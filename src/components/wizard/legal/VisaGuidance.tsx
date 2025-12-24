import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle2, 
  XCircle,
  AlertTriangle,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Lightbulb
} from "lucide-react";
import { useDecisionLedger, type VisaStatus } from "@/contexts/DecisionLedgerContext";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface VisaGuidanceProps {
  onContinue: () => void;
}

interface GuidanceItem {
  type: 'allowed' | 'restricted' | 'warning';
  text: string;
}

interface VisaGuidanceData {
  title: string;
  items: GuidanceItem[];
  nextSteps: string[];
  buttons: { label: string; action: string }[];
}

const getVisaGuidance = (visa: VisaStatus, hasCofounder: boolean): VisaGuidanceData => {
  switch (visa) {
    case 'us-citizen':
    case 'green-card':
      return {
        title: 'Full Operational Freedom',
        items: [
          { type: 'allowed', text: 'No restrictions on ownership or work' },
          { type: 'allowed', text: 'Can be CEO, employee, or any role' },
          { type: 'allowed', text: 'Can raise funding and sign contracts' },
          { type: 'allowed', text: 'Can hire employees and pay yourself' }
        ],
        nextSteps: [
          'Proceed directly to company registration',
          'No immigration-specific considerations needed'
        ],
        buttons: [
          { label: 'Continue to setup', action: 'continue' }
        ]
      };
    
    case 'f1-no-opt':
      return {
        title: 'Build Now, Work Later',
        items: [
          { type: 'allowed', text: 'Can incorporate a company' },
          { type: 'allowed', text: 'Can be a shareholder/equity holder' },
          { type: 'allowed', text: 'Can do unpaid research and planning' },
          { type: 'restricted', text: 'Cannot actively work for the company' },
          { type: 'restricted', text: 'Cannot receive salary or payments' },
          { type: 'warning', text: 'Revenue-generating work must wait for OPT' }
        ],
        nextSteps: hasCofounder ? [
          'Have a work-authorized cofounder handle operations',
          'Focus on product research and planning',
          'Apply for OPT before graduation',
          'Delay paid work until OPT is approved'
        ] : [
          'Build your MVP as "coursework" or research',
          'Apply for OPT before graduation',
          'Consider finding a work-authorized cofounder',
          'Delay revenue-generating activities'
        ],
        buttons: [
          { label: 'Show safe founder setup', action: 'safe-setup' },
          { label: 'Explain OPT impact', action: 'explain-opt' }
        ]
      };

    case 'f1-opt':
    case 'f1-stem-opt':
      return {
        title: 'Work-Authorized with Structure Requirements',
        items: [
          { type: 'allowed', text: 'Can work if startup aligns with your degree' },
          { type: 'allowed', text: 'Can be an employee of your company' },
          { type: 'warning', text: 'Need employer-employee relationship' },
          { type: 'warning', text: 'Must meet OPT reporting requirements' },
          { type: 'warning', text: visa === 'f1-stem-opt' ? 'STEM OPT requires formal training plan' : 'Track your work hours carefully' }
        ],
        nextSteps: [
          'Ensure startup work relates to your degree field',
          'Set up proper employer-employee structure',
          'Update SEVP Portal with employer information',
          visa === 'f1-stem-opt' ? 'Create I-983 training plan' : 'Document all work activities',
          'Consider H-1B lottery for long-term solution'
        ],
        buttons: [
          { label: 'Check if startup qualifies', action: 'check-qualify' },
          { label: 'Show OPT-safe structure', action: 'opt-structure' }
        ]
      };

    case 'h1b':
      return {
        title: 'Ownership Allowed, Work is Complex',
        items: [
          { type: 'allowed', text: 'Can own shares in a company' },
          { type: 'warning', text: 'Working for own company is complicated' },
          { type: 'warning', text: 'Need independent board structure' },
          { type: 'warning', text: 'Requires employer-employee relationship' },
          { type: 'restricted', text: 'May need H-1B amendment or transfer' }
        ],
        nextSteps: hasCofounder ? [
          'Consider passive ownership initially',
          'Have cofounder handle day-to-day operations',
          'Consult immigration attorney for H-1B options',
          'Explore O-1 visa as alternative'
        ] : [
          'Start as passive shareholder/advisor',
          'Get independent board members',
          'Work with immigration attorney on structure',
          'Consider O-1 visa for more flexibility'
        ],
        buttons: [
          { label: 'Show safe ownership structure', action: 'h1b-structure' },
          { label: 'Explain O-1 alternative', action: 'explain-o1' }
        ]
      };

    case 'o1':
      return {
        title: 'Founder-Friendly Visa',
        items: [
          { type: 'allowed', text: 'Can operate startup via agent/petitioner' },
          { type: 'allowed', text: 'Flexible structure for entrepreneurs' },
          { type: 'allowed', text: 'Can raise funding and scale' },
          { type: 'warning', text: 'Maintain "extraordinary ability" evidence' }
        ],
        nextSteps: [
          'Set up O-1 agent or petitioner structure',
          'Document all achievements and press',
          'Keep evidence of continued extraordinary ability',
          'Consider EB-1A for permanent residency'
        ],
        buttons: [
          { label: 'Show O-1 agent structure', action: 'o1-structure' },
          { label: 'Learn about EB-1A path', action: 'eb1a-path' }
        ]
      };

    case 'l1':
      return {
        title: 'Tied to Current Employer',
        items: [
          { type: 'allowed', text: 'Can own shares in a company' },
          { type: 'restricted', text: 'Cannot work for a new startup' },
          { type: 'restricted', text: 'L-1 is tied to your sponsoring employer' },
          { type: 'warning', text: 'Would need new visa to actively work' }
        ],
        nextSteps: [
          'Explore passive ownership options',
          'Consider O-1 or H-1B transfer',
          'Work with immigration attorney on options',
          hasCofounder ? 'Have cofounder handle operations' : 'Consider finding a work-authorized cofounder'
        ],
        buttons: [
          { label: 'Show passive ownership options', action: 'passive-options' },
          { label: 'Explore visa alternatives', action: 'visa-alternatives' }
        ]
      };

    default:
      return {
        title: 'Consult an Expert',
        items: [
          { type: 'warning', text: 'Your situation needs personalized review' },
          { type: 'warning', text: 'Immigration rules vary by visa type' },
          { type: 'allowed', text: 'Generally, ownership is often allowed' },
          { type: 'warning', text: 'Work authorization varies significantly' }
        ],
        nextSteps: [
          'Consult an immigration attorney',
          'Verify your specific visa restrictions',
          'Explore options before making commitments'
        ],
        buttons: [
          { label: 'Get help finding resources', action: 'find-resources' }
        ]
      };
  }
};

