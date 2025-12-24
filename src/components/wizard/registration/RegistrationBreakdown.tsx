import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Clock, 
  DollarSign, 
  MapPin, 
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Info,
  Sparkles
} from "lucide-react";
import { useDecisionLedger } from "@/contexts/DecisionLedgerContext";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface RegistrationBreakdownProps {
  onContinue: () => void;
}

export const RegistrationBreakdown = ({ onContinue }: RegistrationBreakdownProps) => {
  const { ledger } = useDecisionLedger();
  const [expandedSection, setExpandedSection] = useState<string | null>('time');
  const [showTimeExplainer, setShowTimeExplainer] = useState(false);
  const [budgetFit, setBudgetFit] = useState<'fits' | 'cheaper' | 'done-for-me' | null>(null);

  const isDelawareCCorp = ledger.entityType === 'delaware-c-corp';

  const timelineSteps = isDelawareCCorp ? [
    { label: 'State Filing', time: '1–3 days', note: 'Same-day with $100 expedite' },
    { label: 'EIN Application', time: 'Same day', note: 'Free, online via IRS' },
    { label: 'Bank Account', time: '1–7 days', note: 'Mercury/Brex approve faster' },
    { label: 'Legal Docs', time: '1–3 days', note: 'Use templates or lawyer' }
  ] : [
    { label: 'State Filing', time: '1–5 days', note: 'Varies by state' },
    { label: 'EIN Application', time: 'Same day', note: 'Free, online via IRS' },
    { label: 'Bank Account', time: '1–7 days', note: 'Mercury/Brex approve faster' },
    { label: 'Operating Agreement', time: '1–2 days', note: 'Required for most banks' }
  ];

  const costBreakdown = isDelawareCCorp ? {
    government: [
      { item: 'Delaware filing fee', cost: '$89–$189', required: true },
      { item: 'Franchise tax (annual)', cost: '$225 minimum', required: true },
      { item: 'Expedited processing', cost: '$100–$1,000', required: false }
    ],
    services: [
      { tier: 'Basic', cost: '$300–$500', includes: 'Filing + registered agent', color: 'success' },
      { tier: 'Standard', cost: '$500–$1,000', includes: 'Filing + agent + legal docs', color: 'warning' },
      { tier: 'Premium', cost: '$1,500–$3,000', includes: 'Full-service + lawyer review', color: 'primary' }
    ]
  } : {
    government: [
      { item: 'State filing fee', cost: '$50–$500', required: true },
      { item: 'Annual report fee', cost: '$0–$300', required: true },
      { item: 'Publication (some states)', cost: '$50–$2,000', required: false }
    ],
    services: [
      { tier: 'Basic', cost: '$100–$300', includes: 'Filing only', color: 'success' },
      { tier: 'Standard', cost: '$300–$600', includes: 'Filing + operating agreement', color: 'warning' },
      { tier: 'Premium', cost: '$800–$1,500', includes: 'Full-service + legal docs', color: 'primary' }
    ]
  };

  const locationSteps = isDelawareCCorp ? [
    { where: 'Delaware Division of Corporations', what: 'File Certificate of Incorporation', link: 'corp.delaware.gov' },
    { where: 'IRS', what: 'Apply for EIN (free)', link: 'irs.gov/businesses' },
    { where: 'Your Bank', what: 'Open business account', link: 'Mercury, Brex, or local bank' },
    { where: 'Accounting Tool', what: 'Track finances (recommended)', link: 'QuickBooks, Wave, Xero' }
  ] : [
    { where: 'Your State Secretary of State', what: 'File Articles of Organization', link: 'Check your state website' },
    { where: 'IRS', what: 'Apply for EIN (free)', link: 'irs.gov/businesses' },
    { where: 'Your Bank', what: 'Open business account', link: 'Mercury, Brex, or local bank' },
    { where: 'Accounting Tool', what: 'Track finances (recommended)', link: 'QuickBooks, Wave, Xero' }
  ];

  const tierColors = {
    success: 'bg-success/10 border-success/30 hover:bg-success/20',
    warning: 'bg-warning/10 border-warning/30 hover:bg-warning/20',
    primary: 'bg-primary/10 border-primary/30 hover:bg-primary/20'
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-accent flex items-center justify-center shadow-lg">
          <Sparkles className="h-7 w-7 text-accent-foreground" />
        </div>
        <div>
          <h2 className="text-2xl md:text-3xl font-display font-bold">Registration Details</h2>
          <p className="text-muted-foreground">
            {isDelawareCCorp ? 'Delaware C-Corp' : ledger.entityType === 'llc' ? 'LLC' : 'Your entity'} breakdown
          </p>
        </div>
      </div>

      {/* Time Section */}
      <Collapsible open={expandedSection === 'time'} onOpenChange={(open) => setExpandedSection(open ? 'time' : null)}>
        <CollapsibleTrigger asChild>
          <button className="w-full flex items-center gap-4 p-4 bg-card rounded-xl border border-border/50 shadow-sm hover:shadow-md transition-all text-left group">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Clock className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <p className="font-bold">How long does it take?</p>
              <p className="text-sm text-muted-foreground">Total: 3–10 business days realistic</p>
            </div>
            {expandedSection === 'time' ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="mt-2 bg-muted/30 rounded-xl p-4 space-y-4">
            {/* Timeline Bar */}
            <div className="space-y-3">
              {timelineSteps.map((step, i) => (
                <div key={step.label} className="flex items-center gap-4">
                  <div className="w-20 shrink-0">
                    <span className="text-sm font-mono text-primary font-bold">{step.time}</span>
                  </div>
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full progress-gradient transition-all"
                      style={{ width: `${((i + 1) / timelineSteps.length) * 100}%` }}
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{step.label}</p>
                    <p className="text-xs text-muted-foreground">{step.note}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex gap-2 pt-2 border-t border-border">
              <Button size="sm" onClick={() => setExpandedSection('cost')} className="rounded-lg">
                Okay, continue
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowTimeExplainer(!showTimeExplainer)}
                className="rounded-lg"
              >
                <Info className="h-3 w-3 mr-1" />
                Why this long?
              </Button>
            </div>

            {showTimeExplainer && (
              <div className="bg-card rounded-lg p-4 text-sm space-y-2 border border-border/50">
                <p><strong className="text-primary">State processing:</strong> Government offices have queues. Expediting costs extra.</p>
                <p><strong className="text-primary">EIN:</strong> Instant online, but only during IRS hours (7am–10pm ET).</p>
                <p><strong className="text-primary">Bank:</strong> KYC checks take time. Online banks are faster than traditional.</p>
              </div>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Cost Section */}
      <Collapsible open={expandedSection === 'cost'} onOpenChange={(open) => setExpandedSection(open ? 'cost' : null)}>
        <CollapsibleTrigger asChild>
          <button className="w-full flex items-center gap-4 p-4 bg-card rounded-xl border border-border/50 shadow-sm hover:shadow-md transition-all text-left group">
            <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <DollarSign className="h-6 w-6 text-success" />
            </div>
            <div className="flex-1">
              <p className="font-bold">How much does it cost?</p>
              <p className="text-sm text-muted-foreground">
                {isDelawareCCorp ? '$300–$3,000 depending on services' : '$100–$1,500 depending on state & services'}
              </p>
            </div>
            {expandedSection === 'cost' ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="mt-2 bg-muted/30 rounded-xl p-4 space-y-4">
            <div>
              <p className="font-bold text-sm mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-destructive"></span>
                Government Fees (Required)
              </p>
              <div className="space-y-2">
                {costBreakdown.government.map((fee) => (
                  <div key={fee.item} className="flex justify-between text-sm bg-card p-3 rounded-lg border border-border/50">
                    <span className={fee.required ? 'font-medium' : 'text-muted-foreground'}>{fee.item}</span>
                    <span className="font-mono font-bold">{fee.cost}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="font-bold text-sm mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-accent"></span>
                Service Tiers (Optional)
              </p>
              <div className="grid gap-2">
                {costBreakdown.services.map((tier) => (
                  <div key={tier.tier} className={`border rounded-xl p-4 transition-colors ${tierColors[tier.color as keyof typeof tierColors]}`}>
                    <div className="flex justify-between items-center">
                      <span className="font-bold">{tier.tier}</span>
                      <span className="font-mono text-lg font-bold">{tier.cost}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{tier.includes}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
              <Button 
                size="sm" 
                variant={budgetFit === 'fits' ? 'default' : 'outline'}
                onClick={() => { setBudgetFit('fits'); setExpandedSection('location'); }}
                className="rounded-lg"
              >
                Fits my budget
              </Button>
              <Button 
                size="sm" 
                variant={budgetFit === 'cheaper' ? 'default' : 'outline'}
                onClick={() => { setBudgetFit('cheaper'); setExpandedSection('location'); }}
                className="rounded-lg"
              >
                Show cheaper
              </Button>
              <Button 
                size="sm" 
                variant={budgetFit === 'done-for-me' ? 'default' : 'outline'}
                onClick={() => { setBudgetFit('done-for-me'); setExpandedSection('location'); }}
                className="rounded-lg"
              >
                Done-for-me
              </Button>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Location Section */}
      <Collapsible open={expandedSection === 'location'} onOpenChange={(open) => setExpandedSection(open ? 'location' : null)}>
        <CollapsibleTrigger asChild>
          <button className="w-full flex items-center gap-4 p-4 bg-card rounded-xl border border-border/50 shadow-sm hover:shadow-md transition-all text-left group">
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <MapPin className="h-6 w-6 text-accent" />
            </div>
            <div className="flex-1">
              <p className="font-bold">Where exactly do I register?</p>
              <p className="text-sm text-muted-foreground">Step-by-step locations</p>
            </div>
            {expandedSection === 'location' ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="mt-2 bg-muted/30 rounded-xl p-4 space-y-4">
            <div className="space-y-3">
              {locationSteps.map((step, i) => (
                <div key={step.where} className="flex items-start gap-4 bg-card p-4 rounded-xl border border-border/50">
                  <div className="w-8 h-8 rounded-lg bg-gradient-primary text-primary-foreground flex items-center justify-center shrink-0 text-sm font-bold">
                    {i + 1}
                  </div>
                  <div>
                    <p className="font-bold">{step.where}</p>
                    <p className="text-sm text-muted-foreground">{step.what}</p>
                    <p className="text-xs text-primary mt-1">{step.link}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2 pt-2 border-t border-border">
              <Button size="sm" onClick={onContinue} className="rounded-lg">
                Continue to services
              </Button>
              <Button variant="outline" size="sm" onClick={onContinue} className="rounded-lg">
                Skip details
              </Button>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      <Button 
        onClick={onContinue}
        size="lg"
        className="w-full gap-2 bg-gradient-primary hover:opacity-90 text-primary-foreground font-bold text-lg h-14 rounded-xl shadow-lg btn-glow-primary transition-all"
      >
        View Services & Create Checklist
        <ChevronRight className="h-5 w-5" />
      </Button>
    </div>
  );
};
