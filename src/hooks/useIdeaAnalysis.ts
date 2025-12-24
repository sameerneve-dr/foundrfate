import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { IdeaData } from "@/pages/Index";
import { useToast } from "@/hooks/use-toast";

export interface Competitor {
  name: string;
  coreOffering: string;
  strength: string;
  weakness: string;
  marketGap?: string;
}

export interface PivotSuggestion {
  title: string;
  description: string;
  whyBetter: string;
}

export interface AnalysisResult {
  decision: "yes" | "conditional" | "no";
  decisionRationale: {
    summary: string;
    marketSaturation: "low" | "medium" | "high";
    differentiation: "weak" | "moderate" | "strong";
    userUrgency: "low" | "medium" | "high";
    executionComplexity: "low" | "medium" | "high";
    founderMarketFit: "weak" | "moderate" | "strong";
  };
  realNeedAnalysis: {
    isPainkiller: boolean;
    usersActivelySearching: boolean;
    painFrequency: string;
    willingness: string;
    explanation: string;
  };
  competitiveLandscape: {
    directCompetitors: Competitor[];
    indirectCompetitors: Competitor[];
    marketCrowded: boolean;
    whatIsSolved: string;
    whatIsNot: string;
  };
  valueAnalysis: {
    timeSaved: string;
    moneySaved: string;
    riskReduced: string;
    revenueUnlocked: string;
    whyExist: string;
  };
  pitchStory: string;
  pitchDeck: {
    problem: string;
    whyNow: string;
    solution: string;
    marketSize: string;
    businessModel: string;
    goToMarket: string;
    differentiator: string;
  };
  companyFormation: {
    entityType: string;
    entityReason: string;
    whenToIncorporate: string;
    equityAdvice: string;
  };
  profitStructure: {
    recommendation: string;
    reason: string;
  };
  timeline: {
    month0to1: string[];
    month2to3: string[];
    month4to6: string[];
    month7plus: string[];
  };
  pivotSuggestions: PivotSuggestion[];
}

export const useIdeaAnalysis = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const analyzeIdea = async (ideaData: IdeaData): Promise<AnalysisResult | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('analyze-idea', {
        body: { ideaData }
      });

      if (fnError) {
        throw fnError;
      }

      if (data.error) {
        throw new Error(data.error);
      }

      const result = data.analysis as AnalysisResult;
      setAnalysis(result);
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to analyze idea";
      setError(message);
      toast({
        title: "Analysis Failed",
        description: message,
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    analyzeIdea,
    isLoading,
    analysis,
    error,
  };
};
