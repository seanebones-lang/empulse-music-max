-- Migration: Create user_likes table for track favorites
-- Run this in Supabase SQL Editor

-- Create user_likes table
CREATE TABLE IF NOT EXISTS user_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  track_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, track_id)
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_user_likes_user_id ON user_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_user_likes_track_id ON user_likes(track_id);
CREATE INDEX IF NOT EXISTS idx_user_likes_created_at ON user_likes(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE user_likes ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own likes
CREATE POLICY "Users can view own likes"
  ON user_likes
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own likes
CREATE POLICY "Users can insert own likes"
  ON user_likes
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own likes
CREATE POLICY "Users can delete own likes"
  ON user_likes
  FOR DELETE
  USING (auth.uid() = user_id);

-- Optional: Create a view for liked tracks with track details
CREATE OR REPLACE VIEW user_liked_tracks AS
SELECT 
  ul.id as like_id,
  ul.user_id,
  ul.track_id,
  ul.created_at as liked_at,
  t.id,
  t.title,
  t.artist,
  t.url,
  t.artwork,
  t.duration
FROM user_likes ul
LEFT JOIN tracks t ON ul.track_id = t.id
WHERE t.id IS NOT NULL;

-- Grant access to authenticated users
GRANT SELECT ON user_liked_tracks TO authenticated;
