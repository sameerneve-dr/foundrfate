import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  Target,
  Users,
  TrendingUp,
  FileText,
  Building2,
  Calendar,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Lightbulb,
  Presentation
} from "lucide-react";
import type { IdeaData } from "@/pages/Index";
import type { AnalysisResult as AnalysisData } from "@/hooks/useIdeaAnalysis";

interface AnalysisResultProps {
  ideaData: IdeaData;
  analysis: AnalysisData;
  onReset: () => void;
}

export const AnalysisResult = ({ ideaData, analysis, onReset }: AnalysisResultProps) => {
  const [expandedSections, setExpandedSections] = useState<string[]>(["decision", "competitors"]);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const decision = analysis.decision;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b-2 border-border p-4 sticky top-0 bg-background z-10">
        <div className="container flex items-center justify-between">
          <button 
            onClick={onReset} 
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="font-mono text-sm">New Analysis</span>
          </button>
          <h1 className="text-xl font-bold">FoundrFate</h1>
          <span className="font-mono text-sm text-muted-foreground">Analysis</span>
        </div>
      </header>

      {/* Hero Decision */}
      <div className={`border-b-2 border-border p-8 md:p-12 ${
        decision === "yes" ? "bg-secondary" : 
        decision === "conditional" ? "bg-muted" : "bg-destructive/10"
      }`}>
        <div className="container max-w-4xl">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <DecisionIcon decision={decision} />
            <div className="space-y-2">
              <Badge variant={decision === "yes" ? "default" : decision === "conditional" ? "secondary" : "destructive"} className="text-sm">
                {decision === "yes" ? "✅ YES — PURSUE" : 
                 decision === "conditional" ? "⚠️ CONDITIONAL — PURSUE WITH CHANGES" : 
                 "❌ NO — DO NOT PURSUE"}
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold">{ideaData.ideaName}</h2>
              <p className="text-muted-foreground text-lg">
                {analysis.decisionRationale.summary}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Analysis Sections */}
      <div className="flex-1 py-8">
        <div className="container max-w-4xl space-y-4">
          
          <AnalysisSection
            id="decision"
            icon={<Target className="h-5 w-5" />}
            title="Decision Rationale"
            expanded={expandedSections.includes("decision")}
            onToggle={() => toggleSection("decision")}
          >
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <MetricCard 
                  label="Market Saturation" 
                  value={analysis.decisionRationale.marketSaturation.toUpperCase()} 
                  positive={analysis.decisionRationale.marketSaturation === "low"} 
                />
                <MetricCard 
                  label="Differentiation" 
                  value={analysis.decisionRationale.differentiation.toUpperCase()} 
                  positive={analysis.decisionRationale.differentiation === "strong"} 
                />
                <MetricCard 
                  label="User Urgency" 
                  value={analysis.decisionRationale.userUrgency.toUpperCase()} 
                  positive={analysis.decisionRationale.userUrgency === "high"} 
                />
                <MetricCard 
                  label="Founder-Market Fit" 
                  value={analysis.decisionRationale.founderMarketFit.toUpperCase()} 
                  positive={analysis.decisionRationale.founderMarketFit === "strong"} 
                />
              </div>
              <div className="border-2 border-border p-4 bg-secondary">
                <p className="font-medium">Real Need Assessment</p>
                <p className="text-muted-foreground mt-2">{analysis.realNeedAnalysis.explanation}</p>
                <div className="flex gap-4 mt-3 text-sm">
                  <Badge variant={analysis.realNeedAnalysis.isPainkiller ? "default" : "secondary"}>
                    {analysis.realNeedAnalysis.isPainkiller ? "💊 Painkiller" : "💊 Vitamin"}
                  </Badge>
                  <Badge variant={analysis.realNeedAnalysis.willingness === "Users need this" ? "default" : "destructive"}>
                    {analysis.realNeedAnalysis.willingness}
                  </Badge>
                </div>
              </div>
            </div>
          </AnalysisSection>

          <AnalysisSection
            id="competitors"
            icon={<Users className="h-5 w-5" />}
            title="Competitive Landscape"
            expanded={expandedSections.includes("competitors")}
            onToggle={() => toggleSection("competitors")}
          >
            <div className="space-y-4">
              <div className="flex gap-2 flex-wrap">
                <Badge variant={analysis.competitiveLandscape.marketCrowded ? "destructive" : "default"}>
                  {analysis.competitiveLandscape.marketCrowded ? "⚠️ Market Crowded" : "✓ Market Has Room"}
                </Badge>
              </div>
              
              {analysis.competitiveLandscape.directCompetitors.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-mono uppercase tracking-wider text-muted-foreground">Direct Competitors</p>
                  <div className="grid gap-3">
                    {analysis.competitiveLandscape.directCompetitors.map((comp, i) => (
                      <CompetitorCard key={i} {...comp} />
                    ))}
                  </div>
                </div>
              )}

              {analysis.competitiveLandscape.indirectCompetitors.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-mono uppercase tracking-wider text-muted-foreground">Indirect Competitors</p>
                  <div className="grid gap-3">
                    {analysis.competitiveLandscape.indirectCompetitors.map((comp, i) => (
                      <CompetitorCard key={i} {...comp} />
                    ))}
                  </div>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-4">
                <div className="border-2 border-border p-4">
                  <p className="text-sm font-mono uppercase text-muted-foreground mb-2">What's Already Solved</p>
                  <p className="text-sm">{analysis.competitiveLandscape.whatIsSolved}</p>
                </div>
                <div className="border-2 border-border p-4 bg-secondary">
                  <p className="text-sm font-mono uppercase text-muted-foreground mb-2">Your Opportunity</p>
                  <p className="text-sm">{analysis.competitiveLandscape.whatIsNot}</p>
                </div>
              </div>
            </div>
          </AnalysisSection>

          <AnalysisSection
            id="value"
            icon={<TrendingUp className="h-5 w-5" />}
            title="Value Analysis"
            expanded={expandedSections.includes("value")}
            onToggle={() => toggleSection("value")}
          >
            <div className="space-y-4">
              <div className="border-2 border-border p-4 bg-secondary">
                <p className="text-lg">{analysis.valueAnalysis.whyExist}</p>
              </div>
              <div className="grid md:grid-cols-4 gap-4">
                <ValueCard label="Time Saved" value={analysis.valueAnalysis.timeSaved} />
                <ValueCard label="Money Saved" value={analysis.valueAnalysis.moneySaved} />
                <ValueCard label="Risk Reduced" value={analysis.valueAnalysis.riskReduced} />
                <ValueCard label="Revenue Impact" value={analysis.valueAnalysis.revenueUnlocked} />
              </div>
            </div>
          </AnalysisSection>

          <AnalysisSection
            id="pitch"
            icon={<Presentation className="h-5 w-5" />}
            title="Pitch Story"
            expanded={expandedSections.includes("pitch")}
            onToggle={() => toggleSection("pitch")}
          >
            <div className="border-2 border-border p-6 bg-secondary">
              <p className="whitespace-pre-line leading-relaxed">{analysis.pitchStory}</p>
            </div>
          </AnalysisSection>

          <AnalysisSection
            id="deck"
            icon={<FileText className="h-5 w-5" />}
            title="Pitch Deck Outline"
            expanded={expandedSections.includes("deck")}
            onToggle={() => toggleSection("deck")}
          >
            <div className="grid gap-3">
              <DeckSlide number={1} title="Problem" content={analysis.pitchDeck.problem} />
              <DeckSlide number={2} title="Why Now" content={analysis.pitchDeck.whyNow} />
              <DeckSlide number={3} title="Solution" content={analysis.pitchDeck.solution} />
              <DeckSlide number={4} title="Market Size" content={analysis.pitchDeck.marketSize} />
              <DeckSlide number={5} title="Business Model" content={analysis.pitchDeck.businessModel} />
              <DeckSlide number={6} title="Go-to-Market" content={analysis.pitchDeck.goToMarket} />
              <DeckSlide number={7} title="Differentiator" content={analysis.pitchDeck.differentiator} />
            </div>
          </AnalysisSection>

          <AnalysisSection
            id="company"
            icon={<Building2 className="h-5 w-5" />}
            title="Company Formation"
            expanded={expandedSections.includes("company")}
            onToggle={() => toggleSection("company")}
          >
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <RecommendationCard 
                  title="Entity Type"
                  recommendation={analysis.companyFormation.entityType}
                  reason={analysis.companyFormation.entityReason}
                />
                <RecommendationCard 
                  title="When to Incorporate"
                  recommendation={analysis.companyFormation.whenToIncorporate}
                  reason={analysis.companyFormation.equityAdvice}
                />
              </div>
              <div className="border-2 border-border p-4">
                <p className="text-sm font-mono uppercase text-muted-foreground mb-2">Profit Structure</p>
                <p className="font-bold">{analysis.profitStructure.recommendation}</p>
                <p className="text-sm text-muted-foreground mt-1">{analysis.profitStructure.reason}</p>
              </div>
            </div>
          </AnalysisSection>

          <AnalysisSection
            id="timeline"
            icon={<Calendar className="h-5 w-5" />}
            title="Execution Timeline"
            expanded={expandedSections.includes("timeline")}
            onToggle={() => toggleSection("timeline")}
          >
            <div className="space-y-3">
              <TimelineItem 
                phase="Month 0-1"
                title="Validation"
                tasks={analysis.timeline.month0to1}
              />
              <TimelineItem 
                phase="Month 2-3"
                title="MVP"
                tasks={analysis.timeline.month2to3}
              />
              <TimelineItem 
                phase="Month 4-6"
                title="Early Users"
                tasks={analysis.timeline.month4to6}
              />
              <TimelineItem 
                phase="Month 7+"
                title="Scale"
                tasks={analysis.timeline.month7plus}
              />
            </div>
          </AnalysisSection>

          {analysis.pivotSuggestions && analysis.pivotSuggestions.length > 0 && (
            <AnalysisSection
              id="pivots"
              icon={<Lightbulb className="h-5 w-5" />}
              title="Alternative Approaches"
              expanded={expandedSections.includes("pivots")}
              onToggle={() => toggleSection("pivots")}
            >
              <div className="grid gap-3">
                {analysis.pivotSuggestions.map((pivot, i) => (
                  <div key={i} className="border-2 border-border p-4 space-y-2">
                    <p className="font-bold">{pivot.title}</p>
                    <p className="text-sm text-muted-foreground">{pivot.description}</p>
                    <p className="text-sm text-foreground">💡 {pivot.whyBetter}</p>
                  </div>
                ))}
              </div>
            </AnalysisSection>
          )}

        </div>
      </div>

      {/* Footer Actions */}
      <div className="border-t-2 border-border p-4 sticky bottom-0 bg-background">
        <div className="container max-w-4xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            Ready to take the next step?
          </p>
          <div className="flex gap-3">
            <Button variant="outline" onClick={onReset} className="gap-2">
              <RotateCcw className="h-4 w-4" />
              Start Over
            </Button>
            <Button className="gap-2">
              Export Full Report
              <FileText className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const DecisionIcon = ({ decision }: { decision: "yes" | "conditional" | "no" }) => {
  const iconClass = "h-16 w-16 md:h-20 md:w-20";
  if (decision === "yes") return <CheckCircle2 className={`${iconClass} text-foreground`} />;
  if (decision === "conditional") return <AlertTriangle className={`${iconClass} text-foreground`} />;
  return <XCircle className={`${iconClass} text-destructive`} />;
};

const AnalysisSection = ({
  id,
  icon,
  title,
  expanded,
  onToggle,
  children,
}: {
  id: string;
  icon: React.ReactNode;
  title: string;
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) => (
  <div className="border-2 border-border">
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between p-4 hover:bg-secondary transition-colors"
    >
      <div className="flex items-center gap-3">
        {icon}
        <span className="text-lg font-bold">{title}</span>
      </div>
      {expanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
    </button>
    {expanded && (
      <div className="p-4 border-t-2 border-border">
        {children}
      </div>
    )}
  </div>
);

const MetricCard = ({ label, value, positive }: { label: string; value: string; positive?: boolean }) => (
  <div className="border-2 border-border p-4">
    <p className="text-sm text-muted-foreground font-mono uppercase">{label}</p>
    <p className={`text-xl font-bold ${positive ? "text-foreground" : "text-muted-foreground"}`}>{value}</p>
  </div>
);

const CompetitorCard = ({ 
  name, 
  coreOffering,
  strength, 
  weakness,
  marketGap
}: { 
  name: string; 
  coreOffering: string; 
  strength: string; 
  weakness: string;
  marketGap?: string;
}) => (
  <div className="border-2 border-border p-4 space-y-2">
    <h4 className="font-bold">{name}</h4>
    <p className="text-sm text-muted-foreground">{coreOffering}</p>
    <div className="flex flex-col gap-1 text-sm">
      <span className="text-foreground">✓ {strength}</span>
      <span className="text-muted-foreground">✗ {weakness}</span>
      {marketGap && <span className="text-foreground">→ Gap: {marketGap}</span>}
    </div>
  </div>
);

const ValueCard = ({ label, value }: { label: string; value: string }) => (
  <div className="border-2 border-border p-4 text-center">
    <p className="text-lg md:text-xl font-bold">{value}</p>
    <p className="text-sm text-muted-foreground">{label}</p>
  </div>
);

const DeckSlide = ({ number, title, content }: { number: number; title: string; content: string }) => (
  <div className="border-2 border-border p-4 flex gap-4">
    <div className="font-mono text-2xl font-bold text-muted-foreground">{number}</div>
    <div className="flex-1">
      <p className="font-bold">{title}</p>
      <p className="text-sm text-muted-foreground mt-1">{content}</p>
    </div>
  </div>
);

const RecommendationCard = ({ 
  title, 
  recommendation, 
  reason 
}: { 
  title: string; 
  recommendation: string; 
  reason: string;
}) => (
  <div className="border-2 border-border p-4 space-y-2">
    <p className="text-sm text-muted-foreground font-mono uppercase">{title}</p>
    <p className="text-xl font-bold">{recommendation}</p>
    <p className="text-sm text-muted-foreground">{reason}</p>
  </div>
);

const TimelineItem = ({ 
  phase, 
  title, 
  tasks 
}: { 
  phase: string; 
  title: string; 
  tasks: string[];
}) => (
  <div className="border-2 border-border p-4 flex gap-4">
    <div className="font-mono text-sm text-muted-foreground min-w-[80px]">{phase}</div>
    <div className="flex-1">
      <p className="font-bold mb-2">{title}</p>
      <ul className="text-sm text-muted-foreground space-y-1">
        {tasks.map((task, i) => (
          <li key={i}>→ {task}</li>
        ))}
      </ul>
    </div>
  </div>
);
