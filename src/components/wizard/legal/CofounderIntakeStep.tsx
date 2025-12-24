import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight, User, Users, Plus, Trash2 } from "lucide-react";
import { useDecisionLedger, type VisaStatus, type CofounderInfo } from "@/contexts/DecisionLedgerContext";

interface CofounderIntakeStepProps {
  onComplete: () => void;
}

const visaOptions: { value: VisaStatus; label: string }[] = [
  { value: 'us-citizen', label: 'U.S. Citizen' },
  { value: 'green-card', label: 'Green Card' },
  { value: 'f1-no-opt', label: 'F-1 (No OPT)' },
  { value: 'f1-opt', label: 'F-1 on OPT' },
  { value: 'f1-stem-opt', label: 'F-1 STEM OPT' },
  { value: 'h1b', label: 'H-1B' },
  { value: 'o1', label: 'O-1' },
  { value: 'l1', label: 'L-1' },
  { value: 'other', label: 'Other' },
  { value: 'not-sure', label: 'Not sure' }
];

export const CofounderIntakeStep = ({ onComplete }: CofounderIntakeStepProps) => {
  const { ledger, updateLedger } = useDecisionLedger();
  const [hasCofounder, setHasCofounder] = useState<'no' | 'one' | 'multiple' | null>(ledger.hasCofounder);
  const [cofounders, setCofounders] = useState<CofounderInfo[]>(ledger.cofounders);
  const [step, setStep] = useState<'ask' | 'details'>('ask');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleCofounderChoice = (choice: 'no' | 'one' | 'multiple') => {
    setHasCofounder(choice);
    updateLedger({ hasCofounder: choice });
    
    if (choice === 'no') {
      updateLedger({ cofounders: [] });
      onComplete();
    } else {
      if (cofounders.length === 0) {
        const newCofounder: CofounderInfo = {
          id: crypto.randomUUID(),
          visaStatus: null,
          role: 'technical',
          inUS: true
        };
        setCofounders([newCofounder]);
        setEditingIndex(0);
      }
      setStep('details');
    }
  };

  const addCofounder = () => {
    const newCofounder: CofounderInfo = {
      id: crypto.randomUUID(),
      visaStatus: null,
      role: 'technical',
      inUS: true
    };
    const updated = [...cofounders, newCofounder];
    setCofounders(updated);
    setEditingIndex(updated.length - 1);
  };

  const removeCofounder = (index: number) => {
    const updated = cofounders.filter((_, i) => i !== index);
    setCofounders(updated);
    if (updated.length === 0) {
      setStep('ask');
      setHasCofounder(null);
    } else if (editingIndex === index) {
      setEditingIndex(null);
    }
  };

  const updateCofounder = (index: number, updates: Partial<CofounderInfo>) => {
    const updated = cofounders.map((cf, i) => 
      i === index ? { ...cf, ...updates } : cf
    );
    setCofounders(updated);
  };

  const handleComplete = () => {
    updateLedger({ cofounders });
    onComplete();
  };

  const isAllComplete = cofounders.every(cf => cf.visaStatus !== null);

  if (step === 'details') {
    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold">Cofounder Details</h2>
          <p className="text-muted-foreground mt-2">Tell us about each cofounder</p>
        </div>

        <div className="space-y-4">
          {cofounders.map((cf, index) => (
            <div key={cf.id} className="border-2 border-border p-4 space-y-4">
              <div className="flex items-center justify-between">
                <p className="font-bold">Cofounder {index + 1}</p>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => removeCofounder(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              {/* Visa Status */}
              <div className="space-y-2">
                <p className="text-sm font-medium">Visa/Status</p>
                <div className="flex flex-wrap gap-2">
                  {visaOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => updateCofounder(index, { visaStatus: opt.value })}
                      className={`px-3 py-1.5 text-sm border transition-colors
                        ${cf.visaStatus === opt.value 
                          ? 'border-foreground bg-foreground text-background' 
                          : 'border-border hover:bg-secondary'}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Role */}
              <div className="space-y-2">
                <p className="text-sm font-medium">Role</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => updateCofounder(index, { role: 'technical' })}
                    className={`px-4 py-2 text-sm border transition-colors
                      ${cf.role === 'technical' 
                        ? 'border-foreground bg-foreground text-background' 
                        : 'border-border hover:bg-secondary'}`}
                  >
                    Technical
                  </button>
                  <button
                    onClick={() => updateCofounder(index, { role: 'business' })}
                    className={`px-4 py-2 text-sm border transition-colors
                      ${cf.role === 'business' 
                        ? 'border-foreground bg-foreground text-background' 
                        : 'border-border hover:bg-secondary'}`}
                  >
                    Business
                  </button>
                </div>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <p className="text-sm font-medium">In the U.S.?</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => updateCofounder(index, { inUS: true })}
                    className={`px-4 py-2 text-sm border transition-colors
                      ${cf.inUS === true 
                        ? 'border-foreground bg-foreground text-background' 
                        : 'border-border hover:bg-secondary'}`}
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => updateCofounder(index, { inUS: false })}
                    className={`px-4 py-2 text-sm border transition-colors
                      ${cf.inUS === false 
                        ? 'border-foreground bg-foreground text-background' 
                        : 'border-border hover:bg-secondary'}`}
                  >
                    No
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {hasCofounder === 'multiple' && cofounders.length < 4 && (
          <Button variant="outline" onClick={addCofounder} className="gap-2">
            <Plus className="h-4 w-4" />
            Add another cofounder
          </Button>
        )}

        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setStep('ask')}>
            Back
          </Button>
          <Button 
            onClick={handleComplete}
            disabled={!isAllComplete}
            className="flex-1 gap-2"
          >
            Continue
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold">Do you have a cofounder?</h2>
        <p className="text-muted-foreground mt-2">Cofounder status affects legal structure options</p>
      </div>

      <div className="grid gap-4">
        <button
          onClick={() => handleCofounderChoice('no')}
          className={`flex items-center gap-4 p-4 border-2 transition-all text-left
            ${hasCofounder === 'no' ? 'border-foreground bg-secondary' : 'border-border hover:bg-secondary/50'}`}
        >
          <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center shrink-0">
            <User className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <p className="font-bold">No, solo founder</p>
            <p className="text-sm text-muted-foreground">I'm building this alone</p>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </button>

        <button
          onClick={() => handleCofounderChoice('one')}
          className={`flex items-center gap-4 p-4 border-2 transition-all text-left
            ${hasCofounder === 'one' ? 'border-foreground bg-secondary' : 'border-border hover:bg-secondary/50'}`}
        >
          <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center shrink-0">
            <Users className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <p className="font-bold">Yes, one cofounder</p>
            <p className="text-sm text-muted-foreground">I have a partner</p>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </button>

        <button
          onClick={() => handleCofounderChoice('multiple')}
          className={`flex items-center gap-4 p-4 border-2 transition-all text-left
            ${hasCofounder === 'multiple' ? 'border-foreground bg-secondary' : 'border-border hover:bg-secondary/50'}`}
        >
          <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center shrink-0">
            <Users className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <p className="font-bold">Yes, multiple cofounders</p>
            <p className="text-sm text-muted-foreground">We're a team</p>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </button>
      </div>
    </div>
  );
};
