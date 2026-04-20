-- Add supplemental_links to researchers table
-- Run this in your Supabase SQL editor or via the CLI: supabase db push

ALTER TABLE researchers
  ADD COLUMN IF NOT EXISTS supplemental_links JSONB NOT NULL DEFAULT '[]'::jsonb;
