import { useState } from "react";
import { HeroSection } from "@/components/HeroSection";
import { FoundrWizard } from "@/components/wizard/FoundrWizard";
import { DecisionLedgerProvider } from "@/contexts/DecisionLedgerContext";

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

const Index = () => {
  const [started, setStarted] = useState(false);

  if (started) {
    return (
      <DecisionLedgerProvider>
        <FoundrWizard onBack={() => setStarted(false)} />
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
