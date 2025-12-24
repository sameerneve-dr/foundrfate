import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Wrench, 
  Scale, 
  Receipt,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Check,
  Sparkles,
  Star,
  Zap
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
      color: 'primary' as const,
      popular: true,
      includes: ['Delaware C-Corp filing', 'EIN', 'Banking (Mercury/SVB)', 'Stripe account', 'Cap table setup']
    },
    {
      name: 'Clerky',
      price: '$799+',
      bestFor: 'YC-style startups needing proper legal docs',
      color: 'accent' as const,
      popular: false,
      includes: ['Delaware C-Corp', 'All legal documents', 'Founder agreements', '83(b) election help']
    },
    {
      name: 'Firstbase',
      price: '$399+',
      bestFor: 'International founders, fast setup',
      color: 'warning' as const,
      popular: false,
      includes: ['Any US entity type', 'EIN', 'Registered agent', 'Virtual mailbox option']
    },
    {
      name: 'ZenBusiness',
      price: '$0–$299',
      bestFor: 'LLCs and budget-conscious founders',
      color: 'success' as const,
      popular: false,
      includes: ['Any entity type', 'Registered agent', 'Operating agreement', 'Annual report reminders']
    }
  ];

  const colorClasses = {
    primary: 'border-primary/30 bg-primary/5',
    accent: 'border-accent/30 bg-accent/5',
    warning: 'border-warning/30 bg-warning/5',
    success: 'border-success/30 bg-success/5'
  };

  const pillClasses = {
    primary: 'bg-primary/10 text-primary',
    accent: 'bg-accent/10 text-accent',
    warning: 'bg-warning/10 text-warning',
    success: 'bg-success/10 text-success'
  };

  const handlePathSelect = (path: RegistrationPath) => {
    setSelectedPath(path);
    updateLedger({ registrationPath: path });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-lg">
          <Wrench className="h-7 w-7 text-primary-foreground" />
        </div>
        <div>
          <h2 className="text-2xl md:text-3xl font-display font-bold">Done-For-You Services</h2>
          <p className="text-muted-foreground">Options to simplify registration</p>
        </div>
      </div>

      {/* Platforms Section */}
      <Collapsible open={expandedSection === 'platforms'} onOpenChange={(open) => setExpandedSection(open ? 'platforms' : null)}>
        <CollapsibleTrigger asChild>
          <button className="w-full flex items-center gap-4 p-4 bg-card rounded-xl border border-border/50 shadow-sm hover:shadow-md transition-all text-left group">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <p className="font-bold">Startup Incorporation Platforms</p>
              <p className="text-sm text-muted-foreground">All-in-one services for founders</p>
            </div>
            {expandedSection === 'platforms' ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="mt-2 bg-muted/30 rounded-xl p-4 space-y-3">
            {platforms.map((platform) => (
              <div key={platform.name} className={`border-2 rounded-xl p-4 space-y-3 transition-all hover:shadow-md ${colorClasses[platform.color]}`}>
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-lg">{platform.name}</p>
                    {platform.popular && (
                      <span className="pill pill-primary text-xs">
                        <Star className="h-3 w-3" />
                        Popular
                      </span>
                    )}
                  </div>
                  <span className="font-mono text-xl font-bold">{platform.price}</span>
                </div>
                <p className="text-sm text-muted-foreground">{platform.bestFor}</p>
                <div className="flex flex-wrap gap-1.5">
                  {platform.includes.map((item) => (
                    <span key={item} className={`text-xs px-2.5 py-1 rounded-full font-medium ${pillClasses[platform.color]}`}>
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
          <button className="w-full flex items-center gap-4 p-4 bg-card rounded-xl border border-border/50 shadow-sm hover:shadow-md transition-all text-left group">
            <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Scale className="h-6 w-6 text-warning" />
            </div>
            <div className="flex-1">
              <p className="font-bold">Legal Help (Optional)</p>
              <p className="text-sm text-muted-foreground">When you need a lawyer, when you don't</p>
            </div>
            {expandedSection === 'legal' ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="mt-2 bg-muted/30 rounded-xl p-4 space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-destructive/5 border border-destructive/20 rounded-xl p-4 space-y-2">
                <p className="font-bold text-sm flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-destructive"></span>
                  When you need a lawyer
                </p>
                <ul className="text-sm text-muted-foreground space-y-1.5">
                  <li className="flex items-start gap-2"><span>•</span> Multiple cofounders with complex equity splits</li>
                  <li className="flex items-start gap-2"><span>•</span> Taking investor money immediately</li>
                  <li className="flex items-start gap-2"><span>•</span> Complex IP situations (patents, licensing)</li>
                  <li className="flex items-start gap-2"><span>•</span> Regulated industries (healthcare, finance)</li>
                </ul>
              </div>
              <div className="bg-success/5 border border-success/20 rounded-xl p-4 space-y-2">
                <p className="font-bold text-sm flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-success"></span>
                  When you probably don't
                </p>
                <ul className="text-sm text-muted-foreground space-y-1.5">
                  <li className="flex items-start gap-2"><span>•</span> Solo founder, standard equity</li>
                  <li className="flex items-start gap-2"><span>•</span> Bootstrapping initially</li>
                  <li className="flex items-start gap-2"><span>•</span> Simple B2B/SaaS business</li>
                  <li className="flex items-start gap-2"><span>•</span> Using standard templates (Clerky, SAFE notes)</li>
                </ul>
              </div>
            </div>
            <div className="bg-card border border-border/50 rounded-lg p-3">
              <p className="text-sm"><strong className="text-primary">Typical costs:</strong> $200–$500/hr or $1,000–$5,000 fixed fee for incorporation</p>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Accounting Section */}
      <Collapsible open={expandedSection === 'accounting'} onOpenChange={(open) => setExpandedSection(open ? 'accounting' : null)}>
        <CollapsibleTrigger asChild>
          <button className="w-full flex items-center gap-4 p-4 bg-card rounded-xl border border-border/50 shadow-sm hover:shadow-md transition-all text-left group">
            <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Receipt className="h-6 w-6 text-success" />
            </div>
            <div className="flex-1">
              <p className="font-bold">Accounting & Compliance</p>
              <p className="text-sm text-muted-foreground">When to set it up, when it can wait</p>
            </div>
            {expandedSection === 'accounting' ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="mt-2 bg-muted/30 rounded-xl p-4 space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-card border border-border/50 rounded-xl p-4 space-y-2">
                <p className="font-bold text-sm flex items-center gap-2">
                  <span className="pill pill-destructive text-xs">Now</span>
                  Set up now
                </p>
                <ul className="text-sm text-muted-foreground space-y-1.5">
                  <li className="flex items-start gap-2"><span>•</span> Business bank account (required)</li>
                  <li className="flex items-start gap-2"><span>•</span> Simple bookkeeping tool (Wave is free)</li>
                  <li className="flex items-start gap-2"><span>•</span> Separate personal/business expenses from day 1</li>
                </ul>
              </div>
              <div className="bg-card border border-border/50 rounded-xl p-4 space-y-2">
                <p className="font-bold text-sm flex items-center gap-2">
                  <span className="pill pill-success text-xs">Later</span>
                  Can wait until you have revenue
                </p>
                <ul className="text-sm text-muted-foreground space-y-1.5">
                  <li className="flex items-start gap-2"><span>•</span> Professional bookkeeper/CPA</li>
                  <li className="flex items-start gap-2"><span>•</span> Advanced accounting software</li>
                  <li className="flex items-start gap-2"><span>•</span> Payroll setup (until you pay yourself/employees)</li>
                </ul>
              </div>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Path Selection */}
      <div className="bg-card rounded-2xl border border-border/50 shadow-lg p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <p className="font-bold text-lg">Choose your registration path</p>
        </div>
        <div className="grid gap-3">
          {[
            { value: 'diy-checklist' as const, label: 'DIY checklist', desc: 'Step-by-step guide, you do everything', icon: <Check className="h-5 w-5" />, color: 'success' },
            { value: 'service-checklist' as const, label: 'Service-based checklist', desc: 'Use a platform for most steps', icon: <Wrench className="h-5 w-5" />, color: 'primary' },
            { value: 'hybrid' as const, label: 'Hybrid (DIY + service)', desc: 'Mix of both approaches', icon: <Scale className="h-5 w-5" />, color: 'warning' }
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => handlePathSelect(option.value)}
              className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left group
                ${selectedPath === option.value 
                  ? 'border-primary bg-primary/5 shadow-md' 
                  : 'border-border hover:border-primary/50 hover:bg-muted/50'}`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-all
                ${selectedPath === option.value ? 'bg-gradient-primary text-primary-foreground' : 'bg-muted group-hover:scale-105'}`}>
                {option.icon}
              </div>
              <div className="flex-1">
                <p className="font-bold">{option.label}</p>
                <p className="text-sm text-muted-foreground">{option.desc}</p>
              </div>
              <ChevronRight className={`h-5 w-5 transition-transform ${selectedPath === option.value ? 'text-primary translate-x-1' : 'text-muted-foreground'}`} />
            </button>
          ))}
        </div>
      </div>

      <Button 
        onClick={onContinue}
        disabled={!selectedPath}
        size="lg"
        className="w-full gap-2 bg-gradient-primary hover:opacity-90 text-primary-foreground font-bold text-lg h-14 rounded-xl shadow-lg btn-glow-primary transition-all"
      >
        <Sparkles className="h-5 w-5" />
        Generate My Registration Plan
        <ChevronRight className="h-5 w-5" />
      </Button>
    </div>
  );
};
