import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Building2, 
  Shield, 
  FileText, 
  Users, 
  Presentation, 
  Calendar,
  ChevronRight,
  Lock,
  Unlock,
  Clock,
  DollarSign,
  Sparkles,
  ArrowLeft
} from "lucide-react";
import { useDecisionLedger, type ExecutionSection, type SectionState } from "@/contexts/DecisionLedgerContext";
import { SectionGate } from "./SectionGate";

interface ExecutionJourneyProps {
  onOpenSection: (section: ExecutionSection) => void;
  onBack: () => void;
}

interface SectionConfig {
  id: ExecutionSection;
  icon: React.ReactNode;
  title: string;
  description: string;
  timeEstimate: string;
  costRange: string;
  color: 'primary' | 'accent' | 'success' | 'warning';
}

const sections: SectionConfig[] = [
  {
    id: 'company-setup',
    icon: <Building2 className="h-6 w-6" />,
    title: 'Company Setup',
    description: 'Entity selection, structure, and initial decisions',
    timeEstimate: '1-2 hours',
    costRange: 'Free',
    color: 'primary'
  },
  {
    id: 'legal-visa',
    icon: <Shield className="h-6 w-6" />,
    title: 'Legal & Visa Eligibility',
    description: 'Founder visa status, work authorization, legal paths',
    timeEstimate: '30 min',
    costRange: 'Free',
    color: 'accent'
  },
  {
    id: 'registration',
    icon: <FileText className="h-6 w-6" />,
    title: 'Registration & Incorporation',
    description: 'State filing, EIN, banking, legal documents',
    timeEstimate: '3-10 days',
    costRange: '$300-$3,000',
    color: 'success'
  },
  {
    id: 'agents-hiring',
    icon: <Users className="h-6 w-6" />,
    title: 'Agents & Hiring',
    description: 'Registered agents, first hires, contractors',
    timeEstimate: '1-4 weeks',
    costRange: '$125-$5,000',
    color: 'warning'
  },
  {
    id: 'pitch-deck',
    icon: <Presentation className="h-6 w-6" />,
    title: 'Pitch & Deck',
    description: 'Investor materials, pitch practice, deck generation',
    timeEstimate: '2-5 days',
    costRange: 'Free-$500',
    color: 'primary'
  },
  {
    id: 'timeline-roadmap',
    icon: <Calendar className="h-6 w-6" />,
    title: 'Timeline & Roadmap',
    description: 'Milestones, deadlines, execution plan',
    timeEstimate: '1 hour',
    costRange: 'Free',
    color: 'accent'
  }
];

const colorClasses = {
  primary: {
    bg: 'bg-primary/10',
    border: 'border-primary/30',
    icon: 'bg-gradient-primary text-primary-foreground',
    pill: 'pill-primary'
  },
  accent: {
    bg: 'bg-accent/10',
    border: 'border-accent/30',
    icon: 'bg-gradient-accent text-accent-foreground',
    pill: 'pill-accent'
  },
  success: {
    bg: 'bg-success/10',
    border: 'border-success/30',
    icon: 'bg-gradient-success text-success-foreground',
    pill: 'pill-success'
  },
  warning: {
    bg: 'bg-warning/10',
    border: 'border-warning/30',
    icon: 'bg-gradient-warning text-warning-foreground',
    pill: 'pill-warning'
  }
};

export const ExecutionJourney = ({ onOpenSection, onBack }: ExecutionJourneyProps) => {
  const { ledger, updateLedger } = useDecisionLedger();
  const [gateSection, setGateSection] = useState<ExecutionSection | null>(null);

  const handleSectionClick = (section: ExecutionSection) => {
    const sectionState = ledger.unlockedSections[section];
    
    if (sectionState.unlocked && sectionState.detailLevel) {
      // Already unlocked, go directly
      onOpenSection(section);
    } else {
      // Show the gate
      setGateSection(section);
    }
  };

  const handleGateChoice = (choice: 'step-by-step' | 'checklist' | 'skipped') => {
    if (!gateSection) return;

    const newSections = {
      ...ledger.unlockedSections,
      [gateSection]: {
        unlocked: choice !== 'skipped',
        detailLevel: choice
      } as SectionState
    };

    updateLedger({ unlockedSections: newSections });

    if (choice !== 'skipped') {
      onOpenSection(gateSection);
    }
    
    setGateSection(null);
  };

  const unlockedCount = Object.values(ledger.unlockedSections).filter(s => s.unlocked).length;

  if (gateSection) {
    const sectionConfig = sections.find(s => s.id === gateSection)!;
    return (
      <SectionGate 
        section={sectionConfig}
        onChoice={handleGateChoice}
        onBack={() => setGateSection(null)}
      />
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button 
          onClick={onBack}
          className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl md:text-3xl font-display font-bold">Your Execution Journey</h1>
          <p className="text-muted-foreground">
            {ledger.ideaSnapshot?.ideaName} • {unlockedCount} of {sections.length} sections unlocked
          </p>
        </div>
      </div>

      {/* Progress */}
      <div className="bg-card rounded-xl border border-border/50 p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Journey Progress</span>
          <span className="text-sm font-mono text-primary">{Math.round((unlockedCount / sections.length) * 100)}%</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full progress-gradient transition-all duration-500"
            style={{ width: `${(unlockedCount / sections.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Sections Grid */}
      <div className="space-y-4">
        {sections.map((section) => {
          const sectionState = ledger.unlockedSections[section.id];
          const isUnlocked = sectionState.unlocked;
          const colors = colorClasses[section.color];

          return (
            <button
              key={section.id}
              onClick={() => handleSectionClick(section.id)}
              className={`w-full flex items-center gap-4 p-5 rounded-2xl border-2 transition-all text-left group
                ${isUnlocked 
                  ? `${colors.bg} ${colors.border} shadow-md` 
                  : 'bg-card border-border/50 hover:border-primary/30 hover:shadow-md'
                }`}
            >
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105
                ${isUnlocked ? colors.icon : 'bg-muted text-muted-foreground'}`}>
                {section.icon}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-bold text-lg">{section.title}</p>
                  {isUnlocked ? (
                    <Unlock className="h-4 w-4 text-success" />
                  ) : (
                    <Lock className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{section.description}</p>
                <div className="flex items-center gap-4 mt-2">
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {section.timeEstimate}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <DollarSign className="h-3 w-3" />
                    {section.costRange}
                  </span>
                  {isUnlocked && sectionState.detailLevel && (
                    <span className={`pill text-xs ${colors.pill}`}>
                      {sectionState.detailLevel === 'step-by-step' ? 'Full Guide' : 'Checklist'}
                    </span>
                  )}
                </div>
              </div>

              <div className="shrink-0">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all
                  ${isUnlocked ? 'bg-white/50' : 'bg-muted group-hover:bg-primary/10'}`}>
                  <ChevronRight className={`h-5 w-5 transition-transform group-hover:translate-x-1
                    ${isUnlocked ? 'text-foreground' : 'text-muted-foreground'}`} />
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Chatbot hint */}
      <div className="bg-muted/50 rounded-xl p-4 flex items-center gap-3">
        <Sparkles className="h-5 w-5 text-primary shrink-0" />
        <p className="text-sm text-muted-foreground">
          Use the <strong>Ask FoundrFate</strong> chatbot to ask questions about any section — even ones you haven't unlocked yet.
        </p>
      </div>
    </div>
  );
};
