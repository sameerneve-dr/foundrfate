import { Loader2, Brain, Search, Target, FileText } from "lucide-react";

interface AnalysisLoadingProps {
  ideaName: string;
}

export const AnalysisLoading = ({ ideaName }: AnalysisLoadingProps) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="max-w-md text-center space-y-8">
        <div className="relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-32 w-32 rounded-full border-4 border-secondary animate-pulse" />
          </div>
          <div className="relative flex items-center justify-center h-32 w-32 mx-auto">
            <Loader2 className="h-16 w-16 animate-spin text-foreground" />
          </div>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold">Analyzing "{ideaName}"</h2>
          <p className="text-muted-foreground">
            Our AI is performing deep market research, competitive analysis, and founder-market fit evaluation...
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2 border-2 border-border p-3">
            <Search className="h-4 w-4" />
            <span>Market Research</span>
          </div>
          <div className="flex items-center gap-2 border-2 border-border p-3">
            <Target className="h-4 w-4" />
            <span>Competitor Analysis</span>
          </div>
          <div className="flex items-center gap-2 border-2 border-border p-3">
            <Brain className="h-4 w-4" />
            <span>Viability Check</span>
          </div>
          <div className="flex items-center gap-2 border-2 border-border p-3">
            <FileText className="h-4 w-4" />
            <span>Building Roadmap</span>
          </div>
        </div>

        <p className="text-xs text-muted-foreground font-mono">
          This may take 15-30 seconds...
        </p>
      </div>
    </div>
  );
};
