import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Wrench, 
  Scale, 
  Receipt,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Check
} from "lucide-react";
import { useDecisionLedger, type RegistrationPath } from "@/contexts/DecisionLedgerContext";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface RegistrationServicesProps {
  onContinue: () => void;
}

export const RegistrationServices = ({ onContinue }: RegistrationServicesProps) => {
  const { ledger, updateLedger } = useDecisionLedger();
  const [expandedSection, setExpandedSection] = useState<string | null>('platforms');
  const [selectedPath, setSelectedPath] = useState<RegistrationPath>(ledger.registrationPath);

  const platforms = [
    {
      name: 'Stripe Atlas',
      price: '$500',
      bestFor: 'Tech startups wanting bank + Stripe integration',
      includes: ['Delaware C-Corp filing', 'EIN', 'Banking (Mercury/SVB)', 'Stripe account', 'Cap table setup']
    },
    {
      name: 'Clerky',
      price: '$799+',
      bestFor: 'YC-style startups needing proper legal docs',
      includes: ['Delaware C-Corp', 'All legal documents', 'Founder agreements', '83(b) election help']
    },
    {
      name: 'Firstbase',
      price: '$399+',
      bestFor: 'International founders, fast setup',
      includes: ['Any US entity type', 'EIN', 'Registered agent', 'Virtual mailbox option']
    },
    {
      name: 'ZenBusiness',
      price: '$0–$299',
      bestFor: 'LLCs and budget-conscious founders',
      includes: ['Any entity type', 'Registered agent', 'Operating agreement', 'Annual report reminders']
    }
  ];

  const handlePathSelect = (path: RegistrationPath) => {
    setSelectedPath(path);
    updateLedger({ registrationPath: path });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold">Done-For-You Services</h2>
        <p className="text-muted-foreground mt-2">Options to simplify registration</p>
      </div>

      {/* Platforms Section */}
      <Collapsible open={expandedSection === 'platforms'} onOpenChange={(open) => setExpandedSection(open ? 'platforms' : null)}>
        <CollapsibleTrigger asChild>
          <button className="w-full flex items-center gap-4 p-4 border-2 border-border hover:bg-secondary transition-colors text-left">
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center shrink-0">
              <Wrench className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="font-bold">Startup Incorporation Platforms</p>
              <p className="text-sm text-muted-foreground">All-in-one services for founders</p>
            </div>
            {expandedSection === 'platforms' ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="border-2 border-t-0 border-border p-4 space-y-3">
            {platforms.map((platform) => (
              <div key={platform.name} className="border border-border p-4 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold">{platform.name}</p>
                    <p className="text-sm text-muted-foreground">{platform.bestFor}</p>
                  </div>
                  <span className="font-mono text-lg">{platform.price}</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {platform.includes.map((item) => (
                    <span key={item} className="text-xs bg-secondary px-2 py-0.5 rounded">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
            <p className="text-xs text-muted-foreground pt-2">
              Prices and features may change. Check each platform for current offerings.
            </p>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Legal Help Section */}
      <Collapsible open={expandedSection === 'legal'} onOpenChange={(open) => setExpandedSection(open ? 'legal' : null)}>
        <CollapsibleTrigger asChild>
          <button className="w-full flex items-center gap-4 p-4 border-2 border-border hover:bg-secondary transition-colors text-left">
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center shrink-0">
              <Scale className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="font-bold">Legal Help (Optional)</p>
              <p className="text-sm text-muted-foreground">When you need a lawyer, when you don't</p>
            </div>
            {expandedSection === 'legal' ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="border-2 border-t-0 border-border p-4 space-y-4">
            <div className="space-y-2">
              <p className="font-bold text-sm">When you need a lawyer:</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Multiple cofounders with complex equity splits</li>
                <li>• Taking investor money immediately</li>
                <li>• Complex IP situations (patents, licensing)</li>
                <li>• Regulated industries (healthcare, finance)</li>
              </ul>
            </div>
            <div className="space-y-2">
              <p className="font-bold text-sm">When you probably don't:</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Solo founder, standard equity</li>
                <li>• Bootstrapping initially</li>
                <li>• Simple B2B/SaaS business</li>
                <li>• Using standard templates (Clerky, SAFE notes)</li>
              </ul>
            </div>
            <div className="border-t border-border pt-3">
              <p className="text-sm"><strong>Typical costs:</strong> $200–$500/hr or $1,000–$5,000 fixed fee for incorporation</p>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Accounting Section */}
      <Collapsible open={expandedSection === 'accounting'} onOpenChange={(open) => setExpandedSection(open ? 'accounting' : null)}>
        <CollapsibleTrigger asChild>
          <button className="w-full flex items-center gap-4 p-4 border-2 border-border hover:bg-secondary transition-colors text-left">
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center shrink-0">
              <Receipt className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="font-bold">Accounting & Compliance</p>
              <p className="text-sm text-muted-foreground">When to set it up, when it can wait</p>
            </div>
            {expandedSection === 'accounting' ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="border-2 border-t-0 border-border p-4 space-y-4">
            <div className="space-y-2">
              <p className="font-bold text-sm">Set up now:</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Business bank account (required)</li>
                <li>• Simple bookkeeping tool (Wave is free)</li>
                <li>• Separate personal/business expenses from day 1</li>
              </ul>
            </div>
            <div className="space-y-2">
              <p className="font-bold text-sm">Can wait until you have revenue:</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Professional bookkeeper/CPA</li>
                <li>• Advanced accounting software</li>
                <li>• Payroll setup (until you pay yourself/employees)</li>
              </ul>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Path Selection */}
      <div className="border-2 border-border p-6 bg-muted space-y-4">
        <p className="font-bold text-lg">Do you want FoundrFate to recommend a setup path?</p>
        <div className="grid gap-3">
          {[
            { value: 'diy-checklist' as const, label: 'DIY checklist', desc: 'Step-by-step guide, you do everything', icon: <Check className="h-4 w-4" /> },
            { value: 'service-checklist' as const, label: 'Service-based checklist', desc: 'Use a platform for most steps', icon: <Wrench className="h-4 w-4" /> },
            { value: 'hybrid' as const, label: 'Hybrid (DIY + service)', desc: 'Mix of both approaches', icon: <Scale className="h-4 w-4" /> }
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => handlePathSelect(option.value)}
              className={`flex items-center gap-4 p-4 border-2 transition-all text-left
                ${selectedPath === option.value ? 'border-foreground bg-secondary' : 'border-border hover:bg-secondary/50'}`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0
                ${selectedPath === option.value ? 'bg-foreground text-background' : 'bg-secondary'}`}>
                {option.icon}
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
        onClick={onContinue}
        disabled={!selectedPath}
        size="lg"
        className="w-full gap-2"
      >
        Generate My Registration Plan
        <ChevronRight className="h-5 w-5" />
      </Button>
    </div>
  );
};
