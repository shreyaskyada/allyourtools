"use client";

import React, { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Search, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function WordFrequencyAnalyzer(): React.JSX.Element {
  const [text, setText] = useState("");
  const [filter, setFilter] = useState("");
  const [ignoreStopWords, setIgnoreStopWords] = useState(false);

  // Common English stop words
  const stopWords = new Set(["a", "an", "and", "are", "as", "at", "be", "but", "by", "for", "if", "in", "into", "is", "it", "no", "not", "of", "on", "or", "such", "that", "the", "their", "then", "there", "these", "they", "this", "to", "was", "will", "with"]);

  const analysis = useMemo(() => {
    if (!text.trim()) return { totalWords: 0, frequencies: [] };

    // Remove punctuation, convert to lowercase, split by whitespace
    const words = text
      .toLowerCase()
      .replace(/[.,/#!$%\\^&\\*;:{}=\\-_`~()]/g, "")
      .replace(/\\s{2,}/g, " ")
      .trim()
      .split(" ");

    const totalWords = words.length;
    const counts: Record<string, number> = {};

    words.forEach(word => {
      if (word === "") return;
      if (ignoreStopWords && stopWords.has(word)) return;
      counts[word] = (counts[word] || 0) + 1;
    });

    const frequencies = Object.entries(counts)
      .map(([word, count]) => ({
        word,
        count,
        density: ((count / totalWords) * 100).toFixed(1)
      }))
      .sort((a, b) => b.count - a.count); // Sort descending by count

    return { totalWords, frequencies };
  }, [text, ignoreStopWords]);

  const filteredFrequencies = useMemo(() => {
    if (!filter) return analysis.frequencies;
    return analysis.frequencies.filter(f => f.word.includes(filter.toLowerCase()));
  }, [analysis, filter]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
      
      {/* Input Panel */}
      <div className="flex flex-col gap-6">
        <Card className="border border-border/80 bg-card shadow-xs">
          <div className="px-5 py-4 border-b border-border/60 flex justify-between items-center bg-muted/10">
            <h3 className="text-sm font-semibold flex items-center gap-2 text-foreground">
              Text Input
            </h3>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 text-muted-foreground hover:text-destructive"
              onClick={() => setText("")}
            >
              <Trash2 className="h-3.5 w-3.5 mr-1" /> Clear
            </Button>
          </div>
          <CardContent className="p-0">
            <Textarea
              placeholder="Paste the text you want to analyze here..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full min-h-[400px] p-5 font-sans text-sm leading-relaxed resize-y border-0 focus-visible:ring-0 rounded-none bg-transparent"
            />
          </CardContent>
        </Card>
      </div>

      {/* Analysis Panel */}
      <div className="flex flex-col gap-6">
        <Card className="border border-border/80 bg-card shadow-xs flex-1 flex flex-col overflow-hidden">
          <div className="px-5 py-4 border-b border-border/60 flex justify-between items-center bg-muted/10">
            <div className="flex items-center gap-3">
              <h3 className="text-sm font-semibold text-foreground">Word Frequencies</h3>
              {analysis.totalWords > 0 && (
                <span className="text-xs font-mono font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                  {analysis.totalWords} Total Words
                </span>
              )}
            </div>
          </div>
          
          <div className="p-4 border-b border-border/40 bg-card flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Filter words..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="pl-9 h-9 bg-muted/50"
              />
            </div>
            
            <label className="flex items-center space-x-2 text-sm font-medium cursor-pointer w-full sm:w-auto">
              <input 
                type="checkbox" 
                checked={ignoreStopWords}
                onChange={(e) => setIgnoreStopWords(e.target.checked)}
                className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4"
              />
              <span className="whitespace-nowrap">Ignore Stop Words (e.g. "the", "a")</span>
            </label>
          </div>

          <CardContent className="p-0 flex-1 overflow-auto min-h-[300px]">
            {filteredFrequencies.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-muted-foreground gap-3">
                <AlertCircle className="h-8 w-8 opacity-20" />
                <p className="text-sm">No words found to analyze.</p>
              </div>
            ) : (
              <div className="w-full">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-muted-foreground uppercase bg-muted/30 sticky top-0 backdrop-blur-md">
                    <tr>
                      <th className="px-6 py-3 font-semibold">Word</th>
                      <th className="px-6 py-3 font-semibold w-24">Count</th>
                      <th className="px-6 py-3 font-semibold w-24">Density</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredFrequencies.map((f, i) => (
                      <tr key={i} className="border-b border-border/40 last:border-0 hover:bg-muted/10 transition-colors">
                        <td className="px-6 py-3 font-medium text-foreground">{f.word}</td>
                        <td className="px-6 py-3 font-mono">
                          <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-md font-bold">{f.count}</span>
                        </td>
                        <td className="px-6 py-3 font-mono text-muted-foreground">{f.density}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
