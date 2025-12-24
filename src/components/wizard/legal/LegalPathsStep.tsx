import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  ChevronRight,
  Route,
  Clock,
  Scale,
  Users,
  MessageCircle
} from "lucide-react";
import { useDecisionLedger, type LegalPathPreference, type VisaStatus } from "@/contexts/DecisionLedgerContext";

interface LegalPathsStepProps {
  onContinue: () => void;
}

interface LegalPath {
  id: LegalPathPreference;
  title: string;
  description: string;
  forWho: string;
  timeline: string;
  lawyerWhen: string;
}

const getLegalPaths = (visa: VisaStatus): LegalPath[] => {
  const allPaths: Record<string, LegalPath> = {
    'opt-to-h1b-to-gc': {
      id: 'opt-to-h1b-to-gc',
      title: 'OPT → STEM OPT → H-1B → Green Card',
      description: 'The classic path for F-1 students building startups',
      forWho: 'F-1 students with STEM degrees planning to stay long-term',
      timeline: '5-10 years for green card',
      lawyerWhen: 'Before H-1B lottery application, or if complications arise'
    },
    'o1-to-eb1a': {
      id: 'o1-to-eb1a',
      title: 'O-1 → EB-1A',
      description: 'Fast track for founders with strong credentials',
      forWho: 'Founders with press, awards, or significant achievements',
      timeline: '2-5 years for green card',
      lawyerWhen: 'When applying for O-1 to build the strongest case'
    },
    'cofounder-led': {
      id: 'cofounder-led',
      title: 'Cofounder-Led Operations',
      description: 'Let a work-authorized cofounder run day-to-day while you build',
      forWho: 'Founders with visa restrictions but a capable cofounder',
      timeline: 'Immediate, while resolving your visa',
      lawyerWhen: 'When structuring equity and roles to comply with visa rules'
    },
    'passive-ownership': {
      id: 'passive-ownership',
      title: 'Passive Ownership → Employment Later',
      description: 'Own equity now, transition to active work when authorized',
      forWho: 'Solo founders who need to wait for work authorization',
      timeline: 'Varies based on visa timeline',
      lawyerWhen: 'To structure ownership correctly from the start'
    },
    'no-restrictions': {
      id: 'no-restrictions',
      title: 'Direct Path (No Immigration Barriers)',
      description: 'You can proceed directly with no immigration considerations',
      forWho: 'U.S. citizens and green card holders',
      timeline: 'Immediate',
      lawyerWhen: 'Only for business legal matters, not immigration'
    }
  };

  switch (visa) {
    case 'us-citizen':
    case 'green-card':
      return [allPaths['no-restrictions']];
    case 'f1-no-opt':
    case 'f1-opt':
    case 'f1-stem-opt':
      return [
        allPaths['opt-to-h1b-to-gc'],
        allPaths['o1-to-eb1a'],
        allPaths['cofounder-led'],
        allPaths['passive-ownership']
      ];
    case 'h1b':
      return [
        allPaths['o1-to-eb1a'],
        allPaths['cofounder-led'],
        allPaths['passive-ownership']
      ];
    case 'o1':
      return [allPaths['o1-to-eb1a']];
    default:
      return [
        allPaths['cofounder-led'],
        allPaths['passive-ownership']
      ];
  }
};

export const LegalPathsStep = ({ onContinue }: LegalPathsStepProps) => {
  const { ledger, updateLedger } = useDecisionLedger();
  const [selectedPath, setSelectedPath] = useState<LegalPathPreference>(ledger.legalPathPreference);
  const [expandedPath, setExpandedPath] = useState<string | null>(null);

  const paths = getLegalPaths(ledger.founderVisaStatus);

  const handleSelect = (pathId: LegalPathPreference) => {
    setSelectedPath(pathId);
    updateLedger({ legalPathPreference: pathId });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold">Possible Legal Paths Forward</h2>
        <p className="text-muted-foreground mt-2">Choose the path that fits your situation</p>
      </div>

      <div className="space-y-3">
        {paths.map((path) => (
          <div key={path.id} className="border-2 border-border">
            <button
              onClick={() => handleSelect(path.id)}
              className={`w-full flex items-start gap-4 p-4 text-left transition-colors
                ${selectedPath === path.id ? 'bg-secondary' : 'hover:bg-secondary/50'}`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0
                ${selectedPath === path.id ? 'bg-foreground text-background' : 'bg-secondary'}`}>
                <Route className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="font-bold">{path.title}</p>
                <p className="text-sm text-muted-foreground">{path.description}</p>
              </div>
              <ChevronRight className={`h-5 w-5 transition-transform ${expandedPath === path.id ? 'rotate-90' : ''}`} />
            </button>
            
            {(selectedPath === path.id || expandedPath === path.id) && (
              <div className="border-t border-border p-4 bg-muted space-y-3">
                <div className="flex items-start gap-3">
                  <Users className="h-4 w-4 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Who it's for</p>
                    <p className="text-sm">{path.forWho}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="h-4 w-4 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Timeline</p>
                    <p className="text-sm">{path.timeline}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Scale className="h-4 w-4 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">When to talk to a lawyer</p>
                    <p className="text-sm">{path.lawyerWhen}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Disclaimer */}
      <div className="border border-border p-3 bg-muted/50 text-xs text-muted-foreground">
        <strong>Disclaimer:</strong> These are general paths, not legal advice. Your specific situation may require different approaches. Always consult with an immigration attorney.
      </div>

      <div className="flex gap-3">
        <Button 
          variant="outline" 
          className="gap-2"
          onClick={() => {/* Could open chatbot */}}
        >
          <MessageCircle className="h-4 w-4" />
          Ask FoundrFate
        </Button>
        <Button 
          onClick={onContinue}
          disabled={!selectedPath}
          className="flex-1 gap-2"
        >
          Continue
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};
