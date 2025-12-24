import { useState } from "react";
import { 
  Rocket, 
  Clock, 
  HelpCircle,
  Wallet,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDecisionLedger, type FundraisingIntent } from "@/contexts/DecisionLedgerContext";

interface FundraisingReadinessProps {
  onComplete: () => void;
}

export const FundraisingReadiness = ({ onComplete }: FundraisingReadinessProps) => {
  const { ledger, updateLedger } = useDecisionLedger();
  const [selected, setSelected] = useState<FundraisingIntent>(ledger.fundraisingIntent);

  const options: { value: FundraisingIntent; label: string; description: string; icon: React.ReactNode }[] = [
    {
      value: 'venture-scale',
      label: 'Yes, now',
      description: 'Ready to pitch and raise capital',
      icon: <Rocket className="h-5 w-5" />
    },
    {
      value: 'mixed',
      label: 'Yes, later',
      description: 'Building first, then raising',
      icon: <Clock className="h-5 w-5" />
    },
    {
      value: null,
      label: 'Not sure',
      description: 'Still exploring options',
      icon: <HelpCircle className="h-5 w-5" />
    },
    {
      value: 'bootstrap',
      label: 'No, bootstrap',
      description: 'Self-funded growth path',
      icon: <Wallet className="h-5 w-5" />
    }
  ];

  const handleSelect = (value: FundraisingIntent) => {
    setSelected(value);
    updateLedger({ fundraisingIntent: value });
  };

  return (
    <div className="bg-card rounded-2xl border border-border/50 shadow-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
          <Rocket className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h3 className="text-lg font-bold">Step 1: Are You Fundraise-Ready?</h3>
          <p className="text-sm text-muted-foreground">Do you want to raise money?</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-3 mb-6">
        {options.map((option) => (
          <button
            key={option.value || 'null'}
            onClick={() => handleSelect(option.value)}
            className={`p-4 rounded-xl border-2 text-left transition-all ${
              selected === option.value
                ? 'border-primary bg-primary/10'
                : 'border-border hover:border-primary/50'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                selected === option.value
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}>
                {option.icon}
              </div>
              <div>
                <p className="font-semibold">{option.label}</p>
                <p className="text-xs text-muted-foreground">{option.description}</p>
              </div>
              {selected === option.value && (
                <CheckCircle2 className="h-5 w-5 text-primary ml-auto" />
              )}
            </div>
          </button>
        ))}
      </div>

      <Button
        onClick={onComplete}
        disabled={selected === undefined}
        className="w-full gap-2"
      >
        Continue
      </Button>
    </div>
  );
};