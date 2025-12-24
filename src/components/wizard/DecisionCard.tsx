import { Button } from "@/components/ui/button";
import { Check, X, HelpCircle, ChevronRight, Loader2 } from "lucide-react";
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
      "border-2 border-border p-6 space-y-4",
      accepted && "border-foreground bg-secondary",
      className
    )}>
      <div className="flex items-start gap-4">
        {icon && (
          <div className="shrink-0 w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
            {icon}
          </div>
        )}
        <div className="flex-1 space-y-2">
          <h3 className="text-lg font-bold">{title}</h3>
          <p className="text-muted-foreground">{description}</p>
          {recommendation && (
            <div className="inline-flex items-center gap-2 bg-foreground text-background px-3 py-1 text-sm font-bold">
              Recommended: {recommendation}
            </div>
          )}
        </div>
        {accepted && (
          <div className="shrink-0 w-8 h-8 rounded-full bg-foreground flex items-center justify-center">
            <Check className="h-4 w-4 text-background" />
          </div>
        )}
      </div>

      {!accepted && (
        <div className="flex flex-wrap gap-2 pt-2">
          {onAccept && (
            <Button 
              onClick={onAccept} 
              disabled={isLoading}
              className="gap-2"
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
              className="gap-2"
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
              className="gap-2"
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
              className="gap-2"
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
