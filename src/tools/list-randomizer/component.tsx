"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Copy, CheckCircle2, Shuffle, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function ListRandomizer(): React.JSX.Element {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);
  const [removeBlanks, setRemoveBlanks] = useState(true);
  const [removeDuplicates, setRemoveDuplicates] = useState(false);
  const [separator, setSeparator] = useState("auto");

  const getActiveDelimiter = () => {
    if (separator === "auto") {
      if (input.includes("\n")) return "\n";
      if (input.includes(",")) return ",";
      return " ";
    }
    return separator === "\\n" ? "\n" : separator;
  };
  
  const activeDelimiter = getActiveDelimiter();
  const itemCount = input ? input.split(activeDelimiter).length : 0;
  const outputCount = output ? output.split(activeDelimiter).length : 0;
  
  const placeholderText = separator === "," 
    ? "Paste your list here... e.g. Apple, Banana, Cherry" 
    : separator === " " 
      ? "Paste your list here... e.g. Apple Banana Cherry" 
      : "Paste your list here...\nApple\nBanana\nCherry";

  const getHelperText = () => {
    if (separator === "auto") return "Auto-detecting separator";
    if (separator === "\\n") return "One item per line";
    if (separator === ",") return "Comma separated";
    return "Space separated";
  };

  const shuffleList = () => {
    if (!input.trim()) {
      setOutput("");
      return;
    }

    let items: string[] = [];
    let delimiter = "\n";
    
    if (separator === "auto") {
      if (input.includes("\n")) {
        items = input.split("\n");
        delimiter = "\n";
      } else if (input.includes(",")) {
        items = input.split(",");
        delimiter = ", ";
      } else {
        items = input.split(" ");
        delimiter = " ";
      }
    } else {
      delimiter = separator === "\\n" ? "\n" : separator;
      items = input.split(delimiter);
      if (separator === ",") delimiter = ", "; // Prettier formatting for comma output
    }

    if (removeBlanks) {
      items = items.filter(item => item.trim() !== "");
    }

    if (removeDuplicates) {
      items = Array.from(new Set(items));
    }

    // Fisher-Yates Shuffle
    for (let i = items.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [items[i], items[j]] = [items[j], items[i]];
    }

    setOutput(items.join(delimiter));
    toast.success("List randomized!");
  };

  const copyToClipboard = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy text");
    }
  };

  const clearAll = () => {
    setInput("");
    setOutput("");
  };

  return (
    <div className="grid grid-cols-1 gap-6 w-full">
      
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-muted/40 p-4 rounded-xl border border-border/50">
        <div className="flex flex-wrap gap-5 items-center">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Separator:</span>
            <select 
              value={separator}
              onChange={(e) => setSeparator(e.target.value)}
              className="bg-background border border-border/60 text-sm font-medium rounded-md px-2 py-1 outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="auto">Auto-detect</option>
              <option value="\n">Newline</option>
              <option value=",">Comma</option>
              <option value=" ">Space</option>
            </select>
          </div>
          <label className="flex items-center space-x-2 text-sm font-medium cursor-pointer">
            <input 
              type="checkbox" 
              checked={removeBlanks}
              onChange={(e) => setRemoveBlanks(e.target.checked)}
              className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4"
            />
            <span>Remove blank items</span>
          </label>
          <label className="flex items-center space-x-2 text-sm font-medium cursor-pointer">
            <input 
              type="checkbox" 
              checked={removeDuplicates}
              onChange={(e) => setRemoveDuplicates(e.target.checked)}
              className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4"
            />
            <span>Remove duplicates</span>
          </label>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" onClick={clearAll} className="gap-2 flex-1 sm:flex-none">
            <Trash2 className="h-4 w-4" />
            Clear
          </Button>
          <Button onClick={shuffleList} className="gap-2 flex-1 sm:flex-none">
            <Shuffle className="h-4 w-4" />
            Randomize List
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border border-border/80 bg-card shadow-xs">
          <div className="px-5 py-4 border-b border-border/60 flex justify-between items-center">
            <h3 className="text-sm font-semibold flex items-center gap-2 text-foreground">
              Input List <span className="text-muted-foreground font-normal">({getHelperText()})</span>
            </h3>
            <span className="text-xs font-mono font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-md">
              {itemCount} items
            </span>
          </div>
          <CardContent className="p-0">
            <Textarea
              placeholder={placeholderText}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full min-h-[400px] p-5 font-mono text-sm resize-y border-0 focus-visible:ring-0 rounded-none bg-transparent"
            />
          </CardContent>
        </Card>

        <Card className="border border-border/80 bg-card shadow-xs">
          <div className="px-5 py-4 border-b border-border/60 flex justify-between items-center bg-muted/10">
            <div className="flex items-center gap-3">
              <h3 className="text-sm font-semibold text-foreground">Randomized Output</h3>
              {output && (
                <span className="text-xs font-mono font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                  {outputCount} items
                </span>
              )}
            </div>
            <Button 
              variant="secondary" 
              size="sm" 
              className="h-7 gap-1.5 px-3"
              onClick={copyToClipboard}
              disabled={!output}
            >
              {copied ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? "Copied" : "Copy"}
            </Button>
          </div>
          <CardContent className="p-0">
            <Textarea
              readOnly
              placeholder="Your randomized list will appear here..."
              value={output}
              className="w-full min-h-[400px] p-5 font-mono text-sm resize-y border-0 focus-visible:ring-0 rounded-none bg-muted/20"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
