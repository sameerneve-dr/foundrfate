import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  Loader2,
  Users,
  TrendingUp,
  Calendar,
  Building2,
  DollarSign,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface SharedData {
  idea_name: string;
  idea_snapshot: {
    ideaName: string;
    problem: string;
    solution: string;
    audience: string;
    scaleIntent: string;
  };
  analysis_result: {
    decision: 'yes' | 'conditional' | 'no';
    decisionRationale: {
      summary: string;
      marketSaturation: string;
      differentiation: string;
      userUrgency: string;
      founderMarketFit: string;
    };
    realNeedAnalysis: {
      isPainkiller: boolean;
      willingness: string;
      explanation: string;
    };
    competitiveLandscape: {
      marketCrowded: boolean;
      directCompetitors: { name: string; coreOffering: string }[];
      whatIsSolved: string;
      whatIsNot: string;
    };
    valueAnalysis: {
      whyExist: string;
      timeSaved: string;
      moneySaved: string;
      riskReduced: string;
      revenueUnlocked: string;
    };
    pitchStory: string;
    timeline: {
      month0to1: string[];
      month2to3: string[];
      month4to6: string[];
      month7plus: string[];
    };
  };
  decision_ledger: {
    targetCustomer: string | null;
    profitType: string | null;
    entityType: string | null;
    fundraisingIntent: string | null;
    verdict: string | null;
  };
}

