import { useState } from "react";
import { HeroSection } from "@/components/HeroSection";
import { IdeaIntakeForm } from "@/components/IdeaIntakeForm";
import { AnalysisResult } from "@/components/AnalysisResult";
import { AnalysisLoading } from "@/components/AnalysisLoading";
import { useIdeaAnalysis, type AnalysisResult as AnalysisData } from "@/hooks/useIdeaAnalysis";

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
  const [step, setStep] = useState<"hero" | "intake" | "loading" | "analysis">("hero");
  const [ideaData, setIdeaData] = useState<IdeaData | null>(null);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const { analyzeIdea, isLoading } = useIdeaAnalysis();

  const handleStart = () => {
    setStep("intake");
  };

  const handleSubmit = async (data: IdeaData) => {
    setIdeaData(data);
    setStep("loading");
    
    const result = await analyzeIdea(data);
    
    if (result) {
      setAnalysisData(result);
      setStep("analysis");
    } else {
      // If analysis failed, go back to intake
      setStep("intake");
    }
  };

  const handleReset = () => {
    setIdeaData(null);
    setAnalysisData(null);
    setStep("hero");
  };

  return (
    <main className="min-h-screen bg-background">
      {step === "hero" && <HeroSection onStart={handleStart} />}
      {step === "intake" && <IdeaIntakeForm onSubmit={handleSubmit} onBack={() => setStep("hero")} />}
      {step === "loading" && ideaData && <AnalysisLoading ideaName={ideaData.ideaName} />}
      {step === "analysis" && ideaData && analysisData && (
        <AnalysisResult ideaData={ideaData} analysis={analysisData} onReset={handleReset} />
      )}
    </main>
  );
};

export default Index;
