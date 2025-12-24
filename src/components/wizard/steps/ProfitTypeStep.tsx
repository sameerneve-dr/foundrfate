import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DollarSign, Heart, Shuffle, HelpCircle, ChevronRight, Sparkles } from "lucide-react";
import { useDecisionLedger, type ProfitType } from "@/contexts/DecisionLedgerContext";
import { DecisionCard } from "../DecisionCard";

interface ProfitTypeStepProps {
  onComplete: () => void;
}

export const ProfitTypeStep = ({ onComplete }: ProfitTypeStepProps) => {
  const { ledger, updateLedger } = useDecisionLedger();
  const [showOptions, setShowOptions] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const analysis = ledger.analysis;
  const recommendation = analysis?.profitStructure?.recommendation || 'for-profit';

  const handleAccept = () => {
    updateLedger({ 
      profitType: recommendation as ProfitType,
      profitTypeAccepted: true 
    });
    onComplete();
  };

  const handleSelect = (type: ProfitType) => {
    updateLedger({ 
      profitType: type,
      profitTypeAccepted: true 
    });
    onComplete();
  };

  const options: { value: ProfitType; label: string; desc: string; icon: React.ReactNode; color: string }[] = [
    {
      value: 'for-profit',
      label: 'For-Profit',
      desc: 'Traditional startup model, can raise VC funding',
      icon: <DollarSign className="h-6 w-6" />,
      color: 'primary'
    },
    {
      value: 'non-profit',
      label: 'Non-Profit (501c3)',
      desc: 'Tax-exempt, grant funding, mission-driven',
      icon: <Heart className="h-6 w-6" />,
      color: 'success'
    },
    {
      value: 'hybrid',
      label: 'Hybrid Model',
      desc: 'Public benefit corp, B-Corp, or social enterprise',
      icon: <Shuffle className="h-6 w-6" />,
      color: 'accent'
    }
  ];

  const getIcon = () => {
    const opt = options.find(o => o.value === recommendation);
    return opt?.icon || <DollarSign className="h-6 w-6" />;
  };

  if (showOptions) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-accent flex items-center justify-center shadow-lg shadow-accent/30">
            <DollarSign className="h-7 w-7 text-accent-foreground" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-display font-bold">Profit Structure</h2>
            <p className="text-muted-foreground">This affects legal structure and funding options</p>
          </div>
        </div>

        <div className="grid gap-3">
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleSelect(opt.value)}
              className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all text-left group
                ${opt.value === recommendation 
                  ? 'border-primary bg-primary/5 shadow-lg' 
                  : 'border-border hover:border-primary/50 hover:bg-muted/50 hover:shadow-md'
                }`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105
                ${opt.value === recommendation ? 'bg-gradient-primary text-primary-foreground' : 'bg-muted'}`}>
                {opt.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-bold">{opt.label}</p>
                  {opt.value === recommendation && (
                    <span className="pill pill-primary text-xs">
                      <Sparkles className="h-3 w-3" />
                      RECOMMENDED
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1">{opt.desc}</p>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </button>
          ))}
        </div>

        <Button variant="outline" onClick={() => setShowOptions(false)} className="rounded-xl">
          Back to recommendation
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-accent flex items-center justify-center shadow-lg shadow-accent/30">
          <DollarSign className="h-7 w-7 text-accent-foreground" />
        </div>
        <div>
          <h2 className="text-2xl md:text-3xl font-display font-bold">Profit Structure</h2>
          <p className="text-muted-foreground">Based on your idea and scale intent</p>
        </div>
      </div>

      <DecisionCard
        title={`${recommendation === 'for-profit' ? 'For-Profit' : recommendation === 'non-profit' ? 'Non-Profit' : 'Hybrid'}`}
        description={analysis?.profitStructure?.reason || 'This structure best matches your goals.'}
        recommendation="Best for your goals"
        icon={getIcon()}
        onAccept={handleAccept}
        onShowOptions={() => setShowOptions(true)}
        onExplain={() => setShowExplanation(!showExplanation)}
      />

      {showExplanation && (
        <div className="bg-muted/50 rounded-2xl p-5 border border-border/50 space-y-3 animate-fade-in">
          <h4 className="font-bold flex items-center gap-2">
            <HelpCircle className="h-4 w-4 text-primary" />
            Quick explanation
          </h4>
          <div className="grid gap-2">
            <div className="flex items-start gap-3 p-3 bg-card rounded-xl border border-border/50">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <DollarSign className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">For-Profit</p>
                <p className="text-xs text-muted-foreground">Keep equity, raise VC, exit via acquisition/IPO</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-card rounded-xl border border-border/50">
              <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center shrink-0">
                <Heart className="h-4 w-4 text-success" />
              </div>
              <div>
                <p className="font-medium text-sm">Non-Profit</p>
                <p className="text-xs text-muted-foreground">Tax exempt, grants, no equity but salary allowed</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-card rounded-xl border border-border/50">
              <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                <Shuffle className="h-4 w-4 text-accent" />
              </div>
              <div>
                <p className="font-medium text-sm">Hybrid</p>
                <p className="text-xs text-muted-foreground">Best of both worlds, but more complex setup</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