const SharedAnalysis = () => {
  const { shareId } = useParams<{ shareId: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<SharedData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<string[]>(['value']);

  useEffect(() => {
    const fetchData = async () => {
      if (!shareId) return;

      try {
        const { data: result, error: fetchError } = await supabase
          .from('shared_analyses')
          .select('*')
          .eq('share_id', shareId)
          .maybeSingle();

        if (fetchError) throw fetchError;
        if (!result) {
          setError("This analysis link has expired or doesn't exist.");
          return;
        }

        setData(result as unknown as SharedData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load analysis");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [shareId]);

  const toggleSection = (id: string) => {
    setExpandedSections(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading analysis...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4 max-w-md px-4">
          <XCircle className="h-12 w-12 mx-auto text-destructive" />
          <h1 className="text-2xl font-bold">Analysis Not Found</h1>
          <p className="text-muted-foreground">{error}</p>
          <Button onClick={() => navigate('/')}>Start Your Own Analysis</Button>
        </div>
      </div>
    );
  }

  const analysis = data.analysis_result;
  const decision = analysis.decision;
  const ledger = data.decision_ledger;

  const formatChoice = (choice: string | null): string => {
    if (!choice) return '—';
    return choice.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b-2 border-border p-4">
        <div className="container flex items-center justify-between">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            <span className="font-mono text-sm">Create your own</span>
          </button>
          <h1 className="text-xl font-bold">FoundrFate</h1>
          <Badge variant="secondary">Shared Analysis</Badge>
        </div>
      </header>

      {/* Hero */}
      <div className={`border-b-2 border-border p-8 animate-fade-in ${
        decision === "yes" ? "bg-secondary" : 
        decision === "conditional" ? "bg-muted" : "bg-destructive/10"
      }`}>
        <div className="container max-w-4xl">
          <div className="flex items-center gap-6">
            <DecisionIcon decision={decision} />
            <div className="space-y-2">
              <Badge variant={decision === "yes" ? "default" : decision === "conditional" ? "secondary" : "destructive"}>
                {decision === "yes" ? "✅ PURSUE" : decision === "conditional" ? "⚠️ CONDITIONAL" : "❌ NO-GO"}
              </Badge>
              <h2 className="text-3xl font-bold">{data.idea_name}</h2>
              <p className="text-muted-foreground">{analysis.decisionRationale.summary}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="py-8 px-4">
        <div className="container max-w-4xl space-y-6">
          {/* Choices Summary */}
          <div className="grid md:grid-cols-4 gap-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <ChoiceCard icon={<Users className="h-5 w-5" />} label="Target" value={formatChoice(ledger.targetCustomer)} />
            <ChoiceCard icon={<DollarSign className="h-5 w-5" />} label="Profit" value={formatChoice(ledger.profitType)} />
            <ChoiceCard icon={<Building2 className="h-5 w-5" />} label="Entity" value={formatChoice(ledger.entityType)} />
            <ChoiceCard icon={<TrendingUp className="h-5 w-5" />} label="Funding" value={formatChoice(ledger.fundraisingIntent)} />
          </div>

          {/* Value Analysis */}
          <Collapsible open={expandedSections.includes('value')} onOpenChange={() => toggleSection('value')}>
            <CollapsibleTrigger asChild>
              <button className="w-full flex items-center justify-between p-4 border-2 border-border hover:bg-secondary transition-colors text-left animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <span className="font-bold">Why This Should Exist</span>
                {expandedSections.includes('value') ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="border-2 border-t-0 border-border p-4 space-y-4">
                <p className="text-muted-foreground">{analysis.valueAnalysis.whyExist}</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <MiniStat label="Time Saved" value={analysis.valueAnalysis.timeSaved} />
                  <MiniStat label="Money Saved" value={analysis.valueAnalysis.moneySaved} />
                  <MiniStat label="Risk Reduced" value={analysis.valueAnalysis.riskReduced} />
                  <MiniStat label="Revenue" value={analysis.valueAnalysis.revenueUnlocked} />
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Pitch Story */}
          <Collapsible open={expandedSections.includes('pitch')} onOpenChange={() => toggleSection('pitch')}>
            <CollapsibleTrigger asChild>
              <button className="w-full flex items-center justify-between p-4 border-2 border-border hover:bg-secondary transition-colors text-left animate-fade-in" style={{ animationDelay: '0.3s' }}>
                <span className="font-bold">The Pitch Story</span>
                {expandedSections.includes('pitch') ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="border-2 border-t-0 border-border p-4">
                <p className="whitespace-pre-line text-muted-foreground">{analysis.pitchStory}</p>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Timeline */}
          <Collapsible open={expandedSections.includes('timeline')} onOpenChange={() => toggleSection('timeline')}>
            <CollapsibleTrigger asChild>
              <button className="w-full flex items-center justify-between p-4 border-2 border-border hover:bg-secondary transition-colors text-left animate-fade-in" style={{ animationDelay: '0.4s' }}>
                <span className="font-bold flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Execution Timeline
                </span>
                {expandedSections.includes('timeline') ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="border-2 border-t-0 border-border p-4 space-y-3">
                <TimelinePhase label="Month 0-1" title="Validation" tasks={analysis.timeline.month0to1} />
                <TimelinePhase label="Month 2-3" title="MVP" tasks={analysis.timeline.month2to3} />
                <TimelinePhase label="Month 4-6" title="Early Users" tasks={analysis.timeline.month4to6} />
                <TimelinePhase label="Month 7+" title="Scale" tasks={analysis.timeline.month7plus} />
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* CTA */}
          <div className="text-center pt-8 animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <p className="text-muted-foreground mb-4">Ready to analyze your own idea?</p>
            <Button size="lg" onClick={() => navigate('/')}>
              Start Your Analysis
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const DecisionIcon = ({ decision }: { decision: "yes" | "conditional" | "no" }) => {
  const iconClass = "h-12 w-12";
  if (decision === "yes") return <CheckCircle2 className={`${iconClass} text-foreground`} />;
  if (decision === "conditional") return <AlertTriangle className={`${iconClass} text-foreground`} />;
  return <XCircle className={`${iconClass} text-destructive`} />;
};

const ChoiceCard = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="border-2 border-border p-3 text-center">
    <div className="flex justify-center mb-2 text-muted-foreground">{icon}</div>
    <p className="text-xs text-muted-foreground uppercase">{label}</p>
    <p className="font-bold text-sm">{value}</p>
  </div>
);

const MiniStat = ({ label, value }: { label: string; value: string }) => (
  <div className="text-center p-2 bg-secondary border border-border">
    <p className="font-bold text-sm">{value}</p>
    <p className="text-xs text-muted-foreground">{label}</p>
  </div>
);

const TimelinePhase = ({ label, title, tasks }: { label: string; title: string; tasks: string[] }) => (
  <div className="flex gap-4">
    <div className="font-mono text-xs text-muted-foreground min-w-[70px]">{label}</div>
    <div className="flex-1">
      <p className="font-bold text-sm">{title}</p>
      <ul className="text-xs text-muted-foreground mt-1 space-y-1">
        {tasks.slice(0, 3).map((task, i) => (
          <li key={i}>• {task}</li>
        ))}
      </ul>
    </div>
  </div>
);

export default SharedAnalysis;
