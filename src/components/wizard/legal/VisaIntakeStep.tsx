import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight, User, MapPin } from "lucide-react";
import { useDecisionLedger, type VisaStatus } from "@/contexts/DecisionLedgerContext";

interface VisaIntakeStepProps {
  onComplete: () => void;
}

const visaOptions: { value: VisaStatus; label: string; desc: string }[] = [
  { value: 'us-citizen', label: 'U.S. Citizen', desc: 'Full rights, no restrictions' },
  { value: 'green-card', label: 'Permanent Resident (Green Card)', desc: 'Full work authorization' },
  { value: 'f1-no-opt', label: 'F-1 Student (No OPT yet)', desc: 'Currently enrolled, no work auth' },
  { value: 'f1-opt', label: 'F-1 on OPT', desc: '12-month post-graduation work' },
  { value: 'f1-stem-opt', label: 'F-1 on STEM OPT', desc: '24-month STEM extension' },
  { value: 'h1b', label: 'H-1B', desc: 'Specialty occupation visa' },
  { value: 'o1', label: 'O-1', desc: 'Extraordinary ability visa' },
  { value: 'l1', label: 'L-1', desc: 'Intracompany transfer visa' },
  { value: 'other', label: 'Other', desc: 'Different visa type' },
  { value: 'not-sure', label: 'Not sure', desc: 'Need to check my status' }
];

export const VisaIntakeStep = ({ onComplete }: VisaIntakeStepProps) => {
  const { ledger, updateLedger } = useDecisionLedger();
  const [selectedVisa, setSelectedVisa] = useState<VisaStatus>(ledger.founderVisaStatus);
  const [inUS, setInUS] = useState<boolean | null>(ledger.founderInUS);
  const [step, setStep] = useState<'visa' | 'location'>('visa');

  const handleVisaSelect = (visa: VisaStatus) => {
    setSelectedVisa(visa);
    updateLedger({ founderVisaStatus: visa });
    setStep('location');
  };

  const handleLocationSelect = (isInUS: boolean) => {
    setInUS(isInUS);
    updateLedger({ founderInUS: isInUS });
    onComplete();
  };

  if (step === 'location') {
    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold">Are you currently in the U.S.?</h2>
          <p className="text-muted-foreground mt-2">This affects your startup options</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <button
            onClick={() => handleLocationSelect(true)}
            className={`flex flex-col items-center gap-3 p-6 border-2 transition-all
              ${inUS === true ? 'border-foreground bg-secondary' : 'border-border hover:bg-secondary/50'}`}
          >
            <MapPin className="h-8 w-8" />
            <div className="text-center">
              <p className="font-bold text-lg">Yes, I'm in the U.S.</p>
              <p className="text-sm text-muted-foreground">Currently located in the United States</p>
            </div>
          </button>

          <button
            onClick={() => handleLocationSelect(false)}
            className={`flex flex-col items-center gap-3 p-6 border-2 transition-all
              ${inUS === false ? 'border-foreground bg-secondary' : 'border-border hover:bg-secondary/50'}`}
          >
            <MapPin className="h-8 w-8" />
            <div className="text-center">
              <p className="font-bold text-lg">No, I'm abroad</p>
              <p className="text-sm text-muted-foreground">Currently outside the United States</p>
            </div>
          </button>
        </div>

        <Button variant="outline" onClick={() => setStep('visa')}>
          Back
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold">What is your current visa/status?</h2>
        <p className="text-muted-foreground mt-2">This helps us show what you can legally do</p>
      </div>

      <div className="grid gap-2">
        {visaOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => handleVisaSelect(option.value)}
            className={`flex items-center gap-4 p-4 border-2 transition-all text-left
              ${selectedVisa === option.value ? 'border-foreground bg-secondary' : 'border-border hover:bg-secondary/50'}`}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0
              ${selectedVisa === option.value ? 'bg-foreground text-background' : 'bg-secondary'}`}>
              <User className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="font-bold">{option.label}</p>
              <p className="text-sm text-muted-foreground">{option.desc}</p>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </button>
        ))}
      </div>
    </div>
  );
};
