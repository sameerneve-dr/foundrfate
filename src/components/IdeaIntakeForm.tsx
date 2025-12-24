import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import type { IdeaData } from "@/pages/Index";

interface IdeaIntakeFormProps {
  onSubmit: (data: IdeaData) => void;
  onBack: () => void;
}

export const IdeaIntakeForm = ({ onSubmit, onBack }: IdeaIntakeFormProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<IdeaData>({
    ideaName: "",
    problemStatement: "",
    proposedSolution: "",
    targetAudience: "",
    existingAlternatives: "",
    purpose: "real-startup",
    scaleIntent: "venture-scale",
    founderBackground: "",
    timeline: "",
  });

  const steps = [
    {
      title: "01 — The Idea",
      fields: ["ideaName", "problemStatement"],
    },
    {
      title: "02 — The Solution",
      fields: ["proposedSolution", "targetAudience"],
    },
    {
      title: "03 — The Landscape",
      fields: ["existingAlternatives", "purpose"],
    },
    {
      title: "04 — The Vision",
      fields: ["scaleIntent", "founderBackground", "timeline"],
    },
  ];

  const handleChange = (field: keyof IdeaData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    onSubmit(formData);
  };

  const isStepValid = () => {
    const currentFields = steps[currentStep].fields;
    return currentFields.every(field => {
      const value = formData[field as keyof IdeaData];
      return value && value.toString().trim() !== "";
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b-2 border-border p-4">
        <div className="container flex items-center justify-between">
          <button onClick={onBack} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span className="font-mono text-sm">Back</span>
          </button>
          <h1 className="text-xl font-bold">FoundrFate</h1>
          <span className="font-mono text-sm text-muted-foreground">
            {currentStep + 1}/{steps.length}
          </span>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="border-b-2 border-border">
        <div className="container">
          <div className="h-1 bg-secondary">
            <div 
              className="h-full bg-foreground transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="flex-1 py-12 px-4">
        <div className="container max-w-2xl">
          <div className="space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold">{steps[currentStep].title}</h2>

            <div className="space-y-6">
              {currentStep === 0 && (
                <>
                  <FormField
                    label="Idea Name"
                    description="Working title is fine"
                    value={formData.ideaName}
                    onChange={(v) => handleChange("ideaName", v)}
                    placeholder="e.g., FoundrFate"
                  />
                  <FormTextarea
                    label="Problem Statement"
                    description="Who is hurting, how badly, and why?"
                    value={formData.problemStatement}
                    onChange={(v) => handleChange("problemStatement", v)}
                    placeholder="Describe the problem in detail..."
                  />
                </>
              )}

              {currentStep === 1 && (
                <>
                  <FormTextarea
                    label="Proposed Solution"
                    description="What exactly are you building?"
                    value={formData.proposedSolution}
                    onChange={(v) => handleChange("proposedSolution", v)}
                    placeholder="Describe your solution..."
                  />
                  <FormTextarea
                    label="Target Audience"
                    description="Users vs buyers, B2B/B2C/etc."
                    value={formData.targetAudience}
                    onChange={(v) => handleChange("targetAudience", v)}
                    placeholder="Who are your primary users and customers?"
                  />
                </>
              )}

              {currentStep === 2 && (
                <>
                  <FormTextarea
                    label="Existing Alternatives"
                    description="What solutions exist today?"
                    value={formData.existingAlternatives}
                    onChange={(v) => handleChange("existingAlternatives", v)}
                    placeholder="List competitors or workarounds people use..."
                  />
                  <div className="space-y-3">
                    <Label className="text-lg font-medium">Purpose</Label>
                    <p className="text-sm text-muted-foreground">What's this for?</p>
                    <RadioGroup
                      value={formData.purpose}
                      onValueChange={(v) => handleChange("purpose", v)}
                      className="grid gap-3"
                    >
                      <RadioOption value="hackathon" label="Hackathon only" />
                      <RadioOption value="side-project" label="Side project" />
                      <RadioOption value="real-startup" label="Real startup" />
                    </RadioGroup>
                  </div>
                </>
              )}

              {currentStep === 3 && (
                <>
                  <div className="space-y-3">
                    <Label className="text-lg font-medium">Scale Intent</Label>
                    <p className="text-sm text-muted-foreground">How big do you want this to be?</p>
                    <RadioGroup
                      value={formData.scaleIntent}
                      onValueChange={(v) => handleChange("scaleIntent", v)}
                      className="grid gap-3"
                    >
                      <RadioOption value="lifestyle" label="Lifestyle business" />
                      <RadioOption value="venture-scale" label="Venture-scale" />
                      <RadioOption value="non-profit" label="Non-profit / social impact" />
                    </RadioGroup>
                  </div>
                  <FormTextarea
                    label="Founder Background"
                    description="Your skills, experience, and strengths"
                    value={formData.founderBackground}
                    onChange={(v) => handleChange("founderBackground", v)}
                    placeholder="What makes you the right person to build this?"
                  />
                  <FormField
                    label="Timeline Expectations"
                    description="How long do you expect this to take?"
                    value={formData.timeline}
                    onChange={(v) => handleChange("timeline", v)}
                    placeholder="e.g., 3 months to MVP, 1 year to revenue"
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="border-t-2 border-border p-4">
        <div className="container max-w-2xl flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Previous
          </Button>
          
          {currentStep < steps.length - 1 ? (
            <Button
              onClick={handleNext}
              disabled={!isStepValid()}
              className="gap-2"
            >
              Next
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!isStepValid() || isSubmitting}
              className="gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  Reveal My Fate
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

const FormField = ({
  label,
  description,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  description: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) => (
  <div className="space-y-3">
    <div>
      <Label className="text-lg font-medium">{label}</Label>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
    <Input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="border-2 h-12 text-base"
    />
  </div>
);

const FormTextarea = ({
  label,
  description,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  description: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) => (
  <div className="space-y-3">
    <div>
      <Label className="text-lg font-medium">{label}</Label>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
    <Textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="border-2 min-h-[120px] text-base resize-none"
    />
  </div>
);

const RadioOption = ({ value, label }: { value: string; label: string }) => (
  <div className="flex items-center space-x-3 border-2 border-border p-4 hover:bg-secondary transition-colors cursor-pointer">
    <RadioGroupItem value={value} id={value} />
    <Label htmlFor={value} className="cursor-pointer flex-1 font-medium">{label}</Label>
  </div>
);
