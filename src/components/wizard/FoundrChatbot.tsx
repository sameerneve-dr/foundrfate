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

export type ChatMode = 'general' | 'investor';

const GENERAL_PROMPTS = [
  "Can I start a company on OPT?",
  "What should I register first?",
  "Do I need a lawyer?",
  "Explain C-Corp vs LLC",
  "Can I raise funding on F-1?",
  "What's the cheapest option?",
];

const INVESTOR_PROMPTS = [
  "Am I too early to raise?",
  "Should I pitch angels or VCs?",
  "How do I find warm intros?",
  "What will investors push back on?",
  "What's a fair pre-money valuation?",
  "How long does fundraising take?",
];

interface FoundrChatbotProps {
  initialMode?: ChatMode;
  prefilledMessage?: string;
}

export const FoundrChatbot = ({ initialMode = 'general', prefilledMessage }: FoundrChatbotProps) => {
  const [isOpen, setIsOpen] = useState(!!prefilledMessage);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<ChatMode>(initialMode);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { ledger } = useDecisionLedger();
  const processedPrefilledRef = useRef(false);

  const SUGGESTED_PROMPTS = mode === 'investor' ? INVESTOR_PROMPTS : GENERAL_PROMPTS;

  // Handle prefilled message
  useEffect(() => {
    if (prefilledMessage && !processedPrefilledRef.current) {
      processedPrefilledRef.current = true;
      handleSend(prefilledMessage);
    }
  }, [prefilledMessage]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getInvestorResponse = (query: string): string => {
    const q = query.toLowerCase();
    const ideaName = ledger.ideaSnapshot?.ideaName || 'your startup';
    
    // Too early to raise
    if (q.includes('early') || q.includes('too soon')) {
      const hasEntity = ledger.entityType;
      if (!hasEntity) {
        return `For ${ideaName}: You're likely too early if you don't have: 1) A clear problem/solution, 2) Some form of traction (users, waitlist, revenue), 3) A team or strong solo story. Most angels want to see momentum. Focus on: getting 10-20 design partners or launching a waitlist first.`;
      }
      return `For ${ideaName}: Consider raising when you have: 1) Proof people want this (signups, usage, revenue), 2) A story for why now, 3) Clear use of funds. You have your entity set up, which is good. The real question: can you show traction or a compelling narrative?`;
    }
    
    // Angels vs VCs
    if (q.includes('angel') || q.includes('vc') || q.includes('pitch')) {
      return `For ${ideaName}: **Angels** are better if: you're pre-product, need $25K-$150K, want quick decisions. **VCs** (pre-seed/seed) are better if: you have early traction, need $500K+, want strategic help. Most founders start with angels → accelerator → seed VC. Your path depends on how much you need and how fast you're growing.`;
    }
    
    // Warm intros
    if (q.includes('intro') || q.includes('warm') || q.includes('network')) {
      return `Finding warm intros for ${ideaName}: 1) LinkedIn: who do you know who knows investors? 2) Your university alumni network, 3) Accelerator alumni, 4) Founders who've raised (they often intro), 5) AngelList connections. Cold outreach works sometimes, but warm intros convert 10x better. Start by listing 20 people who might know investors.`;
    }
    
    // Pushback
    if (q.includes('pushback') || q.includes('object') || q.includes('concern')) {
      const analysis = ledger.analysis;
      let concerns = [];
      if (analysis?.decisionRationale.marketSaturation === 'high') concerns.push('crowded market');
      if (analysis?.decisionRationale.differentiation === 'weak') concerns.push('unclear differentiation');
      if (analysis?.decisionRationale.userUrgency === 'low') concerns.push('low user urgency');
      const concernList = concerns.length > 0 ? concerns.join(', ') : 'standard founder questions';
      return `For ${ideaName}, investors will likely push back on: ${concernList}. Common objections: 1) "Why you?" → founder-market fit, 2) "Why now?" → timing/urgency, 3) "How big can this get?" → market size, 4) "What's the moat?" → defensibility. Prepare strong answers for each.`;
    }
    
    // Valuation
    if (q.includes('valuation') || q.includes('pre-money') || q.includes('worth')) {
      return `Pre-seed valuations for ${ideaName}: $1M-$5M pre-money is typical for pre-product. $3M-$8M if you have early traction. $5M-$15M for strong teams with proven backgrounds. Don't obsess over valuation early—terms (pro-rata, board seats) matter more. SAFE notes are common: no valuation, just a cap.`;
    }
    
    // Timeline
    if (q.includes('long') || q.includes('time') || q.includes('how long')) {
      return `Fundraising timeline: Angels: 2-8 weeks per close. Pre-seed round: 2-4 months. Seed round: 3-6 months. The process: 1) Build target list (50-100 investors), 2) Get intros (2-3 weeks), 3) First meetings (2-4 weeks), 4) Follow-ups & due diligence (2-4 weeks), 5) Term sheet & close (2-4 weeks). Start earlier than you think.`;
    }
    
    return `I can help with investor questions for ${ideaName}. Ask about: timing to raise, angels vs VCs, finding warm intros, handling objections, valuation, or fundraising timelines. What would you like to know?`;
  };

  const getContextualResponse = (query: string): string => {
    const q = query.toLowerCase();
    const hasProceed = ledger.proceedIntent === 'yes' || ledger.proceedIntent === 'conditional';
    
    // Investor mode responses
    if (mode === 'investor') {
      return getInvestorResponse(query);
    }
    
    // If user hasn't committed, only answer high-level questions
    if (!hasProceed) {
      if (q.includes('proceed') || q.includes('should i') || q.includes('worth it')) {
        return "Based on the verdict, you should consider the key factors: market opportunity, your differentiation, and user urgency. If you're ready to commit, click 'Yes, proceed' to unlock detailed guidance on legal, visa, and registration steps.";
      }
      return "I can answer high-level questions about your idea. Once you decide to proceed, I'll have access to detailed guidance on legal setup, visa requirements, registration, and more. What would you like to know about the verdict?";
    }

    // Check which sections are unlocked for context
    const unlockedSections = Object.entries(ledger.unlockedSections)
      .filter(([_, state]) => state.unlocked)
      .map(([key]) => key);
    
    // Visa-related questions
    if (q.includes('opt') || q.includes('f-1') || q.includes('visa')) {
      if (!ledger.unlockedSections['legal-visa'].unlocked) {
        return "Great question about visa status! I can give you a quick overview: on most visas you can OWN a company, but WORKING for it depends on your specific visa type. For detailed guidance tailored to your situation, unlock the 'Legal & Visa Eligibility' section in your Execution Journey.";
      }
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
      <div className="bg-gradient-primary p-4 flex flex-col gap-3 shrink-0">
        <div className="flex items-center justify-between">
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
        {/* Mode Toggle */}
        <div className="flex gap-1 bg-white/10 rounded-lg p-1">
          <button
            onClick={() => setMode('general')}
            className={`flex-1 py-1.5 px-3 rounded-md text-xs font-medium transition-all ${
              mode === 'general' ? 'bg-white/20 text-primary-foreground' : 'text-primary-foreground/70 hover:text-primary-foreground'
            }`}
          >
            General
          </button>
          <button
            onClick={() => setMode('investor')}
            className={`flex-1 py-1.5 px-3 rounded-md text-xs font-medium transition-all ${
              mode === 'investor' ? 'bg-white/20 text-primary-foreground' : 'text-primary-foreground/70 hover:text-primary-foreground'
            }`}
          >
            Investor Prep
          </button>
        </div>
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
