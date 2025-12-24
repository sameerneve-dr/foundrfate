import { useState } from "react";
import { ArrowLeft, Sparkles } from "lucide-react";
import { useDecisionLedger } from "@/contexts/DecisionLedgerContext";
import { AnimatedStep } from "../AnimatedStep";
import { FoundrChatbot } from "../FoundrChatbot";
import { AgentsSnapshot, type AgentsMode } from "./AgentsSnapshot";
import { AgentsBreakdown } from "./AgentsBreakdown";
import { AgentsServices } from "./AgentsServices";
import { AgentsChecklist } from "./AgentsChecklist";

interface AgentsModuleProps {
  onComplete: () => void;
  onBack: () => void;
}

type AgentsStep = 'snapshot' | 'breakdown' | 'services' | 'checklist';

export const AgentsModule = ({ onComplete, onBack }: AgentsModuleProps) => {
  const { ledger } = useDecisionLedger();
  const [currentStep, setCurrentStep] = useState<AgentsStep>('snapshot');
  const [mode, setMode] = useState<AgentsMode>(null);

  const handleSnapshotContinue = (selectedMode: AgentsMode) => {
    setMode(selectedMode);
    if (selectedMode === 'explain') {
      setCurrentStep('breakdown');
    } else if (selectedMode === 'full-service') {
      setCurrentStep('services');
    } else {
      // DIY goes straight to checklist
      setCurrentStep('checklist');
    }
  };

  const stepLabels: Record<AgentsStep, string> = {
    snapshot: 'Overview',
    breakdown: 'Details',
    services: 'Services',
    checklist: 'Checklist'
  };

  const getStepNumber = () => {
    const steps: AgentsStep[] = ['snapshot', 'breakdown', 'services', 'checklist'];
    return steps.indexOf(currentStep) + 1;
  };

  const handleBack = () => {
    const steps: AgentsStep[] = ['snapshot', 'breakdown', 'services', 'checklist'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    } else {
      onBack();
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'snapshot':
        return <AgentsSnapshot onContinue={handleSnapshotContinue} />;
      case 'breakdown':
        return <AgentsBreakdown onContinue={() => setCurrentStep('services')} />;
      case 'services':
        return <AgentsServices onContinue={() => setCurrentStep('checklist')} />;
      case 'checklist':
        return <AgentsChecklist onComplete={onComplete} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b border-border/50 p-4 bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container flex items-center justify-between">
          <button 
            onClick={handleBack}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="font-medium text-sm">Back</span>
          </button>
          <h1 className="text-xl font-display font-bold flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-warning" />
            <span className="text-gradient-primary">Agents & Hiring</span>
          </h1>
          <span className="pill pill-warning text-xs">
            Step {getStepNumber()}/4
          </span>
        </div>
      </header>

      {/* Progress */}
      <div className="border-b border-border/50 bg-card/50">
        <div className="container py-3">
          <div className="flex items-center gap-2 overflow-x-auto">
            {(['snapshot', 'breakdown', 'services', 'checklist'] as AgentsStep[]).map((step, i) => {
              const isActive = currentStep === step;
              const isPast = getStepNumber() > i + 1;
              return (
                <div key={step} className="flex items-center gap-2">
                  {i > 0 && <div className={`h-0.5 w-4 ${isPast ? 'bg-warning' : 'bg-border'}`} />}
                  <button
                    onClick={() => isPast && setCurrentStep(step)}
                    disabled={!isPast && !isActive}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all
                      ${isActive ? 'bg-gradient-warning text-warning-foreground shadow-md' : ''}
                      ${isPast ? 'bg-warning/20 text-warning hover:bg-warning/30 cursor-pointer' : ''}
                      ${!isActive && !isPast ? 'text-muted-foreground cursor-not-allowed' : ''}
                    `}
                  >
                    {stepLabels[step]}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex-1 py-8 px-4 bg-gradient-hero">
        <div className="container max-w-2xl">
          <AnimatedStep stepKey={currentStep}>
            {renderStep()}
          </AnimatedStep>
        </div>
      </div>

      <FoundrChatbot />
    </div>
  );
};
