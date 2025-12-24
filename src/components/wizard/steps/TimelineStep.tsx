import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  ChevronDown, 
  ChevronUp,
  ArrowRight,
  Check,
  Sparkles,
  Rocket,
  Users,
  TrendingUp,
  Zap
} from "lucide-react";
import { useDecisionLedger } from "@/contexts/DecisionLedgerContext";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface TimelineStepProps {
  onComplete: () => void;
}

export const TimelineStep = ({ onComplete }: TimelineStepProps) => {
  const { ledger } = useDecisionLedger();
  const [expandedPhase, setExpandedPhase] = useState<string | null>('month0');

  const analysis = ledger.analysis;
  if (!analysis) return null;

  const phases = [
    {
      id: 'month0',
      label: 'Month 0-1',
      title: 'Validation',
      icon: <Zap className="h-5 w-5" />,
      gradient: 'bg-gradient-primary',
      tasks: analysis.timeline.month0to1
    },
    {
      id: 'month2',
      label: 'Month 2-3',
      title: 'MVP',
      icon: <Rocket className="h-5 w-5" />,
      gradient: 'bg-gradient-accent',
      tasks: analysis.timeline.month2to3
    },
    {
      id: 'month4',
      label: 'Month 4-6',
      title: 'Early Users',
      icon: <Users className="h-5 w-5" />,
      gradient: 'bg-gradient-success',
      tasks: analysis.timeline.month4to6
    },
    {
      id: 'month7',
      label: 'Month 7+',
      title: 'Scale',
      icon: <TrendingUp className="h-5 w-5" />,
      gradient: 'bg-gradient-warning',
      tasks: analysis.timeline.month7plus
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-lg shadow-primary/30">
          <Calendar className="h-7 w-7 text-primary-foreground" />
        </div>
        <div>
          <h2 className="text-2xl md:text-3xl font-display font-bold">Execution Timeline</h2>
          <p className="text-muted-foreground">Your personalized roadmap</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="flex gap-1">
        {phases.map((phase, i) => (
          <div 
            key={phase.id}
            className={`h-2 flex-1 rounded-full ${phase.gradient}`}
          />
        ))}
      </div>

      <div className="space-y-3">
        {phases.map((phase, index) => {
          const isExpanded = expandedPhase === phase.id;
          
          return (
            <Collapsible 
              key={phase.id}
              open={isExpanded}
              onOpenChange={(open) => setExpandedPhase(open ? phase.id : null)}
            >
              <CollapsibleTrigger asChild>
                <button className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left group
                  ${isExpanded 
                    ? 'border-primary bg-primary/5 shadow-lg' 
                    : 'border-border hover:border-primary/50 hover:bg-muted/50'
                  }`}>
                  <div className={`w-12 h-12 rounded-xl ${phase.gradient} flex items-center justify-center text-primary-foreground shadow-md transition-transform group-hover:scale-105`}>
                    {phase.icon}
                  </div>
                  <div className="flex-1">
                    <p className="font-mono text-xs text-muted-foreground">{phase.label}</p>
                    <p className="font-bold text-lg">{phase.title}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="pill pill-primary text-xs">{phase.tasks.length} tasks</span>
                    {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                  </div>
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="mt-2 p-4 bg-muted/30 rounded-xl border border-border/50 space-y-2 animate-fade-in">
                  {phase.tasks.map((task, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 bg-card rounded-xl border border-border/50 shadow-sm">
                      <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-primary">{i + 1}</span>
                      </div>
                      <span className="text-sm flex-1">{task}</span>
                    </div>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          );
        })}
      </div>

      <Button 
        onClick={onComplete} 
        size="lg" 
        className="w-full gap-2 bg-gradient-primary hover:opacity-90 text-primary-foreground font-bold text-lg h-14 rounded-xl shadow-lg btn-glow-primary transition-all"
      >
        <Sparkles className="h-5 w-5" />
        Continue to Final Summary
        <ArrowRight className="h-5 w-5" />
      </Button>
    </div>
  );
};
