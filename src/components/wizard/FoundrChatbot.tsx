import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  MessageCircle, 
  X, 
  Send, 
  Sparkles,
  User,
  Bot,
  Loader2
} from "lucide-react";
import { useDecisionLedger } from "@/contexts/DecisionLedgerContext";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const SUGGESTED_PROMPTS = [
  "Can I start a company on OPT?",
  "What should I register first?",
  "Do I need a lawyer?",
  "Explain C-Corp vs LLC",
  "Can I raise funding on F-1?",
  "What's the cheapest option?",
];

export const FoundrChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { ledger } = useDecisionLedger();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getContextualResponse = (query: string): string => {
    const q = query.toLowerCase();
    
    // Visa-related questions
    if (q.includes('opt') || q.includes('f-1') || q.includes('visa')) {
      if (ledger.founderVisaStatus === 'f1-opt' || ledger.founderVisaStatus === 'f1-stem-opt') {
        return "On OPT/STEM OPT, you CAN own and work for your startup if it's related to your field of study. Key requirements: 1) Maintain proper employment relationship, 2) Your startup must relate to your degree, 3) File all required reports. Many successful founders started on OPT. Would you like me to explain the specific requirements?";
      }
      if (ledger.founderVisaStatus === 'f1-no-opt') {
        return "On F-1 without OPT, you CAN incorporate a company and own shares. However, you CANNOT actively work for it or receive payment. Many founders prepare everything while in school, then activate when OPT begins. Consider: 1) Building your MVP as a 'school project', 2) Having a cofounder handle operations, 3) Applying for OPT as graduation approaches.";
      }
      return "Visa status significantly impacts what you can do. Generally: 1) You can always OWN a company on any visa, 2) WORKING for it depends on your specific visa, 3) F-1/OPT requires work to relate to your degree, 4) H-1B requires careful structuring. What's your current visa status?";
    }

    // Registration questions
    if (q.includes('register') || q.includes('first') || q.includes('start')) {
      const entity = ledger.entityType === 'delaware-c-corp' ? 'Delaware C-Corp' : 
                     ledger.entityType === 'llc' ? 'LLC' : 'your entity';
      return `For ${entity}, here's the order: 1) Choose and verify company name, 2) File with the state (Delaware or your state), 3) Get EIN from IRS (free, same-day), 4) Open business bank account, 5) Set up legal docs. The whole process takes 3-10 business days. Want me to break down any step?`;
    }

    // C-Corp vs LLC
    if (q.includes('c-corp') || q.includes('llc') || q.includes('vs')) {
      return "**C-Corp** is best if: raising VC money, planning stock options, aiming for large scale. **LLC** is best if: bootstrapping, simpler taxes (pass-through), fewer formalities. Most VC-backed startups are Delaware C-Corps. Most small businesses are LLCs. Your choice depends on your fundraising plans and scale intent.";
    }

    // Lawyer questions
    if (q.includes('lawyer') || q.includes('legal')) {
      return "You probably DON'T need a lawyer if: solo founder, standard equity, bootstrapping, using templates. You probably DO need one if: multiple cofounders with complex splits, taking investor money soon, regulated industry, complex IP. Good news: platforms like Clerky and Stripe Atlas handle most legal docs. Budget $1,000-3,000 if you do hire one.";
    }

    // Cost questions
    if (q.includes('cheap') || q.includes('cost') || q.includes('budget')) {
      return "Cheapest path: DIY everything. Delaware C-Corp: ~$300 total (filing $89 + registered agent $125 + franchise tax $225). LLC: ~$100-300 depending on state. Add $500 if using Stripe Atlas (includes banking + more). Legal docs are free if you use templates. Want a detailed cost breakdown?";
    }

    // Funding questions
    if (q.includes('fund') || q.includes('invest') || q.includes('raise')) {
      return "For raising money: 1) Delaware C-Corp is the standard (investors expect it), 2) You'll need proper legal docs (bylaws, stock purchase agreements), 3) 83(b) election is CRITICAL (file within 30 days of stock grant), 4) Cap table should be clean. On visas: F-1 can raise funding, H-1B works too with proper structure. The entity type matters more than visa status for fundraising.";
    }

    // Default response
    return "I can help with visa questions, company registration, entity selection, and founder legal topics. I provide guidance (not legal advice). What specific question do you have about starting your company?";
  };

  const handleSend = async (message: string) => {
    if (!message.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate AI response delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const response = getContextualResponse(message);
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: response,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, assistantMessage]);
    setIsLoading(false);
  };

  const handlePromptClick = (prompt: string) => {
    handleSend(prompt);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-2xl bg-gradient-primary shadow-xl shadow-primary/30 flex items-center justify-center text-primary-foreground hover:scale-105 transition-transform animate-bounce-subtle"
      >
        <MessageCircle className="h-6 w-6" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-3rem)] h-[500px] max-h-[calc(100vh-6rem)] bg-card rounded-2xl shadow-2xl border border-border/50 flex flex-col overflow-hidden animate-scale-in">
      {/* Header */}
      <div className="bg-gradient-primary p-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-bold text-primary-foreground">Ask FoundrFate</h3>
            <p className="text-xs text-primary-foreground/80">Your founder guide</p>
          </div>
        </div>
        <button 
          onClick={() => setIsOpen(false)}
          className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-primary-foreground transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Bot className="h-4 w-4 text-primary" />
              </div>
              <div className="bg-muted rounded-2xl rounded-tl-sm p-3 max-w-[85%]">
                <p className="text-sm">
                  Hi! I'm here to help with visa questions, registration steps, and founder legal topics. 
                  <span className="block mt-2 text-xs text-muted-foreground italic">
                    This is guidance, not legal advice.
                  </span>
                </p>
              </div>
            </div>
            
            {/* Suggested Prompts */}
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground font-medium px-1">Try asking:</p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTED_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => handlePromptClick(prompt)}
                    className="px-3 py-1.5 bg-primary/5 hover:bg-primary/10 border border-primary/20 rounded-full text-xs font-medium text-primary transition-colors hover:scale-105"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex gap-3",
                  msg.role === 'user' && "flex-row-reverse"
                )}
              >
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                  msg.role === 'user' ? "bg-accent/10" : "bg-primary/10"
                )}>
                  {msg.role === 'user' ? (
                    <User className="h-4 w-4 text-accent" />
                  ) : (
                    <Bot className="h-4 w-4 text-primary" />
                  )}
                </div>
                <div className={cn(
                  "rounded-2xl p-3 max-w-[85%] text-sm",
                  msg.role === 'user' 
                    ? "bg-accent text-accent-foreground rounded-tr-sm" 
                    : "bg-muted rounded-tl-sm"
                )}>
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
                <div className="bg-muted rounded-2xl rounded-tl-sm p-3">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Suggested prompts when there are messages */}
      {messages.length > 0 && (
        <div className="px-4 pb-2 flex gap-2 overflow-x-auto shrink-0">
          {SUGGESTED_PROMPTS.slice(0, 3).map((prompt) => (
            <button
              key={prompt}
              onClick={() => handlePromptClick(prompt)}
              className="px-2.5 py-1 bg-muted hover:bg-muted/80 rounded-full text-xs font-medium whitespace-nowrap transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-border shrink-0">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
            placeholder="Ask anything..."
            className="flex-1 rounded-xl border-2"
            disabled={isLoading}
          />
          <Button
            onClick={() => handleSend(input)}
            disabled={!input.trim() || isLoading}
            size="icon"
            className="shrink-0 rounded-xl bg-gradient-primary hover:opacity-90"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
