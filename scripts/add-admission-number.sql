-- Run this SQL in your Supabase dashboard → SQL Editor
-- Adds the admission_number column to admission_applications table

ALTER TABLE admission_applications
ADD COLUMN IF NOT EXISTS admission_number TEXT DEFAULT NULL;

-- Optional: Create a unique index to prevent duplicate numbers
CREATE UNIQUE INDEX IF NOT EXISTS idx_admission_number_unique 
  ON admission_applications (admission_number) 
  WHERE admission_number IS NOT NULL;

-- Verify it worked:
-- SELECT column_name, data_type FROM information_schema.columns 
-- WHERE table_name = 'admission_applications';
