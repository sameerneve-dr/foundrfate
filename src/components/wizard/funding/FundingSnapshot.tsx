import { 
  DollarSign, 
  TrendingUp, 
  Target,
  CheckCircle2
} from "lucide-react";
import { useDecisionLedger } from "@/contexts/DecisionLedgerContext";

export const FundingSnapshot = () => {
  const { ledger } = useDecisionLedger();
  
  const entityType = ledger.entityType;
  const fundraisingIntent = ledger.fundraisingIntent;
  
  const getStageRecommendation = () => {
    if (fundraisingIntent === 'bootstrap') {
      return { stage: 'Bootstrapping', description: 'Self-funded growth path' };
    }
    if (entityType === 'delaware-c-corp') {
      return { stage: 'Pre-Seed Ready', description: 'Set up for institutional investment' };
    }
    return { stage: 'Early Stage', description: 'Focus on validation first' };
  };

  const getTypicalRaise = () => {
    if (fundraisingIntent === 'venture-scale') {
      return '$100K - $500K';
    }
    if (fundraisingIntent === 'mixed') {
      return '$25K - $150K';
    }
    return 'Self-funded';
  };

  const stage = getStageRecommendation();

  return (
    <div className="bg-card rounded-2xl border border-border/50 shadow-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-gradient-success flex items-center justify-center">
          <DollarSign className="h-6 w-6 text-success-foreground" />
        </div>
        <div>
          <h2 className="text-xl font-bold">Funding Overview</h2>
          <p className="text-sm text-muted-foreground">{ledger.ideaSnapshot?.ideaName}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-muted/50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Target className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Stage</span>
          </div>
          <p className="text-lg font-bold">{stage.stage}</p>
          <p className="text-xs text-muted-foreground">{stage.description}</p>
        </div>

        <div className="bg-muted/50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-success" />
            <span className="text-sm font-medium">Typical Raise</span>
          </div>
          <p className="text-lg font-bold">{getTypicalRaise()}</p>
          <p className="text-xs text-muted-foreground">Based on your model</p>
        </div>

        <div className="bg-muted/50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="h-4 w-4 text-accent" />
            <span className="text-sm font-medium">Readiness</span>
          </div>
          <p className="text-lg font-bold">
            {entityType === 'delaware-c-corp' ? 'Investor Ready' : 'Setup Needed'}
          </p>
          <p className="text-xs text-muted-foreground">
            {entityType === 'delaware-c-corp' ? 'C-Corp structure in place' : 'Consider C-Corp for VCs'}
          </p>
        </div>
      </div>
    </div>
  );
};