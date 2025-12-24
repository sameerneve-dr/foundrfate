import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Building2, ChevronRight, Sparkles, HelpCircle, Check } from "lucide-react";
import { useDecisionLedger, type EntityType } from "@/contexts/DecisionLedgerContext";
import { DecisionCard } from "../DecisionCard";

interface EntityTypeStepProps {
  onComplete: () => void;
  onCCorpSetup: () => void;
}

export const EntityTypeStep = ({ onComplete, onCCorpSetup }: EntityTypeStepProps) => {
  const { ledger, updateLedger } = useDecisionLedger();
  const [showOptions, setShowOptions] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const profitType = ledger.profitType;
  
  const recommendation: EntityType = 
    profitType === 'non-profit' ? 'non-profit-501c3' :
    profitType === 'for-profit' && ledger.fundraisingIntent === 'venture-scale' ? 'delaware-c-corp' :
    profitType === 'for-profit' && ledger.fundraisingIntent === 'bootstrap' ? 'llc' :
    'delaware-c-corp';

  const handleAccept = () => {
    updateLedger({ 
      entityType: recommendation,
      entityAccepted: true 
    });
    if (recommendation === 'delaware-c-corp') {
      onCCorpSetup();
    } else {
      onComplete();
    }
  };

  const handleSelect = (type: EntityType) => {
    updateLedger({ 
      entityType: type,
      entityAccepted: true 
    });
    if (type === 'delaware-c-corp') {
      onCCorpSetup();
    } else {
      onComplete();
    }
  };

  const options: { value: EntityType; label: string; desc: string; color: string }[] = [
    {
      value: 'delaware-c-corp',
      label: 'Delaware C-Corporation',
      desc: 'Best for raising VC, standard for tech startups',
      color: 'primary'
    },
    {
      value: 'llc',
      label: 'LLC',
      desc: 'Flexible, pass-through taxation, good for bootstrapping',
      color: 'accent'
    },
    {
      value: 'non-profit-501c3',
      label: '501(c)(3) Non-Profit',
      desc: 'Tax-exempt, for charitable/educational purposes',
      color: 'success'
    },
    {
      value: 'other',
      label: 'Other / Decide Later',
      desc: "I'll figure this out with a lawyer",
      color: 'warning'
    }
  ];

  const getRecommendationReason = () => {
    if (recommendation === 'delaware-c-corp') {
      return "Delaware C-Corp is the gold standard for venture-backed startups. It's what investors expect and makes fundraising smoother.";
    }
    if (recommendation === 'llc') {
      return "An LLC gives you flexibility and pass-through taxation, ideal for bootstrapped businesses.";
    }
    if (recommendation === 'non-profit-501c3') {
      return "A 501(c)(3) allows you to receive tax-deductible donations and grants for your mission.";
    }
    return "We'll help you figure this out.";
  };

  if (showOptions) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-lg shadow-primary/30">
            <Building2 className="h-7 w-7 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-display font-bold">Choose Your Entity</h2>
            <p className="text-muted-foreground">This determines your legal structure and tax treatment</p>
          </div>
        </div>

        <div className="grid gap-3">
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleSelect(opt.value)}
              className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all text-left group
                ${opt.value === recommendation 
                  ? 'border-primary bg-primary/5 shadow-lg' 
                  : 'border-border hover:border-primary/50 hover:bg-muted/50 hover:shadow-md'
                }`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105
                ${opt.value === recommendation ? 'bg-gradient-primary text-primary-foreground' : 'bg-muted'}`}>
                <Building2 className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-bold">{opt.label}</p>
                  {opt.value === recommendation && (
                    <span className="pill pill-primary text-xs">
                      <Sparkles className="h-3 w-3" />
                      RECOMMENDED
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1">{opt.desc}</p>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </button>
          ))}
        </div>

        <Button variant="outline" onClick={() => setShowOptions(false)} className="rounded-xl">
          Back to recommendation
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-lg shadow-primary/30">
          <Building2 className="h-7 w-7 text-primary-foreground" />
        </div>
        <div>
          <h2 className="text-2xl md:text-3xl font-display font-bold">Legal Entity</h2>
          <p className="text-muted-foreground">Based on your profit structure and funding goals</p>
        </div>
      </div>

      <DecisionCard
        title={options.find(o => o.value === recommendation)?.label || 'Entity Type'}
        description={getRecommendationReason()}
        icon={<Building2 className="h-6 w-6" />}
        onAccept={handleAccept}
        onShowOptions={() => setShowOptions(true)}
        onExplain={() => setShowExplanation(!showExplanation)}
      />

      {showExplanation && (
        <div className="bg-muted/50 rounded-2xl p-5 border border-border/50 space-y-3 animate-fade-in">
          <h4 className="font-bold flex items-center gap-2">
            <HelpCircle className="h-4 w-4 text-primary" />
            Why does entity type matter?
          </h4>
          <div className="grid gap-2">
            <div className="flex items-start gap-3 p-3 bg-card rounded-xl border border-border/50">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <span className="text-xs font-bold text-primary">C</span>
              </div>
              <div>
                <p className="font-medium text-sm">C-Corp</p>
                <p className="text-xs text-muted-foreground">Required for VC funding, but double taxation on profits</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-card rounded-xl border border-border/50">
              <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                <span className="text-xs font-bold text-accent">L</span>
              </div>
              <div>
                <p className="font-medium text-sm">LLC</p>
                <p className="text-xs text-muted-foreground">Simpler taxes, but harder to issue equity to investors</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-card rounded-xl border border-border/50">
              <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center shrink-0">
                <span className="text-xs font-bold text-success">5</span>
              </div>
              <div>
                <p className="font-medium text-sm">501(c)(3)</p>
                <p className="text-xs text-muted-foreground">Tax-exempt but strict rules on activities</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
