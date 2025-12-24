import { useState } from "react";
import { HeroSection } from "@/components/HeroSection";
import { IdeaIntakeForm } from "@/components/IdeaIntakeForm";
import { AnalysisResult } from "@/components/AnalysisResult";

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
  const [step, setStep] = useState<"hero" | "intake" | "analysis">("hero");
  const [ideaData, setIdeaData] = useState<IdeaData | null>(null);

  const handleStart = () => {
    setStep("intake");
  };

  const handleSubmit = (data: IdeaData) => {
    setIdeaData(data);
    setStep("analysis");
  };

  const handleReset = () => {
    setIdeaData(null);
    setStep("hero");
  };

  return (
    <main className="min-h-screen bg-background">
      {step === "hero" && <HeroSection onStart={handleStart} />}
      {step === "intake" && <IdeaIntakeForm onSubmit={handleSubmit} onBack={() => setStep("hero")} />}
      {step === "analysis" && ideaData && <AnalysisResult ideaData={ideaData} onReset={handleReset} />}
    </main>
  );
};

export default Index;
