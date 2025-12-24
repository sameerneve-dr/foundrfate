import { Button } from "@/components/ui/button";
import { 
  CheckCircle2, 
  AlertCircle, 
  XCircle,
  Building2,
  Briefcase,
  Users,
  ChevronRight,
  Info
} from "lucide-react";
import { useDecisionLedger, type VisaStatus, type VisaEligibility } from "@/contexts/DecisionLedgerContext";
import { useState } from "react";

interface EligibilityAnalysisProps {
  onContinue: () => void;
}

const getEligibility = (visa: VisaStatus): VisaEligibility => {
  switch (visa) {
    case 'us-citizen':
    case 'green-card':
      return {
        canOwn: 'yes',
        canWork: 'yes',
        allowedRoles: ['founder', 'shareholder', 'advisor', 'employee'],
        explanation: 'You have full rights to own and operate a company in the U.S. with no restrictions.'
      };
    case 'f1-no-opt':
      return {
        canOwn: 'yes',
        canWork: 'no',
        allowedRoles: ['shareholder', 'advisor'],
        explanation: 'You can own shares and be a passive founder, but cannot actively work for your company or receive income until you have work authorization (OPT/CPT).'
      };
    case 'f1-opt':
      return {
        canOwn: 'yes',
        canWork: 'conditions',
        allowedRoles: ['founder', 'shareholder', 'advisor', 'employee'],
        explanation: 'You can work for your startup if it directly relates to your field of study. You need an employer-employee relationship and must meet reporting requirements.'
      };
    case 'f1-stem-opt':
      return {
        canOwn: 'yes',
        canWork: 'conditions',
        allowedRoles: ['founder', 'shareholder', 'advisor', 'employee'],
        explanation: 'Similar to OPT, but with more flexibility. Your startup must relate to your STEM degree. You need an employer-employee relationship with proper supervision structure.'
      };
    case 'h1b':
      return {
        canOwn: 'yes-restrictions',
        canWork: 'conditions',
        allowedRoles: ['shareholder', 'advisor', 'employee'],
        explanation: 'You can own shares, but working for your own company is complex. You need an independent board, employer-employee structure, and possibly an H-1B amendment or transfer.'
      };
    case 'o1':
      return {
        canOwn: 'yes',
        canWork: 'yes',
        allowedRoles: ['founder', 'shareholder', 'advisor', 'employee'],
        explanation: 'O-1 is founder-friendly. You can work for your startup through an agent or petitioner structure. This is one of the better visas for entrepreneurs.'
      };
    case 'l1':
      return {
        canOwn: 'yes-restrictions',
        canWork: 'conditions',
        allowedRoles: ['shareholder', 'advisor'],
        explanation: 'L-1 is tied to your current employer. Working for a startup would require a new visa or change of status. Ownership is possible but active work is restricted.'
      };
    default:
      return {
        canOwn: 'yes-restrictions',
        canWork: 'conditions',
        allowedRoles: ['shareholder', 'advisor'],
        explanation: 'Your situation may have specific restrictions. We recommend consulting an immigration attorney for personalized advice.'
      };
  }
};

const getVisaLabel = (visa: VisaStatus): string => {
  const labels: Record<string, string> = {
    'us-citizen': 'U.S. Citizen',
    'green-card': 'Green Card Holder',
    'f1-no-opt': 'F-1 Student (No OPT)',
    'f1-opt': 'F-1 on OPT',
    'f1-stem-opt': 'F-1 on STEM OPT',
    'h1b': 'H-1B Visa Holder',
    'o1': 'O-1 Visa Holder',
    'l1': 'L-1 Visa Holder',
    'other': 'Other Visa',
    'not-sure': 'Status Unknown'
  };
  return labels[visa || ''] || 'Unknown';
};

