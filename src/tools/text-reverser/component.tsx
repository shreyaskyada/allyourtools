"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Copy, CheckCircle2, Trash2 } from "lucide-react";
import { toast } from "sonner";

// Map for upside-down text
const flipMap: Record<string, string> = {
  a: "ɐ", b: "q", c: "ɔ", d: "p", e: "ǝ", f: "ɟ", g: "ƃ", h: "ɥ", i: "ᴉ",
  j: "ɾ", k: "ʞ", l: "l", m: "ɯ", n: "u", o: "o", p: "d", q: "b", r: "ɹ",
  s: "s", t: "ʇ", u: "n", v: "ʌ", w: "ʍ", x: "x", y: "ʎ", z: "z",
  A: "∀", B: "𐐒", C: "Ɔ", D: "◖", E: "Ǝ", F: "Ⅎ", G: "פ", H: "H", I: "I",
  J: "ſ", K: "ʞ", L: "˥", M: "W", N: "N", O: "O", P: "Ԁ", Q: "Ό", R: "ᴚ",
  S: "S", T: "⊥", U: "∩", V: "Λ", W: "M", X: "X", Y: "⅄", Z: "Z",
  "1": "Ɩ", "2": "ᄅ", "3": "Ɛ", "4": "ㄣ", "5": "ϛ", "6": "9", "7": "ㄥ",
  "8": "8", "9": "9", "0": "0", ".": "˙", ",": "'", "'": ",", "\"": ",,",
  "`": ",", "?": "¿", "!": "¡", "[": "]", "]": "[", "(": ")", ")": "(",
  "{": "}", "}": "{", "<": ">", ">": "<", "&": "⅋", "_": "‾"
};

export default function TextReverser(): React.JSX.Element {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"characters" | "words" | "upside-down">("characters");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!input) {
      setOutput("");
      return;
    }

    let result = "";
    if (mode === "characters") {
      result = input.split("").reverse().join("");
    } else if (mode === "words") {
      result = input.split(" ").reverse().join(" ");
    } else if (mode === "upside-down") {
      result = input.split("").reverse().map(char => flipMap[char] || char).join("");
    }
    
    setOutput(result);
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
      
      {/* Input Panel */}
      <div className="flex flex-col gap-6">
        <div className="flex bg-muted/40 p-2 rounded-xl border border-border/50 justify-between items-center">
          <div className="flex gap-2 bg-background p-1 rounded-lg border border-border/50 shadow-xs">
            {(["characters", "words", "upside-down"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  mode === m 
                    ? "bg-primary text-primary-foreground shadow-sm" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {m.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
              </button>
            ))}
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 text-muted-foreground hover:text-destructive"
            onClick={() => setInput("")}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        <Card className="border border-border/80 bg-card shadow-xs">
          <div className="px-5 py-3 border-b border-border/60 bg-muted/10 flex justify-between items-center">
            <h3 className="text-sm font-semibold text-foreground">Original Text</h3>
            <span className="text-xs font-mono text-muted-foreground">{input.length} chars</span>
          </div>
          <CardContent className="p-0">
            <Textarea
              placeholder="Type or paste the text you want to reverse here..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full min-h-[300px] p-5 font-sans text-sm leading-relaxed resize-y border-0 focus-visible:ring-0 rounded-none bg-transparent"
            />
          </CardContent>
        </Card>
      </div>

      {/* Output Panel */}
      <div className="flex flex-col gap-6 pt-16 md:pt-0">
        <Card className="border border-border/80 bg-card shadow-xs h-full flex flex-col mt-[60px] md:mt-[60px]">
          <div className="px-5 py-3 border-b border-border/60 bg-muted/20 flex justify-between items-center">
            <h3 className="text-sm font-semibold text-foreground">Reversed Result</h3>
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
          <CardContent className="p-0 flex-1">
            <Textarea
              readOnly
              placeholder="Your reversed text will appear here..."
              value={output}
              className="w-full h-full min-h-[300px] p-5 font-sans text-sm leading-relaxed resize-y border-0 focus-visible:ring-0 rounded-none bg-muted/10"
            />
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
