"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Copy, CheckCircle2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { RangeSlider } from "@/components/ui/range-slider";

export default function NumberRandomizer(): React.JSX.Element {
  const [min, setMin] = useState<number>(1);
  const [max, setMax] = useState<number>(100);
  const [count, setCount] = useState<number>(10);
  const [unique, setUnique] = useState<boolean>(false);
  const [separator, setSeparator] = useState<string>(", ");
  const [output, setOutput] = useState<string>("");
  const [copied, setCopied] = useState(false);

  const generateNumbers = () => {
    if (min > max) {
      toast.error("Minimum value cannot be greater than maximum value.");
      return;
    }

    if (unique && (max - min + 1 < count)) {
      toast.error("Range is too small to generate that many unique numbers.");
      return;
    }

    const numbers: number[] = [];
    const used = new Set<number>();

    while (numbers.length < count) {
      // Using crypto for better randomness if possible, but fallback to Math.random
      // Math.random is sufficient for basic generation when range is large
      const randomValue = Math.floor(Math.random() * (max - min + 1)) + min;
      
      if (unique) {
        if (!used.has(randomValue)) {
          used.add(randomValue);
          numbers.push(randomValue);
        }
      } else {
        numbers.push(randomValue);
      }
    }

    // Sort if unique is enabled (often desired for lottery numbers), otherwise leave in random order
    if (unique) {
      numbers.sort((a, b) => a - b);
    }

    setOutput(numbers.join(separator === "\\n" ? "\n" : separator));
  };

  useEffect(() => {
    generateNumbers();
  }, [min, max, count, unique, separator]);

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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
      {/* Settings Panel */}
      <Card className="border border-border/80 bg-card shadow-xs self-start lg:sticky lg:top-6">
        <div className="px-5 py-4 border-b border-border/60">
          <h3 className="text-sm font-semibold flex items-center gap-2 text-foreground">
            Configuration
          </h3>
        </div>
        <CardContent className="p-5 flex flex-col gap-6">
          
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Range
              </label>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-xs text-muted-foreground">Min</span>
                <input
                  type="number"
                  value={min}
                  onChange={(e) => setMin(Number(e.target.value))}
                  className="w-full bg-background border border-border/60 text-sm rounded-md px-3 py-2 outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-muted-foreground">Max</span>
                <input
                  type="number"
                  value={max}
                  onChange={(e) => setMax(Number(e.target.value))}
                  className="w-full bg-background border border-border/60 text-sm rounded-md px-3 py-2 outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Quantity
              </label>
              <span className="text-xs font-mono font-bold tabular-nums px-2 py-0.5 rounded-md bg-primary/10 text-primary">
                {count} numbers
              </span>
            </div>
            <RangeSlider
              min={1}
              max={1000}
              step={1}
              value={count}
              onChange={setCount}
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Output Format
            </label>
            <div className="grid grid-cols-3 bg-muted/50 p-1 rounded-lg border border-border/40">
              {(["\\n", ", ", " "] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setSeparator(t)}
                  className={`py-1.5 px-1 text-[11px] sm:text-xs font-medium rounded-md transition-all ${
                    separator === t
                      ? "bg-background text-foreground shadow-sm border border-border/50 scale-100"
                      : "text-muted-foreground hover:text-foreground border border-transparent scale-[0.98] hover:scale-100"
                  }`}
                >
                  {t === "\\n" ? "Newlines" : t === ", " ? "Commas" : "Spaces"}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2 bg-muted/30 p-3 rounded-lg border border-border/40">
            <input 
              type="checkbox" 
              id="unique"
              checked={unique}
              onChange={(e) => setUnique(e.target.checked)}
              className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4"
            />
            <label
              htmlFor="unique"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Unique numbers only
            </label>
          </div>

          <Button onClick={generateNumbers} className="w-full gap-2 mt-2">
            <RefreshCw className="h-4 w-4" />
            Generate New Numbers
          </Button>
        </CardContent>
      </Card>

      {/* Output Panel */}
      <Card className="border border-border/80 bg-card shadow-xs lg:col-span-2">
        <div className="px-5 py-4 border-b border-border/60 flex justify-between items-center bg-muted/20">
          <div className="flex items-center gap-3">
            <h3 className="text-sm font-semibold text-foreground">
              Generated Numbers
            </h3>
            {output && (
              <span className="text-xs font-mono font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                {count} items
              </span>
            )}
          </div>
          <Button
            variant="secondary"
            size="sm"
            className="h-8 gap-1.5 px-3"
            onClick={copyToClipboard}
          >
            {copied ? (
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
            {copied ? "Copied" : "Copy to Clipboard"}
          </Button>
        </div>
        <CardContent className="p-0">
          <Textarea
            readOnly
            value={output}
            className="w-full h-[500px] max-h-[600px] overflow-y-auto p-6 font-mono text-sm font-medium leading-relaxed resize-y border-0 focus-visible:ring-0 rounded-none bg-transparent custom-scrollbar"
          />
        </CardContent>
      </Card>
    </div>
  );
}
