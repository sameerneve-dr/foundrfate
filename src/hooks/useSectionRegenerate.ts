import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { IdeaData } from "@/pages/Index";
import type { AnalysisResult } from "@/hooks/useIdeaAnalysis";
import { useToast } from "@/hooks/use-toast";

export type RegenerateSection = "competitors" | "value" | "pitch" | "deck" | "company" | "timeline";

export const useSectionRegenerate = () => {
  const [regeneratingSection, setRegeneratingSection] = useState<RegenerateSection | null>(null);
  const { toast } = useToast();

  const regenerateSection = async (
    section: RegenerateSection,
    ideaData: IdeaData,
    currentAnalysis: AnalysisResult,
    customInstructions?: string
  ): Promise<AnalysisResult | null> => {
    setRegeneratingSection(section);

    try {
      const { data, error } = await supabase.functions.invoke('regenerate-section', {
        body: { ideaData, section, customInstructions }
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      // Merge the new section data with the current analysis
      let updatedAnalysis = { ...currentAnalysis };
      
      switch (section) {
        case "competitors":
          updatedAnalysis.competitiveLandscape = data.data;
          break;
        case "value":
          updatedAnalysis.valueAnalysis = data.data;
          break;
        case "pitch":
          updatedAnalysis.pitchStory = data.data.pitchStory;
          break;
        case "deck":
          updatedAnalysis.pitchDeck = data.data;
          break;
        case "company":
          updatedAnalysis.companyFormation = data.data;
          break;
        case "timeline":
          updatedAnalysis.timeline = data.data;
          break;
      }

      toast({
        title: "Section Updated",
        description: `The ${section} section has been regenerated.`,
      });

      return updatedAnalysis;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to regenerate section";
      toast({
        title: "Regeneration Failed",
        description: message,
        variant: "destructive",
      });
      return null;
    } finally {
      setRegeneratingSection(null);
    }
  };

  return {
    regenerateSection,
    regeneratingSection,
    isRegenerating: regeneratingSection !== null,
  };
};
