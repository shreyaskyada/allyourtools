"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { diffChars, diffWords, diffLines, Change } from "diff";
import { Trash2 } from "lucide-react";

export default function TextDiff(): React.JSX.Element {
  const [original, setOriginal] = useState("");
  const [modified, setModified] = useState("");
  const [diffMode, setDiffMode] = useState<"chars" | "words" | "lines">("words");
  const [diffResult, setDiffResult] = useState<Change[]>([]);

  useEffect(() => {
    let result: Change[] = [];
    if (!original && !modified) {
      setDiffResult([]);
      return;
    }

    try {
      if (diffMode === "chars") {
        result = diffChars(original, modified);
      } else if (diffMode === "words") {
        result = diffWords(original, modified);
      } else {
        result = diffLines(original, modified);
      }
      setDiffResult(result);
    } catch (e) {
      console.error(e);
    }
  }, [original, modified, diffMode]);

  return (
    <div className="flex flex-col gap-6 w-full">
      
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-muted/40 p-4 rounded-xl border border-border/50">
        <div className="flex gap-2 bg-background p-1 rounded-lg border border-border/50 shadow-xs">
          {(["chars", "words", "lines"] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setDiffMode(mode)}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                diffMode === mode 
                  ? "bg-primary text-primary-foreground shadow-sm" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              By {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </button>
          ))}
        </div>
        
        <Button variant="outline" onClick={() => { setOriginal(""); setModified(""); }} className="gap-2 w-full sm:w-auto">
          <Trash2 className="h-4 w-4" />
          Clear All
        </Button>
      </div>

      {/* Input Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border border-border/80 bg-card shadow-xs">
          <div className="px-5 py-3 border-b border-border/60 bg-muted/10">
            <h3 className="text-sm font-semibold text-foreground">Original Text</h3>
          </div>
          <CardContent className="p-0">
            <Textarea
              placeholder="Paste the original text here..."
              value={original}
              onChange={(e) => setOriginal(e.target.value)}
              className="w-full min-h-[250px] p-5 font-mono text-sm resize-y border-0 focus-visible:ring-0 rounded-none bg-transparent"
            />
          </CardContent>
        </Card>

        <Card className="border border-border/80 bg-card shadow-xs">
          <div className="px-5 py-3 border-b border-border/60 bg-muted/10">
            <h3 className="text-sm font-semibold text-foreground">Modified Text</h3>
          </div>
          <CardContent className="p-0">
            <Textarea
              placeholder="Paste the modified text here..."
              value={modified}
              onChange={(e) => setModified(e.target.value)}
              className="w-full min-h-[250px] p-5 font-mono text-sm resize-y border-0 focus-visible:ring-0 rounded-none bg-transparent"
            />
          </CardContent>
        </Card>
      </div>

      {/* Diff Output Panel */}
      <Card className="border border-border/80 bg-card shadow-xs overflow-hidden">
        <div className="px-5 py-3 border-b border-border/60 bg-muted/20 flex justify-between items-center">
          <h3 className="text-sm font-semibold text-foreground">Diff Result</h3>
          <div className="flex gap-4 text-xs font-medium">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-destructive/20 border border-destructive/50"></span> Removed</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-emerald-500/20 border border-emerald-500/50"></span> Added</span>
          </div>
        </div>
        <CardContent className="p-0 bg-muted/5">
          <div className="w-full min-h-[200px] p-5 font-mono text-sm whitespace-pre-wrap break-words">
            {diffResult.length === 0 ? (
              <span className="text-muted-foreground italic">Diff output will appear here...</span>
            ) : (
              diffResult.map((part, index) => {
                const colorClass = part.added 
                  ? "bg-emerald-500/20 text-emerald-700 dark:text-emerald-400" 
                  : part.removed 
                    ? "bg-destructive/20 text-destructive dark:text-red-400 line-through decoration-destructive/50" 
                    : "text-foreground";
                
                return (
                  <span key={index} className={`${colorClass} rounded-[2px] px-[1px]`}>
                    {part.value}
                  </span>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
