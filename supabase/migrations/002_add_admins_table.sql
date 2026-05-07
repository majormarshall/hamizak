-- ============================================================
-- Hamizak Montessori Academy — Admin Access Control
-- Run in: Supabase Dashboard > SQL Editor
-- ============================================================

CREATE TABLE IF NOT EXISTS admins (
  email TEXT PRIMARY KEY,
  role TEXT DEFAULT 'admin',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Allow public read of admin emails for middleware check (or restrict to authenticated)
-- Actually, the middleware uses service role or admin client usually, but let's set proper policies.

CREATE POLICY "Admins can view other admins" ON admins
  FOR SELECT USING (
    auth.jwt() ->> 'email' IN (SELECT email FROM admins)
    OR auth.jwt() ->> 'email' = 'alaminoseni22@gmail.com'
  );

CREATE POLICY "Super Admin can manage admins" ON admins
  FOR ALL USING (
    auth.jwt() ->> 'email' = 'alaminoseni22@gmail.com'
  );

-- Initial Seed (Optional: Replace with your actual email)
-- INSERT INTO admins (email, role) VALUES ('alaminoseni22@gmail.com', 'admin') ON CONFLICT DO NOTHING;
