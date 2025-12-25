import { useState } from "react";
import { ArrowLeft, Sparkles, DollarSign } from "lucide-react";
import { FoundrChatbot } from "../FoundrChatbot";
import { FundingSnapshot } from "./FundingSnapshot";
import { FundraisingReadiness } from "./FundraisingReadiness";
import { InvestorTypes } from "./InvestorTypes";
import { FundingChecklist } from "./FundingChecklist";
import { InvestorEducation } from "./InvestorEducation";
import { PitchDeckGenerator } from "./PitchDeckGenerator";
import { useDecisionLedger } from "@/contexts/DecisionLedgerContext";

interface FundingModuleProps {
  onComplete: () => void;
  onBack: () => void;
}

type FundingStep = 'readiness' | 'investors' | 'checklist' | 'pitchdeck' | 'education';

export const FundingModule = ({ onComplete, onBack }: FundingModuleProps) => {
  const { ledger } = useDecisionLedger();
  const [currentStep, setCurrentStep] = useState<FundingStep>('readiness');
  const [chatMessage, setChatMessage] = useState<string | null>(null);

  const handleChatWithBot = (message: string) => {
    setChatMessage(message);
    // Trigger chatbot with message - the chatbot component will handle this
  };

  const steps: FundingStep[] = ['readiness', 'investors', 'checklist', 'pitchdeck', 'education'];
  const currentIndex = steps.indexOf(currentStep);

  const handleNext = () => {
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b border-border/50 p-4 bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container flex items-center justify-between">
          <button 
            onClick={onBack} 
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="font-medium text-sm">Back to Journey</span>
          </button>
          <h1 className="text-xl font-display font-bold flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-success" />
            <span className="text-gradient-primary">Funding & Investor Path</span>
          </h1>
          <span className="pill pill-success text-xs">
            Step {currentIndex + 1} of {steps.length}
          </span>
        </div>
      </header>

      {/* Progress */}
      <div className="bg-muted/30 p-2">
        <div className="container max-w-3xl">
          <div className="flex gap-1">
            {steps.map((step, i) => {
              const stepLabels: Record<FundingStep, string> = {
                readiness: '1. Readiness',
                investors: '2. Investors',
                checklist: '3. Checklist',
                pitchdeck: '4. Pitch Deck',
                education: '5. Guidance'
              };
              return (
                <button
                  key={step}
                  onClick={() => setCurrentStep(step)}
                  title={stepLabels[step]}
                  className={`flex-1 h-2 rounded-full transition-all cursor-pointer hover:opacity-80 ${
                    i <= currentIndex ? 'bg-success' : 'bg-muted hover:bg-muted-foreground/30'
                  }`}
                />
              );
            })}
          </div>
          {/* Step labels for clarity */}
          <div className="flex justify-between mt-1 text-xs text-muted-foreground">
            <span>Readiness</span>
            <span>Investors</span>
            <span>Checklist</span>
            <span>Pitch Deck</span>
            <span className="font-medium text-success">Guidance</span>
          </div>
        </div>
      </div>

      {/* Failsafe: Direct access to Investor Guidance */}
      {currentStep !== 'education' && (
        <div className="container max-w-3xl py-2">
          <button
            onClick={() => setCurrentStep('education')}
            className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 ml-auto"
          >
            <Sparkles className="h-3 w-3" />
            Skip to Investor Guidance →
          </button>
        </div>
      )}

      <div className="flex-1 py-8 px-4 bg-gradient-hero">
        <div className="container max-w-3xl space-y-6">
          {/* Snapshot always visible */}
          <FundingSnapshot />

          {/* Step Content */}
          {currentStep === 'readiness' && (
            <FundraisingReadiness onComplete={handleNext} />
          )}

          {currentStep === 'investors' && (
            <div className="space-y-6">
              <InvestorTypes />
              <div className="flex justify-end">
                <button
                  onClick={handleNext}
                  className="pill pill-primary px-4 py-2 text-sm hover:opacity-90"
                >
                  Continue to Checklist →
                </button>
              </div>
            </div>
          )}

          {currentStep === 'checklist' && (
            <div className="space-y-6">
              <FundingChecklist onGenerateAssets={handleNext} />
              <div className="flex justify-end">
                <button
                  onClick={handleNext}
                  className="pill pill-primary px-4 py-2 text-sm hover:opacity-90"
                >
                  Continue to Pitch Deck →
                </button>
              </div>
            </div>
          )}

          {currentStep === 'pitchdeck' && (
            <div className="space-y-6">
              <PitchDeckGenerator />
              <div className="flex justify-end">
                <button
                  onClick={handleNext}
                  className="pill pill-primary px-4 py-2 text-sm hover:opacity-90"
                >
                  Continue to Education →
                </button>
              </div>
            </div>
          )}

          {currentStep === 'education' && (
            <div className="space-y-6">
              <InvestorEducation onChatWithBot={handleChatWithBot} />
              <div className="flex justify-center">
                <button
                  onClick={onComplete}
                  className="pill pill-success px-6 py-2 text-sm font-bold hover:opacity-90"
                >
                  Complete Funding Section ✓
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <FoundrChatbot 
        initialMode="investor" 
        prefilledMessage={chatMessage || undefined}
      />
    </div>
  );
};