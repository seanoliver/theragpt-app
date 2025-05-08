-- Create distortion_types table to store the enum values
CREATE TABLE IF NOT EXISTS public.distortion_types (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  description TEXT NOT NULL,
  examples TEXT[] DEFAULT '{}',
  strategies TEXT[] DEFAULT '{}'
);

-- Create entries table for storing therapy entries
CREATE TABLE IF NOT EXISTS public.therapy_entries (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT,
  category TEXT,
  raw_text TEXT NOT NULL,
  strategies TEXT[] DEFAULT '{}',
  created_at BIGINT NOT NULL,
  updated_at BIGINT,
  is_pinned BOOLEAN DEFAULT false,
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create reframes table for storing reframes related to entries
CREATE TABLE IF NOT EXISTS public.reframes (
  id UUID PRIMARY KEY,
  entry_id UUID NOT NULL,
  text TEXT NOT NULL,
  explanation TEXT NOT NULL,
  CONSTRAINT fk_entry FOREIGN KEY (entry_id) REFERENCES public.therapy_entries(id) ON DELETE CASCADE
);

-- Create distortion_instances table for storing distortions related to entries
CREATE TABLE IF NOT EXISTS public.distortion_instances (
  id UUID PRIMARY KEY,
  entry_id UUID NOT NULL,
  distortion_id TEXT NOT NULL,
  label TEXT NOT NULL,
  description TEXT NOT NULL,
  confidence_score FLOAT,
  CONSTRAINT fk_entry FOREIGN KEY (entry_id) REFERENCES public.therapy_entries(id) ON DELETE CASCADE,
  CONSTRAINT fk_distortion_type FOREIGN KEY (distortion_id) REFERENCES public.distortion_types(id) ON DELETE CASCADE
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_therapy_entries_user_id ON public.therapy_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_reframes_entry_id ON public.reframes(entry_id);
CREATE INDEX IF NOT EXISTS idx_distortion_instances_entry_id ON public.distortion_instances(entry_id);
CREATE INDEX IF NOT EXISTS idx_distortion_instances_distortion_id ON public.distortion_instances(distortion_id);

-- Enable Row Level Security
ALTER TABLE public.therapy_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reframes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.distortion_instances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.distortion_types ENABLE ROW LEVEL SECURITY;

-- Create policies for therapy_entries
CREATE POLICY "Users can select their own therapy entries"
ON public.therapy_entries
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own therapy entries"
ON public.therapy_entries
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own therapy entries"
ON public.therapy_entries
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own therapy entries"
ON public.therapy_entries
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Create policies for reframes
CREATE POLICY "Users can select reframes for their own entries"
ON public.reframes
FOR SELECT
TO authenticated
USING (entry_id IN (SELECT id FROM public.therapy_entries WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert reframes for their own entries"
ON public.reframes
FOR INSERT
TO authenticated
WITH CHECK (entry_id IN (SELECT id FROM public.therapy_entries WHERE user_id = auth.uid()));

CREATE POLICY "Users can update reframes for their own entries"
ON public.reframes
FOR UPDATE
TO authenticated
USING (entry_id IN (SELECT id FROM public.therapy_entries WHERE user_id = auth.uid()));

CREATE POLICY "Users can delete reframes for their own entries"
ON public.reframes
FOR DELETE
TO authenticated
USING (entry_id IN (SELECT id FROM public.therapy_entries WHERE user_id = auth.uid()));

-- Create policies for distortion_instances
CREATE POLICY "Users can select distortion instances for their own entries"
ON public.distortion_instances
FOR SELECT
TO authenticated
USING (entry_id IN (SELECT id FROM public.therapy_entries WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert distortion instances for their own entries"
ON public.distortion_instances
FOR INSERT
TO authenticated
WITH CHECK (entry_id IN (SELECT id FROM public.therapy_entries WHERE user_id = auth.uid()));

CREATE POLICY "Users can update distortion instances for their own entries"
ON public.distortion_instances
FOR UPDATE
TO authenticated
USING (entry_id IN (SELECT id FROM public.therapy_entries WHERE user_id = auth.uid()));

CREATE POLICY "Users can delete distortion instances for their own entries"
ON public.distortion_instances
FOR DELETE
TO authenticated
USING (entry_id IN (SELECT id FROM public.therapy_entries WHERE user_id = auth.uid()));

-- Create policies for distortion_types (read-only for authenticated users)
CREATE POLICY "Anyone can view distortion types"
ON public.distortion_types
FOR SELECT
TO authenticated
USING (true);

-- Insert distortion types from the enum
INSERT INTO public.distortion_types (id, label, description)
VALUES
  ('all-or-nothing-thinking', 'All-or-Nothing Thinking', 'Seeing things in black and white categories'),
  ('overgeneralization', 'Overgeneralization', 'Viewing a negative event as a never-ending pattern of defeat'),
  ('mental-filter', 'Mental Filter', 'Picking out a single negative detail and dwelling on it'),
  ('disqualifying-the-positive', 'Disqualifying the Positive', 'Rejecting positive experiences by insisting they "don''t count"'),
  ('jumping-to-conclusions', 'Jumping to Conclusions', 'Making negative interpretations without definite facts'),
  ('magnification', 'Magnification', 'Exaggerating the importance of problems or minimizing positive qualities'),
  ('emotional-reasoning', 'Emotional Reasoning', 'Assuming that negative emotions reflect the way things really are'),
  ('should-statements', 'Should Statements', 'Having rigid rules about how you and others "should" behave'),
  ('labeling', 'Labeling', 'Attaching a negative label to yourself or others instead of describing behavior'),
  ('personalization', 'Personalization', 'Seeing yourself as the cause of external negative events'),
  ('catastrophizing', 'Catastrophizing', 'Expecting disaster; blowing things way out of proportion'),
  ('blaming', 'Blaming', 'Holding others responsible for your pain or blaming yourself for every problem'),
  ('fortune-telling', 'Fortune Telling', 'Anticipating that things will turn out badly'),
  ('mind-reading', 'Mind Reading', 'Assuming you know what others are thinking'),
  ('minimization', 'Minimization', 'Inappropriately shrinking positive qualities about yourself or others')
ON CONFLICT (id) DO NOTHING;