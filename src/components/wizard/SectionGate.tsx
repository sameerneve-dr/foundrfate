import { Button } from "@/components/ui/button";
import { 
  ArrowLeft,
  ListChecks,
  BookOpen,
  SkipForward,
  Sparkles
} from "lucide-react";

interface SectionConfig {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  timeEstimate: string;
  costRange: string;
  color: 'primary' | 'accent' | 'success' | 'warning';
}

interface SectionGateProps {
  section: SectionConfig;
  onChoice: (choice: 'step-by-step' | 'checklist' | 'skipped') => void;
  onBack: () => void;
}

const colorClasses = {
  primary: 'bg-gradient-primary',
  accent: 'bg-gradient-accent',
  success: 'bg-gradient-success',
  warning: 'bg-gradient-warning'
};

export const SectionGate = ({ section, onChoice, onBack }: SectionGateProps) => {
  return (
    <div className="space-y-8 animate-fade-in max-w-xl mx-auto">
      {/* Back button */}
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span className="text-sm font-medium">Back to Journey</span>
      </button>

      {/* Section Header */}
      <div className="text-center space-y-4">
        <div className={`w-20 h-20 rounded-2xl ${colorClasses[section.color]} flex items-center justify-center mx-auto shadow-lg text-white`}>
          {section.icon}
        </div>
        <div>
          <h2 className="text-2xl md:text-3xl font-display font-bold">{section.title}</h2>
          <p className="text-muted-foreground mt-1">{section.description}</p>
        </div>
      </div>

      {/* The Gate Question */}
      <div className="bg-card rounded-2xl border border-border/50 shadow-lg p-6 space-y-6">
        <div className="text-center">
          <Sparkles className="h-6 w-6 text-primary mx-auto mb-2" />
          <h3 className="text-lg font-bold">Do you want full setup guidance for this?</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Choose how much detail you need
          </p>
        </div>

        <div className="space-y-3">
          <Button
            onClick={() => onChoice('step-by-step')}
            size="lg"
            className="w-full gap-3 bg-gradient-primary hover:opacity-90 text-primary-foreground font-bold h-14 rounded-xl shadow-lg btn-glow-primary transition-all justify-start px-6"
          >
            <BookOpen className="h-5 w-5" />
            <div className="text-left">
              <p>Yes, show me step-by-step</p>
              <p className="text-xs font-normal opacity-80">Full guidance with explanations</p>
            </div>
          </Button>

          <Button
            onClick={() => onChoice('checklist')}
            variant="outline"
            size="lg"
            className="w-full gap-3 h-14 rounded-xl border-2 justify-start px-6"
          >
            <ListChecks className="h-5 w-5 text-primary" />
            <div className="text-left">
              <p className="font-bold">Just give me a checklist</p>
              <p className="text-xs text-muted-foreground">Quick overview, I'll figure it out</p>
            </div>
          </Button>

          <Button
            onClick={() => onChoice('skipped')}
            variant="ghost"
            size="lg"
            className="w-full gap-3 h-12 rounded-xl text-muted-foreground hover:text-foreground justify-start px-6"
          >
            <SkipForward className="h-5 w-5" />
            <span>Skip for now</span>
          </Button>
        </div>
      </div>

      {/* Context pills */}
      <div className="flex justify-center gap-4 text-sm text-muted-foreground">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-primary"></span>
          {section.timeEstimate}
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-success"></span>
          {section.costRange}
        </span>
      </div>
    </div>
  );
};
