import { Button } from "@/components/ui/button";
import { Check, X, HelpCircle, ChevronRight, Loader2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface DecisionCardProps {
  title: string;
  description: string;
  recommendation?: string;
  icon?: React.ReactNode;
  onAccept?: () => void;
  onReject?: () => void;
  onExplain?: () => void;
  onShowOptions?: () => void;
  isLoading?: boolean;
  accepted?: boolean;
  className?: string;
}

export const DecisionCard = ({
  title,
  description,
  recommendation,
  icon,
  onAccept,
  onReject,
  onExplain,
  onShowOptions,
  isLoading,
  accepted,
  className
}: DecisionCardProps) => {
  return (
    <div className={cn(
      "bg-card rounded-2xl border border-border/50 shadow-lg p-6 space-y-4 transition-all duration-200",
      accepted && "ring-2 ring-success bg-success/5",
      !accepted && "hover:shadow-xl",
      className
    )}>
      <div className="flex items-start gap-4">
        {icon && (
          <div className="shrink-0 w-14 h-14 rounded-xl bg-gradient-primary flex items-center justify-center text-primary-foreground">
            {icon}
          </div>
        )}
        <div className="flex-1 space-y-2">
          <h3 className="text-xl font-bold">{title}</h3>
          <p className="text-muted-foreground leading-relaxed">{description}</p>
          {recommendation && (
            <span className="pill pill-primary">
              <Sparkles className="h-3 w-3" />
              Recommended: {recommendation}
            </span>
          )}
        </div>
        {accepted && (
          <div className="shrink-0 w-10 h-10 rounded-xl bg-success flex items-center justify-center">
            <Check className="h-5 w-5 text-success-foreground" />
          </div>
        )}
      </div>

      {!accepted && (
        <div className="flex flex-wrap gap-3 pt-2">
          {onAccept && (
            <Button 
              onClick={onAccept} 
              disabled={isLoading}
              className="gap-2 bg-gradient-primary hover:opacity-90 text-primary-foreground rounded-xl btn-glow-primary"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
              Yes, accept
            </Button>
          )}
          {onShowOptions && (
            <Button 
              variant="outline" 
              onClick={onShowOptions}
              disabled={isLoading}
              className="gap-2 rounded-xl border-2"
            >
              <ChevronRight className="h-4 w-4" />
              Show options
            </Button>
          )}
          {onReject && (
            <Button 
              variant="outline" 
              onClick={onReject}
              disabled={isLoading}
              className="gap-2 rounded-xl border-2 hover:bg-destructive/10 hover:border-destructive/50"
            >
              <X className="h-4 w-4" />
              No
            </Button>
          )}
          {onExplain && (
            <Button 
              variant="ghost" 
              onClick={onExplain}
              disabled={isLoading}
              className="gap-2 rounded-xl"
            >
              <HelpCircle className="h-4 w-4" />
              Explain
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
