import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Download, 
  Presentation, 
  RotateCcw,
  Sparkles,
  Share2,
  Copy,
  Check,
  Loader2
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
    // Convert snapshot to IdeaData format for PDF export
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

  // Generate next 3 actions based on choices
  const getNextActions = () => {
    const actions: string[] = [];
    
    if (ledger.entityType === 'delaware-c-corp') {
      const setup = ledger.cCorpSetup.preIncorporation;
      if (!setup.nameCheck) actions.push('Check Delaware name availability');
      if (!setup.registeredAgent) actions.push('Choose a registered agent service');
      if (!setup.founderDetails) actions.push('Gather all founder information');
    }

    if (actions.length < 3) {
      actions.push('Schedule 5 customer discovery calls');
    }
    if (actions.length < 3) {
      actions.push('Create a landing page to test demand');
    }
    if (actions.length < 3) {
      actions.push('Draft your 1-paragraph pitch');
    }

    return actions.slice(0, 3);
  };

  const formatChoice = (choice: string | null): string => {
    if (!choice) return 'Not selected';
    return choice
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="border-2 border-foreground bg-secondary p-6 md:p-8 text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-foreground">
          <Sparkles className="h-8 w-8 text-background" />
        </div>
        <h2 className="text-3xl md:text-4xl font-bold">{ledger.ideaSnapshot.ideaName}</h2>
        <p className="text-lg text-muted-foreground">Your personalized startup blueprint</p>
        <Badge variant="default" className="text-sm">
          {analysis.decision === 'yes' ? '✅ PURSUE' : 
           analysis.decision === 'conditional' ? '⚠️ CONDITIONAL' : 
           '❌ PIVOT'}
        </Badge>
      </div>

      {/* Decision Ledger Summary */}
      <div className="border-2 border-border p-6 space-y-4">
        <h3 className="font-bold text-lg">Your Choices</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <SummaryItem label="Target Customer" value={formatChoice(ledger.targetCustomer)} />
          <SummaryItem label="Profit Structure" value={formatChoice(ledger.profitType)} />
          <SummaryItem label="Entity Type" value={formatChoice(ledger.entityType)} />
          <SummaryItem label="Fundraising" value={formatChoice(ledger.fundraisingIntent)} />
        </div>
      </div>

      {/* Next 3 Actions */}
      <div className="border-2 border-border p-6 space-y-4">
        <h3 className="font-bold text-lg">Next 3 Actions This Week</h3>
        <div className="space-y-3">
          {getNextActions().map((action, i) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-secondary">
              <div className="w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center font-bold">
                {i + 1}
              </div>
              <span className="font-medium">{action}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Value Proposition */}
      <div className="border-2 border-border p-6 bg-muted">
        <h3 className="font-bold text-lg mb-3">Why This Company Should Exist</h3>
        <p className="text-muted-foreground">{analysis.valueAnalysis.whyExist}</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
          <MiniStat label="Time Saved" value={analysis.valueAnalysis.timeSaved} />
          <MiniStat label="Money Saved" value={analysis.valueAnalysis.moneySaved} />
          <MiniStat label="Risk Reduced" value={analysis.valueAnalysis.riskReduced} />
          <MiniStat label="Revenue" value={analysis.valueAnalysis.revenueUnlocked} />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid md:grid-cols-2 gap-3">
        <Button onClick={handleExport} size="lg" className="gap-2">
          <Download className="h-5 w-5" />
          Download PDF
        </Button>
        <Button onClick={onGeneratePitch} variant="outline" size="lg" className="gap-2">
          <Presentation className="h-5 w-5" />
          View Pitch Deck
        </Button>
      </div>

      {/* Share Section */}
      <div className="border-2 border-border p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-bold flex items-center gap-2">
            <Share2 className="h-4 w-4" />
            Share Your Analysis
          </h4>
          {!shareUrl && (
            <Button onClick={handleShare} disabled={isSharing} size="sm" className="gap-2">
              {isSharing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating link...
                </>
              ) : (
                <>
                  <Share2 className="h-4 w-4" />
                  Get shareable link
                </>
              )}
            </Button>
          )}
        </div>
        {shareUrl && (
          <div className="flex gap-2">
            <Input 
              value={shareUrl} 
              readOnly 
              className="font-mono text-sm"
            />
            <Button onClick={handleCopy} variant="outline" size="icon">
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        )}
      </div>

      <Button 
        onClick={onReset} 
        variant="ghost" 
        className="w-full gap-2 text-muted-foreground"
      >
        <RotateCcw className="h-4 w-4" />
        Start Over with New Idea
      </Button>
    </div>
  );
};

const SummaryItem = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between items-center py-2 border-b border-border">
    <span className="text-muted-foreground text-sm">{label}</span>
    <span className="font-bold">{value}</span>
  </div>
);

const MiniStat = ({ label, value }: { label: string; value: string }) => (
  <div className="text-center p-2 bg-background border border-border">
    <p className="font-bold text-sm">{value}</p>
    <p className="text-xs text-muted-foreground">{label}</p>
  </div>
);
