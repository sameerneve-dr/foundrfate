import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface WizardProgressProps {
  currentStep: number;
  totalSteps: number;
  stepLabels: string[];
  onStepClick?: (step: number) => void;
  maxUnlockedStep: number;
}

export const WizardProgress = ({ 
  currentStep, 
  totalSteps, 
  stepLabels, 
  onStepClick,
  maxUnlockedStep 
}: WizardProgressProps) => {
  return (
    <div className="border-b-2 border-border bg-background">
      <div className="container py-4">
        {/* Mobile: Simple progress */}
        <div className="md:hidden flex items-center justify-between mb-2">
          <span className="text-sm font-mono text-muted-foreground">
            Step {currentStep + 1} of {totalSteps}
          </span>
          <span className="text-sm font-bold">{stepLabels[currentStep]}</span>
        </div>
        
        {/* Progress bar */}
        <div className="h-2 bg-secondary rounded-full overflow-hidden">
          <div 
            className="h-full bg-foreground transition-all duration-500 ease-out"
            style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
          />
        </div>
        
        {/* Desktop: Step labels */}
        <div className="hidden md:flex items-center justify-between mt-4">
          {stepLabels.map((label, index) => {
            const isCompleted = index < currentStep;
            const isCurrent = index === currentStep;
            const isClickable = index <= maxUnlockedStep && onStepClick;
            
            return (
              <button
                key={index}
                onClick={() => isClickable && onStepClick(index)}
                disabled={!isClickable}
                className={cn(
                  "flex items-center gap-2 text-sm transition-colors",
                  isClickable && "cursor-pointer hover:text-foreground",
                  !isClickable && "cursor-default",
                  isCurrent && "text-foreground font-bold",
                  isCompleted && "text-foreground",
                  !isCurrent && !isCompleted && "text-muted-foreground"
                )}
              >
                <div className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2",
                  isCurrent && "border-foreground bg-foreground text-background",
                  isCompleted && "border-foreground bg-foreground text-background",
                  !isCurrent && !isCompleted && "border-muted-foreground"
                )}>
                  {isCompleted ? <Check className="h-3 w-3" /> : index + 1}
                </div>
                <span className="hidden lg:inline">{label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
