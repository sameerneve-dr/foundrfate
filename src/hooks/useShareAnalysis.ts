import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useDecisionLedger } from "@/contexts/DecisionLedgerContext";
import { useToast } from "@/hooks/use-toast";
import type { Json } from "@/integrations/supabase/types";

const generateShareId = () => {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export const useShareAnalysis = () => {
  const [isSharing, setIsSharing] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const { ledger } = useDecisionLedger();
  const { toast } = useToast();

  const shareAnalysis = async (): Promise<string | null> => {
    if (!ledger.ideaSnapshot || !ledger.analysis) {
      toast({
        title: "Cannot share",
        description: "Complete your analysis first before sharing.",
        variant: "destructive",
      });
      return null;
    }

    setIsSharing(true);

    try {
      const shareId = generateShareId();
      
      const { error } = await supabase
        .from('shared_analyses')
        .insert([{
          share_id: shareId,
          idea_name: ledger.ideaSnapshot.ideaName,
          idea_snapshot: JSON.parse(JSON.stringify(ledger.ideaSnapshot)) as Json,
          analysis_result: JSON.parse(JSON.stringify(ledger.analysis)) as Json,
          decision_ledger: JSON.parse(JSON.stringify({
            targetCustomer: ledger.targetCustomer,
            profitType: ledger.profitType,
            entityType: ledger.entityType,
            fundraisingIntent: ledger.fundraisingIntent,
            verdict: ledger.verdict,
          })) as Json,
        }]);

      if (error) throw error;

      const url = `${window.location.origin}/share/${shareId}`;
      setShareUrl(url);

      toast({
        title: "Link created!",
        description: "Your analysis is now shareable.",
      });

      return url;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to create share link";
      toast({
        title: "Sharing failed",
        description: message,
        variant: "destructive",
      });
      return null;
    } finally {
      setIsSharing(false);
    }
  };

  const copyToClipboard = async () => {
    if (!shareUrl) return;
    
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Copied!",
        description: "Link copied to clipboard.",
      });
    } catch {
      toast({
        title: "Copy failed",
        description: "Please copy the link manually.",
        variant: "destructive",
      });
    }
  };

  return {
    shareAnalysis,
    copyToClipboard,
    isSharing,
    shareUrl,
  };
};
