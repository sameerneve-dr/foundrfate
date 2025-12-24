import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Building2, ChevronRight } from "lucide-react";
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

  const analysis = ledger.analysis;
  const profitType = ledger.profitType;
  
  // Determine recommendation based on profit type
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

  const options: { value: EntityType; label: string; desc: string }[] = [
    {
      value: 'delaware-c-corp',
      label: 'Delaware C-Corporation',
      desc: 'Best for raising VC, standard for tech startups'
    },
    {
      value: 'llc',
      label: 'LLC',
      desc: 'Flexible, pass-through taxation, good for bootstrapping'
    },
    {
      value: 'non-profit-501c3',
      label: '501(c)(3) Non-Profit',
      desc: 'Tax-exempt, for charitable/educational purposes'
    },
    {
      value: 'other',
      label: 'Other / Decide Later',
      desc: "I'll figure this out with a lawyer"
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
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold">Choose your entity type</h2>
          <p className="text-muted-foreground mt-2">This determines your legal structure and tax treatment</p>
        </div>

        <div className="grid gap-3">
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleSelect(opt.value)}
              className={`flex items-center gap-4 p-4 border-2 transition-all text-left
                ${opt.value === recommendation ? 'border-foreground' : 'border-border'}
                hover:bg-secondary`}
            >
              <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center shrink-0">
                <Building2 className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-bold">{opt.label}</p>
                  {opt.value === recommendation && (
                    <span className="text-xs bg-foreground text-background px-2 py-0.5 font-bold">RECOMMENDED</span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{opt.desc}</p>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </button>
          ))}
        </div>

        <Button variant="outline" onClick={() => setShowOptions(false)}>
          Back to recommendation
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold">Legal Entity</h2>
        <p className="text-muted-foreground mt-2">Based on your profit structure and funding goals</p>
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
        <div className="border-2 border-border p-4 bg-muted space-y-3">
          <h4 className="font-bold">Why does entity type matter?</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><strong>C-Corp:</strong> Required for VC funding, but double taxation on profits</li>
            <li><strong>LLC:</strong> Simpler taxes, but harder to issue equity to investors</li>
            <li><strong>501c3:</strong> Tax-exempt but strict rules on activities</li>
          </ul>
        </div>
      )}
    </div>
  );
};
