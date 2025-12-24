import { useState } from "react";
import { useDecisionLedger, type ExecutionSection, type ProceedIntent } from "@/contexts/DecisionLedgerContext";
import { useIdeaAnalysis } from "@/hooks/useIdeaAnalysis";
import { WizardProgress } from "./WizardProgress";
import { ChoicesSidebar } from "./ChoicesSidebar";
import { AnimatedStep } from "./AnimatedStep";
import { FoundrChatbot } from "./FoundrChatbot";
import { PitchDeckViewer } from "./PitchDeckViewer";
import { IdeaSnapshotStep } from "./steps/IdeaSnapshotStep";
import { VerdictSummary } from "./VerdictSummary";
import { ExecutionJourney } from "./ExecutionJourney";
import { TargetCustomerStep } from "./steps/TargetCustomerStep";
import { ProfitTypeStep } from "./steps/ProfitTypeStep";
import { FundraisingStep } from "./steps/FundraisingStep";
import { EntityTypeStep } from "./steps/EntityTypeStep";
import { CCorpSetupWizard } from "./steps/CCorpSetupWizard";
import { TimelineStep } from "./steps/TimelineStep";
import { FinalSummaryStep } from "./steps/FinalSummaryStep";
import { RegistrationModule } from "./registration/RegistrationModule";
import { LegalEligibilityModule } from "./legal/LegalEligibilityModule";
import { AgentsModule } from "./agents/AgentsModule";
import { AnalysisLoading } from "@/components/AnalysisLoading";
import { ArrowLeft, Sparkles } from "lucide-react";

interface FoundrWizardProps {
  onBack: () => void;
}

type WizardView = 
  | 'idea-input'
  | 'verdict-summary'
  | 'execution-journey'
  | 'company-setup'
  | 'legal-visa'
  | 'registration'
  | 'agents-hiring'
  | 'pitch-deck'
  | 'timeline-roadmap'
  | 'ccorp-setup';

