import { useState } from "react";
import { 
  MessageSquare, 
  AlertTriangle, 
  DollarSign,
  Scale,
  ChevronRight,
  Sparkles,
  Send
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface InvestorEducationProps {
  onChatWithBot: (message: string) => void;
}

export const InvestorEducation = ({ onChatWithBot }: InvestorEducationProps) => {
  console.log("InvestorEducation mounted");
  const topics = [
    {
      id: 'outreach',
      icon: <MessageSquare className="h-5 w-5" />,
      label: 'Write my first investor outreach message',
      prompt: 'Help me write a compelling first outreach message to investors based on my idea and analysis.',
      color: 'primary'
    },
    {
      id: 'mistakes',
      icon: <AlertTriangle className="h-5 w-5" />,
      label: 'What NOT to say to VCs',
      prompt: 'What are the common mistakes founders make when pitching to VCs that I should avoid?',
      color: 'warning'
    },
    {
      id: 'how-much',
      icon: <DollarSign className="h-5 w-5" />,
      label: 'How much should I raise?',
      prompt: 'Based on my idea and stage, how much should I try to raise in my first round?',
      color: 'success'
    },
    {
      id: 'valuation',
      icon: <Scale className="h-5 w-5" />,
      label: 'How valuation works (simply)',
      prompt: 'Explain how startup valuation works in simple terms for a first-time founder.',
      color: 'accent'
    }
  ];

  const colorClasses: Record<string, string> = {
    primary: 'bg-primary/10 text-primary border-primary/30 hover:bg-primary/20',
    warning: 'bg-warning/10 text-warning border-warning/30 hover:bg-warning/20',
    success: 'bg-success/10 text-success border-success/30 hover:bg-success/20',
    accent: 'bg-accent/10 text-accent border-accent/30 hover:bg-accent/20'
  };

  return (
    <div className="bg-card rounded-2xl border border-border/50 shadow-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-accent flex items-center justify-center">
          <Sparkles className="h-5 w-5 text-accent-foreground" />
        </div>
        <div>
          <h3 className="text-lg font-bold">Step 5: Learn How to Approach Investors</h3>
          <p className="text-sm text-muted-foreground">Personalized guidance based on your idea</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        {topics.map((topic) => (
          <button
            key={topic.id}
            onClick={() => onChatWithBot(topic.prompt)}
            className={`flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all group ${colorClasses[topic.color]}`}
          >
            <div className="w-10 h-10 rounded-lg bg-background/50 flex items-center justify-center shrink-0">
              {topic.icon}
            </div>
            <span className="flex-1 font-medium text-sm text-foreground">{topic.label}</span>
            <ChevronRight className="h-4 w-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
          </button>
        ))}
      </div>

      <p className="text-xs text-muted-foreground text-center mt-4">
        All responses use your saved idea, competitor analysis, and business model.
      </p>
    </div>
  );
};