export const VisaGuidance = ({ onContinue }: VisaGuidanceProps) => {
  const { ledger } = useDecisionLedger();
  const [expandedSection, setExpandedSection] = useState<string | null>('items');
  
  const hasWorkAuthorizedCofounder = ledger.cofounders.some(cf => 
    cf.visaStatus === 'us-citizen' || 
    cf.visaStatus === 'green-card' ||
    cf.visaStatus === 'o1'
  );
  
  const guidance = getVisaGuidance(
    ledger.founderVisaStatus, 
    ledger.hasCofounder !== 'no' && hasWorkAuthorizedCofounder
  );

  const getItemIcon = (type: GuidanceItem['type']) => {
    switch (type) {
      case 'allowed': return <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />;
      case 'restricted': return <XCircle className="h-4 w-4 text-red-600 shrink-0" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-600 shrink-0" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold">{guidance.title}</h2>
        <p className="text-muted-foreground mt-2">What you can and cannot do</p>
      </div>

      {/* Status items */}
      <Collapsible open={expandedSection === 'items'} onOpenChange={(open) => setExpandedSection(open ? 'items' : null)}>
        <CollapsibleTrigger asChild>
          <button className="w-full flex items-center justify-between p-4 border-2 border-border hover:bg-secondary transition-colors text-left">
            <span className="font-bold">Your Status Summary</span>
            {expandedSection === 'items' ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="border-2 border-t-0 border-border p-4 space-y-2">
            {guidance.items.map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                {getItemIcon(item.type)}
                <span className="text-sm">{item.text}</span>
              </div>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Next steps */}
      <Collapsible open={expandedSection === 'steps'} onOpenChange={(open) => setExpandedSection(open ? 'steps' : null)}>
        <CollapsibleTrigger asChild>
          <button className="w-full flex items-center justify-between p-4 border-2 border-border hover:bg-secondary transition-colors text-left">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5" />
              <span className="font-bold">Suggested Next Steps</span>
            </div>
            {expandedSection === 'steps' ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="border-2 border-t-0 border-border p-4 space-y-2">
            {guidance.nextSteps.map((step, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-foreground text-background flex items-center justify-center shrink-0 text-xs font-bold">
                  {i + 1}
                </span>
                <span className="text-sm">{step}</span>
              </div>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Cofounder note */}
      {ledger.hasCofounder !== 'no' && hasWorkAuthorizedCofounder && (
        <div className="border-2 border-foreground/30 bg-muted p-4">
          <p className="text-sm">
            <strong>Good news:</strong> You have a work-authorized cofounder who can handle day-to-day operations while you navigate your visa situation.
          </p>
        </div>
      )}

      {/* Disclaimer */}
      <div className="border border-border p-3 bg-muted/50 text-xs text-muted-foreground">
        <strong>Disclaimer:</strong> This is general guidance, not legal advice. Consult an immigration attorney for your specific situation.
      </div>

      <Button onClick={onContinue} size="lg" className="w-full gap-2">
        View legal paths forward
        <ChevronRight className="h-5 w-5" />
      </Button>
    </div>
  );
};
