import { useState } from "react";
import { 
  Presentation, 
  Loader2, 
  ChevronLeft, 
  ChevronRight,
  Download,
  RefreshCw,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDecisionLedger } from "@/contexts/DecisionLedgerContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Slide {
  id: string;
  title: string;
  subtitle?: string;
  bullets: string[];
  notes?: string;
}

interface PitchDeckGeneratorProps {
  onClose?: () => void;
}

export const PitchDeckGenerator = ({ onClose }: PitchDeckGeneratorProps) => {
  const { ledger } = useDecisionLedger();
  const [slides, setSlides] = useState<Slide[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);

  const generatePitchDeck = async () => {
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-pitch-deck', {
        body: {
          ideaSnapshot: ledger.ideaSnapshot,
          analysis: ledger.analysis,
          entityType: ledger.entityType,
          fundraisingIntent: ledger.fundraisingIntent,
        }
      });

      if (error) {
        console.error("Error generating pitch deck:", error);
        toast.error("Failed to generate pitch deck. Please try again.");
        return;
      }

      if (data?.slides) {
        setSlides(data.slides);
        setCurrentSlide(0);
        setHasGenerated(true);
        toast.success("Pitch deck generated successfully!");
      }
    } catch (err) {
      console.error("Error:", err);
      toast.error("Failed to generate pitch deck");
    } finally {
      setIsGenerating(false);
    }
  };

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(curr => curr + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(curr => curr - 1);
    }
  };

  const exportToText = () => {
    const content = slides.map((slide, i) => 
      `Slide ${i + 1}: ${slide.title}\n${slide.subtitle ? `${slide.subtitle}\n` : ''}\n${slide.bullets.map(b => `• ${b}`).join('\n')}\n${slide.notes ? `\nNotes: ${slide.notes}` : ''}`
    ).join('\n\n---\n\n');
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${ledger.ideaSnapshot?.ideaName || 'pitch-deck'}-slides.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Pitch deck exported!");
  };

  if (!hasGenerated) {
    return (
      <div className="bg-card rounded-2xl border border-border/50 shadow-lg p-8 text-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-primary mx-auto flex items-center justify-center mb-4">
          <Presentation className="h-8 w-8 text-primary-foreground" />
        </div>
        <h3 className="text-xl font-bold mb-2">AI Pitch Deck Generator</h3>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          Generate a professional 10-slide pitch deck based on your idea, analysis, and business model.
        </p>
        <Button 
          onClick={generatePitchDeck} 
          disabled={isGenerating}
          className="bg-gradient-primary text-primary-foreground"
          size="lg"
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Generating Slides...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              Generate Pitch Deck
            </>
          )}
        </Button>
      </div>
    );
  }

  const slide = slides[currentSlide];

  return (
    <div className="bg-card rounded-2xl border border-border/50 shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-primary p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Presentation className="h-5 w-5 text-primary-foreground" />
          <span className="font-bold text-primary-foreground">Pitch Deck</span>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={generatePitchDeck}
            disabled={isGenerating}
            className="text-primary-foreground hover:bg-white/20"
          >
            <RefreshCw className={`h-4 w-4 mr-1 ${isGenerating ? 'animate-spin' : ''}`} />
            Regenerate
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={exportToText}
            className="text-primary-foreground hover:bg-white/20"
          >
            <Download className="h-4 w-4 mr-1" />
            Export
          </Button>
        </div>
      </div>

      {/* Slide Content */}
      <div className="p-8 min-h-[400px] flex flex-col">
        <div className="text-xs text-muted-foreground mb-2">
          Slide {currentSlide + 1} of {slides.length}
        </div>
        
        <h2 className="text-2xl font-bold mb-2">{slide?.title}</h2>
        {slide?.subtitle && (
          <p className="text-muted-foreground mb-4">{slide.subtitle}</p>
        )}
        
        <ul className="space-y-3 flex-1">
          {slide?.bullets.map((bullet, i) => (
            <li key={i} className="flex gap-3">
              <span className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>

        {slide?.notes && (
          <div className="mt-4 p-3 bg-muted/50 rounded-lg">
            <p className="text-xs text-muted-foreground">
              <strong>Speaker Notes:</strong> {slide.notes}
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="border-t border-border/50 p-4 flex items-center justify-between">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={prevSlide}
          disabled={currentSlide === 0}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous
        </Button>
        
        <div className="flex gap-1">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`w-2 h-2 rounded-full transition-all ${
                i === currentSlide ? 'bg-primary w-4' : 'bg-muted hover:bg-muted-foreground/50'
              }`}
            />
          ))}
        </div>

        <Button 
          variant="outline" 
          size="sm" 
          onClick={nextSlide}
          disabled={currentSlide === slides.length - 1}
        >
          Next
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
};
