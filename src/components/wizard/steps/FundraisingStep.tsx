import { TrendingUp, Wallet, Shuffle, ArrowRight, Rocket, Sparkles } from "lucide-react";
import { useDecisionLedger, type FundraisingIntent } from "@/contexts/DecisionLedgerContext";

interface FundraisingStepProps {
  onComplete: () => void;
}

export const FundraisingStep = ({ onComplete }: FundraisingStepProps) => {
  const { ledger, updateLedger } = useDecisionLedger();

  const handleSelect = (intent: FundraisingIntent) => {
    updateLedger({ fundraisingIntent: intent });
    onComplete();
  };

  const options: { value: FundraisingIntent; label: string; desc: string; icon: React.ReactNode; gradient: string }[] = [
    {
      value: 'venture-scale',
      label: 'Venture-Scale',
      desc: 'Raise from VCs, aim for $100M+ valuation',
      icon: <Rocket className="h-6 w-6" />,
      gradient: 'bg-gradient-primary'
    },
    {
      value: 'bootstrap',
      label: 'Bootstrap',
      desc: 'Self-funded, keep full ownership',
      icon: <Wallet className="h-6 w-6" />,
      gradient: 'bg-gradient-accent'
    },
    {
      value: 'mixed',
      label: 'Mixed Approach',
      desc: 'Angels/grants first, maybe VC later',
      icon: <Shuffle className="h-6 w-6" />,
      gradient: 'bg-gradient-success'
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-lg shadow-primary/30">
          <TrendingUp className="h-7 w-7 text-primary-foreground" />
        </div>
        <div>
          <h2 className="text-2xl md:text-3xl font-display font-bold">Fundraising Intent</h2>
          <p className="text-muted-foreground">This shapes your entity choice and growth strategy</p>
        </div>
      </div>

      <div className="grid gap-4">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => handleSelect(opt.value)}
            className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all text-left group
              ${ledger.fundraisingIntent === opt.value 
                ? 'border-primary bg-primary/5 shadow-lg ring-2 ring-primary/20' 
                : 'border-border hover:border-primary/50 hover:bg-muted/50 hover:shadow-md'
              }`}
          >
            <div className={`w-14 h-14 rounded-xl ${opt.gradient} flex items-center justify-center shrink-0 text-primary-foreground transition-transform group-hover:scale-105 shadow-lg`}>
              {opt.icon}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="font-bold text-lg">{opt.label}</p>
                {ledger.fundraisingIntent === opt.value && (
                  <span className="pill pill-success text-xs">
                    <Sparkles className="h-3 w-3" />
                    Selected
                  </span>
                )}
              </div>
              <p className="text-muted-foreground mt-1">{opt.desc}</p>
            </div>
            <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
          </button>
        ))}
      </div>

      <p className="text-sm text-muted-foreground text-center pt-2">
        💡 Your choice affects entity recommendations and investor expectations
      </p>
    </div>
  );
};
