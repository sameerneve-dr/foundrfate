import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { AnalysisResult } from '@/hooks/useIdeaAnalysis';

export type TargetCustomer = 'consumer' | 'b2b' | 'regulator' | 'product-teams' | null;
export type ProfitType = 'for-profit' | 'non-profit' | 'hybrid' | null;
export type EntityType = 'delaware-c-corp' | 'llc' | 'non-profit-501c3' | 'other' | null;
export type FundraisingIntent = 'venture-scale' | 'bootstrap' | 'mixed' | null;

export interface IdeaSnapshot {
  ideaName: string;
  problem: string;
  solution: string;
  audience: string;
  scaleIntent: 'lifestyle' | 'venture-scale' | 'non-profit';
}

export interface DecisionLedger {
  // Idea inputs
  ideaSnapshot: IdeaSnapshot | null;
  
  // AI Analysis result
  analysis: AnalysisResult | null;
  
  // Verdict
  verdict: 'yes' | 'conditional' | 'no' | null;
  verdictAccepted: boolean;
  
  // Target customer
  targetCustomer: TargetCustomer;
  
  // Profit type
  profitType: ProfitType;
  profitTypeAccepted: boolean;
  
  // Entity
  entityType: EntityType;
  entityAccepted: boolean;
  
  // Fundraising (unlocked after for-profit accepted)
  fundraisingIntent: FundraisingIntent;
  
  // Pivots
  selectedPivots: string[];
  
  // Timeline
  timeline: string | null;
  
  // C-Corp setup progress
  cCorpSetup: {
    preIncorporation: {
      nameCheck: boolean;
      registeredAgent: boolean;
      founderDetails: boolean;
    };
    incorporation: {
      certificate: boolean;
      bylaws: boolean;
      directors: boolean;
    };
    equity: {
      ipAssignment: boolean;
      founderStock: boolean;
      advisorPool: boolean;
    };
    einBanking: {
      ein: boolean;
      bankAccount: boolean;
    };
  };
  
  // Current wizard step
  currentStep: number;
  maxUnlockedStep: number;
}

const initialLedger: DecisionLedger = {
  ideaSnapshot: null,
  analysis: null,
  verdict: null,
  verdictAccepted: false,
  targetCustomer: null,
  profitType: null,
  profitTypeAccepted: false,
  entityType: null,
  entityAccepted: false,
  fundraisingIntent: null,
  selectedPivots: [],
  timeline: null,
  cCorpSetup: {
    preIncorporation: { nameCheck: false, registeredAgent: false, founderDetails: false },
    incorporation: { certificate: false, bylaws: false, directors: false },
    equity: { ipAssignment: false, founderStock: false, advisorPool: false },
    einBanking: { ein: false, bankAccount: false },
  },
  currentStep: 0,
  maxUnlockedStep: 0,
};

interface DecisionLedgerContextValue {
  ledger: DecisionLedger;
  updateLedger: (updates: Partial<DecisionLedger>) => void;
  setStep: (step: number) => void;
  unlockStep: (step: number) => void;
  resetLedger: () => void;
  updateCCorpSetup: (category: keyof DecisionLedger['cCorpSetup'], field: string, value: boolean) => void;
}

const DecisionLedgerContext = createContext<DecisionLedgerContextValue | null>(null);

const STORAGE_KEY = 'foundrfate-ledger';

export const DecisionLedgerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [ledger, setLedger] = useState<DecisionLedger>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return { ...initialLedger, ...JSON.parse(stored) };
      }
    } catch (e) {
      console.error('Failed to load ledger from storage:', e);
    }
    return initialLedger;
  });

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ledger));
    } catch (e) {
      console.error('Failed to save ledger to storage:', e);
    }
  }, [ledger]);

  const updateLedger = useCallback((updates: Partial<DecisionLedger>) => {
    setLedger(prev => ({ ...prev, ...updates }));
  }, []);

  const setStep = useCallback((step: number) => {
    setLedger(prev => ({ 
      ...prev, 
      currentStep: step,
      maxUnlockedStep: Math.max(prev.maxUnlockedStep, step)
    }));
  }, []);

  const unlockStep = useCallback((step: number) => {
    setLedger(prev => ({ 
      ...prev, 
      maxUnlockedStep: Math.max(prev.maxUnlockedStep, step)
    }));
  }, []);

  const resetLedger = useCallback(() => {
    setLedger(initialLedger);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const updateCCorpSetup = useCallback((
    category: keyof DecisionLedger['cCorpSetup'], 
    field: string, 
    value: boolean
  ) => {
    setLedger(prev => ({
      ...prev,
      cCorpSetup: {
        ...prev.cCorpSetup,
        [category]: {
          ...prev.cCorpSetup[category],
          [field]: value
        }
      }
    }));
  }, []);

  return (
    <DecisionLedgerContext.Provider value={{ 
      ledger, 
      updateLedger, 
      setStep, 
      unlockStep, 
      resetLedger,
      updateCCorpSetup 
    }}>
      {children}
    </DecisionLedgerContext.Provider>
  );
};

export const useDecisionLedger = () => {
  const context = useContext(DecisionLedgerContext);
  if (!context) {
    throw new Error('useDecisionLedger must be used within a DecisionLedgerProvider');
  }
  return context;
};