export const FoundrWizard = ({ onBack }: FoundrWizardProps) => {
  const { ledger, updateLedger, setStep, resetLedger } = useDecisionLedger();
  const { analyzeIdea, isLoading } = useIdeaAnalysis();
  
  // Main view state
  const [currentView, setCurrentView] = useState<WizardView>(() => {
    if (!ledger.ideaSnapshot || !ledger.analysis) return 'idea-input';
    if (!ledger.proceedIntent) return 'verdict-summary';
    if (ledger.proceedIntent === 'no') return 'idea-input';
    return 'execution-journey';
  });

  const [showPitchDeck, setShowPitchDeck] = useState(false);

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
      setCurrentView('verdict-summary');
    }
  };

  const handleReset = () => {
    resetLedger();
    setCurrentView('idea-input');
  };

  const handleProceed = (intent: ProceedIntent) => {
    if (intent === 'no') {
      // Reset and start over
      handleReset();
    } else {
      // Proceed to execution journey
      setCurrentView('execution-journey');
    }
  };

  const handleOpenSection = (section: ExecutionSection) => {
    setCurrentView(section);
  };

  const handleSectionComplete = () => {
    setCurrentView('execution-journey');
  };

  // Render pitch deck viewer
  if (showPitchDeck) {
    return <PitchDeckViewer onClose={() => setShowPitchDeck(false)} />;
  }

  // Render loading state
  if (isLoading) {
    return <AnalysisLoading ideaName={ledger.ideaSnapshot?.ideaName || 'your idea'} />;
  }

  // Render section modules
  if (currentView === 'legal-visa') {
    return (
      <LegalEligibilityModule 
        onComplete={handleSectionComplete} 
        onBack={() => setCurrentView('execution-journey')} 
      />
    );
  }

  if (currentView === 'registration') {
    return (
      <RegistrationModule 
        onComplete={handleSectionComplete} 
        onBack={() => setCurrentView('execution-journey')} 
      />
    );
  }

  if (currentView === 'ccorp-setup') {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <header className="border-b border-border/50 p-4 bg-card/80 backdrop-blur-sm">
          <div className="container flex items-center justify-between">
            <button onClick={() => setCurrentView('company-setup')} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-4 w-4" />
              <span className="font-medium text-sm">Back</span>
            </button>
            <h1 className="text-xl font-display font-bold text-gradient-primary">FoundrFate</h1>
            <span className="pill pill-primary text-xs">C-Corp Setup</span>
          </div>
        </header>
        <div className="flex-1 py-8 px-4 bg-gradient-hero">
          <div className="container max-w-2xl">
            <CCorpSetupWizard onComplete={handleSectionComplete} />
          </div>
        </div>
        <FoundrChatbot />
      </div>
    );
  }

  // Render company setup section (entity selection flow)
  if (currentView === 'company-setup') {
    const companySetupStep = ledger.currentStep;
    
    const renderCompanySetupStep = () => {
      switch (companySetupStep) {
        case 0:
          return <TargetCustomerStep onComplete={() => setStep(1)} />;
        case 1:
          return <ProfitTypeStep onComplete={() => ledger.profitType === 'for-profit' ? setStep(2) : setStep(3)} />;
        case 2:
          return <FundraisingStep onComplete={() => setStep(3)} />;
        case 3:
          return (
            <EntityTypeStep 
              onComplete={handleSectionComplete} 
              onCCorpSetup={() => setCurrentView('ccorp-setup')} 
            />
          );
        default:
          return <TargetCustomerStep onComplete={() => setStep(1)} />;
      }
    };

    return (
      <div className="min-h-screen flex flex-col bg-background">
        <header className="border-b border-border/50 p-4 bg-card/80 backdrop-blur-sm sticky top-0 z-10">
          <div className="container flex items-center justify-between">
            <button onClick={() => setCurrentView('execution-journey')} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-4 w-4" />
              <span className="font-medium text-sm">Back to Journey</span>
            </button>
            <h1 className="text-xl font-display font-bold flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <span className="text-gradient-primary">Company Setup</span>
            </h1>
            <span className="pill pill-primary text-xs">
              {ledger.ideaSnapshot?.ideaName || 'New Idea'}
            </span>
          </div>
        </header>

        <WizardProgress 
          currentStep={companySetupStep}
          totalSteps={4}
          stepLabels={['Target', 'Profit Type', 'Funding', 'Entity']}
          maxUnlockedStep={Math.max(ledger.maxUnlockedStep, companySetupStep)}
          onStepClick={(step) => setStep(step)}
        />

        <div className="flex-1 py-8 px-4 bg-gradient-hero">
          <div className="container max-w-4xl">
            <div className="grid lg:grid-cols-[1fr_280px] gap-8">
              <AnimatedStep stepKey={companySetupStep}>
                {renderCompanySetupStep()}
              </AnimatedStep>
              <div className="hidden lg:block">
                <div className="sticky top-32 animate-slide-in-right">
                  <ChoicesSidebar onReset={handleReset} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <FoundrChatbot />
      </div>
    );
  }

  // Timeline & Roadmap section
  if (currentView === 'timeline-roadmap') {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <header className="border-b border-border/50 p-4 bg-card/80 backdrop-blur-sm sticky top-0 z-10">
          <div className="container flex items-center justify-between">
            <button onClick={() => setCurrentView('execution-journey')} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-4 w-4" />
              <span className="font-medium text-sm">Back to Journey</span>
            </button>
            <h1 className="text-xl font-display font-bold text-gradient-primary">Timeline & Roadmap</h1>
            <span className="pill pill-accent text-xs">Planning</span>
          </div>
        </header>
        <div className="flex-1 py-8 px-4 bg-gradient-hero">
          <div className="container max-w-2xl">
            <TimelineStep onComplete={handleSectionComplete} />
          </div>
        </div>
        <FoundrChatbot />
      </div>
    );
  }

  // Pitch deck section
  if (currentView === 'pitch-deck') {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <header className="border-b border-border/50 p-4 bg-card/80 backdrop-blur-sm sticky top-0 z-10">
          <div className="container flex items-center justify-between">
            <button onClick={() => setCurrentView('execution-journey')} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-4 w-4" />
              <span className="font-medium text-sm">Back to Journey</span>
            </button>
            <h1 className="text-xl font-display font-bold text-gradient-primary">Pitch & Deck</h1>
            <span className="pill pill-primary text-xs">Investor Ready</span>
          </div>
        </header>
        <div className="flex-1 py-8 px-4 bg-gradient-hero">
          <div className="container max-w-2xl">
            <FinalSummaryStep onReset={handleReset} onGeneratePitch={() => setShowPitchDeck(true)} />
          </div>
        </div>
        <FoundrChatbot />
      </div>
    );
  }

  if (currentView === 'agents-hiring') {
    return (
      <AgentsModule 
        onComplete={handleSectionComplete} 
        onBack={() => setCurrentView('execution-journey')} 
      />
    );
  }

  // Main flow views
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b border-border/50 p-4 bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container flex items-center justify-between">
          <button onClick={onBack} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span className="font-medium text-sm">Back</span>
          </button>
          <h1 className="text-xl font-display font-bold flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="text-gradient-primary">FoundrFate</span>
          </h1>
          <span className="pill pill-primary text-xs">
            {ledger.ideaSnapshot?.ideaName || 'New Idea'}
          </span>
        </div>
      </header>

      <div className="flex-1 py-8 px-4 bg-gradient-hero">
        <div className="container max-w-4xl">
          {currentView === 'idea-input' && (
            <AnimatedStep stepKey="idea">
              <IdeaSnapshotStep onComplete={handleAnalyze} isAnalyzing={isLoading} />
            </AnimatedStep>
          )}

          {currentView === 'verdict-summary' && (
            <AnimatedStep stepKey="verdict">
              <VerdictSummary onProceed={handleProceed} />
            </AnimatedStep>
          )}

          {currentView === 'execution-journey' && (
            <AnimatedStep stepKey="journey">
              <ExecutionJourney 
                onOpenSection={handleOpenSection} 
                onBack={() => setCurrentView('verdict-summary')}
              />
            </AnimatedStep>
          )}
        </div>
      </div>

      <FoundrChatbot />
    </div>
  );
};
