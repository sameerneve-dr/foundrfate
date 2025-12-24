import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Lightbulb, ArrowRight, Loader2, Sparkles, Rocket, Heart } from "lucide-react";
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
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-lg shadow-primary/30">
          <Lightbulb className="h-8 w-8 text-primary-foreground" />
        </div>
        <div>
          <h2 className="text-2xl md:text-3xl font-display font-bold">Idea Snapshot</h2>
          <p className="text-muted-foreground">5 quick questions to understand your idea</p>
        </div>
      </div>

      {/* Form */}
      <div className="grid gap-6">
        <div className="bg-card rounded-2xl border border-border/50 shadow-sm p-5 space-y-3">
          <Label className="text-base font-bold flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">1</span>
            What's your idea called?
          </Label>
          <Input
            value={snapshot.ideaName}
            onChange={(e) => handleChange('ideaName', e.target.value)}
            placeholder="Working title is fine..."
            className="border-2 h-12 rounded-xl focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="bg-card rounded-2xl border border-border/50 shadow-sm p-5 space-y-3">
          <Label className="text-base font-bold flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">2</span>
            What problem are you solving?
          </Label>
          <Textarea
            value={snapshot.problem}
            onChange={(e) => handleChange('problem', e.target.value)}
            placeholder="Who's hurting and why?"
            className="border-2 min-h-[100px] resize-none rounded-xl focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="bg-card rounded-2xl border border-border/50 shadow-sm p-5 space-y-3">
          <Label className="text-base font-bold flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">3</span>
            What's your solution?
          </Label>
          <Textarea
            value={snapshot.solution}
            onChange={(e) => handleChange('solution', e.target.value)}
            placeholder="Describe what you're building..."
            className="border-2 min-h-[100px] resize-none rounded-xl focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="bg-card rounded-2xl border border-border/50 shadow-sm p-5 space-y-3">
          <Label className="text-base font-bold flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">4</span>
            Who's your target audience?
          </Label>
          <Input
            value={snapshot.audience}
            onChange={(e) => handleChange('audience', e.target.value)}
            placeholder="B2B, consumers, developers..."
            className="border-2 h-12 rounded-xl focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="bg-card rounded-2xl border border-border/50 shadow-sm p-5 space-y-4">
          <Label className="text-base font-bold flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">5</span>
            How big do you want this to be?
          </Label>
          <RadioGroup
            value={snapshot.scaleIntent}
            onValueChange={(v) => handleChange('scaleIntent', v)}
            className="grid gap-3"
          >
            <RadioOption 
              value="lifestyle" 
              label="Lifestyle business" 
              desc="Sustainable income, no investors"
              icon={<Sparkles className="h-5 w-5" />}
              color="accent"
            />
            <RadioOption 
              value="venture-scale" 
              label="Venture-scale startup" 
              desc="Go big or go home"
              icon={<Rocket className="h-5 w-5" />}
              color="primary"
            />
            <RadioOption 
              value="non-profit" 
              label="Non-profit / social impact" 
              desc="Mission over money"
              icon={<Heart className="h-5 w-5" />}
              color="success"
            />
          </RadioGroup>
        </div>
      </div>

      <Button 
        onClick={handleSubmit} 
        disabled={!isValid || isAnalyzing}
        size="lg"
        className="w-full gap-2 bg-gradient-primary hover:opacity-90 text-primary-foreground font-bold text-lg h-14 rounded-xl shadow-lg btn-glow-primary transition-all"
      >
        {isAnalyzing ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Analyzing your idea...
          </>
        ) : (
          <>
            <Sparkles className="h-5 w-5" />
            Reveal My Fate
            <ArrowRight className="h-5 w-5" />
          </>
        )}
      </Button>
    </div>
  );
};

const RadioOption = ({ 
  value, 
  label, 
  desc, 
  icon,
  color = 'primary'
}: { 
  value: string; 
  label: string; 
  desc: string;
  icon: React.ReactNode;
  color?: 'primary' | 'accent' | 'success';
}) => {
  const colorClasses = {
    primary: 'data-[state=checked]:border-primary data-[state=checked]:bg-primary/5',
    accent: 'data-[state=checked]:border-accent data-[state=checked]:bg-accent/5',
    success: 'data-[state=checked]:border-success data-[state=checked]:bg-success/5'
  };

  const iconColors = {
    primary: 'text-primary',
    accent: 'text-accent',
    success: 'text-success'
  };

  return (
    <div className={`flex items-center space-x-4 border-2 border-border rounded-xl p-4 hover:bg-muted/50 transition-all cursor-pointer group ${colorClasses[color]}`}>
      <RadioGroupItem value={value} id={value} className="shrink-0" />
      <div className={`w-10 h-10 rounded-lg bg-muted flex items-center justify-center group-hover:scale-105 transition-transform ${iconColors[color]}`}>
        {icon}
      </div>
      <Label htmlFor={value} className="cursor-pointer flex-1">
        <span className="font-bold block">{label}</span>
        <span className="text-muted-foreground text-sm">{desc}</span>
      </Label>
    </div>
  );
};
