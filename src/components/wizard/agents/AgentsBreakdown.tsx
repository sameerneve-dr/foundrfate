import { Button } from "@/components/ui/button";
import { 
  ChevronRight, 
  UserCheck, 
  Users, 
  Briefcase, 
  Scale,
  CheckCircle2,
  AlertTriangle,
  DollarSign,
  Clock
} from "lucide-react";
import { useDecisionLedger } from "@/contexts/DecisionLedgerContext";

interface AgentsBreakdownProps {
  onContinue: () => void;
}

export const AgentsBreakdown = ({ onContinue }: AgentsBreakdownProps) => {
  const { ledger } = useDecisionLedger();
  
  const isDelawareCCorp = ledger.entityType === 'delaware-c-corp';
  const isVentureScale = ledger.fundraisingIntent === 'venture-scale';

  const sections = [
    {
      icon: <UserCheck className="h-6 w-6" />,
      title: 'Registered Agent',
      color: 'primary' as const,
      explanation: isDelawareCCorp 
        ? 'Delaware requires a registered agent with a physical address in the state. This person or service receives legal documents, tax notices, and official correspondence on behalf of your company.'
        : 'Many states require a registered agent. Check your state\'s requirements. The agent receives legal documents on your behalf.',
      pros: [
        'Professional handling of legal documents',
        'Privacy (uses their address, not yours)',
        'Never miss important deadlines',
        isDelawareCCorp ? 'Some offer mail forwarding' : 'Can be yourself if you have a state address'
      ],
      cons: [
        'Annual cost ($125–$300)',
        'Another vendor relationship to manage',
        'Some cheap services have poor support'
      ],
      recommendation: isDelawareCCorp 
        ? 'Use a reputable service like Harvard Business Services, Registered Agents Inc, or your formation service\'s agent.' 
        : 'You can be your own agent if you have a physical address in your state and can receive mail during business hours.'
    },
    {
      icon: <Briefcase className="h-6 w-6" />,
      title: 'First Hire Decision',
      color: 'success' as const,
      explanation: isVentureScale
        ? 'For venture-scale startups, your first hire is typically technical (engineer, CTO) or sales-focused. Consider equity compensation to preserve cash.'
        : 'For bootstrapped companies, hire when revenue supports it. Start with contractors or part-time help before committing to full-time.',
      pros: [
        'Dedicated help to move faster',
        'Can delegate tasks you\'re weak at',
        'Equity hires are highly motivated',
        'Builds culture early'
      ],
      cons: [
        'Payroll complexity and costs',
        'Management overhead',
        'Wrong hire can be costly',
        'Dilution if using equity'
      ],
      recommendation: isVentureScale
        ? 'Prioritize a technical co-founder or first engineer. Offer meaningful equity (1-5% for early hires). Use cash + equity hybrid when possible.'
        : 'Start with contractors for specific projects. Convert to full-time when you have consistent work and revenue to support payroll.'
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: 'Contractors vs Employees',
      color: 'accent' as const,
      explanation: 'Understanding the difference is crucial. Misclassifying employees as contractors can result in significant IRS penalties and back taxes.',
      pros: [
        'Contractors: No payroll taxes, flexible engagement',
        'Contractors: Easy to start and end relationships',
        'Employees: More control over work process',
        'Employees: Stronger IP protection'
      ],
      cons: [
        'Contractors: Less control, IP risks without good contracts',
        'Contractors: They can work for competitors',
        'Employees: Payroll, benefits, taxes complexity',
        'Employees: Harder to terminate, unemployment insurance'
      ],
      recommendation: 'Use contractors for defined projects with clear deliverables. Use employees for core functions that require ongoing control and IP protection.'
    },
    {
      icon: <Scale className="h-6 w-6" />,
      title: 'Legal Protection',
      color: 'warning' as const,
      explanation: 'Whether hiring contractors or employees, proper documentation protects your company\'s IP and limits liability.',
      pros: [
        'CIIA ensures work belongs to company',
        'NDAs protect confidential information',
        'Clear agreements prevent disputes',
        'Standard templates available'
      ],
      cons: [
        'Legal review costs ($500-$2,000)',
        'Some contractors resist signing',
        'Template contracts may miss edge cases',
        'International contractors need different docs'
      ],
      recommendation: 'Always use CIIA (Confidential Information and Invention Assignment) for anyone creating IP. Use independent contractor agreements for 1099 workers. Consider using Clerky or a startup lawyer for templates.'
    }
  ];

  const colorClasses = {
    primary: 'border-primary/30 bg-primary/5',
    success: 'border-success/30 bg-success/5',
    accent: 'border-accent/30 bg-accent/5',
    warning: 'border-warning/30 bg-warning/5'
  };

  const iconBgClasses = {
    primary: 'bg-gradient-primary text-primary-foreground',
    success: 'bg-gradient-success text-success-foreground',
    accent: 'bg-gradient-accent text-accent-foreground',
    warning: 'bg-gradient-warning text-warning-foreground'
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-warning flex items-center justify-center shadow-lg shadow-warning/30">
          <Users className="h-7 w-7 text-warning-foreground" />
        </div>
        <div>
          <h2 className="text-2xl font-display font-bold">Understanding Your Options</h2>
          <p className="text-muted-foreground">Key decisions explained simply</p>
        </div>
      </div>

      {/* Decision Framework Sections */}
      <div className="space-y-6">
        {sections.map((section) => (
          <div 
            key={section.title}
            className={`rounded-2xl border-2 ${colorClasses[section.color]} p-6 space-y-4`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${iconBgClasses[section.color]}`}>
                {section.icon}
              </div>
              <h3 className="text-xl font-bold">{section.title}</h3>
            </div>

            <p className="text-muted-foreground leading-relaxed">{section.explanation}</p>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-success font-medium">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Pros</span>
                </div>
                <ul className="space-y-1.5 text-sm">
                  {section.pros.map((pro, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-success mt-1">•</span>
                      <span className="text-muted-foreground">{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-destructive font-medium">
                  <AlertTriangle className="h-4 w-4" />
                  <span>Cons</span>
                </div>
                <ul className="space-y-1.5 text-sm">
                  {section.cons.map((con, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-destructive mt-1">•</span>
                      <span className="text-muted-foreground">{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-card/50 rounded-xl p-4 border border-border/50">
              <p className="text-sm font-medium text-primary">💡 Recommendation</p>
              <p className="text-sm text-muted-foreground mt-1">{section.recommendation}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Cost Summary */}
      <div className="bg-card rounded-2xl border border-border/50 p-6 shadow-lg">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-success" />
          Expected Costs Summary
        </h3>
        <div className="grid sm:grid-cols-2 gap-4 text-sm">
          <div className="flex justify-between p-3 bg-muted/50 rounded-lg">
            <span className="text-muted-foreground">Registered Agent</span>
            <span className="font-mono font-bold">$125–$300/yr</span>
          </div>
          <div className="flex justify-between p-3 bg-muted/50 rounded-lg">
            <span className="text-muted-foreground">Legal Templates</span>
            <span className="font-mono font-bold">$500–$2,000</span>
          </div>
          <div className="flex justify-between p-3 bg-muted/50 rounded-lg">
            <span className="text-muted-foreground">Contractor (hourly)</span>
            <span className="font-mono font-bold">$25–$200/hr</span>
          </div>
          <div className="flex justify-between p-3 bg-muted/50 rounded-lg">
            <span className="text-muted-foreground">First FT Hire (annual)</span>
            <span className="font-mono font-bold">$50K–$150K+</span>
          </div>
        </div>
      </div>

      <Button 
        onClick={onContinue}
        size="lg"
        className="w-full gap-2 bg-gradient-warning hover:opacity-90 text-warning-foreground font-bold text-lg h-14 rounded-xl shadow-lg transition-all"
      >
        See Services & Tools
        <ChevronRight className="h-5 w-5" />
      </Button>
    </div>
  );
};
