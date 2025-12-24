import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { useDecisionLedger } from "@/contexts/DecisionLedgerContext";
import { MetricBadge } from "../MetricBadge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface VerdictStepProps {
  onAccept: () => void;
  onShowPivots: () => void;
}

export const VerdictStep = ({ onAccept, onShowPivots }: VerdictStepProps) => {
  const { ledger, updateLedger } = useDecisionLedger();
  const [showCompetitors, setShowCompetitors] = useState(false);
  
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

  return (
    <div className="space-y-8">
      {/* Hero Decision */}
      <div className={`border-2 border-border p-6 md:p-8 ${
        decision === "yes" ? "bg-secondary border-foreground" : 
        decision === "conditional" ? "bg-muted" : "bg-destructive/10"
      }`}>
        <div className="flex items-center gap-6">
          <DecisionIcon decision={decision} />
          <div className="space-y-2">
            <Badge variant={decision === "yes" ? "default" : decision === "conditional" ? "secondary" : "destructive"} className="text-sm">
              {decision === "yes" ? "✅ YES — PURSUE" : 
               decision === "conditional" ? "⚠️ CONDITIONAL" : 
               "❌ NO — DO NOT PURSUE"}
            </Badge>
            <h2 className="text-2xl md:text-3xl font-bold">{ledger.ideaSnapshot?.ideaName}</h2>
            <p className="text-muted-foreground">{analysis.decisionRationale.summary}</p>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="space-y-4">
        <h3 className="font-bold text-lg">Key Signals</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <MetricBadge 
            label="Market Saturation" 
            value={analysis.decisionRationale.marketSaturation}
            inverted={true}
          />
          <MetricBadge 
            label="Differentiation" 
            value={analysis.decisionRationale.differentiation}
          />
          <MetricBadge 
            label="User Urgency" 
            value={analysis.decisionRationale.userUrgency}
          />
          <MetricBadge 
            label="Founder Fit" 
            value={analysis.decisionRationale.founderMarketFit}
          />
        </div>
      </div>

      {/* Real Need */}
      <div className="border-2 border-border p-4 space-y-3">
        <div className="flex items-center gap-3">
          <Badge variant={analysis.realNeedAnalysis.isPainkiller ? "default" : "secondary"}>
            {analysis.realNeedAnalysis.isPainkiller ? "💊 Painkiller" : "💊 Vitamin"}
          </Badge>
          <Badge variant={analysis.realNeedAnalysis.willingness === "Users need this" ? "default" : "destructive"}>
            {analysis.realNeedAnalysis.willingness}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">{analysis.realNeedAnalysis.explanation}</p>
      </div>

      {/* Competitors (Collapsible) */}
      <Collapsible open={showCompetitors} onOpenChange={setShowCompetitors}>
        <CollapsibleTrigger asChild>
          <Button variant="outline" className="w-full justify-between gap-2">
            <span className="flex items-center gap-2">
              <Badge variant={analysis.competitiveLandscape.marketCrowded ? "destructive" : "default"}>
                {analysis.competitiveLandscape.directCompetitors.length} competitors
              </Badge>
              Expand competitor analysis
            </span>
            {showCompetitors ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-4 space-y-3">
          {analysis.competitiveLandscape.directCompetitors.map((comp, i) => (
            <div key={i} className="border-2 border-border p-3 text-sm space-y-1">
              <p className="font-bold">{comp.name}</p>
              <p className="text-muted-foreground">{comp.coreOffering}</p>
              <div className="flex gap-4 text-xs">
                <span className="text-foreground">✓ {comp.strength}</span>
                <span className="text-muted-foreground">✗ {comp.weakness}</span>
              </div>
            </div>
          ))}
          <div className="grid md:grid-cols-2 gap-3">
            <div className="border-2 border-border p-3">
              <p className="text-xs font-mono uppercase text-muted-foreground mb-1">What's Solved</p>
              <p className="text-sm">{analysis.competitiveLandscape.whatIsSolved}</p>
            </div>
            <div className="border-2 border-border p-3 bg-secondary">
              <p className="text-xs font-mono uppercase text-muted-foreground mb-1">Your Opportunity</p>
              <p className="text-sm">{analysis.competitiveLandscape.whatIsNot}</p>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Decision Buttons */}
      <div className="border-t-2 border-border pt-6 space-y-3">
        <p className="font-bold">Do you accept this verdict?</p>
        <div className="flex flex-wrap gap-3">
          <Button onClick={handleAccept} size="lg" className="gap-2">
            <CheckCircle2 className="h-5 w-5" />
            {decision === "yes" ? "Yes, let's build this" : 
             decision === "conditional" ? "Accept with changes" : 
             "Understood, show me pivots"}
          </Button>
          {decision !== "no" && (
            <Button variant="outline" size="lg" onClick={onShowPivots} className="gap-2">
              <RefreshCw className="h-5 w-5" />
              Show alternatives
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

const DecisionIcon = ({ decision }: { decision: "yes" | "conditional" | "no" }) => {
  const iconClass = "h-14 w-14";
  if (decision === "yes") return <CheckCircle2 className={`${iconClass} text-foreground`} />;
  if (decision === "conditional") return <AlertTriangle className={`${iconClass} text-foreground`} />;
  return <XCircle className={`${iconClass} text-destructive`} />;
};
