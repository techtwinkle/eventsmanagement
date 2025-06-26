/*
  # Add Event Date and Time Column

  1. New Column
    - Add `event_datetime` column (timestamptz) - when the event will occur
    - Set default to null as existing events may not have scheduled times

  2. Security
    - No RLS changes needed as table already has proper security
*/

-- Add event_datetime column to events table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'events' AND column_name = 'event_datetime'
  ) THEN
    ALTER TABLE events ADD COLUMN event_datetime timestamptz;
  END IF;
END $$;