import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface AnimatedStepProps {
  children: React.ReactNode;
  stepKey: number | string;
  className?: string;
}

export const AnimatedStep = ({ children, stepKey, className }: AnimatedStepProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const prevKeyRef = useRef(stepKey);

  useEffect(() => {
    // Reset animation when step changes
    if (prevKeyRef.current !== stepKey) {
      setIsVisible(false);
      const timer = setTimeout(() => setIsVisible(true), 50);
      prevKeyRef.current = stepKey;
      return () => clearTimeout(timer);
    } else {
      setIsVisible(true);
    }
  }, [stepKey]);

  return (
    <div 
      className={cn(
        "transition-all duration-300",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
        className
      )}
    >
      {children}
    </div>
  );
};
