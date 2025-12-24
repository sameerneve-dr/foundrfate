import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  ArrowRight,
  Check,
  ChevronDown,
  ChevronUp,
  User,
  Building2,
  Clock,
  DollarSign
} from "lucide-react";
import { useDecisionLedger, type RegistrationChecklist as ChecklistType } from "@/contexts/DecisionLedgerContext";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface RegistrationChecklistProps {
  onComplete: () => void;
}

type ChecklistKey = keyof ChecklistType;

interface ChecklistItem {
  key: ChecklistKey;
  label: string;
  desc: string;
  timeEstimate: string;
  costEstimate: string;
}

export const RegistrationChecklist = ({ onComplete }: RegistrationChecklistProps) => {
  const { ledger, updateRegistrationChecklist, updateLedger } = useDecisionLedger();
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const checklist = ledger.registrationChecklist;
  const path = ledger.registrationPath || 'hybrid';
  const isDelawareCCorp = ledger.entityType === 'delaware-c-corp';

  // Customize doer based on path
  const getDoer = (key: ChecklistKey): 'you' | 'service' => {
    if (path === 'diy-checklist') return 'you';
    if (path === 'service-checklist') {
      if (key === 'getEIN' || key === 'openBank') return 'you'; // Always DIY
      return 'service';
    }
    // Hybrid - use stored value
    return checklist[key].doer;
  };

  const items: ChecklistItem[] = isDelawareCCorp ? [
    { key: 'chooseName', label: 'Choose company name', desc: 'Search Delaware Division of Corporations for availability', timeEstimate: '30 min', costEstimate: 'Free' },
    { key: 'fileCertificate', label: 'File Certificate of Incorporation', desc: 'Submit to Delaware Secretary of State', timeEstimate: '1–3 days', costEstimate: '$89–$189' },
    { key: 'adoptBylaws', label: 'Adopt bylaws & appoint officers', desc: 'Corporate governance documents', timeEstimate: '1–2 hours', costEstimate: 'Free–$500' },
    { key: 'getEIN', label: 'Get EIN from IRS', desc: 'Apply online at irs.gov (free, instant)', timeEstimate: '15 min', costEstimate: 'Free' },
    { key: 'openBank', label: 'Open business bank account', desc: 'Mercury, Brex, or traditional bank', timeEstimate: '1–7 days', costEstimate: 'Free' },
    { key: 'issueShares', label: 'Issue founder stock + 83(b)', desc: 'Critical: file 83(b) within 30 days', timeEstimate: '1–2 hours', costEstimate: 'Free–$200' },
    { key: 'ipAssignment', label: 'IP assignment agreement', desc: 'Transfer all pre-incorporation IP to company', timeEstimate: '1 hour', costEstimate: 'Free–$500' }
  ] : [
    { key: 'chooseName', label: 'Choose company name', desc: 'Search your state for availability', timeEstimate: '30 min', costEstimate: 'Free' },
    { key: 'fileCertificate', label: 'File Articles of Organization', desc: 'Submit to your state Secretary of State', timeEstimate: '1–5 days', costEstimate: '$50–$500' },
    { key: 'adoptBylaws', label: 'Create operating agreement', desc: 'Required by most banks, outlines member rights', timeEstimate: '1–2 hours', costEstimate: 'Free–$300' },
    { key: 'getEIN', label: 'Get EIN from IRS', desc: 'Apply online at irs.gov (free, instant)', timeEstimate: '15 min', costEstimate: 'Free' },
    { key: 'openBank', label: 'Open business bank account', desc: 'Mercury, Brex, or traditional bank', timeEstimate: '1–7 days', costEstimate: 'Free' },
    { key: 'issueShares', label: 'Document member interests', desc: 'Record ownership percentages', timeEstimate: '30 min', costEstimate: 'Free' },
    { key: 'ipAssignment', label: 'IP assignment (if applicable)', desc: 'Transfer any pre-existing IP to company', timeEstimate: '1 hour', costEstimate: 'Free–$300' }
  ];

  const completedCount = items.filter(item => checklist[item.key].done).length;
  const percentage = Math.round((completedCount / items.length) * 100);

  const toggleDoer = (key: ChecklistKey) => {
    const currentDoer = checklist[key].doer;
    const newDoer = currentDoer === 'you' ? 'service' : 'you';
    updateLedger({
      registrationChecklist: {
        ...checklist,
        [key]: { ...checklist[key], doer: newDoer }
      }
    });
  };

  const explainers: Record<ChecklistKey, string> = {
    chooseName: isDelawareCCorp 
      ? 'Go to icis.corp.delaware.gov and search. Your name must include "Inc.", "Corp.", or "Corporation". Avoid names too similar to existing companies.'
      : 'Check your state\'s business entity database. Most states require "LLC" at the end. Avoid names too similar to existing businesses.',
    fileCertificate: isDelawareCCorp
      ? 'Use Delaware\'s online portal at corp.delaware.gov. Standard takes 24 hours; same-day is $100 extra. You\'ll need a registered agent.'
      : 'Most states offer online filing. Processing times vary from instant to 2 weeks depending on state.',
    adoptBylaws: isDelawareCCorp
      ? 'Use standard templates from Clerky or Stripe Atlas. Covers board meetings, officer roles, and decision-making. Solo founders can start simple.'
      : 'An operating agreement isn\'t always legally required but banks will ask for it. Free templates available online.',
    getEIN: 'Apply at irs.gov/businesses. It\'s free and instant during IRS hours (7am–10pm ET Mon-Fri). You\'ll need your Certificate of Incorporation first.',
    openBank: 'Mercury and Brex are startup-friendly and often approve in 24–48 hours. Bring your Certificate, EIN, and ID. Traditional banks take longer.',
    issueShares: isDelawareCCorp
      ? 'CRITICAL: File your 83(b) election within 30 days of receiving stock to avoid massive tax bills later. Send by certified mail to IRS.'
      : 'Document who owns what percentage. This becomes important if you ever have disagreements or want to bring in investors.',
    ipAssignment: 'Any code, designs, or IP created before incorporation belongs to you personally. Sign an IP assignment to transfer it to the company.'
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold">Your Registration Plan</h2>
        <p className="text-muted-foreground mt-2">
          Personalized for {isDelawareCCorp ? 'Delaware C-Corp' : ledger.entityType === 'llc' ? 'LLC' : 'your entity'} • {path === 'diy-checklist' ? 'DIY' : path === 'service-checklist' ? 'Service-based' : 'Hybrid'} path
        </p>
      </div>

      {/* Progress */}
      <div className="border-2 border-border p-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="font-bold">Registration Progress</span>
          <span className="font-mono">{percentage}%</span>
        </div>
        <div className="h-2 bg-secondary rounded-full overflow-hidden">
          <div 
            className="h-full bg-foreground transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground">{completedCount} of {items.length} steps complete</p>
      </div>

      {/* Checklist */}
      <div className="space-y-2">
        {items.map((item, index) => {
          const isDone = checklist[item.key].done;
          const doer = getDoer(item.key);
          const isExpanded = expandedItem === item.key;

          return (
            <Collapsible key={item.key} open={isExpanded} onOpenChange={(open) => setExpandedItem(open ? item.key : null)}>
              <div className={`border-2 transition-colors ${isDone ? 'border-foreground/30 bg-muted/50' : 'border-border'}`}>
                <div className="flex items-start gap-3 p-4">
                  <Checkbox
                    id={item.key}
                    checked={isDone}
                    onCheckedChange={(checked) => updateRegistrationChecklist(item.key, checked as boolean)}
                    className="mt-1"
                  />
                  <div className="flex-1 min-w-0">
                    <label htmlFor={item.key} className={`font-medium cursor-pointer ${isDone ? 'line-through text-muted-foreground' : ''}`}>
                      {item.label}
                    </label>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs">
                      <span className="flex items-center gap-1">
                        {doer === 'you' ? <User className="h-3 w-3" /> : <Building2 className="h-3 w-3" />}
                        {doer === 'you' ? 'You' : 'Service'}
                      </span>
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {item.timeEstimate}
                      </span>
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <DollarSign className="h-3 w-3" />
                        {item.costEstimate}
                      </span>
                    </div>
                  </div>
                  <CollapsibleTrigger asChild>
                    <button className="p-2 hover:bg-secondary rounded">
                      {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>
                  </CollapsibleTrigger>
                </div>
                <CollapsibleContent>
                  <div className="px-4 pb-4 pt-0 space-y-3">
                    <div className="bg-muted p-3 text-sm">
                      <p>{explainers[item.key]}</p>
                    </div>
                    {path === 'hybrid' && item.key !== 'getEIN' && item.key !== 'openBank' && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => toggleDoer(item.key)}
                      >
                        Switch to {doer === 'you' ? 'Service' : 'DIY'}
                      </Button>
                    )}
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>
          );
        })}
      </div>

      <Button 
        onClick={onComplete}
        size="lg"
        className="w-full gap-2"
      >
        {percentage === 100 ? 'Complete Setup' : 'Save & Continue'}
        <ArrowRight className="h-5 w-5" />
      </Button>
    </div>
  );
};
