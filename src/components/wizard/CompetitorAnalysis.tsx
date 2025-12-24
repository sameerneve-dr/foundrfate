import { useState } from "react";
import { 
  ChevronDown, 
  ChevronUp, 
  Target, 
  Shield, 
  AlertTriangle,
  Sparkles,
  RefreshCw,
  ChevronRight,
  Building2,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDecisionLedger } from "@/contexts/DecisionLedgerContext";
import type { Competitor } from "@/hooks/useIdeaAnalysis";

interface CompetitorAnalysisProps {
  onRegenerate?: () => void;
  isRegenerating?: boolean;
}

export const CompetitorAnalysis = ({ onRegenerate, isRegenerating }: CompetitorAnalysisProps) => {
  const { ledger } = useDecisionLedger();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const analysis = ledger.analysis;
  if (!analysis?.competitiveLandscape) return null;

  const { directCompetitors, indirectCompetitors, marketCrowded, whatIsSolved, whatIsNot } = analysis.competitiveLandscape;

  const allCompetitors = [...directCompetitors, ...indirectCompetitors];
  const displayedCompetitors = showAll ? allCompetitors : allCompetitors.slice(0, 3);

  return (
    <div className="bg-card rounded-2xl border border-border/50 shadow-lg overflow-hidden">
      {/* Collapsible Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-5 hover:bg-muted/50 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-accent flex items-center justify-center">
            <Target className="h-5 w-5 text-accent-foreground" />
          </div>
          <div>
            <h3 className="font-bold text-lg flex items-center gap-2">
              Competitors & Market Gaps
              {marketCrowded && (
                <span className="pill pill-warning text-xs">Crowded Market</span>
              )}
            </h3>
            <p className="text-sm text-muted-foreground">
              {allCompetitors.length} competitors identified • Click to expand
            </p>
          </div>
        </div>
        <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
          {isExpanded ? (
            <ChevronUp className="h-5 w-5" />
          ) : (
            <ChevronDown className="h-5 w-5" />
          )}
        </div>
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="p-5 pt-0 space-y-6 animate-fade-in">
          {/* Market Overview */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-success/10 rounded-xl p-4 border border-success/20">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-4 w-4 text-success" />
                <span className="font-semibold text-sm text-success">What's Already Solved</span>
              </div>
              <p className="text-sm text-muted-foreground">{whatIsSolved}</p>
            </div>
            <div className="bg-primary/10 rounded-xl p-4 border border-primary/20">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-4 w-4 text-primary" />
                <span className="font-semibold text-sm text-primary">Unsolved Opportunity</span>
              </div>
              <p className="text-sm text-muted-foreground">{whatIsNot}</p>
            </div>
          </div>

          {/* Competitor Cards */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              Competitor Breakdown
            </h4>
            
            <div className="grid gap-4">
              {displayedCompetitors.map((competitor, index) => (
                <CompetitorCard 
                  key={index} 
                  competitor={competitor} 
                  isDirect={index < directCompetitors.length}
                />
              ))}
            </div>

            {allCompetitors.length > 3 && (
              <Button
                variant="outline"
                onClick={() => setShowAll(!showAll)}
                className="w-full gap-2"
              >
                {showAll ? (
                  <>Show fewer competitors</>
                ) : (
                  <>
                    Show {allCompetitors.length - 3} more competitors
                    <ChevronRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2 border-t border-border/50">
            {onRegenerate && (
              <Button
                variant="outline"
                size="sm"
                onClick={onRegenerate}
                disabled={isRegenerating}
                className="gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${isRegenerating ? 'animate-spin' : ''}`} />
                {isRegenerating ? 'Regenerating...' : 'Regenerate analysis'}
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

interface CompetitorCardProps {
  competitor: Competitor;
  isDirect: boolean;
}

const CompetitorCard = ({ competitor, isDirect }: CompetitorCardProps) => {
  const strengthBullets = competitor.strength?.split(/[,;.]/).filter(s => s.trim()).slice(0, 3) || [];
  const weaknessBullets = competitor.weakness?.split(/[,;.]/).filter(s => s.trim()).slice(0, 3) || [];
  const gapBullets = competitor.marketGap?.split(/[,;.]/).filter(s => s.trim()).slice(0, 2) || [];

  return (
    <div className="bg-muted/30 rounded-xl p-5 border border-border/50 hover:border-primary/30 transition-colors">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-background border border-border flex items-center justify-center">
            <Building2 className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <h5 className="font-bold">{competitor.name}</h5>
            <p className="text-sm text-muted-foreground">{competitor.coreOffering}</p>
          </div>
        </div>
        <span className={`pill text-xs ${isDirect ? 'pill-primary' : 'pill-accent'}`}>
          {isDirect ? 'Direct' : 'Indirect'}
        </span>
      </div>

      {/* Details Grid */}
      <div className="grid md:grid-cols-3 gap-4">
        {/* Strengths */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-success">
            <Shield className="h-3.5 w-3.5" />
            <span className="text-xs font-semibold uppercase tracking-wide">Strengths</span>
          </div>
          <ul className="space-y-1">
            {strengthBullets.length > 0 ? (
              strengthBullets.map((item, i) => (
                <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                  <span className="text-success mt-0.5">•</span>
                  <span>{item.trim()}</span>
                </li>
              ))
            ) : (
              <li className="text-xs text-muted-foreground">{competitor.strength || 'N/A'}</li>
            )}
          </ul>
        </div>

        {/* Weaknesses */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-destructive">
            <AlertTriangle className="h-3.5 w-3.5" />
            <span className="text-xs font-semibold uppercase tracking-wide">Weaknesses</span>
          </div>
          <ul className="space-y-1">
            {weaknessBullets.length > 0 ? (
              weaknessBullets.map((item, i) => (
                <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                  <span className="text-destructive mt-0.5">•</span>
                  <span>{item.trim()}</span>
                </li>
              ))
            ) : (
              <li className="text-xs text-muted-foreground">{competitor.weakness || 'N/A'}</li>
            )}
          </ul>
        </div>

        {/* Gaps/Opportunity */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            <span className="text-xs font-semibold uppercase tracking-wide">Your Opportunity</span>
          </div>
          <ul className="space-y-1">
            {gapBullets.length > 0 ? (
              gapBullets.map((item, i) => (
                <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                  <span className="text-primary mt-0.5">•</span>
                  <span>{item.trim()}</span>
                </li>
              ))
            ) : (
              <li className="text-xs text-muted-foreground">{competitor.marketGap || 'Differentiation needed'}</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};