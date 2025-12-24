import { Button } from "@/components/ui/button";
import { ArrowRight, Target, Zap, Shield } from "lucide-react";

interface HeroSectionProps {
  onStart: () => void;
}

export const HeroSection = ({ onStart }: HeroSectionProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b-2 border-border p-4">
        <div className="container flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">FoundrFate</h1>
          <span className="font-mono text-sm text-muted-foreground">v1.0</span>
        </div>
      </header>

      {/* Hero Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="container max-w-4xl">
          <div className="space-y-8">
            {/* Tagline */}
            <div className="space-y-4">
              <p className="font-mono text-sm uppercase tracking-widest text-muted-foreground">
                AI Startup Architect
              </p>
              <h2 className="text-5xl md:text-7xl font-bold tracking-tight leading-none">
                Every idea has<br />
                <span className="inline-block border-b-4 border-foreground">a fate.</span>
              </h2>
            </div>

            {/* Description */}
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl leading-relaxed">
              We don't flatter ideas. We stress-test them, improve them, and if viable, 
              walk you from idea → company → pitch → roadmap.
            </p>

            {/* CTA */}
            <div className="pt-4">
              <Button 
                onClick={onStart}
                size="lg"
                className="text-lg px-8 py-6 shadow-md hover:shadow-lg transition-shadow group"
              >
                Discover Your Fate
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="border-t-2 border-border">
        <div className="container grid md:grid-cols-3 divide-y-2 md:divide-y-0 md:divide-x-2 divide-border">
          <FeatureBlock 
            icon={<Target className="h-6 w-6" />}
            title="Honest Analysis"
            description="No sugarcoating. Get a clear GO or NO-GO decision backed by market data."
          />
          <FeatureBlock 
            icon={<Zap className="h-6 w-6" />}
            title="Competitive Intel"
            description="Identify gaps, threats, and opportunities in your market landscape."
          />
          <FeatureBlock 
            icon={<Shield className="h-6 w-6" />}
            title="Full Roadmap"
            description="From pitch deck to company formation to execution timeline."
          />
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t-2 border-border p-4">
        <div className="container flex items-center justify-between text-sm text-muted-foreground">
          <span>Think like a YC partner.</span>
          <span className="font-mono">2024</span>
        </div>
      </footer>
    </div>
  );
};

const FeatureBlock = ({ 
  icon, 
  title, 
  description 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
}) => (
  <div className="p-8 space-y-4">
    <div className="inline-flex items-center justify-center w-12 h-12 border-2 border-border bg-secondary">
      {icon}
    </div>
    <h3 className="text-xl font-bold">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
  </div>
);
