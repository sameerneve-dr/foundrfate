import { useState } from "react";
import { 
  CheckCircle2, 
  Circle,
  ListChecks,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChecklistItem {
  id: string;
  label: string;
  description: string;
  optional?: boolean;
}

interface FundingChecklistProps {
  onGenerateAssets?: () => void;
}

export const FundingChecklist = ({ onGenerateAssets }: FundingChecklistProps) => {
  const items: ChecklistItem[] = [
    { id: 'angellist', label: 'AngelList profile', description: 'Create investor-ready profile' },
    { id: 'linkedin', label: 'LinkedIn founder story post', description: 'Share your journey publicly' },
    { id: 'deck', label: 'Simple pitch deck', description: '10-15 slides max' },
    { id: 'narrative', label: '1-page narrative', description: 'Why now, why you, why this' },
    { id: 'intros', label: 'Warm intro list (10–20 people)', description: 'Map your network connections' },
    { id: 'accelerators', label: 'Accelerator applications', description: 'YC, Techstars, Antler', optional: true }
  ];

  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const toggleItem = (id: string) => {
    setChecked(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const completedCount = Object.values(checked).filter(Boolean).length;
  const progress = (completedCount / items.length) * 100;

  return (
    <div className="bg-card rounded-2xl border border-border/50 shadow-lg p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-success flex items-center justify-center">
          <ListChecks className="h-5 w-5 text-success-foreground" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold">Step 3: Funding Setup Checklist</h3>
          <p className="text-sm text-muted-foreground">{completedCount} of {items.length} completed</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-2 bg-muted rounded-full overflow-hidden mb-6">
        <div 
          className="h-full progress-gradient transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Checklist Items */}
      <div className="space-y-3 mb-6">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => toggleItem(item.id)}
            className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all ${
              checked[item.id]
                ? 'border-success/50 bg-success/5'
                : 'border-border hover:border-primary/30'
            }`}
          >
            <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
              checked[item.id] ? 'text-success' : 'text-muted-foreground'
            }`}>
              {checked[item.id] ? (
                <CheckCircle2 className="h-5 w-5" />
              ) : (
                <Circle className="h-5 w-5" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className={`font-medium ${checked[item.id] ? 'line-through text-muted-foreground' : ''}`}>
                  {item.label}
                </span>
                {item.optional && (
                  <span className="text-xs text-muted-foreground">(optional)</span>
                )}
              </div>
              <p className="text-xs text-muted-foreground">{item.description}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button 
          onClick={onGenerateAssets}
          className="flex-1 gap-2 bg-gradient-primary hover:opacity-90"
        >
          <Sparkles className="h-4 w-4" />
          Generate my fundraising checklist
        </Button>
        <Button 
          variant="outline"
          onClick={onGenerateAssets}
          className="flex-1 gap-2"
        >
          Help me create these assets
        </Button>
      </div>
    </div>
  );
};