import { Check, Sparkles } from "lucide-react";
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
  const progressPercent = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="bg-card/80 backdrop-blur-sm border-b border-border/50">
      <div className="container py-4">
        {/* Mobile: Enhanced progress */}
        <div className="md:hidden flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <span className="text-sm font-bold text-primary-foreground">{currentStep + 1}</span>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Step {currentStep + 1} of {totalSteps}</p>
              <p className="text-sm font-bold">{stepLabels[currentStep]}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-primary">{Math.round(progressPercent)}%</p>
          </div>
        </div>
        
        {/* Gradient progress bar */}
        <div className="h-2 bg-muted rounded-full overflow-hidden shadow-inner">
          <div 
            className="h-full progress-gradient transition-all duration-500 ease-out relative"
            style={{ width: `${progressPercent}%` }}
          >
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" 
                 style={{ backgroundSize: '200% 100%' }} />
          </div>
        </div>
        
        {/* Desktop: Step indicators */}
        <div className="hidden md:flex items-center justify-between mt-4 gap-2">
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
                  "flex items-center gap-2 text-sm transition-all duration-200 group",
                  isClickable && "cursor-pointer",
                  !isClickable && "cursor-default opacity-60"
                )}
              >
                <div className={cn(
                  "w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold transition-all duration-200",
                  isCurrent && "bg-gradient-primary text-primary-foreground shadow-lg shadow-primary/30 scale-110",
                  isCompleted && "bg-success text-success-foreground",
                  !isCurrent && !isCompleted && "bg-muted text-muted-foreground",
                  isClickable && !isCurrent && "group-hover:scale-105"
                )}>
                  {isCompleted ? <Check className="h-4 w-4" /> : index + 1}
                </div>
                <span className={cn(
                  "hidden lg:inline transition-colors",
                  isCurrent && "font-bold text-foreground",
                  isCompleted && "text-success font-medium",
                  !isCurrent && !isCompleted && "text-muted-foreground"
                )}>
                  {label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
