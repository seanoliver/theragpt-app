-- Create entries table for storing key-value data per user
CREATE TABLE IF NOT EXISTS public.entries (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  key TEXT NOT NULL,
  value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, key)
);

-- Create index for faster lookups by user_id
CREATE INDEX IF NOT EXISTS entries_user_id_idx ON public.entries(user_id);

-- Create index for faster lookups by key
CREATE INDEX IF NOT EXISTS entries_key_idx ON public.entries(key);

-- Enable Row Level Security
ALTER TABLE public.entries ENABLE ROW LEVEL SECURITY;

-- Create policy for users to select their own entries
CREATE POLICY "Users can select their own entries"
ON public.entries
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Create policy for users to insert their own entries
CREATE POLICY "Users can insert their own entries"
ON public.entries
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Create policy for users to update their own entries
CREATE POLICY "Users can update their own entries"
ON public.entries
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- Create policy for users to delete their own entries
CREATE POLICY "Users can delete their own entries"
ON public.entries
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);