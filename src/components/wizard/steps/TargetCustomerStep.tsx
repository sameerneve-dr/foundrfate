import { Button } from "@/components/ui/button";
import { Users, Building2, Briefcase, Shield, ArrowRight } from "lucide-react";
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

  const options: { value: TargetCustomer; label: string; desc: string; icon: React.ReactNode }[] = [
    {
      value: 'consumer',
      label: 'Consumers (B2C)',
      desc: 'Individual users, mass market',
      icon: <Users className="h-6 w-6" />
    },
    {
      value: 'b2b',
      label: 'Businesses (B2B)',
      desc: 'Companies, enterprises, SMBs',
      icon: <Building2 className="h-6 w-6" />
    },
    {
      value: 'product-teams',
      label: 'Product Teams',
      desc: 'Developers, designers, PMs',
      icon: <Briefcase className="h-6 w-6" />
    },
    {
      value: 'regulator',
      label: 'Regulated Industries',
      desc: 'Healthcare, finance, government',
      icon: <Shield className="h-6 w-6" />
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold">Who's your primary buyer?</h2>
        <p className="text-muted-foreground mt-2">This helps us tailor your go-to-market strategy</p>
      </div>

      <div className="grid gap-3">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => handleSelect(opt.value)}
            className={`flex items-center gap-4 p-4 border-2 transition-all text-left
              ${ledger.targetCustomer === opt.value 
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
