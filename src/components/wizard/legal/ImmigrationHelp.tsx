import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Scale,
  Award,
  GraduationCap,
  DollarSign,
  Clock
} from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface ImmigrationHelpProps {
  onComplete: () => void;
}

export const ImmigrationHelp = ({ onComplete }: ImmigrationHelpProps) => {
  const [expandedSection, setExpandedSection] = useState<string | null>('attorneys');
  const [helpChoice, setHelpChoice] = useState<'later' | 'checklist' | 'questions' | null>(null);

  const resources = [
    {
      id: 'attorneys',
      title: 'Immigration Attorneys',
      icon: <Scale className="h-5 w-5" />,
      content: {
        whenNeed: [
          'Complex visa situations (multiple status changes)',
          'Starting a company on H-1B or restricted visa',
          'O-1 or EB-1 applications',
          'Any denial or RFE (Request for Evidence)'
        ],
        whenWait: [
          'U.S. citizen or green card holder',
          'Simple F-1 to OPT transition',
          'Just exploring options'
        ],
        costs: {
          consultation: '$100–$300 for initial consultation',
          filing: '$2,000–$10,000+ for full case handling'
        }
      }
    },
    {
      id: 'specialists',
      title: 'O-1 / EB-1 Specialists',
      icon: <Award className="h-5 w-5" />,
      content: {
        whoTheyHelp: [
          'Founders with press coverage or awards',
          'Technical founders with patents or publications',
          'Entrepreneurs with significant funding or exits'
        ],
        whenTheyMakeSense: [
          'You have evidence of "extraordinary ability"',
          'You want a founder-friendly visa (O-1)',
          'You\'re planning for permanent residency (EB-1A)'
        ],
        examples: [
          'Legalpad (startup-focused)',
          'Fragomen (large firm with startup practice)',
          'Small boutique firms specializing in O-1/EB-1'
        ]
      }
    },
    {
      id: 'university',
      title: 'Accelerator & University Resources',
      icon: <GraduationCap className="h-5 w-5" />,
      content: {
        universityResources: [
          'International Student Office (ISO/ISSS)',
          'OPT/CPT workshops and advising',
          'Startup legal clinics at law schools',
          'Entrepreneurship centers with visa guidance'
        ],
        acceleratorResources: [
          'Y Combinator (provides immigration support)',
          'Techstars (immigration resources for founders)',
          'University accelerators (often have legal help)'
        ]
      }
    }
  ];

  const lawyerQuestions = [
    'Can I legally work for my own startup on my current visa?',
    'What structure do I need to avoid visa violations?',
    'Should I wait for my next visa status before actively working?',
    'What documentation should I keep to prove compliance?',
    'Is O-1 a realistic option for my situation?',
    'How should I structure equity and salary?'
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold">Getting Help</h2>
        <p className="text-muted-foreground mt-2">Immigration resources for founders</p>
      </div>

      {/* Resource sections */}
      <div className="space-y-3">
        {resources.map((resource) => (
          <Collapsible 
            key={resource.id} 
            open={expandedSection === resource.id} 
            onOpenChange={(open) => setExpandedSection(open ? resource.id : null)}
          >
            <CollapsibleTrigger asChild>
              <button className="w-full flex items-center gap-4 p-4 border-2 border-border hover:bg-secondary transition-colors text-left">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center shrink-0">
                  {resource.icon}
                </div>
                <div className="flex-1">
                  <p className="font-bold">{resource.title}</p>
                </div>
                {expandedSection === resource.id ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="border-2 border-t-0 border-border p-4 space-y-4">
                {resource.id === 'attorneys' && (
                  <>
                    <div>
                      <p className="font-bold text-sm mb-2">When you need one:</p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {resource.content.whenNeed?.map((item, i) => (
                          <li key={i}>• {item}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="font-bold text-sm mb-2">When you can wait:</p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {resource.content.whenWait?.map((item, i) => (
                          <li key={i}>• {item}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="border-t border-border pt-3">
                      <div className="flex items-center gap-2 text-sm">
                        <DollarSign className="h-4 w-4" />
                        <span><strong>Consultation:</strong> {resource.content.costs?.consultation}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm mt-1">
                        <DollarSign className="h-4 w-4" />
                        <span><strong>Full case:</strong> {resource.content.costs?.filing}</span>
                      </div>
                    </div>
                  </>
                )}
                
                {resource.id === 'specialists' && (
                  <>
                    <div>
                      <p className="font-bold text-sm mb-2">Who they help:</p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {resource.content.whoTheyHelp?.map((item, i) => (
                          <li key={i}>• {item}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="font-bold text-sm mb-2">When they make sense:</p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {resource.content.whenTheyMakeSense?.map((item, i) => (
                          <li key={i}>• {item}</li>
                        ))}
                      </ul>
                    </div>
                  </>
                )}

                {resource.id === 'university' && (
                  <>
                    <div>
                      <p className="font-bold text-sm mb-2">University resources:</p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {resource.content.universityResources?.map((item, i) => (
                          <li key={i}>• {item}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="font-bold text-sm mb-2">Accelerator resources:</p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {resource.content.acceleratorResources?.map((item, i) => (
                          <li key={i}>• {item}</li>
                        ))}
                      </ul>
                    </div>
                  </>
                )}
              </div>
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>

      {/* Questions to ask */}
      <Collapsible>
        <CollapsibleTrigger asChild>
          <button className="w-full flex items-center gap-4 p-4 border-2 border-border hover:bg-secondary transition-colors text-left">
            <div className="flex-1">
              <p className="font-bold">Questions to ask an immigration lawyer</p>
            </div>
            <ChevronDown className="h-5 w-5" />
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="border-2 border-t-0 border-border p-4">
            <ul className="space-y-2">
              {lawyerQuestions.map((q, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="w-5 h-5 rounded-full bg-secondary flex items-center justify-center shrink-0 text-xs">
                    {i + 1}
                  </span>
                  <span>{q}</span>
                </li>
              ))}
            </ul>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Decision */}
      <div className="border-2 border-border p-4 space-y-4">
        <p className="font-bold">What would you like to do?</p>
        <div className="grid gap-2">
          {[
            { value: 'later' as const, label: 'Handle this later', icon: <Clock className="h-4 w-4" /> },
            { value: 'checklist' as const, label: 'Add to my checklist', icon: <ChevronRight className="h-4 w-4" /> },
            { value: 'questions' as const, label: 'Save questions to ask a lawyer', icon: <Scale className="h-4 w-4" /> }
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => setHelpChoice(option.value)}
              className={`flex items-center gap-3 p-3 border transition-colors text-left
                ${helpChoice === option.value ? 'border-foreground bg-secondary' : 'border-border hover:bg-secondary/50'}`}
            >
              {option.icon}
              <span className="text-sm font-medium">{option.label}</span>
            </button>
          ))}
        </div>
      </div>

      <Button 
        onClick={onComplete}
        size="lg"
        className="w-full gap-2"
      >
        Complete Legal Check
        <ChevronRight className="h-5 w-5" />
      </Button>
    </div>
  );
};
