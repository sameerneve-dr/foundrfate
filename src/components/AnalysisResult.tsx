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
  RotateCcw
} from "lucide-react";
import type { IdeaData } from "@/pages/Index";

interface AnalysisResultProps {
  ideaData: IdeaData;
  onReset: () => void;
}

type DecisionType = "yes" | "conditional" | "no";

export const AnalysisResult = ({ ideaData, onReset }: AnalysisResultProps) => {
  const [expandedSections, setExpandedSections] = useState<string[]>(["decision", "competitors"]);

  // Simulated analysis - in production this would come from AI
  const decision: DecisionType = ideaData.purpose === "hackathon" ? "yes" : 
    ideaData.existingAlternatives.toLowerCase().includes("many") ? "conditional" : "yes";

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

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
                {decision === "yes" 
                  ? "This idea has strong fundamentals and clear market potential."
                  : decision === "conditional"
                  ? "This idea needs refinement before it's ready for execution."
                  : "The market dynamics don't support this idea in its current form."}
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
                <MetricCard label="Market Saturation" value="Low" positive />
                <MetricCard label="Differentiation" value="Strong" positive />
                <MetricCard label="User Urgency" value="High" positive />
                <MetricCard label="Execution Complexity" value="Medium" />
              </div>
              <p className="text-muted-foreground">
                Based on the problem statement and target audience, there's a clear gap in the market 
                for a solution that {ideaData.proposedSolution.toLowerCase().slice(0, 100)}...
              </p>
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
              <p className="text-sm text-muted-foreground font-mono uppercase tracking-wider">
                Based on your input: "{ideaData.existingAlternatives.slice(0, 50)}..."
              </p>
              <div className="grid gap-3">
                <CompetitorCard 
                  name="Direct Competitors"
                  description="Solutions directly addressing the same problem"
                  strength="Established user base"
                  weakness="Often overcomplicated"
                />
                <CompetitorCard 
                  name="Indirect Competitors"
                  description="Adjacent solutions users might use instead"
                  strength="Lower switching cost"
                  weakness="Not purpose-built"
                />
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
                <p className="text-lg font-medium">
                  {ideaData.scaleIntent === "venture-scale" 
                    ? "This is a painkiller, not a vitamin."
                    : ideaData.scaleIntent === "lifestyle"
                    ? "This serves a real, recurring need."
                    : "This addresses a genuine social gap."}
                </p>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <ValueCard label="Time Saved" value="~5 hrs/week" />
                <ValueCard label="Money Saved" value="$200-500/mo" />
                <ValueCard label="Risk Reduced" value="Significant" />
              </div>
            </div>
          </AnalysisSection>

          <AnalysisSection
            id="pitch"
            icon={<FileText className="h-5 w-5" />}
            title="Pitch Deck Outline"
            expanded={expandedSections.includes("pitch")}
            onToggle={() => toggleSection("pitch")}
          >
            <div className="grid md:grid-cols-2 gap-3">
              {[
                "1. Problem",
                "2. Why Now",
                "3. Solution",
                "4. Product Demo",
                "5. Market Size",
                "6. Competition",
                "7. Differentiation",
                "8. Business Model",
                "9. Traction Plan",
                "10. Go-to-Market",
                "11. Team",
                "12. Roadmap",
                "13. The Ask"
              ].map((slide) => (
                <div key={slide} className="border-2 border-border p-3 hover:bg-secondary transition-colors">
                  <span className="font-mono text-sm">{slide}</span>
                </div>
              ))}
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
                  recommendation={ideaData.scaleIntent === "venture-scale" ? "Delaware C-Corp" : "LLC"}
                  reason={ideaData.scaleIntent === "venture-scale" 
                    ? "Required for VC funding, standard for startups"
                    : "Simpler structure, pass-through taxation"}
                />
                <RecommendationCard 
                  title="When to Incorporate"
                  recommendation="After validation"
                  reason="Don't spend money until you've talked to 10+ potential users"
                />
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
                tasks={["User interviews", "Problem validation", "Solution testing"]}
              />
              <TimelineItem 
                phase="Month 2-3"
                title="MVP"
                tasks={["Core feature build", "Landing page", "Early access list"]}
              />
              <TimelineItem 
                phase="Month 4-6"
                title="Early Users"
                tasks={["Launch to waitlist", "Iterate on feedback", "Establish metrics"]}
              />
              <TimelineItem 
                phase="Month 7+"
                title="Scale"
                tasks={["Fundraising prep", "Team expansion", "Growth experiments"]}
              />
            </div>
          </AnalysisSection>

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

const DecisionIcon = ({ decision }: { decision: DecisionType }) => {
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
  description, 
  strength, 
  weakness 
}: { 
  name: string; 
  description: string; 
  strength: string; 
  weakness: string;
}) => (
  <div className="border-2 border-border p-4 space-y-2">
    <h4 className="font-bold">{name}</h4>
    <p className="text-sm text-muted-foreground">{description}</p>
    <div className="flex gap-4 text-sm">
      <span className="text-foreground">✓ {strength}</span>
      <span className="text-muted-foreground">✗ {weakness}</span>
    </div>
  </div>
);

const ValueCard = ({ label, value }: { label: string; value: string }) => (
  <div className="border-2 border-border p-4 text-center">
    <p className="text-2xl font-bold">{value}</p>
    <p className="text-sm text-muted-foreground">{label}</p>
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
