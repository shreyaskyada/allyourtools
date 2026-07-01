"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Copy, 
  Trash2, 
  FileEdit, 
  Sparkles, 
  BookOpen, 
  Mic, 
  TrendingUp, 
  Layers,
  Info
} from "lucide-react";
import { toast } from "sonner";

// Common English stop words
const STOP_WORDS = new Set([
  "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for", "with", "by", "of", "is", "are", 
  "was", "were", "it", "this", "that", "these", "those", "i", "you", "he", "she", "they", "we", "me", 
  "him", "her", "them", "us", "my", "your", "his", "their", "our", "be", "been", "have", "has", "had", 
  "do", "does", "did", "as", "if", "than", "then", "so", "up", "down", "out", "about", "into", "through", 
  "over", "after", "before", "no", "not", "only", "other", "some", "such", "than", "too", "very", "can"
]);

const SAMPLE_TEXT = `AllYourTools is an all-in-one developer and content analysis toolkit built for maximum speed and simplicity. It features multiple utilities that run entirely inside your browser, guaranteeing absolute data privacy.

When you analyze your documents here, your text is never uploaded to external servers. This makes it safe to count characters, inspect JSON payloads, generate UUID keys, or decode keys locally. Try typing your paragraphs here to analyze content readability!`;

export default function WordCounter(): React.JSX.Element {
  const [text, setText] = useState<string>("");
  const [excludeStopWords, setExcludeStopWords] = useState<boolean>(true);

  // Analysis calculations
  const charCountWithSpaces = text.length;
  const charCountWithoutSpaces = text.replace(/\s/g, "").length;

  const wordsArray = text.trim().split(/\s+/).filter(w => w.length > 0);
  const wordCount = wordsArray.length;

  const sentenceCount = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
  const paragraphCount = text.split(/\n+/).filter(p => p.trim().length > 0).length;

  // Average metrics
  const avgWordLength = wordCount > 0 ? (charCountWithoutSpaces / wordCount).toFixed(1) : "0.0";
  const avgSentenceLength = sentenceCount > 0 ? (wordCount / sentenceCount).toFixed(1) : "0.0";

  // Estimates
  const readingTimeMinutes = wordCount > 0 ? Math.ceil(wordCount / 200) : 0;
  const speakingTimeMinutes = wordCount > 0 ? Math.ceil(wordCount / 130) : 0;

  const handleCopy = () => {
    if (!text) {
      toast.warning("Nothing to copy!");
      return;
    }
    navigator.clipboard.writeText(text);
    toast.success("Text copied to clipboard!");
  };

  const handleClear = () => {
    setText("");
    toast.success("Workspace cleared");
  };

  const handleLoadSample = () => {
    setText(SAMPLE_TEXT);
    toast.success("Sample text loaded");
  };

  // Word density processing
  const getWordDensity = () => {
    // extract words and strip punctuation
    const words = text
      .toLowerCase()
      .replace(/[^\w\s']/g, "")
      .split(/\s+/)
      .filter(w => w.length > 1 && !/^\d+$/.test(w));

    const freqMap: Record<string, number> = {};
    let targetCount = 0;

    words.forEach(word => {
      if (excludeStopWords && STOP_WORDS.has(word)) return;
      freqMap[word] = (freqMap[word] || 0) + 1;
      targetCount++;
    });

    const densityArray = Object.entries(freqMap)
      .map(([word, freq]) => ({
        word,
        freq,
        percentage: targetCount > 0 ? ((freq / targetCount) * 100).toFixed(1) : "0"
      }))
      .sort((a, b) => b.freq - a.freq)
      .slice(0, 8); // Top 8 words

    return { densityArray, targetCount };
  };

  const { densityArray, targetCount: analyzedWordsCount } = getWordDensity();

  return (
    <div className="flex flex-col gap-6">
      {/* Stats Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border border-border/80 bg-card shadow-xs">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <FileText className="h-4.5 w-4.5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground">Words</p>
              <h3 className="text-xl font-bold text-foreground font-mono leading-none mt-1">{wordCount}</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/80 bg-card shadow-xs">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <Layers className="h-4.5 w-4.5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground">Characters</p>
              <h3 className="text-xl font-bold text-foreground font-mono leading-none mt-1">{charCountWithSpaces}</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/80 bg-card shadow-xs">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <Sparkles className="h-4.5 w-4.5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground">Sentences</p>
              <h3 className="text-xl font-bold text-foreground font-mono leading-none mt-1">{sentenceCount}</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/80 bg-card shadow-xs">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <FileEdit className="h-4.5 w-4.5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground">Paragraphs</p>
              <h3 className="text-xl font-bold text-foreground font-mono leading-none mt-1">{paragraphCount}</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Analysis Card */}
      <Card className="border border-border/80 bg-card shadow-xs">
        <CardContent className="p-5 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <label htmlFor="word-counter-textarea" className="text-xs font-bold text-muted-foreground">
              Input Text Workspace
            </label>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleLoadSample}
                className="h-8 text-xs cursor-pointer"
              >
                Load Sample
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="h-8 text-xs cursor-pointer gap-1"
              >
                <Copy className="h-3 w-3" />
                Copy
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClear}
                className="h-8 text-xs cursor-pointer text-destructive hover:bg-destructive/5 gap-1"
              >
                <Trash2 className="h-3 w-3" />
                Clear
              </Button>
            </div>
          </div>

          <Textarea
            id="word-counter-textarea"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type or paste your content here to begin analysis..."
            className="min-h-[220px] font-sans text-sm focus-visible:ring-primary leading-relaxed resize-y"
          />

          <div className="flex justify-between items-center text-[10px] text-muted-foreground font-semibold px-0.5">
            <span>Characters (no spaces): <strong className="text-foreground font-mono">{charCountWithoutSpaces}</strong></span>
            <span>Avg. Word Length: <strong className="text-foreground font-mono">{avgWordLength} chars</strong></span>
            <span>Avg. Sentence Length: <strong className="text-foreground font-mono">{avgSentenceLength} words</strong></span>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Readability & Time Estimators */}
        <Card className="border border-border/80 bg-card shadow-xs">
          <CardHeader className="p-5 pb-2 border-b border-border/40">
            <CardTitle className="text-sm font-bold flex items-center gap-1.5 text-foreground">
              <BookOpen className="h-4.5 w-4.5 text-primary" />
              Readability & Speed Estimators
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 flex flex-col gap-4">
            <div className="flex flex-col gap-3.5">
              <div className="flex justify-between items-center p-3 border rounded-xl bg-muted/10">
                <div className="flex items-center gap-2.5">
                  <BookOpen className="h-4.5 w-4.5 text-emerald-500" />
                  <div>
                    <h4 className="text-xs font-bold text-foreground">Reading Duration</h4>
                    <p className="text-[10px] text-muted-foreground font-medium">Estimated at 200 WPM</p>
                  </div>
                </div>
                <Badge variant="outline" className="font-mono font-bold text-xs bg-emerald-500/5 border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                  {readingTimeMinutes} {readingTimeMinutes === 1 ? "min" : "mins"}
                </Badge>
              </div>

              <div className="flex justify-between items-center p-3 border rounded-xl bg-muted/10">
                <div className="flex items-center gap-2.5">
                  <Mic className="h-4.5 w-4.5 text-indigo-500" />
                  <div>
                    <h4 className="text-xs font-bold text-foreground">Speaking Duration</h4>
                    <p className="text-[10px] text-muted-foreground font-medium">Estimated at 130 WPM</p>
                  </div>
                </div>
                <Badge variant="outline" className="font-mono font-bold text-xs bg-indigo-500/5 border-indigo-500/20 text-indigo-600 dark:text-indigo-400">
                  {speakingTimeMinutes} {speakingTimeMinutes === 1 ? "min" : "mins"}
                </Badge>
              </div>
            </div>

            <div className="text-[11px] text-muted-foreground border-t border-border/40 pt-4 flex gap-1.5 leading-normal font-medium">
              <Info className="h-4 w-4 text-primary shrink-0" />
              Estimator results are calculated client-side based on conversational and silent reading speeds.
            </div>
          </CardContent>
        </Card>

        {/* Word Density Analyzer */}
        <Card className="border border-border/80 bg-card shadow-xs">
          <CardHeader className="p-5 pb-2 border-b border-border/40 flex flex-row justify-between items-center gap-2 space-y-0">
            <CardTitle className="text-sm font-bold flex items-center gap-1.5 text-foreground">
              <TrendingUp className="h-4.5 w-4.5 text-primary" />
              Word Density Keyword Analyzer
            </CardTitle>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setExcludeStopWords(!excludeStopWords)}
                className={`text-[9px] font-bold py-0.5 px-2 rounded-full border cursor-pointer select-none transition-all ${
                  excludeStopWords
                    ? "bg-primary/10 text-primary border-primary/20"
                    : "bg-muted text-muted-foreground border-transparent"
                }`}
              >
                Hide Stop Words
              </button>
            </div>
          </CardHeader>
          <CardContent className="p-5 flex flex-col gap-3">
            {densityArray.length === 0 ? (
              <div className="text-center text-xs text-muted-foreground py-8">
                Type text to see keyword density details.
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <div className="text-[10px] font-bold text-muted-foreground flex justify-between px-0.5 uppercase tracking-wider">
                  <span>Keyword</span>
                  <span>Usage (Share %)</span>
                </div>
                <div className="flex flex-col gap-2.5 max-h-48 overflow-y-auto pr-1">
                  {densityArray.map((item, idx) => (
                    <div key={idx} className="flex flex-col gap-1">
                      <div className="flex justify-between text-xs font-semibold px-0.5">
                        <span className="text-foreground">{item.word}</span>
                        <span className="font-mono text-muted-foreground">{item.freq}x ({item.percentage}%)</span>
                      </div>
                      {/* Custom visual density bar */}
                      <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full transition-all"
                          style={{ width: `${Math.min(100, parseFloat(item.percentage) * 3)}%` }} // scale width visually
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-muted-foreground mt-1 font-semibold">
                  Analyzing top {densityArray.length} key terms out of {analyzedWordsCount} total semantic words.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
