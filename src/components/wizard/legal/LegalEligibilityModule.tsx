import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useDecisionLedger } from "@/contexts/DecisionLedgerContext";
import { AnimatedStep } from "../AnimatedStep";
import { VisaIntakeStep } from "./VisaIntakeStep";
import { CofounderIntakeStep } from "./CofounderIntakeStep";
import { EligibilityAnalysis } from "./EligibilityAnalysis";
import { VisaGuidance } from "./VisaGuidance";
import { LegalPathsStep } from "./LegalPathsStep";
import { ImmigrationHelp } from "./ImmigrationHelp";

interface LegalEligibilityModuleProps {
  onComplete: () => void;
  onBack: () => void;
}

type LegalStep = 'visa' | 'cofounder' | 'eligibility' | 'guidance' | 'paths' | 'help';

export const LegalEligibilityModule = ({ onComplete, onBack }: LegalEligibilityModuleProps) => {
  const { ledger } = useDecisionLedger();
  const [currentStep, setCurrentStep] = useState<LegalStep>('visa');

  const stepLabels: Record<LegalStep, string> = {
    visa: 'Your Status',
    cofounder: 'Cofounders',
    eligibility: 'Eligibility',
    guidance: 'Guidance',
    paths: 'Paths',
    help: 'Resources'
  };

  const allSteps: LegalStep[] = ['visa', 'cofounder', 'eligibility', 'guidance', 'paths', 'help'];
  
  const getStepNumber = () => allSteps.indexOf(currentStep) + 1;

  const handleBack = () => {
    const currentIndex = allSteps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(allSteps[currentIndex - 1]);
    } else {
      onBack();
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'visa':
        return <VisaIntakeStep onComplete={() => setCurrentStep('cofounder')} />;
      case 'cofounder':
        return <CofounderIntakeStep onComplete={() => setCurrentStep('eligibility')} />;
      case 'eligibility':
        return <EligibilityAnalysis onContinue={() => setCurrentStep('guidance')} />;
      case 'guidance':
        return <VisaGuidance onContinue={() => setCurrentStep('paths')} />;
      case 'paths':
        // Skip paths for citizens/GC holders
        if (ledger.founderVisaStatus === 'us-citizen' || ledger.founderVisaStatus === 'green-card') {
          return <ImmigrationHelp onComplete={onComplete} />;
        }
        return <LegalPathsStep onContinue={() => setCurrentStep('help')} />;
      case 'help':
        return <ImmigrationHelp onComplete={onComplete} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b-2 border-border p-4">
        <div className="container flex items-center justify-between">
          <button 
            onClick={handleBack}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="font-mono text-sm">Back</span>
          </button>
          <h1 className="text-xl font-bold">FoundrFate</h1>
          <span className="font-mono text-sm text-muted-foreground">
            Legal Check {getStepNumber()}/{allSteps.length}
          </span>
        </div>
      </header>

      {/* Progress */}
      <div className="border-b border-border">
        <div className="container py-3">
          <div className="flex items-center gap-1 overflow-x-auto">
            {allSteps.map((step, i) => {
              const isActive = currentStep === step;
              const isPast = getStepNumber() > i + 1;
              return (
                <div key={step} className="flex items-center gap-1">
                  {i > 0 && <div className={`h-0.5 w-3 ${isPast ? 'bg-foreground' : 'bg-border'}`} />}
                  <button
                    onClick={() => isPast && setCurrentStep(step)}
                    disabled={!isPast && !isActive}
                    className={`px-2 py-1 text-xs font-medium transition-colors whitespace-nowrap
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

      {/* Footer disclaimer */}
      <div className="border-t border-border p-3 bg-muted/30">
        <p className="text-xs text-center text-muted-foreground">
          This is general guidance, not legal advice. Consult an immigration attorney for your specific situation.
        </p>
      </div>
    </div>
  );
};
