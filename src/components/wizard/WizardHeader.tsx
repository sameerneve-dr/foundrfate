import { useNavigate } from "react-router-dom";
import { ArrowLeft, Sparkles, Save, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useDecisionLedger } from "@/contexts/DecisionLedgerContext";
import { useSavedIdeas } from "@/hooks/useSavedIdeas";

interface WizardHeaderProps {
  onBack: () => void;
  backLabel?: string;
  title: string;
  badge?: string;
  badgeVariant?: 'primary' | 'success' | 'accent' | 'warning';
  showSaveButton?: boolean;
}

export const WizardHeader = ({ 
  onBack, 
  backLabel = "Back", 
  title, 
  badge,
  badgeVariant = 'primary',
  showSaveButton = true
}: WizardHeaderProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { ledger } = useDecisionLedger();
  const { saveIdea, isSaving } = useSavedIdeas();

  const handleSaveIdea = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    if (!ledger.ideaSnapshot) return;
    
    await saveIdea(ledger.ideaSnapshot, ledger.analysis, ledger);
  };

  const badgeClass = {
    primary: 'pill-primary',
    success: 'pill-success',
    accent: 'pill-accent',
    warning: 'pill-warning'
  }[badgeVariant];

  return (
    <header className="border-b border-border/50 p-4 bg-card/80 backdrop-blur-sm sticky top-0 z-10">
      <div className="container flex items-center justify-between">
        <button 
          onClick={onBack} 
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="font-medium text-sm">{backLabel}</span>
        </button>
        
        <h1 className="text-xl font-display font-bold flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <span className="text-gradient-primary">{title}</span>
        </h1>
        
        <div className="flex items-center gap-2">
          {showSaveButton && ledger.ideaSnapshot && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleSaveIdea}
              disabled={isSaving}
              className="gap-1.5"
            >
              {user ? (
                <>
                  <Save className="h-3.5 w-3.5" />
                  {isSaving ? 'Saving...' : 'Save'}
                </>
              ) : (
                <>
                  <LogIn className="h-3.5 w-3.5" />
                  Sign in to Save
                </>
              )}
            </Button>
          )}
          {badge && (
            <span className={`pill ${badgeClass} text-xs`}>
              {badge}
            </span>
          )}
        </div>
      </div>
    </header>
  );
};