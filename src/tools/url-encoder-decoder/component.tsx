"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Copy, Trash2, ArrowDownUp, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export default function UrlEncoderDecoder(): React.JSX.Element {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      if (!input) {
        setOutput("");
        return;
      }
      
      if (mode === "encode") {
        setOutput(encodeURIComponent(input));
      } else {
        setOutput(decodeURIComponent(input.replace(/\\+/g, " ")));
      }
    } catch (e) {
      setOutput("Error: Malformed URI component.");
    }
  }, [input, mode]);

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

  const toggleMode = () => {
    setMode(prev => prev === "encode" ? "decode" : "encode");
    // Swap input and output for better UX
    if (output && output !== "Error: Malformed URI component.") {
      setInput(output);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6 max-w-5xl mx-auto">
      <Card className="border border-border/80 bg-card shadow-xs">
        <div className="px-5 py-4 border-b border-border/60 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex bg-muted p-1 rounded-lg">
            <button
              onClick={() => setMode("encode")}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                mode === "encode" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Encode URL
            </button>
            <button
              onClick={() => setMode("decode")}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                mode === "decode" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Decode URL
            </button>
          </div>
          
          <Button variant="outline" size="sm" onClick={toggleMode} className="gap-2 h-8">
            <ArrowDownUp className="h-3.5 w-3.5" />
            Swap
          </Button>
        </div>
        
        <CardContent className="p-5 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                {mode === "encode" ? "Raw Text Input" : "Encoded URL Input"}
              </label>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 px-2 text-muted-foreground hover:text-destructive"
                onClick={() => setInput("")}
              >
                <Trash2 className="h-3 w-3 mr-1" /> Clear
              </Button>
            </div>
            <Textarea
              placeholder={mode === "encode" ? "Enter text with spaces, symbols, & emoji to encode..." : "Enter %20encoded%20URL%20string%20to%20decode..."}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="min-h-[150px] font-mono resize-y"
            />
          </div>

          <div className="flex justify-center -my-2 relative z-10 pointer-events-none">
            <div className="bg-muted border border-border/50 rounded-full p-2 text-muted-foreground shadow-sm">
              <ArrowDownUp className="h-4 w-4" />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                {mode === "encode" ? "Encoded Result" : "Decoded Result"}
              </label>
              <Button 
                variant="secondary" 
                size="sm" 
                className="h-7 gap-1"
                onClick={copyToClipboard}
                disabled={!output || output.startsWith("Error")}
              >
                {copied ? <CheckCircle2 className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                {copied ? "Copied" : "Copy"}
              </Button>
            </div>
            <Textarea
              readOnly
              value={output}
              className={`min-h-[150px] font-mono resize-y bg-muted/30 ${output.startsWith("Error") ? "text-destructive" : ""}`}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
