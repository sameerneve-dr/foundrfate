import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Clock, DollarSign, Users, ChevronRight, Sparkles, UserCheck, Briefcase, FileCheck } from "lucide-react";
import { useDecisionLedger } from "@/contexts/DecisionLedgerContext";

export type AgentsMode = 'diy' | 'full-service' | 'explain' | null;

interface AgentsSnapshotProps {
  onContinue: (mode: AgentsMode) => void;
}

export const AgentsSnapshot = ({ onContinue }: AgentsSnapshotProps) => {
  const { ledger } = useDecisionLedger();
  const [selectedMode, setSelectedMode] = useState<AgentsMode>(null);

  const entityType = ledger.entityType;
  const isDelawareCCorp = entityType === 'delaware-c-corp';
  const fundraisingIntent = ledger.fundraisingIntent;
  const isVentureScale = fundraisingIntent === 'venture-scale';

  const getTeamRecommendation = () => {
    if (isVentureScale) {
      return {
        title: 'Growth-Focused Team',
        description: 'Plan for technical co-founder, early engineers, and sales/BD',
        timeline: 'First hire within 3-6 months'
      };
    }
    return {
      title: 'Lean Team',
      description: 'Start solo or with contractors, hire as needed',
      timeline: 'First hire when revenue supports it'
    };
  };

  const teamRec = getTeamRecommendation();

  const cards = [
    {
      icon: <UserCheck className="h-6 w-6" />,
      title: 'Registered Agent',
      highlight: isDelawareCCorp ? 'Required in Delaware' : 'State-Dependent',
      color: 'primary' as const,
      details: [
        isDelawareCCorp ? 'Must have DE physical address' : 'Check your state requirements',
        'Receives legal documents on your behalf',
        'Services: $125–$300/year',
        'Can use your own address (if in-state)'
      ]
    },
    {
      icon: <Briefcase className="h-6 w-6" />,
      title: 'First Hire',
      highlight: teamRec.timeline,
      color: 'success' as const,
      details: [
        teamRec.description,
        isVentureScale ? 'Often technical (engineer/CTO)' : 'Often operational (VA, support)',
        'Consider equity vs cash compensation',
        'Budget: $0 (equity) to $5K+/mo'
      ]
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: 'Contractors',
      highlight: 'Flexible & Fast',
      color: 'accent' as const,
      details: [
        'No payroll complexity',
        'Use 1099 agreements (US) or contractor agreements',
        'Platforms: Upwork, Toptal, Contra',
        'Cost: $25–$200/hr depending on role'
      ]
    },
    {
      icon: <FileCheck className="h-6 w-6" />,
      title: 'Key Documents',
      highlight: 'Protect Yourself',
      color: 'warning' as const,
      details: [
        'CIIA (Invention Assignment)',
        'Independent Contractor Agreement',
        'Offer letters with equity terms',
        'IP assignment for all work'
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

  const handleContinue = () => {
    if (selectedMode) {
      onContinue(selectedMode);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-warning flex items-center justify-center shadow-lg shadow-warning/30">
          <Users className="h-8 w-8 text-warning-foreground" />
        </div>
        <div>
          <h2 className="text-2xl md:text-3xl font-display font-bold">Agents & Hiring</h2>
          <p className="text-muted-foreground">Build your support team strategically</p>
        </div>
      </div>

      {/* Team Recommendation Banner */}
      <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl border border-primary/20 p-5">
        <div className="flex items-center gap-3 mb-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <span className="font-bold text-lg">{teamRec.title}</span>
        </div>
        <p className="text-muted-foreground">{teamRec.description} — {teamRec.timeline}</p>
      </div>

      {/* Info Cards */}
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
          <p className="font-bold text-lg">How do you want to approach hiring & agents?</p>
        </div>
        <div className="grid gap-3">
          {[
            { value: 'diy' as const, label: 'I\'ll handle it myself', desc: 'Use templates, DIY research', color: 'primary' },
            { value: 'full-service' as const, label: 'I want service recommendations', desc: 'Curated platforms and agencies', color: 'accent' },
            { value: 'explain' as const, label: 'Explain the decisions first', desc: 'Help me understand priorities', color: 'warning' }
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => setSelectedMode(option.value)}
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
        className="w-full gap-2 bg-gradient-warning hover:opacity-90 text-warning-foreground font-bold text-lg h-14 rounded-xl shadow-lg transition-all"
      >
        Continue
        <ChevronRight className="h-5 w-5" />
      </Button>
    </div>
  );
};
