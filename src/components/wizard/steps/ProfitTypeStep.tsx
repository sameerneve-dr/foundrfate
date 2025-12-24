import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DollarSign, Heart, Shuffle, Check, HelpCircle, ChevronRight } from "lucide-react";
import { useDecisionLedger, type ProfitType } from "@/contexts/DecisionLedgerContext";
import { DecisionCard } from "../DecisionCard";

interface ProfitTypeStepProps {
  onComplete: () => void;
}

export const ProfitTypeStep = ({ onComplete }: ProfitTypeStepProps) => {
  const { ledger, updateLedger } = useDecisionLedger();
  const [showOptions, setShowOptions] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const analysis = ledger.analysis;
  const recommendation = analysis?.profitStructure?.recommendation || 'for-profit';

  const handleAccept = () => {
    updateLedger({ 
      profitType: recommendation as ProfitType,
      profitTypeAccepted: true 
    });
    onComplete();
  };

  const handleSelect = (type: ProfitType) => {
    updateLedger({ 
      profitType: type,
      profitTypeAccepted: true 
    });
    onComplete();
  };

  const options: { value: ProfitType; label: string; desc: string; icon: React.ReactNode }[] = [
    {
      value: 'for-profit',
      label: 'For-Profit',
      desc: 'Traditional startup model, can raise VC funding',
      icon: <DollarSign className="h-6 w-6" />
    },
    {
      value: 'non-profit',
      label: 'Non-Profit (501c3)',
      desc: 'Tax-exempt, grant funding, mission-driven',
      icon: <Heart className="h-6 w-6" />
    },
    {
      value: 'hybrid',
      label: 'Hybrid Model',
      desc: 'Public benefit corp, B-Corp, or social enterprise',
      icon: <Shuffle className="h-6 w-6" />
    }
  ];

  if (showOptions) {
    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold">Choose your profit structure</h2>
          <p className="text-muted-foreground mt-2">This affects legal structure and funding options</p>
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
                {opt.icon}
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
        <h2 className="text-2xl md:text-3xl font-bold">Profit Structure</h2>
        <p className="text-muted-foreground mt-2">Based on your idea and scale intent</p>
      </div>

      <DecisionCard
        title={`Recommended: ${recommendation === 'for-profit' ? 'For-Profit' : recommendation === 'non-profit' ? 'Non-Profit' : 'Hybrid'}`}
        description={analysis?.profitStructure?.reason || 'This structure best matches your goals.'}
        icon={recommendation === 'for-profit' ? <DollarSign className="h-6 w-6" /> : 
              recommendation === 'non-profit' ? <Heart className="h-6 w-6" /> : 
              <Shuffle className="h-6 w-6" />}
        onAccept={handleAccept}
        onShowOptions={() => setShowOptions(true)}
        onExplain={() => setShowExplanation(!showExplanation)}
      />

      {showExplanation && (
        <div className="border-2 border-border p-4 bg-muted space-y-3">
          <h4 className="font-bold">Quick explanation</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><strong>For-Profit:</strong> You keep equity, can raise VC, exit via acquisition/IPO</li>
            <li><strong>Non-Profit:</strong> Tax exempt, can receive grants, no equity but salary allowed</li>
            <li><strong>Hybrid:</strong> Best of both worlds, but more complex to set up</li>
          </ul>
        </div>
      )}
    </div>
  );
};
