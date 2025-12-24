import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  ChevronDown, 
  ChevronUp,
  ArrowRight,
  Check
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
      tasks: analysis.timeline.month0to1
    },
    {
      id: 'month2',
      label: 'Month 2-3',
      title: 'MVP',
      tasks: analysis.timeline.month2to3
    },
    {
      id: 'month4',
      label: 'Month 4-6',
      title: 'Early Users',
      tasks: analysis.timeline.month4to6
    },
    {
      id: 'month7',
      label: 'Month 7+',
      title: 'Scale',
      tasks: analysis.timeline.month7plus
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-foreground flex items-center justify-center">
          <Calendar className="h-6 w-6 text-background" />
        </div>
        <div>
          <h2 className="text-2xl md:text-3xl font-bold">Execution Timeline</h2>
          <p className="text-muted-foreground">Your personalized roadmap</p>
        </div>
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
                <button className="w-full flex items-center gap-4 p-4 border-2 border-border hover:bg-secondary transition-colors text-left">
                  <div className="font-mono text-sm text-muted-foreground min-w-[80px]">
                    {phase.label}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold">{phase.title}</p>
                    <p className="text-sm text-muted-foreground">{phase.tasks.length} tasks</p>
                  </div>
                  {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="border-2 border-t-0 border-border p-4">
                  <ul className="space-y-2">
                    {phase.tasks.map((task, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full border-2 border-border flex items-center justify-center shrink-0 mt-0.5">
                          <span className="text-xs font-mono">{i + 1}</span>
                        </div>
                        <span className="text-sm">{task}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CollapsibleContent>
            </Collapsible>
          );
        })}
      </div>

      <Button onClick={onComplete} size="lg" className="w-full gap-2">
        Continue to Final Summary
        <ArrowRight className="h-5 w-5" />
      </Button>
    </div>
  );
};
