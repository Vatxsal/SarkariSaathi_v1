CREATE TABLE IF NOT EXISTS prompt_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  identifier TEXT NOT NULL,
  -- for logged in users: their user ID from Better Auth
  -- for guests: their cookie/session fingerprint
  identifier_type TEXT NOT NULL CHECK (
    identifier_type IN ('user', 'guest')
  ),
  prompt_count INTEGER DEFAULT 0,
  window_start TIMESTAMPTZ DEFAULT NOW(),
  -- window resets every 24 hours
  last_prompt_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(identifier)
);

CREATE INDEX IF NOT EXISTS idx_prompt_usage_identifier 
ON prompt_usage(identifier);
