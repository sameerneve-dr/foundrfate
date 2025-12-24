import { Button } from "@/components/ui/button";
import { ArrowRight, Target, Zap, Shield, FolderOpen, User, Sparkles, Rocket, TrendingUp, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface HeroSectionProps {
  onStart: () => void;
}

export const HeroSection = ({ onStart }: HeroSectionProps) => {
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-background overflow-hidden">
      {/* Header */}
      <header className="relative z-20 p-4 md:p-6">
        <div className="container flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
              <Rocket className="h-5 w-5 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-display font-bold text-gradient-primary">FoundrFate</h1>
          </div>
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <Button variant="ghost" size="sm" asChild className="hover:bg-primary/10">
                  <Link to="/saved-ideas" className="gap-1.5">
                    <FolderOpen className="h-4 w-4" />
                    My Ideas
                  </Link>
                </Button>
                <Button variant="outline" size="sm" onClick={signOut} className="border-primary/30 hover:bg-primary/10">
                  Sign Out
                </Button>
              </>
            ) : (
              <Button variant="outline" size="sm" asChild className="border-primary/30 hover:bg-primary/10">
                <Link to="/auth" className="gap-1.5">
                  <User className="h-4 w-4" />
                  Sign In
                </Link>
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Content */}
      <div className="flex-1 relative">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/10 to-background" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-primary/10 to-transparent rounded-full" />
        
        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-primary/40 rounded-full animate-bounce-subtle"
              style={{
                left: `${15 + i * 15}%`,
                top: `${20 + (i % 3) * 25}%`,
                animationDelay: `${i * 0.3}s`,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-200px)] px-4 py-16">
          <div className="container max-w-5xl text-center">
            <div className="space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary animate-fade-in">
                <Sparkles className="h-4 w-4" />
                <span className="text-sm font-medium">AI Startup Architect</span>
              </div>

              {/* Headline */}
              <h2 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold tracking-tight leading-[1.1] animate-fade-in" style={{ animationDelay: '0.1s' }}>
                Every idea has<br />
                <span className="text-gradient-primary">a fate.</span>
              </h2>

              {/* Description */}
              <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed animate-fade-in" style={{ animationDelay: '0.2s' }}>
                We don't flatter ideas. We <span className="text-foreground font-semibold">stress-test</span> them, 
                <span className="text-foreground font-semibold"> improve</span> them, and if viable, 
                walk you from <span className="text-primary font-semibold">idea → company → pitch → roadmap</span>.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                <Button 
                  onClick={onStart}
                  size="lg"
                  className="text-lg px-10 py-7 bg-gradient-primary hover:opacity-90 shadow-xl shadow-primary/30 transition-all hover:shadow-2xl hover:shadow-primary/40 hover:-translate-y-1 group btn-glow-primary"
                >
                  <Sparkles className="mr-2 h-5 w-5" />
                  Discover Your Fate
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
                <Button 
                  variant="outline"
                  size="lg"
                  className="text-lg px-8 py-7 border-2 border-primary/30 hover:bg-primary/10 hover:border-primary/50"
                  asChild
                >
                  <Link to="/auth">
                    Free to start
                  </Link>
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center justify-center gap-6 pt-8 text-sm text-muted-foreground animate-fade-in" style={{ animationDelay: '0.4s' }}>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  <span>AI-powered analysis</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  <span>Full execution roadmap</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="relative z-10 py-16 px-4">
        <div className="container max-w-6xl">
          <div className="grid md:grid-cols-3 gap-6">
            <FeatureCard 
              icon={<Target className="h-6 w-6" />}
              title="Honest Analysis"
              description="No sugarcoating. Get a clear GO or NO-GO decision backed by market data and AI insights."
              gradient="from-primary to-primary/60"
              delay="0s"
            />
            <FeatureCard 
              icon={<Zap className="h-6 w-6" />}
              title="Competitive Intel"
              description="Identify gaps, threats, and opportunities in your market landscape instantly."
              gradient="from-accent to-success"
              delay="0.1s"
            />
            <FeatureCard 
              icon={<Shield className="h-6 w-6" />}
              title="Full Roadmap"
              description="From pitch deck to company formation to execution timeline — all automated."
              gradient="from-warning to-destructive"
              delay="0.2s"
            />
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="relative z-10 py-12 px-4 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5">
        <div className="container max-w-4xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatBlock number="10k+" label="Ideas Analyzed" />
            <StatBlock number="85%" label="Accuracy Rate" />
            <StatBlock number="24h" label="To First Pitch" />
            <StatBlock number="50+" label="Visa Paths" />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 py-6 px-4 border-t border-border/50">
        <div className="container flex items-center justify-between text-sm text-muted-foreground">
          <span className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            Think like a YC partner.
          </span>
          <span className="font-mono">2024</span>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ 
  icon, 
  title, 
  description,
  gradient,
  delay
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
  gradient: string;
  delay: string;
}) => (
  <div 
    className="group relative p-8 rounded-2xl bg-card border border-border/50 shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300 overflow-hidden animate-fade-in"
    style={{ animationDelay: delay }}
  >
    {/* Glow effect on hover */}
    <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
    
    <div className={`relative z-10 inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${gradient} text-primary-foreground mb-4 group-hover:scale-110 transition-transform duration-300`}>
      {icon}
    </div>
    <h3 className="relative z-10 text-xl font-bold mb-2">{title}</h3>
    <p className="relative z-10 text-muted-foreground leading-relaxed">{description}</p>
  </div>
);

const StatBlock = ({ number, label }: { number: string; label: string }) => (
  <div className="text-center">
    <div className="text-3xl md:text-4xl font-display font-bold text-gradient-primary">{number}</div>
    <div className="text-sm text-muted-foreground mt-1">{label}</div>
  </div>
);
