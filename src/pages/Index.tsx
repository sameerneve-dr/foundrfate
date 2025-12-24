import { useState, useEffect } from "react";
import { HeroSection } from "@/components/HeroSection";
import { FoundrWizard } from "@/components/wizard/FoundrWizard";
import { DecisionLedgerProvider, useDecisionLedger } from "@/contexts/DecisionLedgerContext";
import type { SavedIdea } from "@/hooks/useSavedIdeas";

export type IdeaData = {
  ideaName: string;
  problemStatement: string;
  proposedSolution: string;
  targetAudience: string;
  existingAlternatives: string;
  purpose: "hackathon" | "side-project" | "real-startup";
  scaleIntent: "lifestyle" | "venture-scale" | "non-profit";
  founderBackground: string;
  timeline: string;
};

// Inner component that can use the DecisionLedger context
const WizardWithLoader = ({ onBack }: { onBack: () => void }) => {
  const { loadLedger } = useDecisionLedger();

  useEffect(() => {
    const savedIdeaJson = sessionStorage.getItem('loadSavedIdea');
    if (savedIdeaJson) {
      try {
        const savedIdea: SavedIdea = JSON.parse(savedIdeaJson);
        loadLedger({
          ideaSnapshot: savedIdea.idea_snapshot,
          analysis: savedIdea.analysis_result,
          ...(savedIdea.decision_ledger || {})
        });
        sessionStorage.removeItem('loadSavedIdea');
      } catch (e) {
        console.error('Failed to load saved idea:', e);
      }
    }
  }, [loadLedger]);

  return <FoundrWizard onBack={onBack} />;
};

const Index = () => {
  const [started, setStarted] = useState(() => {
    // Auto-start if loading a saved idea
    return !!sessionStorage.getItem('loadSavedIdea');
  });

  if (started) {
    return (
      <DecisionLedgerProvider>
        <WizardWithLoader onBack={() => setStarted(false)} />
      </DecisionLedgerProvider>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <HeroSection onStart={() => setStarted(true)} />
    </main>
  );
};

export default Index;
