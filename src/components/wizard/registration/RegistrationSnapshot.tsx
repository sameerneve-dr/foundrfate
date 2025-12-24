import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Clock, DollarSign, MapPin, Users, ChevronRight, Sparkles, Building2 } from "lucide-react";
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
      color: 'primary' as const,
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
      color: 'success' as const,
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
      color: 'accent' as const,
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
      color: 'warning' as const,
      details: [
        'DIY: cheapest, ~$200–$400',
        'Platforms: Stripe Atlas, Clerky',
        'Legal help: hourly or fixed fee',
        'Full-service: $1,500–$5,000'
      ]
    }
  ];

  const colorClasses = {
    primary: 'bg-primary/10 text-primary border-primary/20',
    success: 'bg-success/10 text-success border-success/20',
    accent: 'bg-accent/10 text-accent border-accent/20',
    warning: 'bg-warning/10 text-warning border-warning/20'
  };

  const iconBgClasses = {
    primary: 'bg-gradient-primary text-primary-foreground',
    success: 'bg-gradient-success text-success-foreground',
    accent: 'bg-gradient-accent text-accent-foreground',
    warning: 'bg-gradient-warning text-warning-foreground'
  };

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
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-lg shadow-primary/30">
          <Building2 className="h-8 w-8 text-primary-foreground" />
        </div>
        <div>
          <h2 className="text-2xl md:text-3xl font-display font-bold">Company Registration</h2>
          <p className="text-muted-foreground">What it really takes to register your {getEntityLabel()}</p>
        </div>
      </div>

      {/* Reality Snapshot Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {cards.map((card) => (
          <div 
            key={card.title} 
            className={`bg-card rounded-2xl border shadow-lg p-5 space-y-4 card-interactive ${colorClasses[card.color]}`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${iconBgClasses[card.color]}`}>
                {card.icon}
              </div>
              <div>
                <p className="font-bold text-foreground">{card.title}</p>
                <p className="text-xl font-display font-bold">{card.highlight}</p>
              </div>
            </div>
            <ul className="space-y-1.5 text-sm text-muted-foreground">
              {card.details.map((detail, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-current opacity-60">•</span>
                  <span>{detail}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Decision Question */}
      <div className="bg-card rounded-2xl border border-border/50 shadow-lg p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <p className="font-bold text-lg">How do you want to handle registration?</p>
        </div>
        <div className="grid gap-3">
          {[
            { value: 'diy' as const, label: 'I want to do it myself', desc: 'Cheapest option, full control', color: 'primary' },
            { value: 'service' as const, label: 'I want a service to handle it', desc: 'Faster, less hassle', color: 'accent' },
            { value: 'explain' as const, label: 'Explain everything simply first', desc: 'I need more context', color: 'warning' }
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => handleModeSelect(option.value)}
              className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left group
                ${selectedMode === option.value 
                  ? 'border-primary bg-primary/5 shadow-md' 
                  : 'border-border hover:border-primary/50 hover:bg-muted/50'}`}
            >
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all
                ${selectedMode === option.value ? 'border-primary bg-primary' : 'border-muted-foreground group-hover:border-primary'}`}>
                {selectedMode === option.value && <div className="w-2 h-2 rounded-full bg-primary-foreground" />}
              </div>
              <div className="flex-1">
                <p className="font-bold">{option.label}</p>
                <p className="text-sm text-muted-foreground">{option.desc}</p>
              </div>
              <ChevronRight className={`h-5 w-5 transition-transform ${selectedMode === option.value ? 'text-primary translate-x-1' : 'text-muted-foreground'}`} />
            </button>
          ))}
        </div>
      </div>

      <Button 
        onClick={handleContinue}
        disabled={!selectedMode}
        size="lg"
        className="w-full gap-2 bg-gradient-primary hover:opacity-90 text-primary-foreground font-bold text-lg h-14 rounded-xl shadow-lg btn-glow-primary transition-all"
      >
        Continue
        <ChevronRight className="h-5 w-5" />
      </Button>
    </div>
  );
};
