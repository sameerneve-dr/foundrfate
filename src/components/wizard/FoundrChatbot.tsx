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
import { toast } from "sonner";

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

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/foundr-chat`;

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

    try {
      // Build conversation history for API
      const conversationHistory = [...messages, userMessage].map(m => ({
        role: m.role,
        content: m.content
      }));

      const response = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: conversationHistory,
          mode,
          context: {
            ideaSnapshot: ledger.ideaSnapshot,
            analysis: ledger.analysis,
            entityType: ledger.entityType,
            founderVisaStatus: ledger.founderVisaStatus,
            fundraisingIntent: ledger.fundraisingIntent,
          }
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 429) {
          toast.error("Rate limit reached. Please try again in a moment.");
        } else if (response.status === 402) {
          toast.error("AI usage limit reached. Please check your workspace credits.");
        } else {
          toast.error(errorData.error || "Failed to get response");
        }
        setIsLoading(false);
        return;
      }

      // Handle streaming response
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantContent = "";
      let textBuffer = "";

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          textBuffer += decoder.decode(value, { stream: true });

          // Process line-by-line
          let newlineIndex: number;
          while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
            let line = textBuffer.slice(0, newlineIndex);
            textBuffer = textBuffer.slice(newlineIndex + 1);

            if (line.endsWith("\r")) line = line.slice(0, -1);
            if (line.startsWith(":") || line.trim() === "") continue;
            if (!line.startsWith("data: ")) continue;

            const jsonStr = line.slice(6).trim();
            if (jsonStr === "[DONE]") break;

            try {
              const parsed = JSON.parse(jsonStr);
              const content = parsed.choices?.[0]?.delta?.content;
              if (content) {
                assistantContent += content;
                setMessages(prev => 
                  prev.map((m, i) => 
                    i === prev.length - 1 ? { ...m, content: assistantContent } : m
                  )
                );
              }
            } catch {
              // Incomplete JSON, put it back
              textBuffer = line + "\n" + textBuffer;
              break;
            }
          }
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      toast.error("Failed to connect to AI. Please try again.");
    } finally {
      setIsLoading(false);
    }
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
              <p className="text-xs text-primary-foreground/80">AI-powered guidance</p>
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
            {isLoading && messages[messages.length - 1]?.role !== 'assistant' && (
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
      <div className="p-4 border-t border-border/50 shrink-0">
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(input);
          }}
          className="flex gap-2"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button 
            type="submit" 
            size="icon" 
            disabled={isLoading || !input.trim()}
            className="shrink-0"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};
