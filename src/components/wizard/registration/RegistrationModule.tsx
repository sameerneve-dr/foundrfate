import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useDecisionLedger } from "@/contexts/DecisionLedgerContext";
import { AnimatedStep } from "../AnimatedStep";
import { RegistrationSnapshot } from "./RegistrationSnapshot";
import { RegistrationBreakdown } from "./RegistrationBreakdown";
import { RegistrationServices } from "./RegistrationServices";
import { RegistrationChecklist } from "./RegistrationChecklist";

interface RegistrationModuleProps {
  onComplete: () => void;
  onBack: () => void;
}

type RegistrationStep = 'snapshot' | 'breakdown' | 'services' | 'checklist';

export const RegistrationModule = ({ onComplete, onBack }: RegistrationModuleProps) => {
  const { ledger } = useDecisionLedger();
  const [currentStep, setCurrentStep] = useState<RegistrationStep>('snapshot');

  const handleSnapshotContinue = () => {
    if (ledger.registrationMode === 'explain') {
      setCurrentStep('breakdown');
    } else if (ledger.registrationMode === 'service') {
      setCurrentStep('services');
    } else {
      // DIY goes straight to services to pick path
      setCurrentStep('services');
    }
  };

  const stepLabels: Record<RegistrationStep, string> = {
    snapshot: 'Overview',
    breakdown: 'Details',
    services: 'Services',
    checklist: 'Checklist'
  };

  const getStepNumber = () => {
    const steps: RegistrationStep[] = ['snapshot', 'breakdown', 'services', 'checklist'];
    return steps.indexOf(currentStep) + 1;
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'snapshot':
        return <RegistrationSnapshot onContinue={handleSnapshotContinue} />;
      case 'breakdown':
        return <RegistrationBreakdown onContinue={() => setCurrentStep('services')} />;
      case 'services':
        return <RegistrationServices onContinue={() => setCurrentStep('checklist')} />;
      case 'checklist':
        return <RegistrationChecklist onComplete={onComplete} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b-2 border-border p-4">
        <div className="container flex items-center justify-between">
          <button 
            onClick={currentStep === 'snapshot' ? onBack : () => {
              const steps: RegistrationStep[] = ['snapshot', 'breakdown', 'services', 'checklist'];
              const currentIndex = steps.indexOf(currentStep);
              if (currentIndex > 0) {
                setCurrentStep(steps[currentIndex - 1]);
              }
            }} 
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="font-mono text-sm">Back</span>
          </button>
          <h1 className="text-xl font-bold">FoundrFate</h1>
          <span className="font-mono text-sm text-muted-foreground">
            Registration {getStepNumber()}/4
          </span>
        </div>
      </header>

      {/* Progress */}
      <div className="border-b border-border">
        <div className="container py-3">
          <div className="flex items-center gap-2 overflow-x-auto">
            {(['snapshot', 'breakdown', 'services', 'checklist'] as RegistrationStep[]).map((step, i) => {
              const isActive = currentStep === step;
              const isPast = getStepNumber() > i + 1;
              return (
                <div key={step} className="flex items-center gap-2">
                  {i > 0 && <div className={`h-0.5 w-4 ${isPast ? 'bg-foreground' : 'bg-border'}`} />}
                  <button
                    onClick={() => isPast && setCurrentStep(step)}
                    disabled={!isPast && !isActive}
                    className={`px-3 py-1 text-sm font-medium transition-colors
                      ${isActive ? 'bg-foreground text-background' : ''}
                      ${isPast ? 'bg-secondary hover:bg-secondary/80 cursor-pointer' : ''}
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

      <div className="flex-1 py-8 px-4">
        <div className="container max-w-2xl">
          <AnimatedStep stepKey={currentStep}>
            {renderStep()}
          </AnimatedStep>
        </div>
      </div>
    </div>
  );
};
