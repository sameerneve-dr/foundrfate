import { useState } from "react";
import { 
  Presentation, 
  Loader2, 
  ChevronLeft, 
  ChevronRight,
  Download,
  RefreshCw,
  Sparkles,
  Edit3,
  Check,
  X,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useDecisionLedger } from "@/contexts/DecisionLedgerContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import jsPDF from "jspdf";

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
  const [isRegeneratingSlide, setIsRegeneratingSlide] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [editingSlide, setEditingSlide] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Slide | null>(null);

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

  const regenerateSlide = async (slideIndex: number) => {
    setIsRegeneratingSlide(true);
    try {
      const slideType = slides[slideIndex].title;
      const { data, error } = await supabase.functions.invoke('generate-pitch-deck', {
        body: {
          ideaSnapshot: ledger.ideaSnapshot,
          analysis: ledger.analysis,
          entityType: ledger.entityType,
          fundraisingIntent: ledger.fundraisingIntent,
          regenerateSlide: slideType,
          slideIndex: slideIndex,
        }
      });

      if (error) {
        toast.error("Failed to regenerate slide");
        return;
      }

      if (data?.slides?.[0]) {
        const newSlides = [...slides];
        newSlides[slideIndex] = { ...data.slides[0], id: slides[slideIndex].id };
        setSlides(newSlides);
        toast.success("Slide regenerated!");
      }
    } catch (err) {
      console.error("Error:", err);
      toast.error("Failed to regenerate slide");
    } finally {
      setIsRegeneratingSlide(false);
    }
  };

  const startEditing = (index: number) => {
    setEditingSlide(index);
    setEditForm({ ...slides[index] });
  };

  const saveEdit = () => {
    if (editingSlide !== null && editForm) {
      const newSlides = [...slides];
      newSlides[editingSlide] = editForm;
      setSlides(newSlides);
      setEditingSlide(null);
      setEditForm(null);
      toast.success("Slide updated!");
    }
  };

  const cancelEdit = () => {
    setEditingSlide(null);
    setEditForm(null);
  };

  const updateBullet = (index: number, value: string) => {
    if (editForm) {
      const newBullets = [...editForm.bullets];
      newBullets[index] = value;
      setEditForm({ ...editForm, bullets: newBullets });
    }
  };

  const addBullet = () => {
    if (editForm) {
      setEditForm({ ...editForm, bullets: [...editForm.bullets, ""] });
    }
  };

  const removeBullet = (index: number) => {
    if (editForm && editForm.bullets.length > 1) {
      const newBullets = editForm.bullets.filter((_, i) => i !== index);
      setEditForm({ ...editForm, bullets: newBullets });
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

  const exportToPDF = () => {
    const pdf = new jsPDF('l', 'mm', 'a4'); // Landscape for slides
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - margin * 2;

    slides.forEach((slide, index) => {
      if (index > 0) {
        pdf.addPage();
      }

      // Background gradient simulation with colored rectangle
      pdf.setFillColor(103, 58, 183); // Primary purple
      pdf.rect(0, 0, pageWidth, 40, 'F');

      // Slide number
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(10);
      pdf.text(`Slide ${index + 1} of ${slides.length}`, pageWidth - margin, 15);

      // Title
      pdf.setFontSize(24);
      pdf.setFont('helvetica', 'bold');
      pdf.text(slide.title, margin, 28);

      // Subtitle
      if (slide.subtitle) {
        pdf.setTextColor(100, 100, 100);
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'normal');
        pdf.text(slide.subtitle, margin, 55);
      }

      // Bullets
      pdf.setTextColor(40, 40, 40);
      pdf.setFontSize(12);
      let yPos = slide.subtitle ? 70 : 55;

      slide.bullets.forEach((bullet) => {
        const lines = pdf.splitTextToSize(`• ${bullet}`, contentWidth - 10);
        lines.forEach((line: string) => {
          if (yPos < pageHeight - margin - 20) {
            pdf.text(line, margin + 5, yPos);
            yPos += 8;
          }
        });
        yPos += 4;
      });

      // Speaker notes at bottom
      if (slide.notes) {
        pdf.setFillColor(245, 245, 245);
        pdf.rect(margin, pageHeight - 35, contentWidth, 25, 'F');
        pdf.setTextColor(100, 100, 100);
        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'italic');
        const noteLines = pdf.splitTextToSize(`Notes: ${slide.notes}`, contentWidth - 10);
        pdf.text(noteLines.slice(0, 3), margin + 5, pageHeight - 28);
      }

      // Footer
      pdf.setTextColor(150, 150, 150);
      pdf.setFontSize(8);
      pdf.text(ledger.ideaSnapshot?.ideaName || 'Pitch Deck', margin, pageHeight - 8);
    });

    pdf.save(`${ledger.ideaSnapshot?.ideaName || 'pitch-deck'}.pdf`);
    toast.success("PDF exported successfully!");
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
  const isEditing = editingSlide === currentSlide;

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
            Regenerate All
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={exportToText}
            className="text-primary-foreground hover:bg-white/20"
          >
            <FileText className="h-4 w-4 mr-1" />
            Text
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={exportToPDF}
            className="text-primary-foreground hover:bg-white/20"
          >
            <Download className="h-4 w-4 mr-1" />
            PDF
          </Button>
        </div>
      </div>

      {/* Slide Content */}
      <div className="p-8 min-h-[400px] flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-muted-foreground">
            Slide {currentSlide + 1} of {slides.length}
          </span>
          <div className="flex gap-2">
            {!isEditing ? (
              <>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => startEditing(currentSlide)}
                >
                  <Edit3 className="h-3 w-3 mr-1" />
                  Edit
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => regenerateSlide(currentSlide)}
                  disabled={isRegeneratingSlide}
                >
                  <RefreshCw className={`h-3 w-3 mr-1 ${isRegeneratingSlide ? 'animate-spin' : ''}`} />
                  Regenerate
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="default" 
                  size="sm"
                  onClick={saveEdit}
                  className="bg-success hover:bg-success/90"
                >
                  <Check className="h-3 w-3 mr-1" />
                  Save
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={cancelEdit}
                >
                  <X className="h-3 w-3 mr-1" />
                  Cancel
                </Button>
              </>
            )}
          </div>
        </div>
        
        {isEditing && editForm ? (
          <div className="space-y-4 flex-1">
            <Input
              value={editForm.title}
              onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
              placeholder="Slide title"
              className="text-xl font-bold"
            />
            <Input
              value={editForm.subtitle || ''}
              onChange={(e) => setEditForm({ ...editForm, subtitle: e.target.value })}
              placeholder="Subtitle (optional)"
              className="text-muted-foreground"
            />
            <div className="space-y-2">
              <label className="text-sm font-medium">Bullet Points</label>
              {editForm.bullets.map((bullet, i) => (
                <div key={i} className="flex gap-2">
                  <Input
                    value={bullet}
                    onChange={(e) => updateBullet(i, e.target.value)}
                    placeholder={`Bullet ${i + 1}`}
                  />
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => removeBullet(i)}
                    disabled={editForm.bullets.length <= 1}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={addBullet}>
                + Add Bullet
              </Button>
            </div>
            <Textarea
              value={editForm.notes || ''}
              onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
              placeholder="Speaker notes (optional)"
              rows={2}
            />
          </div>
        ) : (
          <>
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
          </>
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
