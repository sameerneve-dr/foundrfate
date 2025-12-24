import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Download, 
  Presentation, 
  RotateCcw,
  Sparkles,
  Share2,
  Copy,
  Check,
  Loader2,
  Target,
  DollarSign,
  Building2,
  Rocket,
  Clock,
  Zap,
  Shield,
  TrendingUp,
  CheckCircle2
} from "lucide-react";
import { useDecisionLedger } from "@/contexts/DecisionLedgerContext";
import { usePdfExport } from "@/hooks/usePdfExport";
import { useShareAnalysis } from "@/hooks/useShareAnalysis";

interface FinalSummaryStepProps {
  onReset: () => void;
  onGeneratePitch: () => void;
}

export const FinalSummaryStep = ({ onReset, onGeneratePitch }: FinalSummaryStepProps) => {
  const { ledger } = useDecisionLedger();
  const { exportToPdf } = usePdfExport();
  const { shareAnalysis, copyToClipboard, isSharing, shareUrl } = useShareAnalysis();
  const [copied, setCopied] = useState(false);

  const analysis = ledger.analysis;
  if (!analysis || !ledger.ideaSnapshot) return null;

  const handleExport = () => {
    const ideaData = {
      ideaName: ledger.ideaSnapshot!.ideaName,
      problemStatement: ledger.ideaSnapshot!.problem,
      proposedSolution: ledger.ideaSnapshot!.solution,
      targetAudience: ledger.ideaSnapshot!.audience,
      existingAlternatives: '',
      purpose: 'real-startup' as const,
      scaleIntent: ledger.ideaSnapshot!.scaleIntent,
      founderBackground: '',
      timeline: ''
    };
    exportToPdf(ideaData, analysis);
  };

  const handleShare = async () => {
    await shareAnalysis();
  };

  const handleCopy = async () => {
    await copyToClipboard();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getNextActions = () => {
    const actions: string[] = [];
    
    if (ledger.entityType === 'delaware-c-corp') {
      const setup = ledger.cCorpSetup.preIncorporation;
      if (!setup.nameCheck) actions.push('Check Delaware name availability');
      if (!setup.registeredAgent) actions.push('Choose a registered agent service');
      if (!setup.founderDetails) actions.push('Gather all founder information');
    }

    if (actions.length < 3) actions.push('Schedule 5 customer discovery calls');
    if (actions.length < 3) actions.push('Create a landing page to test demand');
    if (actions.length < 3) actions.push('Draft your 1-paragraph pitch');

    return actions.slice(0, 3);
  };

  const formatChoice = (choice: string | null): string => {
    if (!choice) return 'Not selected';
    return choice.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const getVerdictConfig = () => {
    switch (analysis.decision) {
      case 'yes':
        return { gradient: 'bg-verdict-yes', label: '✅ PURSUE', textColor: 'text-success-foreground' };
      case 'conditional':
        return { gradient: 'bg-verdict-conditional', label: '⚠️ CONDITIONAL', textColor: 'text-warning-foreground' };
      default:
        return { gradient: 'bg-verdict-no', label: '❌ PIVOT', textColor: 'text-destructive-foreground' };
    }
  };

  const verdictConfig = getVerdictConfig();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Hero Card */}
      <div className={`${verdictConfig.gradient} rounded-2xl p-8 text-center shadow-xl relative overflow-hidden`}>
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
        <div className="relative space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white">{ledger.ideaSnapshot.ideaName}</h2>
          <p className="text-lg text-white/90">Your personalized startup blueprint</p>
          <span className={`inline-flex items-center px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm ${verdictConfig.textColor} font-bold`}>
            {verdictConfig.label}
          </span>
        </div>
      </div>

      {/* Decision Summary */}
      <div className="bg-card rounded-2xl border border-border/50 shadow-lg p-6 space-y-4">
        <h3 className="font-bold text-lg flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-success" />
          Your Choices
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <ChoiceCard icon={<Target className="h-4 w-4" />} label="Target" value={formatChoice(ledger.targetCustomer)} color="primary" />
          <ChoiceCard icon={<DollarSign className="h-4 w-4" />} label="Profit" value={formatChoice(ledger.profitType)} color="accent" />
          <ChoiceCard icon={<Building2 className="h-4 w-4" />} label="Entity" value={formatChoice(ledger.entityType)} color="success" />
          <ChoiceCard icon={<Rocket className="h-4 w-4" />} label="Funding" value={formatChoice(ledger.fundraisingIntent)} color="warning" />
        </div>
      </div>

      {/* Next Actions */}
      <div className="bg-card rounded-2xl border border-border/50 shadow-lg p-6 space-y-4">
        <h3 className="font-bold text-lg flex items-center gap-2">
          <Zap className="h-5 w-5 text-warning" />
          Next 3 Actions This Week
        </h3>
        <div className="space-y-2">
          {getNextActions().map((action, i) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl border border-border/50">
              <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center text-primary-foreground font-bold text-sm shrink-0">
                {i + 1}
              </div>
              <span className="font-medium text-sm">{action}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Value Metrics */}
      <div className="bg-gradient-hero rounded-2xl p-6 border border-border/50">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Why This Company Should Exist
        </h3>
        <p className="text-muted-foreground mb-4">{analysis.valueAnalysis.whyExist}</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <MiniStat icon={<Clock className="h-4 w-4" />} label="Time Saved" value={analysis.valueAnalysis.timeSaved} />
          <MiniStat icon={<DollarSign className="h-4 w-4" />} label="Money Saved" value={analysis.valueAnalysis.moneySaved} />
          <MiniStat icon={<Shield className="h-4 w-4" />} label="Risk Reduced" value={analysis.valueAnalysis.riskReduced} />
          <MiniStat icon={<TrendingUp className="h-4 w-4" />} label="Revenue" value={analysis.valueAnalysis.revenueUnlocked} />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid md:grid-cols-2 gap-3">
        <Button onClick={handleExport} size="lg" className="gap-2 bg-gradient-primary hover:opacity-90 text-primary-foreground h-12 rounded-xl shadow-lg btn-glow-primary">
          <Download className="h-5 w-5" />
          Download PDF
        </Button>
        <Button onClick={onGeneratePitch} variant="outline" size="lg" className="gap-2 h-12 rounded-xl border-2">
          <Presentation className="h-5 w-5" />
          View Pitch Deck
        </Button>
      </div>

      {/* Share Section */}
      <div className="bg-card rounded-2xl p-5 border border-border/50 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-bold flex items-center gap-2">
            <Share2 className="h-4 w-4 text-primary" />
            Share Your Analysis
          </h4>
          {!shareUrl && (
            <Button onClick={handleShare} disabled={isSharing} size="sm" className="gap-2 rounded-xl">
              {isSharing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Share2 className="h-4 w-4" />
                  Get Link
                </>
              )}
            </Button>
          )}
        </div>
        {shareUrl && (
          <div className="flex gap-2">
            <Input value={shareUrl} readOnly className="font-mono text-sm rounded-xl" />
            <Button onClick={handleCopy} variant="outline" size="icon" className="rounded-xl shrink-0">
              {copied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        )}
      </div>

      <Button onClick={onReset} variant="ghost" className="w-full gap-2 text-muted-foreground rounded-xl">
        <RotateCcw className="h-4 w-4" />
        Start Over with New Idea
      </Button>
    </div>
  );
};

const ChoiceCard = ({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) => {
  const colorClasses: Record<string, string> = {
    primary: 'bg-primary/10 text-primary',
    accent: 'bg-accent/10 text-accent',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning'
  };

  return (
    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl border border-border/50">
      <div className={`w-8 h-8 rounded-lg ${colorClasses[color]} flex items-center justify-center shrink-0`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-bold text-sm truncate">{value}</p>
      </div>
    </div>
  );
};

const MiniStat = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="bg-card p-3 rounded-xl border border-border/50 text-center">
    <div className="flex items-center justify-center gap-1 text-primary mb-1">
      {icon}
    </div>
    <p className="font-bold text-sm">{value}</p>
    <p className="text-xs text-muted-foreground">{label}</p>
  </div>
);
