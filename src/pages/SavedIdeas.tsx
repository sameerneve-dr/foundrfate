import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useSavedIdeas, SavedIdea } from '@/hooks/useSavedIdeas';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, ArrowLeft, Trash2, ArrowRight, Loader2, FolderOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function SavedIdeas() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { loadIdeas, deleteIdea, isLoading } = useSavedIdeas();
  const [ideas, setIdeas] = useState<SavedIdea[]>([]);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      loadIdeas().then(setIdeas);
    }
  }, [user]);

  const handleDelete = async (id: string) => {
    const success = await deleteIdea(id);
    if (success) {
      setIdeas(prev => prev.filter(idea => idea.id !== id));
    }
  };

  const handleLoad = (idea: SavedIdea) => {
    // Store the idea to load in sessionStorage for the wizard to pick up
    sessionStorage.setItem('loadSavedIdea', JSON.stringify(idea));
    navigate('/');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border/50 p-4 bg-card/80 backdrop-blur-sm">
        <div className="container flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span className="font-medium text-sm">Back</span>
          </Link>
          <h1 className="text-xl font-display font-bold flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="text-gradient-primary">FoundrFate</span>
          </h1>
          <div className="w-16" />
        </div>
      </header>

      <div className="flex-1 p-4 md:p-8 bg-gradient-hero">
        <div className="container max-w-4xl">
          <div className="mb-8">
            <h2 className="text-2xl font-display font-bold mb-2">My Saved Ideas</h2>
            <p className="text-muted-foreground">View, manage, and continue working on your startup ideas</p>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : ideas.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <FolderOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-semibold text-lg mb-2">No saved ideas yet</h3>
                <p className="text-muted-foreground mb-4">Start analyzing your startup idea and save it to continue later</p>
                <Button asChild>
                  <Link to="/">Get Started</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {ideas.map((idea) => (
                <Card key={idea.id} className="hover:border-primary/50 transition-colors">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{idea.idea_name}</CardTitle>
                        <CardDescription>
                          Last updated {format(new Date(idea.updated_at), 'MMM d, yyyy')}
                        </CardDescription>
                      </div>
                      {idea.analysis_result && (
                        <span className={`pill text-xs ${
                          idea.analysis_result.decision === 'yes' 
                            ? 'pill-primary' 
                            : idea.analysis_result.decision === 'conditional'
                            ? 'pill-accent'
                            : 'bg-destructive/10 text-destructive'
                        }`}>
                          {idea.analysis_result.decision === 'yes' 
                            ? 'Go' 
                            : idea.analysis_result.decision === 'conditional'
                            ? 'Conditional'
                            : 'No-Go'}
                        </span>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {idea.idea_snapshot.problem}
                    </p>
                    <div className="flex items-center gap-2">
                      <Button 
                        onClick={() => handleLoad(idea)} 
                        size="sm"
                        className="gap-1.5"
                      >
                        <ArrowRight className="h-3.5 w-3.5" />
                        Continue
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm" className="gap-1.5 text-destructive hover:text-destructive">
                            <Trash2 className="h-3.5 w-3.5" />
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete this idea?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete "{idea.idea_name}" and all its analysis data. This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDelete(idea.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}