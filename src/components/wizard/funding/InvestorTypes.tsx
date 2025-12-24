import { 
  Heart, 
  Rocket, 
  Trophy,
  ExternalLink,
  Users,
  TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDecisionLedger } from "@/contexts/DecisionLedgerContext";

export const InvestorTypes = () => {
  const { ledger } = useDecisionLedger();
  const fundraisingIntent = ledger.fundraisingIntent;

  const investorTypes = [
    {
      id: 'angel',
      icon: <Heart className="h-6 w-6" />,
      title: 'Angel Investors',
      subtitle: 'Most common first',
      description: 'Individuals investing $10K–$150K. They bet on you, not metrics.',
      gradient: 'bg-gradient-primary',
      platforms: [
        { name: 'AngelList', url: 'https://angel.co' },
        { name: 'Signal', url: 'https://signal.nfx.com' },
        { name: 'LinkedIn', url: 'https://linkedin.com', note: 'underrated but powerful' }
      ],
      recommended: true
    },
    {
      id: 'preseed',
      icon: <Rocket className="h-6 w-6" />,
      title: 'Pre-Seed / Seed VCs',
      subtitle: 'Small funds, big bets',
      description: 'Institutional investors for early stage. Checkpoint: MVP or strong narrative.',
      gradient: 'bg-gradient-accent',
      platforms: [
        { name: 'Crunchbase', url: 'https://crunchbase.com' },
        { name: 'PitchBook', url: 'https://pitchbook.com' },
        { name: 'NFX Signal', url: 'https://signal.nfx.com' }
      ],
      recommended: fundraisingIntent === 'venture-scale'
    },
    {
      id: 'accelerator',
      icon: <Trophy className="h-6 w-6" />,
      title: 'Accelerators',
      subtitle: 'Very founder-friendly',
      description: 'Highly recommended for first-time founders. Mentorship + funding + network.',
      gradient: 'bg-gradient-success',
      platforms: [
        { name: 'Y Combinator', url: 'https://ycombinator.com' },
        { name: 'Techstars', url: 'https://techstars.com' },
        { name: 'Antler', url: 'https://antler.co' }
      ],
      recommended: true
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-gradient-accent flex items-center justify-center">
          <Users className="h-5 w-5 text-accent-foreground" />
        </div>
        <div>
          <h3 className="text-lg font-bold">Step 2: Investor Types</h3>
          <p className="text-sm text-muted-foreground">Match your stage with the right investors</p>
        </div>
      </div>

      <div className="grid gap-4">
        {investorTypes.map((type) => (
          <div
            key={type.id}
            className={`bg-card rounded-2xl border-2 p-5 transition-all ${
              type.recommended ? 'border-primary/50 shadow-md' : 'border-border/50'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className={`w-14 h-14 rounded-xl ${type.gradient} flex items-center justify-center shrink-0`}>
                {type.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-bold text-lg">{type.title}</h4>
                  {type.recommended && (
                    <span className="pill pill-primary text-xs">Recommended</span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-3">{type.description}</p>
                
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Create accounts here:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {type.platforms.map((platform) => (
                      <Button
                        key={platform.name}
                        variant="outline"
                        size="sm"
                        asChild
                        className="gap-1.5 h-8 text-xs"
                      >
                        <a href={platform.url} target="_blank" rel="noopener noreferrer">
                          {platform.name}
                          {platform.note && (
                            <span className="text-muted-foreground">({platform.note})</span>
                          )}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};