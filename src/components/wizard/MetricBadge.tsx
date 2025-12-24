import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface MetricBadgeProps {
  label: string;
  value: 'low' | 'medium' | 'high' | 'weak' | 'moderate' | 'strong';
  icon?: React.ReactNode;
  inverted?: boolean; // For metrics where "low" is good (e.g., market saturation)
}

export const MetricBadge = ({ label, value, icon, inverted = false }: MetricBadgeProps) => {
  const isPositive = inverted 
    ? ['low', 'weak'].includes(value)
    : ['high', 'strong'].includes(value);
  
  const isNeutral = ['medium', 'moderate'].includes(value);

  return (
    <div className={cn(
      "flex items-center gap-3 p-3 border-2 border-border",
      isPositive && "bg-secondary border-foreground",
      !isPositive && !isNeutral && "opacity-70"
    )}>
      <div className="shrink-0">
        {icon || (
          isPositive ? <TrendingUp className="h-5 w-5" /> :
          isNeutral ? <Minus className="h-5 w-5 text-muted-foreground" /> :
          <TrendingDown className="h-5 w-5 text-muted-foreground" />
        )}
      </div>
      <div className="flex-1">
        <p className="text-xs font-mono uppercase text-muted-foreground">{label}</p>
        <p className="font-bold uppercase">{value}</p>
      </div>
    </div>
  );
};
