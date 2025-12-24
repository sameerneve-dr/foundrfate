import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Target,
  Sparkles,
  TrendingUp,
  Zap,
  Flame,
  Users
} from "lucide-react";
import { useDecisionLedger } from "@/contexts/DecisionLedgerContext";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface VerdictStepProps {
  onAccept: () => void;
  onShowPivots: () => void;
}

export const VerdictStep = ({ onAccept, onShowPivots }: VerdictStepProps) => {
  const { ledger, updateLedger } = useDecisionLedger();
  const [showCompetitors, setShowCompetitors] = useState(false);
  const [showRisks, setShowRisks] = useState(false);
  
  const analysis = ledger.analysis;
  if (!analysis) return null;

  const decision = analysis.decision;

  const handleAccept = () => {
    updateLedger({ 
      verdict: decision,
      verdictAccepted: true 
    });
    onAccept();
  };

  const getVerdictConfig = () => {
    switch (decision) {
      case 'yes':
        return {
          icon: <CheckCircle2 className="h-10 w-10" />,
          title: 'GO',
          subtitle: 'Strong potential identified',
          gradient: 'bg-verdict-yes',
          bgLight: 'bg-success/5',
          borderColor: 'border-success/30',
          textAccent: 'text-success'
        };
      case 'conditional':
        return {
          icon: <AlertTriangle className="h-10 w-10" />,
          title: 'CONDITIONAL',
          subtitle: 'Proceed with adjustments',
          gradient: 'bg-verdict-conditional',
          bgLight: 'bg-warning/5',
          borderColor: 'border-warning/30',
          textAccent: 'text-warning'
        };
      default:
        return {
          icon: <XCircle className="h-10 w-10" />,
          title: 'NO-GO',
          subtitle: 'Consider pivoting',
          gradient: 'bg-verdict-no',
          bgLight: 'bg-destructive/5',
          borderColor: 'border-destructive/30',
          textAccent: 'text-destructive'
        };
    }
  };

  const config = getVerdictConfig();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Verdict Hero Card */}
      <div className={`${config.gradient} rounded-2xl p-8 text-center shadow-xl relative overflow-hidden`}>
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
        <div className="relative flex flex-col items-center gap-4">
          <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white">
            {config.icon}
          </div>
          <div>
            <h2 className="text-5xl font-display font-bold text-white tracking-tight">
              {config.title}
            </h2>
            <p className="text-xl text-white/90 mt-1">{config.subtitle}</p>
          </div>
          <p className="text-lg font-semibold text-white/80 max-w-md">
            {ledger.ideaSnapshot?.ideaName}
          </p>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className={`rounded-2xl ${config.bgLight} border ${config.borderColor} p-6`}>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-5 w-5 text-primary" />
          <h3 className="font-bold text-lg">Key Signals</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard 
            icon={<TrendingUp className="h-5 w-5" />}
            label="Market Saturation" 
            value={analysis.decisionRationale.marketSaturation}
            inverse={true}
          />
          <MetricCard 
            icon={<Zap className="h-5 w-5" />}
            label="Differentiation" 
            value={analysis.decisionRationale.differentiation}
          />
          <MetricCard 
            icon={<Flame className="h-5 w-5" />}
            label="User Urgency" 
            value={analysis.decisionRationale.userUrgency}
          />
          <MetricCard 
            icon={<Users className="h-5 w-5" />}
            label="Founder Fit" 
            value={analysis.decisionRationale.founderMarketFit}
          />
        </div>
      </div>

      {/* Analysis Summary */}
      <div className="bg-card rounded-2xl border border-border/50 shadow-lg p-6">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="h-5 w-5 text-primary" />
          <h3 className="font-bold text-lg">AI Analysis</h3>
        </div>
        <p className="text-muted-foreground leading-relaxed">{analysis.decisionRationale.summary}</p>
        
        {/* Real Need Badge */}
        <div className="mt-4 flex flex-wrap gap-2">
          <span className={`pill ${analysis.realNeedAnalysis.isPainkiller ? 'pill-success' : 'pill-warning'}`}>
            {analysis.realNeedAnalysis.isPainkiller ? '💊 Painkiller' : '💊 Vitamin'}
          </span>
          <span className={`pill ${analysis.realNeedAnalysis.willingness === "Users need this" ? 'pill-success' : 'pill-destructive'}`}>
            {analysis.realNeedAnalysis.willingness}
          </span>
        </div>
      </div>

      {/* Expandable Sections */}
      <div className="space-y-3">
        {/* Competitors */}
        <Collapsible open={showCompetitors} onOpenChange={setShowCompetitors}>
          <CollapsibleTrigger asChild>
            <button className="w-full flex items-center justify-between p-4 bg-card rounded-xl border border-border/50 shadow-sm hover:shadow-md transition-all group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Target className="h-5 w-5 text-primary" />
                </div>
                <div className="text-left">
                  <p className="font-bold">Competitor Analysis</p>
                  <p className="text-sm text-muted-foreground">
                    {analysis.competitiveLandscape.directCompetitors.length} competitors • 
                    {analysis.competitiveLandscape.marketCrowded ? ' Crowded market' : ' Room to grow'}
                  </p>
                </div>
              </div>
              {showCompetitors ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="mt-2 p-4 bg-muted/30 rounded-xl space-y-3">
              {analysis.competitiveLandscape.directCompetitors.map((comp, i) => (
                <div key={i} className="bg-card p-4 rounded-xl border border-border/50 shadow-sm">
                  <p className="font-bold text-primary">{comp.name}</p>
                  <p className="text-sm text-muted-foreground mt-1">{comp.coreOffering}</p>
                  <div className="flex gap-4 mt-2 text-xs">
                    <span className="text-success">✓ {comp.strength}</span>
                    <span className="text-muted-foreground">✗ {comp.weakness}</span>
                  </div>
                </div>
              ))}
              <div className="grid md:grid-cols-2 gap-3 pt-2">
                <div className="bg-card p-4 rounded-xl border border-border/50">
                  <p className="text-xs font-bold text-muted-foreground uppercase mb-1">What's Already Solved</p>
                  <p className="text-sm">{analysis.competitiveLandscape.whatIsSolved}</p>
                </div>
                <div className="bg-gradient-accent p-4 rounded-xl text-accent-foreground">
                  <p className="text-xs font-bold uppercase mb-1 opacity-80">Your Opportunity</p>
                  <p className="text-sm font-medium">{analysis.competitiveLandscape.whatIsNot}</p>
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>

      {/* Action Buttons */}
      <div className="pt-4 space-y-4">
        <p className="font-bold text-lg">Ready to proceed?</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            onClick={handleAccept} 
            size="lg" 
            className="flex-1 bg-gradient-primary hover:opacity-90 text-primary-foreground font-bold text-lg h-14 rounded-xl shadow-lg btn-glow-primary transition-all"
          >
            <Sparkles className="h-5 w-5 mr-2" />
            {decision === "yes" ? "Yes, let's build this" : 
             decision === "conditional" ? "Accept with changes" : 
             "Understood, show pivots"}
          </Button>
          {decision !== "no" && (
            <Button 
              variant="outline" 
              size="lg" 
              onClick={onShowPivots}
              className="flex-1 h-14 rounded-xl border-2 hover:bg-muted/50"
            >
              <RefreshCw className="h-5 w-5 mr-2" />
              Show alternatives
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

const MetricCard = ({ 
  icon, 
  label, 
  value,
  inverse = false
}: { 
  icon: React.ReactNode; 
  label: string; 
  value: string;
  inverse?: boolean;
}) => {
  const getColor = (): 'success' | 'warning' | 'destructive' => {
    const val = value.toLowerCase();
    if (inverse) {
      if (val === 'low') return 'success';
      if (val === 'medium') return 'warning';
      return 'destructive';
    } else {
      if (val === 'high') return 'success';
      if (val === 'medium') return 'warning';
      return 'destructive';
    }
  };

  const color = getColor();
  
  const colorClasses = {
    success: 'bg-success/10 text-success border-success/20',
    warning: 'bg-warning/10 text-warning border-warning/20',
    destructive: 'bg-destructive/10 text-destructive border-destructive/20'
  };

  const barClasses = {
    success: 'meter-low',
    warning: 'meter-medium',
    destructive: 'meter-high'
  };

  const valueToPercent = (): number => {
    switch (value.toLowerCase()) {
      case 'low': return 25;
      case 'medium': return 50;
      case 'high': return 75;
      default: return 50;
    }
  };

  return (
    <div className={`p-4 rounded-xl border ${colorClasses[color]}`}>
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-xs font-medium truncate">{label}</span>
      </div>
      <div className="space-y-2">
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className={`h-full ${barClasses[color]} transition-all duration-500`}
            style={{ width: `${valueToPercent()}%` }}
          />
        </div>
        <p className="text-xs font-bold uppercase">{value}</p>
      </div>
    </div>
  );
};
