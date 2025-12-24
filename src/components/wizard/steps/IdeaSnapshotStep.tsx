import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Lightbulb, ArrowRight, Loader2 } from "lucide-react";
import { useDecisionLedger, type IdeaSnapshot } from "@/contexts/DecisionLedgerContext";

interface IdeaSnapshotStepProps {
  onComplete: () => void;
  isAnalyzing: boolean;
}

export const IdeaSnapshotStep = ({ onComplete, isAnalyzing }: IdeaSnapshotStepProps) => {
  const { ledger, updateLedger } = useDecisionLedger();
  
  const [snapshot, setSnapshot] = useState<IdeaSnapshot>(
    ledger.ideaSnapshot || {
      ideaName: '',
      problem: '',
      solution: '',
      audience: '',
      scaleIntent: 'venture-scale',
    }
  );

  const handleChange = (field: keyof IdeaSnapshot, value: string) => {
    setSnapshot(prev => ({ ...prev, [field]: value }));
  };

  const isValid = 
    snapshot.ideaName.trim() !== '' &&
    snapshot.problem.trim() !== '' &&
    snapshot.solution.trim() !== '' &&
    snapshot.audience.trim() !== '';

  const handleSubmit = () => {
    updateLedger({ ideaSnapshot: snapshot });
    onComplete();
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-foreground flex items-center justify-center">
          <Lightbulb className="h-7 w-7 text-background" />
        </div>
        <div>
          <h2 className="text-2xl md:text-3xl font-bold">Idea Snapshot</h2>
          <p className="text-muted-foreground">5 quick questions to understand your idea</p>
        </div>
      </div>

      <div className="grid gap-6">
        <div className="space-y-2">
          <Label className="text-base font-bold">1. What's your idea called?</Label>
          <Input
            value={snapshot.ideaName}
            onChange={(e) => handleChange('ideaName', e.target.value)}
            placeholder="Working title is fine..."
            className="border-2 h-12"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-base font-bold">2. What problem are you solving?</Label>
          <Textarea
            value={snapshot.problem}
            onChange={(e) => handleChange('problem', e.target.value)}
            placeholder="Who's hurting and why?"
            className="border-2 min-h-[100px] resize-none"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-base font-bold">3. What's your solution?</Label>
          <Textarea
            value={snapshot.solution}
            onChange={(e) => handleChange('solution', e.target.value)}
            placeholder="Describe what you're building..."
            className="border-2 min-h-[100px] resize-none"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-base font-bold">4. Who's your target audience?</Label>
          <Input
            value={snapshot.audience}
            onChange={(e) => handleChange('audience', e.target.value)}
            placeholder="B2B, consumers, developers..."
            className="border-2 h-12"
          />
        </div>

        <div className="space-y-3">
          <Label className="text-base font-bold">5. How big do you want this to be?</Label>
          <RadioGroup
            value={snapshot.scaleIntent}
            onValueChange={(v) => handleChange('scaleIntent', v)}
            className="grid gap-2"
          >
            <RadioOption value="lifestyle" label="Lifestyle business" desc="Sustainable income, no investors" />
            <RadioOption value="venture-scale" label="Venture-scale startup" desc="Go big or go home" />
            <RadioOption value="non-profit" label="Non-profit / social impact" desc="Mission over money" />
          </RadioGroup>
        </div>
      </div>

      <Button 
        onClick={handleSubmit} 
        disabled={!isValid || isAnalyzing}
        size="lg"
        className="w-full gap-2"
      >
        {isAnalyzing ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Analyzing your idea...
          </>
        ) : (
          <>
            Reveal My Fate
            <ArrowRight className="h-5 w-5" />
          </>
        )}
      </Button>
    </div>
  );
};

const RadioOption = ({ value, label, desc }: { value: string; label: string; desc: string }) => (
  <div className="flex items-center space-x-3 border-2 border-border p-4 hover:bg-secondary transition-colors cursor-pointer">
    <RadioGroupItem value={value} id={value} />
    <Label htmlFor={value} className="cursor-pointer flex-1">
      <span className="font-bold">{label}</span>
      <span className="text-muted-foreground ml-2 text-sm">— {desc}</span>
    </Label>
  </div>
);
