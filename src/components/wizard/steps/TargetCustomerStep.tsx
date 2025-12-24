import { Users, Building2, Briefcase, Shield, ArrowRight, Sparkles, Target } from "lucide-react";
import { useDecisionLedger, type TargetCustomer } from "@/contexts/DecisionLedgerContext";

interface TargetCustomerStepProps {
  onComplete: () => void;
}

export const TargetCustomerStep = ({ onComplete }: TargetCustomerStepProps) => {
  const { ledger, updateLedger } = useDecisionLedger();

  const handleSelect = (target: TargetCustomer) => {
    updateLedger({ targetCustomer: target });
    onComplete();
  };

  const options: { value: TargetCustomer; label: string; desc: string; icon: React.ReactNode; color: string }[] = [
    {
      value: 'consumer',
      label: 'Consumers (B2C)',
      desc: 'Individual users, mass market',
      icon: <Users className="h-6 w-6" />,
      color: 'primary'
    },
    {
      value: 'b2b',
      label: 'Businesses (B2B)',
      desc: 'Companies, enterprises, SMBs',
      icon: <Building2 className="h-6 w-6" />,
      color: 'accent'
    },
    {
      value: 'product-teams',
      label: 'Product Teams',
      desc: 'Developers, designers, PMs',
      icon: <Briefcase className="h-6 w-6" />,
      color: 'success'
    },
    {
      value: 'regulator',
      label: 'Regulated Industries',
      desc: 'Healthcare, finance, government',
      icon: <Shield className="h-6 w-6" />,
      color: 'warning'
    }
  ];

  const colorClasses: Record<string, string> = {
    primary: 'bg-primary/10 text-primary group-hover:bg-gradient-primary group-hover:text-primary-foreground',
    accent: 'bg-accent/10 text-accent group-hover:bg-gradient-accent group-hover:text-accent-foreground',
    success: 'bg-success/10 text-success group-hover:bg-gradient-success group-hover:text-success-foreground',
    warning: 'bg-warning/10 text-warning group-hover:bg-gradient-warning group-hover:text-warning-foreground'
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-accent flex items-center justify-center shadow-lg shadow-accent/30">
          <Target className="h-7 w-7 text-accent-foreground" />
        </div>
        <div>
          <h2 className="text-2xl md:text-3xl font-display font-bold">Who's Your Buyer?</h2>
          <p className="text-muted-foreground">This helps us tailor your go-to-market strategy</p>
        </div>
      </div>

      <div className="grid gap-3">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => handleSelect(opt.value)}
            className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all text-left group
              ${ledger.targetCustomer === opt.value 
                ? 'border-primary bg-primary/5 shadow-lg ring-2 ring-primary/20' 
                : 'border-border hover:border-primary/50 hover:bg-muted/50 hover:shadow-md'
              }`}
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200 ${colorClasses[opt.color]}`}>
              {opt.icon}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="font-bold">{opt.label}</p>
                {ledger.targetCustomer === opt.value && (
                  <span className="pill pill-success text-xs">
                    <Sparkles className="h-3 w-3" />
                    Selected
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-1">{opt.desc}</p>
            </div>
            <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
          </button>
        ))}
      </div>
    </div>
  );
};
