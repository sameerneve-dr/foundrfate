import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Clock, 
  DollarSign, 
  MapPin, 
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Info
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
      { tier: 'Basic', cost: '$300–$500', includes: 'Filing + registered agent' },
      { tier: 'Standard', cost: '$500–$1,000', includes: 'Filing + agent + legal docs' },
      { tier: 'Premium', cost: '$1,500–$3,000', includes: 'Full-service + lawyer review' }
    ]
  } : {
    government: [
      { item: 'State filing fee', cost: '$50–$500', required: true },
      { item: 'Annual report fee', cost: '$0–$300', required: true },
      { item: 'Publication (some states)', cost: '$50–$2,000', required: false }
    ],
    services: [
      { tier: 'Basic', cost: '$100–$300', includes: 'Filing only' },
      { tier: 'Standard', cost: '$300–$600', includes: 'Filing + operating agreement' },
      { tier: 'Premium', cost: '$800–$1,500', includes: 'Full-service + legal docs' }
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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold">Registration Details</h2>
        <p className="text-muted-foreground mt-2">
          {isDelawareCCorp ? 'Delaware C-Corp' : ledger.entityType === 'llc' ? 'LLC' : 'Your entity'} breakdown
        </p>
      </div>

      {/* Time Section */}
      <Collapsible open={expandedSection === 'time'} onOpenChange={(open) => setExpandedSection(open ? 'time' : null)}>
        <CollapsibleTrigger asChild>
          <button className="w-full flex items-center gap-4 p-4 border-2 border-border hover:bg-secondary transition-colors text-left">
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center shrink-0">
              <Clock className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="font-bold">How long does it take?</p>
              <p className="text-sm text-muted-foreground">Total: 3–10 business days realistic</p>
            </div>
            {expandedSection === 'time' ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="border-2 border-t-0 border-border p-4 space-y-4">
            {/* Timeline Bar */}
            <div className="space-y-3">
              {timelineSteps.map((step, i) => (
                <div key={step.label} className="flex items-center gap-4">
                  <div className="w-20 shrink-0">
                    <span className="text-sm font-mono text-muted-foreground">{step.time}</span>
                  </div>
                  <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-foreground transition-all"
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
              <Button size="sm" onClick={() => setExpandedSection('cost')}>
                Okay, continue
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowTimeExplainer(!showTimeExplainer)}
              >
                <Info className="h-3 w-3 mr-1" />
                Why this long?
              </Button>
            </div>

            {showTimeExplainer && (
              <div className="bg-muted p-3 text-sm space-y-2">
                <p><strong>State processing:</strong> Government offices have queues. Expediting costs extra.</p>
                <p><strong>EIN:</strong> Instant online, but only during IRS hours (7am–10pm ET).</p>
                <p><strong>Bank:</strong> KYC checks take time. Online banks are faster than traditional.</p>
              </div>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Cost Section */}
      <Collapsible open={expandedSection === 'cost'} onOpenChange={(open) => setExpandedSection(open ? 'cost' : null)}>
        <CollapsibleTrigger asChild>
          <button className="w-full flex items-center gap-4 p-4 border-2 border-border hover:bg-secondary transition-colors text-left">
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center shrink-0">
              <DollarSign className="h-5 w-5" />
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
          <div className="border-2 border-t-0 border-border p-4 space-y-4">
            <div>
              <p className="font-bold text-sm mb-2">Government Fees (Required)</p>
              <div className="space-y-2">
                {costBreakdown.government.map((fee) => (
                  <div key={fee.item} className="flex justify-between text-sm">
                    <span className={fee.required ? '' : 'text-muted-foreground'}>{fee.item}</span>
                    <span className="font-mono">{fee.cost}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="font-bold text-sm mb-2">Service Tiers (Optional)</p>
              <div className="grid gap-2">
                {costBreakdown.services.map((tier) => (
                  <div key={tier.tier} className="border border-border p-3">
                    <div className="flex justify-between">
                      <span className="font-medium">{tier.tier}</span>
                      <span className="font-mono">{tier.cost}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{tier.includes}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-2 border-t border-border">
              <Button 
                size="sm" 
                variant={budgetFit === 'fits' ? 'default' : 'outline'}
                onClick={() => { setBudgetFit('fits'); setExpandedSection('location'); }}
              >
                Fits my budget
              </Button>
              <Button 
                size="sm" 
                variant={budgetFit === 'cheaper' ? 'default' : 'outline'}
                onClick={() => { setBudgetFit('cheaper'); setExpandedSection('location'); }}
              >
                Show cheaper
              </Button>
              <Button 
                size="sm" 
                variant={budgetFit === 'done-for-me' ? 'default' : 'outline'}
                onClick={() => { setBudgetFit('done-for-me'); setExpandedSection('location'); }}
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
          <button className="w-full flex items-center gap-4 p-4 border-2 border-border hover:bg-secondary transition-colors text-left">
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center shrink-0">
              <MapPin className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="font-bold">Where exactly do I register?</p>
              <p className="text-sm text-muted-foreground">Step-by-step locations</p>
            </div>
            {expandedSection === 'location' ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="border-2 border-t-0 border-border p-4 space-y-4">
            <div className="space-y-3">
              {locationSteps.map((step, i) => (
                <div key={step.where} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-foreground text-background flex items-center justify-center shrink-0 text-xs font-bold">
                    {i + 1}
                  </div>
                  <div>
                    <p className="font-medium">{step.where}</p>
                    <p className="text-sm text-muted-foreground">{step.what}</p>
                    <p className="text-xs text-muted-foreground/70">{step.link}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2 pt-2 border-t border-border">
              <Button size="sm" onClick={onContinue}>
                Continue to services
              </Button>
              <Button variant="outline" size="sm" onClick={onContinue}>
                Skip details
              </Button>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      <Button 
        onClick={onContinue}
        size="lg"
        className="w-full gap-2"
      >
        View Services & Create Checklist
        <ChevronRight className="h-5 w-5" />
      </Button>
    </div>
  );
};
