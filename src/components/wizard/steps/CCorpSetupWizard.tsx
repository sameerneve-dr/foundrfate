import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Building2, 
  FileText, 
  Users, 
  CreditCard,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  ArrowRight,
  Check
} from "lucide-react";
import { useDecisionLedger } from "@/contexts/DecisionLedgerContext";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface CCorpSetupWizardProps {
  onComplete: () => void;
}

export const CCorpSetupWizard = ({ onComplete }: CCorpSetupWizardProps) => {
  const { ledger, updateCCorpSetup } = useDecisionLedger();
  const [expandedSection, setExpandedSection] = useState<string | null>('pre');
  const [showDIYGuide, setShowDIYGuide] = useState<string | null>(null);

  const setup = ledger.cCorpSetup;

  const sections = [
    {
      id: 'pre',
      title: 'Step A: Pre-Incorporation',
      icon: <FileText className="h-5 w-5" />,
      items: [
        { key: 'nameCheck', label: 'Check name availability', desc: 'Search Delaware Division of Corporations' },
        { key: 'registeredAgent', label: 'Choose registered agent', desc: 'Required for Delaware—can use a service' },
        { key: 'founderDetails', label: 'Gather founder details', desc: 'Names, addresses, ownership %' }
      ],
      category: 'preIncorporation' as const
    },
    {
      id: 'inc',
      title: 'Step B: Incorporation',
      icon: <Building2 className="h-5 w-5" />,
      items: [
        { key: 'certificate', label: 'File Certificate of Incorporation', desc: 'With Delaware Secretary of State' },
        { key: 'bylaws', label: 'Adopt bylaws', desc: 'Corporate governance rules' },
        { key: 'directors', label: 'Appoint directors & officers', desc: 'CEO, Secretary, Board' }
      ],
      category: 'incorporation' as const
    },
    {
      id: 'equity',
      title: 'Step C: Founder Equity & IP',
      icon: <Users className="h-5 w-5" />,
      items: [
        { key: 'ipAssignment', label: 'IP Assignment Agreement', desc: 'Transfer all IP to company' },
        { key: 'founderStock', label: 'Issue founder stock + vesting', desc: '4-year vesting, 1-year cliff standard' },
        { key: 'advisorPool', label: 'Set aside advisor pool (optional)', desc: 'Typically 1-2% of equity' }
      ],
      category: 'equity' as const
    },
    {
      id: 'ein',
      title: 'Step D: EIN & Banking',
      icon: <CreditCard className="h-5 w-5" />,
      items: [
        { key: 'ein', label: 'Get EIN from IRS', desc: 'Apply online at irs.gov—free & instant' },
        { key: 'bankAccount', label: 'Open business bank account', desc: 'Mercury, Brex, or traditional bank' }
      ],
      category: 'einBanking' as const
    }
  ];

  const getCompletionPercentage = () => {
    const allItems = sections.flatMap(s => s.items);
    const completed = allItems.filter(item => {
      const section = sections.find(s => s.items.includes(item));
      if (!section) return false;
      return setup[section.category][item.key as keyof typeof setup[typeof section.category]];
    });
    return Math.round((completed.length / allItems.length) * 100);
  };

  const isComplete = getCompletionPercentage() === 100;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold">Delaware C-Corp Setup</h2>
        <p className="text-muted-foreground mt-2">Step-by-step checklist to incorporate</p>
      </div>

      {/* Progress */}
      <div className="border-2 border-border p-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="font-bold">Setup Progress</span>
          <span className="font-mono">{getCompletionPercentage()}%</span>
        </div>
        <div className="h-2 bg-secondary rounded-full overflow-hidden">
          <div 
            className="h-full bg-foreground transition-all duration-300"
            style={{ width: `${getCompletionPercentage()}%` }}
          />
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-3">
        {sections.map((section) => {
          const sectionItems = section.items;
          const completedCount = sectionItems.filter(
            item => setup[section.category][item.key as keyof typeof setup[typeof section.category]]
          ).length;
          const isExpanded = expandedSection === section.id;

          return (
            <Collapsible 
              key={section.id} 
              open={isExpanded} 
              onOpenChange={(open) => setExpandedSection(open ? section.id : null)}
            >
              <CollapsibleTrigger asChild>
                <button className="w-full flex items-center gap-4 p-4 border-2 border-border hover:bg-secondary transition-colors text-left">
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center shrink-0">
                    {section.icon}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold">{section.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {completedCount}/{sectionItems.length} complete
                    </p>
                  </div>
                  {completedCount === sectionItems.length ? (
                    <div className="w-8 h-8 rounded-full bg-foreground flex items-center justify-center">
                      <Check className="h-4 w-4 text-background" />
                    </div>
                  ) : (
                    isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />
                  )}
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="border-2 border-t-0 border-border p-4 space-y-4">
                  {sectionItems.map((item) => (
                    <div key={item.key} className="flex items-start gap-3">
                      <Checkbox
                        id={item.key}
                        checked={setup[section.category][item.key as keyof typeof setup[typeof section.category]]}
                        onCheckedChange={(checked) => 
                          updateCCorpSetup(section.category, item.key, checked as boolean)
                        }
                        className="mt-1"
                      />
                      <label htmlFor={item.key} className="flex-1 cursor-pointer">
                        <p className="font-medium">{item.label}</p>
                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                      </label>
                    </div>
                  ))}
                  
                  <div className="flex gap-2 pt-2 border-t border-border">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setShowDIYGuide(showDIYGuide === section.id ? null : section.id)}
                    >
                      {showDIYGuide === section.id ? 'Hide guide' : 'DIY Guide'}
                    </Button>
                    <Button variant="outline" size="sm" className="gap-1">
                      <ExternalLink className="h-3 w-3" />
                      Use a service
                    </Button>
                  </div>

                  {showDIYGuide === section.id && (
                    <div className="bg-muted p-3 text-sm space-y-2">
                      {section.id === 'pre' && (
                        <>
                          <p><strong>Name Check:</strong> Go to icis.corp.delaware.gov and search</p>
                          <p><strong>Registered Agent:</strong> Northwest ($125/yr), Incfile, or CSC</p>
                          <p><strong>Founder Details:</strong> Full legal names, home addresses, SSN</p>
                        </>
                      )}
                      {section.id === 'inc' && (
                        <>
                          <p><strong>Certificate:</strong> File online at corp.delaware.gov ($89 + taxes)</p>
                          <p><strong>Bylaws:</strong> Use Clerky or Stripe Atlas templates</p>
                          <p><strong>Directors:</strong> Solo founders can be sole director initially</p>
                        </>
                      )}
                      {section.id === 'equity' && (
                        <>
                          <p><strong>IP Assignment:</strong> Critical! All pre-incorporation work belongs to founders</p>
                          <p><strong>83(b) Election:</strong> File within 30 days of stock grant to avoid tax nightmare</p>
                          <p><strong>Standard vesting:</strong> 4 years, 1-year cliff, monthly thereafter</p>
                        </>
                      )}
                      {section.id === 'ein' && (
                        <>
                          <p><strong>EIN:</strong> Apply at irs.gov/businesses/small-businesses - instant, free</p>
                          <p><strong>Bank recommendations:</strong> Mercury (startup-friendly), Brex, or SVB</p>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </CollapsibleContent>
            </Collapsible>
          );
        })}
      </div>

      <Button 
        onClick={onComplete} 
        size="lg" 
        className="w-full gap-2"
      >
        {isComplete ? 'Continue to Timeline' : 'Save progress & continue'}
        <ArrowRight className="h-5 w-5" />
      </Button>
    </div>
  );
};
