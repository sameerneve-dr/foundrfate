-- Create saved_ideas table for storing user ideas
CREATE TABLE public.saved_ideas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  idea_name TEXT NOT NULL,
  idea_snapshot JSONB NOT NULL,
  analysis_result JSONB,
  decision_ledger JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.saved_ideas ENABLE ROW LEVEL SECURITY;

-- Users can only view their own saved ideas
CREATE POLICY "Users can view their own ideas"
ON public.saved_ideas
FOR SELECT
USING (auth.uid() = user_id);

-- Users can create their own saved ideas
CREATE POLICY "Users can create their own ideas"
ON public.saved_ideas
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own saved ideas
CREATE POLICY "Users can update their own ideas"
ON public.saved_ideas
FOR UPDATE
USING (auth.uid() = user_id);

-- Users can delete their own saved ideas
CREATE POLICY "Users can delete their own ideas"
ON public.saved_ideas
FOR DELETE
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_saved_ideas_updated_at
BEFORE UPDATE ON public.saved_ideas
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();