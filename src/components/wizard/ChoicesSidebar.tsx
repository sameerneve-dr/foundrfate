import { useDecisionLedger } from "@/contexts/DecisionLedgerContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Lightbulb, 
  Target, 
  Building2, 
  DollarSign, 
  Users,
  ChevronRight,
  RotateCcw
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

  return (
    <div className="border-2 border-border bg-secondary/50 p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-sm font-mono uppercase tracking-wider">Your Choices</h3>
        {onReset && (
          <Button variant="ghost" size="sm" onClick={onReset} className="h-6 px-2 text-xs">
            <RotateCcw className="h-3 w-3 mr-1" />
            Reset
          </Button>
        )}
      </div>

      <div className="space-y-3 text-sm">
        {ledger.ideaSnapshot && (
          <ChoiceItem 
            icon={<Lightbulb className="h-4 w-4" />}
            label="Idea"
            value={ledger.ideaSnapshot.ideaName}
          />
        )}

        {ledger.verdict && (
          <ChoiceItem 
            icon={<Target className="h-4 w-4" />}
            label="Verdict"
            value={
              <Badge variant={
                ledger.verdict === 'yes' ? 'default' : 
                ledger.verdict === 'conditional' ? 'secondary' : 'destructive'
              } className="text-xs">
                {ledger.verdict.toUpperCase()}
              </Badge>
            }
          />
        )}

        {ledger.targetCustomer && (
          <ChoiceItem 
            icon={<Users className="h-4 w-4" />}
            label="Target"
            value={formatChoice(ledger.targetCustomer)}
          />
        )}

        {ledger.profitType && (
          <ChoiceItem 
            icon={<DollarSign className="h-4 w-4" />}
            label="Profit"
            value={formatChoice(ledger.profitType)}
          />
        )}

        {ledger.entityType && (
          <ChoiceItem 
            icon={<Building2 className="h-4 w-4" />}
            label="Entity"
            value={formatChoice(ledger.entityType)}
          />
        )}

        {ledger.fundraisingIntent && (
          <ChoiceItem 
            icon={<ChevronRight className="h-4 w-4" />}
            label="Funding"
            value={formatChoice(ledger.fundraisingIntent)}
          />
        )}
      </div>
    </div>
  );
};

const ChoiceItem = ({ 
  icon, 
  label, 
  value 
}: { 
  icon: React.ReactNode; 
  label: string; 
  value: React.ReactNode;
}) => (
  <div className="flex items-center gap-2">
    <div className="text-muted-foreground">{icon}</div>
    <span className="text-muted-foreground">{label}:</span>
    <span className="font-medium">{value}</span>
  </div>
);

const formatChoice = (choice: string): string => {
  return choice
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};
