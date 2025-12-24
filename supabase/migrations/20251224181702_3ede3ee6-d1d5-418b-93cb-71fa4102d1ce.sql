-- Create table for storing shareable analyses
CREATE TABLE public.shared_analyses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  share_id TEXT NOT NULL UNIQUE,
  idea_name TEXT NOT NULL,
  idea_snapshot JSONB NOT NULL,
  analysis_result JSONB NOT NULL,
  decision_ledger JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (now() + interval '30 days')
);

-- Create index on share_id for fast lookups
CREATE INDEX idx_shared_analyses_share_id ON public.shared_analyses(share_id);

-- Enable Row Level Security
ALTER TABLE public.shared_analyses ENABLE ROW LEVEL SECURITY;

-- Create policy allowing anyone to read shared analyses (they're meant to be public)
CREATE POLICY "Shared analyses are publicly readable" 
ON public.shared_analyses 
FOR SELECT 
USING (true);

-- Create policy allowing anyone to insert (no auth required for sharing)
CREATE POLICY "Anyone can create shared analyses" 
ON public.shared_analyses 
FOR INSERT 
WITH CHECK (true);