import React from "react";
import { Sparkles } from "lucide-react";

interface StatsBannerProps {
  stats: { size: number; rootType: string } | null;
  inputLength: number;
}

export default function StatsBanner({ stats, inputLength }: StatsBannerProps): React.JSX.Element | null {
  if (!stats) return null;

  return (
    <div className="flex flex-wrap gap-6 items-center rounded-lg border border-border bg-muted/40 px-4 py-3 text-xs text-muted-foreground animate-in fade-in duration-200">
      <div className="flex items-center gap-1.5">
        <Sparkles className="h-3.5 w-3.5 text-primary" />
        <span>Root Element: <strong className="text-foreground font-semibold">{stats.rootType}</strong></span>
      </div>
      <div>
        Size: <strong className="text-foreground font-semibold">{stats.size} Bytes</strong>
      </div>
      <div>
        Characters: <strong className="text-foreground font-semibold">{inputLength}</strong>
      </div>
    </div>
  );
}
