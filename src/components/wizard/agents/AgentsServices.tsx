import { Button } from "@/components/ui/button";
import { 
  ChevronRight, 
  ExternalLink,
  Star,
  UserCheck,
  Users,
  FileText,
  Briefcase,
  Globe
} from "lucide-react";
import { useDecisionLedger } from "@/contexts/DecisionLedgerContext";

interface AgentsServicesProps {
  onContinue: () => void;
}

interface ServiceOption {
  name: string;
  category: string;
  description: string;
  cost: string;
  bestFor: string;
  url: string;
  featured?: boolean;
}

export const AgentsServices = ({ onContinue }: AgentsServicesProps) => {
  const { ledger } = useDecisionLedger();
  
  const isDelawareCCorp = ledger.entityType === 'delaware-c-corp';
  const isVentureScale = ledger.fundraisingIntent === 'venture-scale';

  const categories = [
    {
      icon: <UserCheck className="h-6 w-6" />,
      title: 'Registered Agents',
      color: 'primary' as const,
      services: [
        {
          name: 'Harvard Business Services',
          category: 'Premium',
          description: 'Delaware specialist with 40+ years experience. Excellent support.',
          cost: '$225/yr',
          bestFor: 'Delaware C-Corps wanting premium service',
          url: 'https://www.delawareinc.com',
          featured: true
        },
        {
          name: 'Registered Agents Inc',
          category: 'Value',
          description: 'Affordable, reliable agent service in all 50 states.',
          cost: '$125/yr',
          bestFor: 'Cost-conscious founders',
          url: 'https://www.registeredagentsinc.com',
          featured: true
        },
        {
          name: 'Northwest Registered Agent',
          category: 'Popular',
          description: 'Well-known with good privacy features.',
          cost: '$125/yr',
          bestFor: 'Privacy-focused founders',
          url: 'https://www.northwestregisteredagent.com'
        },
        {
          name: 'Stripe Atlas (included)',
          category: 'Bundled',
          description: 'Registered agent included with Atlas formation.',
          cost: 'Included',
          bestFor: 'If using Stripe Atlas for formation',
          url: 'https://stripe.com/atlas'
        }
      ]
    },
    {
      icon: <Briefcase className="h-6 w-6" />,
      title: 'Hiring Platforms',
      color: 'success' as const,
      services: [
        {
          name: 'Wellfound (AngelList Talent)',
          category: 'Startup-Focused',
          description: 'Best for finding startup-minded talent. Free to post.',
          cost: 'Free to $500/mo',
          bestFor: 'Early-stage startup hiring',
          url: 'https://wellfound.com',
          featured: true
        },
        {
          name: 'LinkedIn Recruiter',
          category: 'Professional',
          description: 'Largest professional network. Best for experienced hires.',
          cost: '$170–$270/mo',
          bestFor: 'Senior/specialized roles',
          url: 'https://linkedin.com/talent'
        },
        {
          name: 'Y Combinator Work at a Startup',
          category: 'Elite',
          description: 'Access to YC company job boards (if YC-backed).',
          cost: 'Free (YC companies)',
          bestFor: 'YC startups',
          url: 'https://www.workatastartup.com'
        }
      ]
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: 'Contractor Platforms',
      color: 'accent' as const,
      services: [
        {
          name: 'Toptal',
          category: 'Premium',
          description: 'Top 3% of freelance talent. Rigorous vetting.',
          cost: '$60–$200/hr',
          bestFor: 'High-quality technical contractors',
          url: 'https://www.toptal.com',
          featured: true
        },
        {
          name: 'Upwork',
          category: 'Marketplace',
          description: 'Largest freelancer marketplace. Wide price range.',
          cost: '$15–$150/hr',
          bestFor: 'Flexible budgets, various skills',
          url: 'https://www.upwork.com',
          featured: true
        },
        {
          name: 'Contra',
          category: 'Modern',
          description: 'Commission-free platform for independent contractors.',
          cost: '$30–$150/hr',
          bestFor: 'Design and product work',
          url: 'https://contra.com'
        },
        {
          name: 'Fiverr',
          category: 'Budget',
          description: 'Quick, affordable gig-based work.',
          cost: '$5–$100/task',
          bestFor: 'Small tasks, quick turnaround',
          url: 'https://www.fiverr.com'
        }
      ]
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: 'International Hiring (EOR)',
      color: 'warning' as const,
      services: [
        {
          name: 'Deel',
          category: 'Global Leader',
          description: 'Hire in 150+ countries without local entities.',
          cost: '$599/employee/mo',
          bestFor: 'International full-time hires',
          url: 'https://www.deel.com',
          featured: true
        },
        {
          name: 'Remote.com',
          category: 'Popular',
          description: 'Employer of Record for global hiring.',
          cost: '$599/employee/mo',
          bestFor: 'Global team building',
          url: 'https://remote.com'
        },
        {
          name: 'Oyster HR',
          category: 'Growing',
          description: 'Global employment platform with good UX.',
          cost: '$599/employee/mo',
          bestFor: 'Mid-size remote teams',
          url: 'https://www.oysterhr.com'
        }
      ]
    },
    {
      icon: <FileText className="h-6 w-6" />,
      title: 'Legal Documents & Templates',
      color: 'primary' as const,
      services: [
        {
          name: 'Clerky',
          category: 'Startup Standard',
          description: 'VC-backed startup legal docs. Used by YC companies.',
          cost: '$99–$999',
          bestFor: 'Equity, CIIA, advisor agreements',
          url: 'https://www.clerky.com',
          featured: true
        },
        {
          name: 'Orrick Open Source Docs',
          category: 'Free',
          description: 'Free startup legal documents from top law firm.',
          cost: 'Free',
          bestFor: 'Budget-conscious founders',
          url: 'https://www.orrick.com/Total-Access/Tool-Kit/Start-Up-Forms'
        },
        {
          name: 'Cooley GO',
          category: 'Free Resources',
          description: 'Free legal documents and educational content.',
          cost: 'Free',
          bestFor: 'Learning + basic templates',
          url: 'https://www.cooleygo.com/documents/'
        }
      ]
    }
  ];

  const colorClasses = {
    primary: 'border-primary/30',
    success: 'border-success/30',
    accent: 'border-accent/30',
    warning: 'border-warning/30'
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
          <h2 className="text-2xl font-display font-bold">Recommended Services</h2>
          <p className="text-muted-foreground">Curated tools for {isVentureScale ? 'venture-scale' : 'lean'} startups</p>
        </div>
      </div>

      {/* Service Categories */}
      <div className="space-y-8">
        {categories.map((category) => (
          <div key={category.title} className="space-y-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBgClasses[category.color]}`}>
                {category.icon}
              </div>
              <h3 className="text-lg font-bold">{category.title}</h3>
            </div>

            <div className="grid gap-3">
              {category.services.map((service) => (
                <a
                  key={service.name}
                  href={service.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`block p-4 rounded-xl border-2 ${colorClasses[category.color]} bg-card hover:shadow-md transition-all group ${service.featured ? 'ring-2 ring-primary/20' : ''}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold">{service.name}</span>
                        {service.featured && (
                          <span className="pill pill-primary text-xs flex items-center gap-1">
                            <Star className="h-3 w-3" />
                            Recommended
                          </span>
                        )}
                        <span className="pill text-xs bg-muted">{service.category}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{service.description}</p>
                      <div className="flex flex-wrap gap-3 text-xs">
                        <span className="font-mono font-bold text-success">{service.cost}</span>
                        <span className="text-muted-foreground">Best for: {service.bestFor}</span>
                      </div>
                    </div>
                    <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0 mt-1" />
                  </div>
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Button 
        onClick={onContinue}
        size="lg"
        className="w-full gap-2 bg-gradient-warning hover:opacity-90 text-warning-foreground font-bold text-lg h-14 rounded-xl shadow-lg transition-all"
      >
        View Checklist
        <ChevronRight className="h-5 w-5" />
      </Button>
    </div>
  );
};
