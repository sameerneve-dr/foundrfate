import { useState } from "react";
import { useDecisionLedger } from "@/contexts/DecisionLedgerContext";
import { useIdeaAnalysis } from "@/hooks/useIdeaAnalysis";
import { WizardProgress } from "./WizardProgress";
import { ChoicesSidebar } from "./ChoicesSidebar";
import { AnimatedStep } from "./AnimatedStep";
import { PitchDeckViewer } from "./PitchDeckViewer";
import { IdeaSnapshotStep } from "./steps/IdeaSnapshotStep";
import { VerdictStep } from "./steps/VerdictStep";
import { TargetCustomerStep } from "./steps/TargetCustomerStep";
import { ProfitTypeStep } from "./steps/ProfitTypeStep";
import { FundraisingStep } from "./steps/FundraisingStep";
import { EntityTypeStep } from "./steps/EntityTypeStep";
import { CCorpSetupWizard } from "./steps/CCorpSetupWizard";
import { TimelineStep } from "./steps/TimelineStep";
import { FinalSummaryStep } from "./steps/FinalSummaryStep";
import { RegistrationModule } from "./registration/RegistrationModule";
import { AnalysisLoading } from "@/components/AnalysisLoading";
import { ArrowLeft } from "lucide-react";

interface FoundrWizardProps {
  onBack: () => void;
}

export const FoundrWizard = ({ onBack }: FoundrWizardProps) => {
  const { ledger, updateLedger, setStep, resetLedger } = useDecisionLedger();
  const { analyzeIdea, isLoading } = useIdeaAnalysis();
  const [showCCorpSetup, setShowCCorpSetup] = useState(false);
  const [showPitchDeck, setShowPitchDeck] = useState(false);
  const [showRegistration, setShowRegistration] = useState(false);

  const stepLabels = [
    "Idea",
    "Verdict", 
    "Target",
    "Profit",
    "Funding",
    "Entity",
    "Timeline",
    "Summary"
  ];

  const handleAnalyze = async () => {
    if (!ledger.ideaSnapshot) return;
    
    const ideaData = {
      ideaName: ledger.ideaSnapshot.ideaName,
      problemStatement: ledger.ideaSnapshot.problem,
      proposedSolution: ledger.ideaSnapshot.solution,
      targetAudience: ledger.ideaSnapshot.audience,
      existingAlternatives: '',
      purpose: 'real-startup' as const,
      scaleIntent: ledger.ideaSnapshot.scaleIntent,
      founderBackground: '',
      timeline: ''
    };

    const result = await analyzeIdea(ideaData);
    if (result) {
      updateLedger({ analysis: result, verdict: result.decision });
      setStep(1);
    }
  };

  const handleReset = () => {
    resetLedger();
    setShowCCorpSetup(false);
    setShowPitchDeck(false);
    setShowRegistration(false);
  };

  // Render pitch deck viewer
  if (showPitchDeck) {
    return <PitchDeckViewer onClose={() => setShowPitchDeck(false)} />;
  }

  // Render registration module
  if (showRegistration) {
    return (
      <RegistrationModule 
        onComplete={() => { setShowRegistration(false); setStep(6); }} 
        onBack={() => setShowRegistration(false)} 
      />
    );
  }

  // Render loading state
  if (isLoading) {
    return <AnalysisLoading ideaName={ledger.ideaSnapshot?.ideaName || 'your idea'} />;
  }

  // Render C-Corp setup wizard as overlay
  if (showCCorpSetup) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <header className="border-b-2 border-border p-4">
          <div className="container flex items-center justify-between">
            <button onClick={() => setShowCCorpSetup(false)} className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
              <span className="font-mono text-sm">Back</span>
            </button>
            <h1 className="text-xl font-bold">FoundrFate</h1>
            <span className="font-mono text-sm text-muted-foreground">C-Corp Setup</span>
          </div>
        </header>
        <div className="flex-1 py-8 px-4">
          <div className="container max-w-2xl">
            <CCorpSetupWizard onComplete={() => { setShowCCorpSetup(false); setStep(6); }} />
          </div>
        </div>
      </div>
    );
  }

  const renderStep = () => {
    switch (ledger.currentStep) {
      case 0:
        return <IdeaSnapshotStep onComplete={handleAnalyze} isAnalyzing={isLoading} />;
      case 1:
        return <VerdictStep onAccept={() => setStep(2)} onShowPivots={() => setStep(2)} />;
      case 2:
        return <TargetCustomerStep onComplete={() => setStep(3)} />;
      case 3:
        return <ProfitTypeStep onComplete={() => ledger.profitType === 'for-profit' ? setStep(4) : setStep(5)} />;
      case 4:
        return <FundraisingStep onComplete={() => setStep(5)} />;
      case 5:
        return <EntityTypeStep onComplete={() => setStep(6)} onCCorpSetup={() => setShowRegistration(true)} />;
      case 6:
        return <TimelineStep onComplete={() => setStep(7)} />;
      case 7:
        return <FinalSummaryStep onReset={handleReset} onGeneratePitch={() => setShowPitchDeck(true)} />;
      default:
        return <IdeaSnapshotStep onComplete={handleAnalyze} isAnalyzing={isLoading} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b-2 border-border p-4">
        <div className="container flex items-center justify-between">
          <button onClick={onBack} className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            <span className="font-mono text-sm">Back</span>
          </button>
          <h1 className="text-xl font-bold">FoundrFate</h1>
          <span className="font-mono text-sm text-muted-foreground">
            {ledger.ideaSnapshot?.ideaName || 'New Idea'}
          </span>
        </div>
      </header>

      <WizardProgress 
        currentStep={ledger.currentStep}
        totalSteps={stepLabels.length}
        stepLabels={stepLabels}
        maxUnlockedStep={ledger.maxUnlockedStep}
        onStepClick={(step) => step <= ledger.maxUnlockedStep && setStep(step)}
      />

      <div className="flex-1 py-8 px-4">
        <div className="container max-w-4xl">
          <div className="grid lg:grid-cols-[1fr_280px] gap-8">
            <AnimatedStep stepKey={ledger.currentStep}>
              {renderStep()}
            </AnimatedStep>
            <div className="hidden lg:block">
              <div className="sticky top-24 animate-slide-in-right">
                <ChoicesSidebar onReset={handleReset} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