export const EligibilityAnalysis = ({ onContinue }: EligibilityAnalysisProps) => {
  const { ledger, updateLedger } = useDecisionLedger();
  const [showDetails, setShowDetails] = useState<string | null>(null);
  
  const eligibility = getEligibility(ledger.founderVisaStatus);
  
  // Save to ledger
  if (!ledger.visaEligibility) {
    updateLedger({ visaEligibility: eligibility });
  }

  const cards = [
    {
      id: 'own',
      title: 'Can you own a company?',
      icon: <Building2 className="h-6 w-6" />,
      status: eligibility.canOwn,
      statusLabel: eligibility.canOwn === 'yes' ? 'Yes' : 
                   eligibility.canOwn === 'yes-restrictions' ? 'Yes, with restrictions' : 
                   'Passive ownership only',
      details: eligibility.canOwn === 'yes' 
        ? 'You can fully own and control a U.S. company.'
        : eligibility.canOwn === 'yes-restrictions'
        ? 'You can own shares, but there may be limits on control and active management.'
        : 'You can hold equity but should not actively manage or make operational decisions.'
    },
    {
      id: 'work',
      title: 'Can you work for your own company?',
      icon: <Briefcase className="h-6 w-6" />,
      status: eligibility.canWork === 'yes' ? 'yes' : eligibility.canWork === 'conditions' ? 'yes-restrictions' : 'passive-only',
      statusLabel: eligibility.canWork === 'yes' ? 'Yes' : 
                   eligibility.canWork === 'conditions' ? 'Only if conditions met' : 
                   'No (not yet)',
      details: eligibility.canWork === 'yes'
        ? 'You can be an employee of your company and draw a salary.'
        : eligibility.canWork === 'conditions'
        ? 'You may be able to work if certain conditions are met (e.g., employer-employee relationship, field alignment).'
        : 'Your current status does not allow you to work for your own company. Consider applying for work authorization.'
    },
    {
      id: 'roles',
      title: 'What roles are allowed?',
      icon: <Users className="h-6 w-6" />,
      status: eligibility.allowedRoles.includes('founder') ? 'yes' : 'yes-restrictions',
      statusLabel: eligibility.allowedRoles.join(', ').replace(/\b\w/g, l => l.toUpperCase()),
      details: `Based on your status, you can take on these roles: ${eligibility.allowedRoles.map(r => r.charAt(0).toUpperCase() + r.slice(1)).join(', ')}.`
    }
  ];

  const getStatusIcon = (status: string) => {
    if (status === 'yes') return <CheckCircle2 className="h-5 w-5 text-green-600" />;
    if (status === 'yes-restrictions') return <AlertCircle className="h-5 w-5 text-yellow-600" />;
    return <XCircle className="h-5 w-5 text-red-600" />;
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold">Your Legal Eligibility</h2>
        <p className="text-muted-foreground mt-2">
          Based on: <span className="font-medium">{getVisaLabel(ledger.founderVisaStatus)}</span>
          {!ledger.founderInUS && ' (outside U.S.)'}
        </p>
      </div>

      {/* Summary explanation */}
      <div className="border-2 border-border p-4 bg-muted">
        <p className="text-sm">{eligibility.explanation}</p>
      </div>

      {/* Eligibility cards */}
      <div className="space-y-3">
        {cards.map((card) => (
          <div key={card.id} className="border-2 border-border p-4 space-y-3">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center shrink-0">
                {card.icon}
              </div>
              <div className="flex-1">
                <p className="font-bold">{card.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  {getStatusIcon(card.status)}
                  <span className="font-medium">{card.statusLabel}</span>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowDetails(showDetails === card.id ? null : card.id)}
              >
                <Info className="h-4 w-4" />
              </Button>
            </div>
            {showDetails === card.id && (
              <div className="bg-muted p-3 text-sm text-muted-foreground">
                {card.details}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Disclaimer */}
      <div className="border border-border p-3 bg-muted/50 text-xs text-muted-foreground">
        <strong>Disclaimer:</strong> This is general guidance, not legal advice. Immigration law is complex and your specific situation may differ. Consult an immigration attorney for personalized advice.
      </div>

      <Button onClick={onContinue} size="lg" className="w-full gap-2">
        See what you can do next
        <ChevronRight className="h-5 w-5" />
      </Button>
    </div>
  );
};
