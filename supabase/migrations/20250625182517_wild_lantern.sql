/*
  # Add Department, Tags, and Event Category Fields

  1. Schema Changes
    - Add `department` column (text) - which department is organizing the event
    - Add `tags` column (text array) - hashtags for the event
    - Add `event_category` column (text) - either 'technical' or 'non-technical'
    - Add check constraint to ensure event_category is valid

  2. Data Migration
    - Set default values for existing records to prevent null issues
    - Technical events will be default category

  3. Security
    - No RLS changes needed as table already has proper security
*/

-- Add new columns to events table
DO $$
BEGIN
  -- Add department column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'events' AND column_name = 'department'
  ) THEN
    ALTER TABLE events ADD COLUMN department text DEFAULT 'General';
  END IF;

  -- Add tags column (array of text)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'events' AND column_name = 'tags'
  ) THEN
    ALTER TABLE events ADD COLUMN tags text[] DEFAULT '{}';
  END IF;

  -- Add event_category column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'events' AND column_name = 'event_category'
  ) THEN
    ALTER TABLE events ADD COLUMN event_category text DEFAULT 'technical';
  END IF;
END $$;

-- Add check constraint for event_category
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.check_constraints
    WHERE constraint_name = 'events_event_category_check'
  ) THEN
    ALTER TABLE events ADD CONSTRAINT events_event_category_check 
    CHECK (event_category IN ('technical', 'non-technical'));
  END IF;
END $$;

-- Update existing records to have proper default values
UPDATE events 
SET 
  department = 'General',
  tags = '{}',
  event_category = 'technical'
WHERE department IS NULL OR tags IS NULL OR event_category IS NULL;