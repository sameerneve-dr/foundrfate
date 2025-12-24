import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Clock, DollarSign, MapPin, Users, ChevronRight } from "lucide-react";
import { useDecisionLedger, type RegistrationMode } from "@/contexts/DecisionLedgerContext";

interface RegistrationSnapshotProps {
  onContinue: () => void;
}

export const RegistrationSnapshot = ({ onContinue }: RegistrationSnapshotProps) => {
  const { ledger, updateLedger } = useDecisionLedger();
  const [selectedMode, setSelectedMode] = useState<RegistrationMode>(ledger.registrationMode);

  const entityType = ledger.entityType;
  const isDelawareCCorp = entityType === 'delaware-c-corp';
  const isLLC = entityType === 'llc';

  const getEntityLabel = () => {
    if (isDelawareCCorp) return 'Delaware C-Corp';
    if (isLLC) return 'LLC';
    if (entityType === 'non-profit-501c3') return '501(c)(3) Non-Profit';
    return 'Your Entity';
  };

  const cards = [
    {
      icon: <Clock className="h-6 w-6" />,
      title: 'Time',
      highlight: isDelawareCCorp ? '3–10 days' : isLLC ? '1–7 days' : '2–12 weeks',
      details: [
        isDelawareCCorp ? 'State filing: 1–3 business days' : 'State filing: 1–5 business days',
        'EIN: Same day (online)',
        'Bank account: 1–7 days',
        isDelawareCCorp ? 'Expedited available (+$100)' : 'Varies by state'
      ]
    },
    {
      icon: <DollarSign className="h-6 w-6" />,
      title: 'Cost',
      highlight: isDelawareCCorp ? '$500–$2,500' : isLLC ? '$100–$800' : '$400–$1,500',
      details: [
        isDelawareCCorp ? 'Delaware filing: $89–$189' : 'State filing: $50–$500',
        isDelawareCCorp ? 'Franchise tax: $225/yr min' : 'Annual fee: varies by state',
        'Registered agent: $125–$300/yr',
        'Legal docs (optional): $500–$2,000'
      ]
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      title: 'Where',
      highlight: isDelawareCCorp ? 'Delaware + IRS' : 'Your State + IRS',
      details: [
        isDelawareCCorp ? 'Delaware Division of Corporations' : 'Your state Secretary of State',
        'IRS for EIN (federal)',
        'Business bank (Mercury, Brex, etc.)',
        'Accounting tool (optional)'
      ]
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: 'Help Options',
      highlight: 'DIY to Full-Service',
      details: [
        'DIY: cheapest, ~$200–$400',
        'Platforms: Stripe Atlas, Clerky',
        'Legal help: hourly or fixed fee',
        'Full-service: $1,500–$5,000'
      ]
    }
  ];

  const handleModeSelect = (mode: RegistrationMode) => {
    setSelectedMode(mode);
    updateLedger({ registrationMode: mode });
  };

  const handleContinue = () => {
    if (selectedMode) {
      onContinue();
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold">Company Registration</h2>
        <p className="text-muted-foreground mt-2">What it really takes to register your {getEntityLabel()}</p>
      </div>

      {/* Reality Snapshot Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {cards.map((card) => (
          <div key={card.title} className="border-2 border-border p-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center shrink-0">
                {card.icon}
              </div>
              <div>
                <p className="font-bold">{card.title}</p>
                <p className="text-lg font-mono">{card.highlight}</p>
              </div>
            </div>
            <ul className="space-y-1 text-sm text-muted-foreground">
              {card.details.map((detail, i) => (
                <li key={i}>• {detail}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Decision Question */}
      <div className="border-2 border-border p-6 bg-muted space-y-4">
        <p className="font-bold text-lg">How do you want to handle registration?</p>
        <div className="grid gap-3">
          {[
            { value: 'diy' as const, label: 'I want to do it myself', desc: 'Cheapest option, full control' },
            { value: 'service' as const, label: 'I want a service to handle it', desc: 'Faster, less hassle' },
            { value: 'explain' as const, label: 'Explain everything simply first', desc: 'I need more context' }
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => handleModeSelect(option.value)}
              className={`flex items-center gap-4 p-4 border-2 transition-all text-left
                ${selectedMode === option.value ? 'border-foreground bg-secondary' : 'border-border hover:bg-secondary/50'}`}
            >
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0
                ${selectedMode === option.value ? 'border-foreground bg-foreground' : 'border-muted-foreground'}`}>
                {selectedMode === option.value && <div className="w-2 h-2 rounded-full bg-background" />}
              </div>
              <div className="flex-1">
                <p className="font-bold">{option.label}</p>
                <p className="text-sm text-muted-foreground">{option.desc}</p>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </button>
          ))}
        </div>
      </div>

      <Button 
        onClick={handleContinue}
        disabled={!selectedMode}
        size="lg"
        className="w-full gap-2"
      >
        Continue
        <ChevronRight className="h-5 w-5" />
      </Button>
    </div>
  );
};
