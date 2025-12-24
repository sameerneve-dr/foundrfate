import { Button } from "@/components/ui/button";
import { TrendingUp, Wallet, Shuffle, ArrowRight } from "lucide-react";
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

  const options: { value: FundraisingIntent; label: string; desc: string; icon: React.ReactNode }[] = [
    {
      value: 'venture-scale',
      label: 'Venture-Scale',
      desc: 'Raise from VCs, aim for $100M+ valuation',
      icon: <TrendingUp className="h-6 w-6" />
    },
    {
      value: 'bootstrap',
      label: 'Bootstrap',
      desc: 'Self-funded, keep full ownership',
      icon: <Wallet className="h-6 w-6" />
    },
    {
      value: 'mixed',
      label: 'Mixed Approach',
      desc: 'Angels/grants first, maybe VC later',
      icon: <Shuffle className="h-6 w-6" />
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold">Fundraising Intent</h2>
        <p className="text-muted-foreground mt-2">This shapes your entity choice and growth strategy</p>
      </div>

      <div className="grid gap-3">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => handleSelect(opt.value)}
            className={`flex items-center gap-4 p-4 border-2 transition-all text-left
              ${ledger.fundraisingIntent === opt.value 
                ? 'border-foreground bg-secondary' 
                : 'border-border hover:border-foreground/50 hover:bg-secondary/50'
              }`}
          >
            <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center shrink-0">
              {opt.icon}
            </div>
            <div className="flex-1">
              <p className="font-bold">{opt.label}</p>
              <p className="text-sm text-muted-foreground">{opt.desc}</p>
            </div>
            <ArrowRight className="h-5 w-5 text-muted-foreground" />
          </button>
        ))}
      </div>
    </div>
  );
};
