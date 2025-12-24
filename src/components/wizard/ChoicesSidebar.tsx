import { useDecisionLedger } from "@/contexts/DecisionLedgerContext";
import { Button } from "@/components/ui/button";
import { 
  Lightbulb, 
  Target, 
  Building2, 
  DollarSign, 
  Users,
  Rocket,
  RotateCcw,
  Shield,
  Sparkles
} from "lucide-react";

interface ChoicesSidebarProps {
  onReset?: () => void;
}

export const ChoicesSidebar = ({ onReset }: ChoicesSidebarProps) => {
  const { ledger } = useDecisionLedger();

  const hasAnyChoice = 
    ledger.ideaSnapshot ||
    ledger.verdict ||
    ledger.targetCustomer ||
    ledger.profitType ||
    ledger.entityType;

  if (!hasAnyChoice) return null;

  const getVerdictStyle = (verdict: string | null) => {
    switch (verdict) {
      case 'yes': return 'bg-success/10 text-success border-success/30';
      case 'conditional': return 'bg-warning/10 text-warning border-warning/30';
      case 'no': return 'bg-destructive/10 text-destructive border-destructive/30';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="bg-card rounded-2xl shadow-lg border border-border/50 overflow-hidden">
      {/* Header with gradient */}
      <div className="bg-gradient-primary p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
            <h3 className="font-bold text-sm text-primary-foreground uppercase tracking-wider">
              Your Choices
            </h3>
          </div>
          {onReset && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onReset} 
              className="h-7 px-2 text-xs text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10"
            >
              <RotateCcw className="h-3 w-3 mr-1" />
              Reset
            </Button>
          )}
        </div>
      </div>

      {/* Choices list */}
      <div className="p-4 space-y-3">
        {ledger.ideaSnapshot && (
          <ChoiceItem 
            icon={<Lightbulb className="h-4 w-4" />}
            label="Idea"
            value={ledger.ideaSnapshot.ideaName}
            color="primary"
          />
        )}

        {ledger.verdict && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-accent flex items-center justify-center shrink-0">
              <Target className="h-4 w-4 text-accent-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground">Verdict</p>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${getVerdictStyle(ledger.verdict)}`}>
                {ledger.verdict.toUpperCase()}
              </span>
            </div>
          </div>
        )}

        {ledger.targetCustomer && (
          <ChoiceItem 
            icon={<Users className="h-4 w-4" />}
            label="Target Customer"
            value={formatChoice(ledger.targetCustomer)}
            color="accent"
          />
        )}

        {ledger.profitType && (
          <ChoiceItem 
            icon={<DollarSign className="h-4 w-4" />}
            label="Profit Type"
            value={formatChoice(ledger.profitType)}
            color="success"
          />
        )}

        {ledger.entityType && (
          <ChoiceItem 
            icon={<Building2 className="h-4 w-4" />}
            label="Entity"
            value={formatChoice(ledger.entityType)}
            color="warning"
          />
        )}

        {ledger.fundraisingIntent && (
          <ChoiceItem 
            icon={<Rocket className="h-4 w-4" />}
            label="Funding"
            value={formatChoice(ledger.fundraisingIntent)}
            color="primary"
          />
        )}

        {ledger.founderVisaStatus && (
          <ChoiceItem 
            icon={<Shield className="h-4 w-4" />}
            label="Visa Status"
            value={formatChoice(ledger.founderVisaStatus)}
            color="accent"
          />
        )}
      </div>
    </div>
  );
};

const ChoiceItem = ({ 
  icon, 
  label, 
  value,
  color = 'primary'
}: { 
  icon: React.ReactNode; 
  label: string; 
  value: React.ReactNode;
  color?: 'primary' | 'accent' | 'success' | 'warning';
}) => {
  const colorClasses = {
    primary: 'bg-primary/10 text-primary',
    accent: 'bg-accent/10 text-accent',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning'
  };

  return (
    <div className="flex items-center gap-3">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${colorClasses[color]}`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-semibold truncate">{value}</p>
      </div>
    </div>
  );
};

const formatChoice = (choice: string): string => {
  return choice
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};
