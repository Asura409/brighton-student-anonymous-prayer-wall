CREATE TABLE IF NOT EXISTS prayers (
  id BIGSERIAL PRIMARY KEY,
  category TEXT NOT NULL DEFAULT 'personal' CHECK (category IN ('campus', 'personal', 'community')),
  body VARCHAR(500) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'published', 'hidden')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_prayers_status_created ON prayers (status, created_at DESC);
