import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  ChevronLeft, 
  ChevronRight, 
  X,
  Maximize2,
  Minimize2
} from "lucide-react";
import { useDecisionLedger } from "@/contexts/DecisionLedgerContext";
import { cn } from "@/lib/utils";

interface PitchDeckViewerProps {
  onClose: () => void;
}

export const PitchDeckViewer = ({ onClose }: PitchDeckViewerProps) => {
  const { ledger } = useDecisionLedger();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const analysis = ledger.analysis;
  const ideaSnapshot = ledger.ideaSnapshot;

  if (!analysis || !ideaSnapshot) return null;

  const slides = [
    {
      title: ideaSnapshot.ideaName,
      subtitle: "Pitch Deck",
      content: null,
      type: 'cover' as const
    },
    {
      title: "The Problem",
      subtitle: null,
      content: analysis.pitchDeck.problem,
      type: 'content' as const
    },
    {
      title: "Why Now",
      subtitle: null,
      content: analysis.pitchDeck.whyNow,
      type: 'content' as const
    },
    {
      title: "The Solution",
      subtitle: null,
      content: analysis.pitchDeck.solution,
      type: 'content' as const
    },
    {
      title: "Market Size",
      subtitle: null,
      content: analysis.pitchDeck.marketSize,
      type: 'content' as const
    },
    {
      title: "Business Model",
      subtitle: null,
      content: analysis.pitchDeck.businessModel,
      type: 'content' as const
    },
    {
      title: "Go-to-Market",
      subtitle: null,
      content: analysis.pitchDeck.goToMarket,
      type: 'content' as const
    },
    {
      title: "Our Differentiator",
      subtitle: null,
      content: analysis.pitchDeck.differentiator,
      type: 'content' as const
    },
    {
      title: "Value Proposition",
      subtitle: null,
      content: analysis.valueAnalysis.whyExist,
      type: 'content' as const,
      stats: [
        { label: "Time Saved", value: analysis.valueAnalysis.timeSaved },
        { label: "Money Saved", value: analysis.valueAnalysis.moneySaved },
        { label: "Risk Reduced", value: analysis.valueAnalysis.riskReduced },
        { label: "Revenue Impact", value: analysis.valueAnalysis.revenueUnlocked },
      ]
    },
    {
      title: "Thank You",
      subtitle: ideaSnapshot.ideaName,
      content: null,
      type: 'cover' as const
    }
  ];

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === ' ') {
      nextSlide();
    } else if (e.key === 'ArrowLeft') {
      prevSlide();
    } else if (e.key === 'Escape') {
      if (isFullscreen) {
        setIsFullscreen(false);
      } else {
        onClose();
      }
    }
  };

  const slide = slides[currentSlide];

  return (
    <div 
      className={cn(
        "fixed inset-0 z-50 bg-background flex flex-col",
        isFullscreen ? "" : "md:p-8"
      )}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* Header */}
      <div className={cn(
        "flex items-center justify-between p-4 border-b border-border",
        isFullscreen && "absolute top-0 left-0 right-0 bg-background/80 backdrop-blur z-10"
      )}>
        <div className="flex items-center gap-4">
          <span className="font-mono text-sm text-muted-foreground">
            {currentSlide + 1} / {slides.length}
          </span>
          <div className="hidden md:flex gap-1">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={cn(
                  "w-2 h-2 rounded-full transition-colors",
                  i === currentSlide ? "bg-foreground" : "bg-muted-foreground/30"
                )}
              />
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsFullscreen(!isFullscreen)}
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Slide Content */}
      <div className="flex-1 flex items-center justify-center p-8 overflow-hidden">
        <div 
          key={currentSlide}
          className={cn(
            "w-full max-w-4xl aspect-video bg-secondary border-2 border-border flex flex-col items-center justify-center p-8 md:p-16 animate-scale-in",
            isFullscreen && "max-w-none h-full aspect-auto"
          )}
        >
          {slide.type === 'cover' ? (
            <div className="text-center space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold">{slide.title}</h1>
              {slide.subtitle && (
                <p className="text-xl md:text-2xl text-muted-foreground">{slide.subtitle}</p>
              )}
            </div>
          ) : (
            <div className="w-full space-y-8">
              <h2 className="text-3xl md:text-5xl font-bold text-center">{slide.title}</h2>
              <p className="text-lg md:text-xl text-muted-foreground text-center max-w-2xl mx-auto leading-relaxed">
                {slide.content}
              </p>
              {slide.stats && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8">
                  {slide.stats.map((stat, i) => (
                    <div key={i} className="text-center p-4 bg-background border-2 border-border">
                      <p className="text-xl md:text-2xl font-bold">{stat.value}</p>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className={cn(
        "flex items-center justify-between p-4 border-t border-border",
        isFullscreen && "absolute bottom-0 left-0 right-0 bg-background/80 backdrop-blur"
      )}>
        <Button
          variant="outline"
          onClick={prevSlide}
          disabled={currentSlide === 0}
          className="gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        <span className="text-sm text-muted-foreground">
          Use arrow keys to navigate
        </span>
        <Button
          onClick={nextSlide}
          disabled={currentSlide === slides.length - 1}
          className="gap-2"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
