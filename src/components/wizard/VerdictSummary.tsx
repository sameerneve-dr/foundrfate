import { Button } from "@/components/ui/button";
import { 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Sparkles,
  Target,
  Building2,
  Rocket,
  ArrowRight,
  RefreshCw,
  Hand
} from "lucide-react";
import { useDecisionLedger, type ProceedIntent } from "@/contexts/DecisionLedgerContext";

interface VerdictSummaryProps {
  onProceed: (intent: ProceedIntent) => void;
}

export const VerdictSummary = ({ onProceed }: VerdictSummaryProps) => {
  const { ledger, updateLedger } = useDecisionLedger();
  
  const analysis = ledger.analysis;
  if (!analysis) return null;

  const decision = analysis.decision;

  const getVerdictConfig = () => {
    switch (decision) {
      case 'yes':
        return {
          icon: <CheckCircle2 className="h-12 w-12" />,
          title: 'GO',
          subtitle: 'Strong potential identified',
          gradient: 'bg-verdict-yes',
          textAccent: 'text-success'
        };
      case 'conditional':
        return {
          icon: <AlertCircle className="h-12 w-12" />,
          title: 'CONDITIONAL',
          subtitle: 'Proceed with adjustments',
          gradient: 'bg-verdict-conditional',
          textAccent: 'text-warning'
        };
      default:
        return {
          icon: <XCircle className="h-12 w-12" />,
          title: 'NO-GO',
          subtitle: 'Consider pivoting',
          gradient: 'bg-verdict-no',
          textAccent: 'text-destructive'
        };
    }
  };

  const config = getVerdictConfig();

  // Generate 3-5 bullet points for "Why This Verdict"
  const getVerdictReasons = (): string[] => {
    const reasons: string[] = [];
    const rationale = analysis.decisionRationale;
    
    // Market saturation
    if (rationale.marketSaturation === 'low') {
      reasons.push('Market gap exists with room to grow');
    } else if (rationale.marketSaturation === 'high') {
      reasons.push('Market is crowded, differentiation critical');
    } else {
      reasons.push('Moderate market competition');
    }

    // User urgency
    if (rationale.userUrgency === 'high') {
      reasons.push('Strong user urgency detected');
    } else if (rationale.userUrgency === 'low') {
      reasons.push('User urgency is low — need stronger pain point');
    } else {
      reasons.push('Medium user urgency — validate further');
    }

    // Differentiation
    if (rationale.differentiation === 'strong') {
      reasons.push('Clear differentiation from competitors');
    } else if (rationale.differentiation === 'weak') {
      reasons.push('Differentiation needs strengthening');
    } else {
      reasons.push('Some differentiation exists');
    }

    // Founder fit
    if (rationale.founderMarketFit === 'strong') {
      reasons.push('Strong founder–problem fit');
    } else if (rationale.founderMarketFit === 'weak') {
      reasons.push('Founder–market fit unclear');
    }

    // Real need
    if (analysis.realNeedAnalysis.isPainkiller) {
      reasons.push('Solves a real pain point (painkiller)');
    } else {
      reasons.push('Nice-to-have (vitamin) — monetization path unclear');
    }

    return reasons.slice(0, 5);
  };

  // Recommended path pills
  const getRecommendedPath = () => {
    const pills: { label: string; icon: React.ReactNode }[] = [];
    
    // Target customer based on audience
    const audience = ledger.ideaSnapshot?.audience?.toLowerCase() || '';
    if (audience.includes('b2b') || audience.includes('business') || audience.includes('enterprise')) {
      pills.push({ label: 'B2B', icon: <Target className="h-3 w-3" /> });
    } else if (audience.includes('consumer') || audience.includes('b2c')) {
      pills.push({ label: 'Consumer', icon: <Target className="h-3 w-3" /> });
    } else {
      pills.push({ label: 'Mixed', icon: <Target className="h-3 w-3" /> });
    }

    // Profit type based on scale intent
    if (ledger.ideaSnapshot?.scaleIntent === 'venture-scale') {
      pills.push({ label: 'For-Profit', icon: <Building2 className="h-3 w-3" /> });
      pills.push({ label: 'Delaware C-Corp', icon: <Building2 className="h-3 w-3" /> });
    } else if (ledger.ideaSnapshot?.scaleIntent === 'non-profit') {
      pills.push({ label: 'Non-Profit', icon: <Building2 className="h-3 w-3" /> });
    } else {
      pills.push({ label: 'Lifestyle / LLC', icon: <Building2 className="h-3 w-3" /> });
    }

    // Next milestone
    pills.push({ label: 'MVP Validation', icon: <Rocket className="h-3 w-3" /> });

    return pills;
  };

  const handleProceed = (intent: ProceedIntent) => {
    updateLedger({ 
      proceedIntent: intent,
      verdict: decision,
      verdictAccepted: intent === 'yes' || intent === 'conditional'
    });
    onProceed(intent);
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">
          FoundrFate Verdict
        </h1>
        <p className="text-muted-foreground">
          {ledger.ideaSnapshot?.ideaName}
        </p>
      </div>

      {/* Verdict Card - Big & Visual */}
      <div className={`${config.gradient} rounded-2xl p-8 text-center shadow-xl relative overflow-hidden`}>
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
        <div className="relative flex flex-col items-center gap-4">
          <div className="w-24 h-24 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white">
            {config.icon}
          </div>
          <div>
            <h2 className="text-5xl md:text-6xl font-display font-bold text-white tracking-tight">
              {config.title}
            </h2>
            <p className="text-xl text-white/90 mt-2">{config.subtitle}</p>
          </div>
        </div>
      </div>

      {/* Why This Verdict - 3-5 bullets */}
      <div className="bg-card rounded-2xl border border-border/50 shadow-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-5 w-5 text-primary" />
          <h3 className="font-bold text-lg">Why This Verdict</h3>
        </div>
        <ul className="space-y-3">
          {getVerdictReasons().map((reason, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                i < 2 ? 'bg-success/10 text-success' : 
                i < 4 ? 'bg-warning/10 text-warning' : 
                'bg-muted text-muted-foreground'
              }`}>
                {i + 1}
              </span>
              <span className="text-sm">{reason}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Recommended Path - Pills */}
      <div className="bg-card rounded-2xl border border-border/50 shadow-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Target className="h-5 w-5 text-accent" />
          <h3 className="font-bold text-lg">Recommended Path</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {getRecommendedPath().map((pill, i) => (
            <span key={i} className="pill pill-primary">
              {pill.icon}
              {pill.label}
            </span>
          ))}
        </div>
      </div>

      {/* The Decision Gate */}
      <div className="bg-gradient-hero rounded-2xl border border-primary/20 p-8 text-center space-y-6">
        <h3 className="text-xl font-bold">Do you want to proceed with this idea?</h3>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => handleProceed('yes')}
            size="lg"
            className="gap-2 bg-gradient-primary hover:opacity-90 text-primary-foreground font-bold text-lg h-14 px-8 rounded-xl shadow-lg btn-glow-primary transition-all"
          >
            <CheckCircle2 className="h-5 w-5" />
            Yes, proceed with this idea
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={() => handleProceed('conditional')}
            variant="outline"
            size="lg"
            className="gap-2 h-12 rounded-xl border-2"
          >
            <RefreshCw className="h-4 w-4" />
            Proceed only if modified
          </Button>
          <Button
            onClick={() => handleProceed('no')}
            variant="ghost"
            size="lg"
            className="gap-2 h-12 rounded-xl text-muted-foreground hover:text-destructive"
          >
            <Hand className="h-4 w-4" />
            No, pivot / stop
          </Button>
        </div>
      </div>
    </div>
  );
};
