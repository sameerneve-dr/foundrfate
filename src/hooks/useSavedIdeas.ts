import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import type { DecisionLedger, IdeaSnapshot } from '@/contexts/DecisionLedgerContext';
import type { AnalysisResult } from '@/hooks/useIdeaAnalysis';

export interface SavedIdea {
  id: string;
  idea_name: string;
  idea_snapshot: IdeaSnapshot;
  analysis_result: AnalysisResult | null;
  decision_ledger: Partial<DecisionLedger> | null;
  created_at: string;
  updated_at: string;
}

export function useSavedIdeas() {
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const saveIdea = async (
    ideaSnapshot: IdeaSnapshot,
    analysisResult?: AnalysisResult | null,
    ledger?: Partial<DecisionLedger>
  ) => {
    if (!user) {
      toast.error('Please sign in to save your idea');
      return null;
    }

    setIsSaving(true);
    try {
      const { data, error } = await supabase
        .from('saved_ideas')
        .insert({
          user_id: user.id,
          idea_name: ideaSnapshot.ideaName,
          idea_snapshot: ideaSnapshot as any,
          analysis_result: analysisResult as any,
          decision_ledger: ledger as any
        })
        .select()
        .single();

      if (error) throw error;

      toast.success('Idea saved successfully!');
      return data;
    } catch (error: any) {
      console.error('Error saving idea:', error);
      toast.error('Failed to save idea');
      return null;
    } finally {
      setIsSaving(false);
    }
  };

  const updateIdea = async (
    ideaId: string,
    ideaSnapshot: IdeaSnapshot,
    analysisResult?: AnalysisResult | null,
    ledger?: Partial<DecisionLedger>
  ) => {
    if (!user) {
      toast.error('Please sign in to update your idea');
      return null;
    }

    setIsSaving(true);
    try {
      const { data, error } = await supabase
        .from('saved_ideas')
        .update({
          idea_name: ideaSnapshot.ideaName,
          idea_snapshot: ideaSnapshot as any,
          analysis_result: analysisResult as any,
          decision_ledger: ledger as any
        })
        .eq('id', ideaId)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      toast.success('Idea updated!');
      return data;
    } catch (error: any) {
      console.error('Error updating idea:', error);
      toast.error('Failed to update idea');
      return null;
    } finally {
      setIsSaving(false);
    }
  };

  const loadIdeas = async (): Promise<SavedIdea[]> => {
    if (!user) return [];

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('saved_ideas')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      return (data || []).map(item => ({
        ...item,
        idea_snapshot: item.idea_snapshot as unknown as IdeaSnapshot,
        analysis_result: item.analysis_result as unknown as AnalysisResult | null,
        decision_ledger: item.decision_ledger as unknown as Partial<DecisionLedger> | null
      }));
    } catch (error: any) {
      console.error('Error loading ideas:', error);
      toast.error('Failed to load saved ideas');
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const deleteIdea = async (ideaId: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('saved_ideas')
        .delete()
        .eq('id', ideaId)
        .eq('user_id', user.id);

      if (error) throw error;

      toast.success('Idea deleted');
      return true;
    } catch (error: any) {
      console.error('Error deleting idea:', error);
      toast.error('Failed to delete idea');
      return false;
    }
  };

  return {
    saveIdea,
    updateIdea,
    loadIdeas,
    deleteIdea,
    isSaving,
    isLoading
  };
}