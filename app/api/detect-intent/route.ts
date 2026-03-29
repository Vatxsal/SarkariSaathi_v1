import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { detectIntent } from "@/lib/gemini";

export async function POST(req: Request) {
  // Step 9: Verify origin
  const origin = req.headers.get("origin");
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || '';
  if (!origin || (appUrl && !origin.startsWith(appUrl))) {
      return NextResponse.json({ error: "Unauthorized origin" }, { status: 403 });
  }

  // Step 9: Missing User-Agent
  if (!req.headers.get("user-agent")) {
      return NextResponse.json({ error: "Missing User-Agent" }, { status: 400 });
  }

  // Step 9: Content-Type check
  const contentType = req.headers.get("content-type");
  if (!contentType?.includes("application/json")) {
      return NextResponse.json({ error: "Invalid Content-Type" }, { status: 400 });
  }

  try {
    const { userQuery, userState, currentLang } = await req.json();

    if (!userQuery) {
        return NextResponse.json({ error: "No query provided" }, { status: 400 });
    }

    console.log(`[API] Query: "${userQuery}", State: "${userState}"`);
    const data = await detectIntent(userQuery, userState, currentLang);
    console.log(`[API] Detected:`, JSON.stringify(data));
    return NextResponse.json(data);
  } catch (err: any) {
    console.error("Gemini server error:", err);
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}
