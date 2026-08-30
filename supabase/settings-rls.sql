-- Add RLS policies for settings table
-- Run this in Supabase SQL Editor

-- Enable RLS on settings
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Anyone can read settings (needed for public site)
CREATE POLICY "Public can read settings"
  ON settings FOR SELECT
  USING (true);

-- Authenticated users can update settings
CREATE POLICY "Authenticated users can update settings"
  ON settings FOR UPDATE
  TO authenticated
  USING (true);

-- Authenticated users can insert settings
CREATE POLICY "Authenticated users can insert settings"
  ON settings FOR INSERT
  TO authenticated
  WITH CHECK (true);
