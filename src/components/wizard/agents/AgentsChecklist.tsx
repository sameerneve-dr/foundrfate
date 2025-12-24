import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle2, 
  Circle, 
  Users,
  ChevronRight,
  Download,
  Sparkles,
  UserCheck,
  FileText,
  Briefcase
} from "lucide-react";
import { useDecisionLedger } from "@/contexts/DecisionLedgerContext";

interface AgentsChecklistProps {
  onComplete: () => void;
}

interface ChecklistItem {
  id: string;
  label: string;
  description: string;
  priority: 'critical' | 'important' | 'optional';
  timeframe: string;
}

export const AgentsChecklist = ({ onComplete }: AgentsChecklistProps) => {
  const { ledger } = useDecisionLedger();
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  const isDelawareCCorp = ledger.entityType === 'delaware-c-corp';
  const isVentureScale = ledger.fundraisingIntent === 'venture-scale';

  const sections: Array<{
    icon: React.ReactNode;
    title: string;
    color: 'primary' | 'success' | 'accent' | 'warning';
    items: ChecklistItem[];
  }> = [
    {
      icon: <UserCheck className="h-6 w-6" />,
      title: 'Registered Agent Setup',
      color: 'primary',
      items: [
        {
          id: 'ra-research',
          label: 'Research registered agent services',
          description: 'Compare Harvard Business Services, Registered Agents Inc, etc.',
          priority: 'critical' as const,
          timeframe: 'Day 1'
        },
        {
          id: 'ra-select',
          label: 'Select and sign up with agent',
          description: 'Complete signup and payment for your chosen service',
          priority: 'critical' as const,
          timeframe: 'Day 1-2'
        },
        {
          id: 'ra-confirm',
          label: 'Confirm agent address for filings',
          description: 'Get the exact address to use on incorporation documents',
          priority: 'critical' as const,
          timeframe: 'Before filing'
        },
        {
          id: 'ra-calendar',
          label: 'Set renewal reminder',
          description: 'Add annual renewal date to your calendar',
          priority: 'important' as const,
          timeframe: 'After signup'
        }
      ]
    },
    {
      icon: <FileText className="h-6 w-6" />,
      title: 'Legal Documents',
      color: 'accent',
      items: [
        {
          id: 'legal-ciia',
          label: 'Get CIIA template',
          description: 'Confidential Information and Invention Assignment agreement',
          priority: 'critical' as const,
          timeframe: 'Before first hire'
        },
        {
          id: 'legal-contractor',
          label: 'Get contractor agreement template',
          description: 'Independent contractor agreement with IP assignment',
          priority: 'critical' as const,
          timeframe: 'Before first contractor'
        },
        {
          id: 'legal-nda',
          label: 'Prepare NDA template',
          description: 'For discussions with potential partners, investors',
          priority: 'important' as const,
          timeframe: 'As needed'
        },
        {
          id: 'legal-offer',
          label: 'Create offer letter template',
          description: 'Include equity terms, vesting schedule, compensation',
          priority: 'important' as const,
          timeframe: 'Before first FT hire'
        }
      ]
    },
    {
      icon: <Briefcase className="h-6 w-6" />,
      title: 'First Hire Planning',
      color: 'success',
      items: isVentureScale ? [
        {
          id: 'hire-role',
          label: 'Define first hire role',
          description: 'Technical co-founder, first engineer, or sales lead?',
          priority: 'critical' as const,
          timeframe: 'Month 1-2'
        },
        {
          id: 'hire-equity',
          label: 'Determine equity allocation',
          description: 'Early hires typically get 0.5-2% with 4-year vesting',
          priority: 'critical' as const,
          timeframe: 'Before offering'
        },
        {
          id: 'hire-comp',
          label: 'Set compensation range',
          description: 'Research market rates, plan cash + equity mix',
          priority: 'important' as const,
          timeframe: 'Before job posting'
        },
        {
          id: 'hire-source',
          label: 'Set up hiring sources',
          description: 'Wellfound, LinkedIn, referral network',
          priority: 'important' as const,
          timeframe: 'Month 2-3'
        }
      ] : [
        {
          id: 'hire-needs',
          label: 'Identify hiring needs',
          description: 'What tasks are you spending time on that could be delegated?',
          priority: 'important' as const,
          timeframe: 'When overwhelmed'
        },
        {
          id: 'hire-contractor',
          label: 'Find first contractor',
          description: 'Use Upwork, Toptal, or referrals for specific projects',
          priority: 'important' as const,
          timeframe: 'As needed'
        },
        {
          id: 'hire-budget',
          label: 'Set contractor budget',
          description: 'Determine monthly budget for outside help',
          priority: 'optional' as const,
          timeframe: 'When revenue allows'
        },
        {
          id: 'hire-convert',
          label: 'Plan for conversion',
          description: 'When does contractor become full-time?',
          priority: 'optional' as const,
          timeframe: 'When consistent work'
        }
      ]
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: 'International Hiring',
      color: 'warning',
      items: [
        {
          id: 'intl-need',
          label: 'Assess international hiring needs',
          description: 'Will you hire outside the US?',
          priority: 'optional' as const,
          timeframe: 'As needed'
        },
        {
          id: 'intl-eor',
          label: 'Research EOR providers',
          description: 'Deel, Remote.com, Oyster for international hires',
          priority: 'optional' as const,
          timeframe: 'Before international hire'
        },
        {
          id: 'intl-contractor',
          label: 'Set up international contractor agreements',
          description: 'Different requirements for non-US contractors',
          priority: 'optional' as const,
          timeframe: 'Before first intl contractor'
        }
      ]
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

  const priorityClasses = {
    critical: 'bg-destructive/10 text-destructive border-destructive/20',
    important: 'bg-warning/10 text-warning border-warning/20',
    optional: 'bg-muted text-muted-foreground border-border'
  };

  const toggleItem = (id: string) => {
    setCheckedItems(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const allItems = sections.flatMap(s => s.items);
  const criticalItems = allItems.filter(i => i.priority === 'critical');
  const completedCritical = criticalItems.filter(i => checkedItems.has(i.id)).length;
  const progress = (checkedItems.size / allItems.length) * 100;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-warning flex items-center justify-center shadow-lg shadow-warning/30">
          <Users className="h-7 w-7 text-warning-foreground" />
        </div>
        <div>
          <h2 className="text-2xl font-display font-bold">Agents & Hiring Checklist</h2>
          <p className="text-muted-foreground">Track your progress step by step</p>
        </div>
      </div>

      {/* Progress */}
      <div className="bg-card rounded-2xl border border-border/50 p-5 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <span className="font-bold">Overall Progress</span>
          <span className="font-mono text-primary">{Math.round(progress)}%</span>
        </div>
        <div className="h-3 bg-muted rounded-full overflow-hidden mb-3">
          <div 
            className="h-full progress-gradient transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Sparkles className="h-4 w-4 text-primary" />
          <span>
            {completedCritical} of {criticalItems.length} critical items completed
          </span>
        </div>
      </div>

      {/* Checklist Sections */}
      <div className="space-y-6">
        {sections.map((section) => {
          const sectionCompleted = section.items.filter(i => checkedItems.has(i.id)).length;
          
          return (
            <div 
              key={section.title}
              className={`rounded-2xl border-2 ${colorClasses[section.color]} p-5 space-y-4`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBgClasses[section.color]}`}>
                    {section.icon}
                  </div>
                  <h3 className="font-bold text-lg">{section.title}</h3>
                </div>
                <span className="text-sm text-muted-foreground font-mono">
                  {sectionCompleted}/{section.items.length}
                </span>
              </div>

              <div className="space-y-2">
                {section.items.map((item) => {
                  const isChecked = checkedItems.has(item.id);
                  
                  return (
                    <button
                      key={item.id}
                      onClick={() => toggleItem(item.id)}
                      className={`w-full flex items-start gap-3 p-4 rounded-xl border transition-all text-left
                        ${isChecked 
                          ? 'bg-success/10 border-success/30' 
                          : 'bg-card border-border hover:border-primary/50'}`}
                    >
                      <div className="mt-0.5">
                        {isChecked ? (
                          <CheckCircle2 className="h-5 w-5 text-success" />
                        ) : (
                          <Circle className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`font-medium ${isChecked ? 'line-through text-muted-foreground' : ''}`}>
                            {item.label}
                          </span>
                          <span className={`pill text-xs ${priorityClasses[item.priority]}`}>
                            {item.priority}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                        <p className="text-xs text-muted-foreground mt-1 font-mono">⏱ {item.timeframe}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button 
          variant="outline"
          size="lg"
          className="flex-1 gap-2 h-14 rounded-xl"
        >
          <Download className="h-5 w-5" />
          Export Checklist
        </Button>
        <Button 
          onClick={onComplete}
          size="lg"
          className="flex-1 gap-2 bg-gradient-warning hover:opacity-90 text-warning-foreground font-bold text-lg h-14 rounded-xl shadow-lg transition-all"
        >
          Complete Section
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};
