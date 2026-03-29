import { auth } from "@/lib/auth";
import { headers, cookies } from "next/headers";
import { NextResponse } from "next/server";
import { Pool } from "pg";
import { v4 as uuidv4 } from 'uuid';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

export async function GET(req: Request) {
  return handleRequest(req, true);
}

export async function POST(req: Request) {
  return handleRequest(req, false);
}

async function handleRequest(req: Request, peek: boolean) {
  // Step 9: Verify origin
  const origin = req.headers.get("origin") || req.headers.get("referer");
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || '';
  // For GET requests from browser, origin might be null but referer exists.
  // We'll be a bit more lenient if it's a peek request from our own domain.
  if (appUrl && origin && !origin.startsWith(appUrl)) {
      return NextResponse.json({ error: "Unauthorized origin" }, { status: 403 });
  }

  // Step 9: Security checks
  const userAgent = req.headers.get("user-agent");
  if (!userAgent) {
      return NextResponse.json({ error: "Missing User-Agent" }, { status: 400 });
  }

  const session = await auth.api.getSession({
    headers: await headers()
  });

  let identifier: string;
  let identifierType: 'user' | 'guest';
  let dailyLimit: number;
  let newGuestId: string | null = null;

  const cookieStore = await cookies();

  if (session?.user) {
    identifier = session.user.id;
    identifierType = 'user';
    dailyLimit = 10;
  } else {
    let guestId = cookieStore.get('ss_guest_id')?.value;
    if (!guestId) {
      guestId = uuidv4();
      newGuestId = guestId;
    }
    identifier = guestId;
    identifierType = 'guest';
    dailyLimit = 5;
  }

  const client = await pool.connect();
  try {
    const res = await client.query(
      "SELECT * FROM prompt_usage WHERE identifier = $1",
      [identifier]
    );

    const now = new Date();
    let allowed = true;
    let remaining = dailyLimit;
    let resetAt: Date = new Date(now.getTime() + 16 * 60 * 60 * 1000);

    if (res.rows.length === 0) {
      // First timer
      if (!peek) {
        await client.query(
          "INSERT INTO prompt_usage (identifier, identifier_type, prompt_count, window_start, last_prompt_at) VALUES ($1, $2, 1, NOW(), NOW())",
          [identifier, identifierType]
        );
        remaining = dailyLimit - 1;
      }
    } else {
      const row = res.rows[0];
      const windowStart = new Date(row.window_start);
      const diffMs = now.getTime() - windowStart.getTime();
      const diffHours = diffMs / (1000 * 60 * 60);

      resetAt = new Date(windowStart.getTime() + 16 * 60 * 60 * 1000);

      if (diffHours >= 16) {
        // Window expired
        if (!peek) {
          await client.query(
            "UPDATE prompt_usage SET prompt_count = 1, window_start = NOW(), last_prompt_at = NOW() WHERE identifier = $1",
            [identifier]
          );
          remaining = dailyLimit - 1;
          resetAt = new Date(now.getTime() + 16 * 60 * 60 * 1000);
        } else {
          remaining = dailyLimit;
          resetAt = new Date(now.getTime() + 16 * 60 * 60 * 1000);
        }
      } else {
        // Inside window
        if (!peek && row.prompt_count < dailyLimit) {
          await client.query(
            "UPDATE prompt_usage SET prompt_count = prompt_count + 1, last_prompt_at = NOW() WHERE identifier = $1",
            [identifier]
          );
          remaining = dailyLimit - (row.prompt_count + 1);
        } else {
          remaining = dailyLimit - row.prompt_count;
        }
        
        if (remaining <= 0 && (peek ? row.prompt_count >= dailyLimit : true)) {
          allowed = false;
        }
      }
    }

    const responseData = {
      allowed,
      remaining: Math.max(0, remaining),
      limit: dailyLimit,
      isLoggedIn: identifierType === 'user',
      reset_at: resetAt.toISOString()
    };

    const response = NextResponse.json(responseData);

    if (newGuestId) {
      response.cookies.set('ss_guest_id', newGuestId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 365, // 1 year
        path: '/'
      });
    }

    return response;
  } catch (err) {
    console.error("Database error in prompt-limit:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  } finally {
    client.release();
  }
}
