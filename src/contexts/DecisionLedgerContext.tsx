import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { AnalysisResult } from '@/hooks/useIdeaAnalysis';

export type TargetCustomer = 'consumer' | 'b2b' | 'regulator' | 'product-teams' | null;
export type ProfitType = 'for-profit' | 'non-profit' | 'hybrid' | null;
export type EntityType = 'delaware-c-corp' | 'llc' | 'non-profit-501c3' | 'other' | null;
export type FundraisingIntent = 'venture-scale' | 'bootstrap' | 'mixed' | null;
export type RegistrationMode = 'diy' | 'service' | 'explain' | null;
export type RegistrationPath = 'diy-checklist' | 'service-checklist' | 'hybrid' | null;

export type VisaStatus = 
  | 'us-citizen'
  | 'green-card'
  | 'f1-no-opt'
  | 'f1-opt'
  | 'f1-stem-opt'
  | 'h1b'
  | 'o1'
  | 'l1'
  | 'other'
  | 'not-sure'
  | null;

export type LegalPathPreference = 
  | 'opt-to-h1b-to-gc'
  | 'o1-to-eb1a'
  | 'cofounder-led'
  | 'passive-ownership'
  | 'no-restrictions'
  | null;

export interface CofounderInfo {
  id: string;
  visaStatus: VisaStatus;
  role: 'technical' | 'business';
  inUS: boolean;
}

export interface VisaEligibility {
  canOwn: 'yes' | 'yes-restrictions' | 'passive-only';
  canWork: 'yes' | 'conditions' | 'no';
  allowedRoles: ('founder' | 'shareholder' | 'advisor' | 'employee')[];
  explanation: string;
}

export interface RegistrationChecklist {
  chooseName: { done: boolean; doer: 'you' | 'service' };
  fileCertificate: { done: boolean; doer: 'you' | 'service' };
  getEIN: { done: boolean; doer: 'you' | 'service' };
  openBank: { done: boolean; doer: 'you' | 'service' };
  issueShares: { done: boolean; doer: 'you' | 'service' };
  adoptBylaws: { done: boolean; doer: 'you' | 'service' };
  ipAssignment: { done: boolean; doer: 'you' | 'service' };
}

export interface IdeaSnapshot {
  ideaName: string;
  problem: string;
  solution: string;
  audience: string;
  scaleIntent: 'lifestyle' | 'venture-scale' | 'non-profit';
}

export type ProceedIntent = 'yes' | 'conditional' | 'no' | null;

export type ExecutionSection = 
  | 'company-setup'
  | 'legal-visa'
  | 'registration'
  | 'agents-hiring'
  | 'pitch-deck'
  | 'timeline-roadmap';

export interface SectionState {
  unlocked: boolean;
  detailLevel: 'step-by-step' | 'checklist' | 'skipped' | null;
}

export interface DecisionLedger {
  // Idea inputs
  ideaSnapshot: IdeaSnapshot | null;
  
  // AI Analysis result
  analysis: AnalysisResult | null;
  
  // Verdict
  verdict: 'yes' | 'conditional' | 'no' | null;
  verdictAccepted: boolean;
  
  // NEW: Proceed intent (the decision gate)
  proceedIntent: ProceedIntent;
  
  // NEW: Unlocked execution sections
  unlockedSections: Record<ExecutionSection, SectionState>;
  
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
  
  // Registration guidance
  registrationMode: RegistrationMode;
  registrationPath: RegistrationPath;
  registrationChecklist: RegistrationChecklist;
  
  // Founder legal eligibility
  founderVisaStatus: VisaStatus;
  founderInUS: boolean;
  hasCofounder: 'no' | 'one' | 'multiple' | null;
  cofounders: CofounderInfo[];
  visaEligibility: VisaEligibility | null;
  legalPathPreference: LegalPathPreference;
  
  // Current wizard step
  currentStep: number;
  maxUnlockedStep: number;
}

const initialChecklist: RegistrationChecklist = {
  chooseName: { done: false, doer: 'you' },
  fileCertificate: { done: false, doer: 'service' },
  getEIN: { done: false, doer: 'you' },
  openBank: { done: false, doer: 'you' },
  issueShares: { done: false, doer: 'service' },
  adoptBylaws: { done: false, doer: 'service' },
  ipAssignment: { done: false, doer: 'you' },
};

const initialSectionState: Record<ExecutionSection, SectionState> = {
  'company-setup': { unlocked: false, detailLevel: null },
  'legal-visa': { unlocked: false, detailLevel: null },
  'registration': { unlocked: false, detailLevel: null },
  'agents-hiring': { unlocked: false, detailLevel: null },
  'pitch-deck': { unlocked: false, detailLevel: null },
  'timeline-roadmap': { unlocked: false, detailLevel: null },
};

const initialLedger: DecisionLedger = {
  ideaSnapshot: null,
  analysis: null,
  verdict: null,
  verdictAccepted: false,
  proceedIntent: null,
  unlockedSections: initialSectionState,
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
  registrationMode: null,
  registrationPath: null,
  registrationChecklist: initialChecklist,
  founderVisaStatus: null,
  founderInUS: true,
  hasCofounder: null,
  cofounders: [],
  visaEligibility: null,
  legalPathPreference: null,
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
  updateRegistrationChecklist: (key: keyof RegistrationChecklist, done: boolean) => void;
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

  const updateRegistrationChecklist = useCallback((
    key: keyof RegistrationChecklist,
    done: boolean
  ) => {
    setLedger(prev => ({
      ...prev,
      registrationChecklist: {
        ...prev.registrationChecklist,
        [key]: {
          ...prev.registrationChecklist[key],
          done
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
      updateCCorpSetup,
      updateRegistrationChecklist
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
