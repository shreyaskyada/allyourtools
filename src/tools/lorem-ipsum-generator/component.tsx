"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Copy, CheckCircle2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { RangeSlider } from "@/components/ui/range-slider";

const LOREM_WORDS = [
  "lorem",
  "ipsum",
  "dolor",
  "sit",
  "amet",
  "consectetur",
  "adipiscing",
  "elit",
  "sed",
  "do",
  "eiusmod",
  "tempor",
  "incididunt",
  "ut",
  "labore",
  "et",
  "dolore",
  "magna",
  "aliqua",
  "enim",
  "ad",
  "minim",
  "veniam",
  "quis",
  "nostrud",
  "exercitation",
  "ullamco",
  "laboris",
  "nisi",
  "ut",
  "aliquip",
  "ex",
  "ea",
  "commodo",
  "consequat",
  "duis",
  "aute",
  "irure",
  "dolor",
  "in",
  "reprehenderit",
  "in",
  "voluptate",
  "velit",
  "esse",
  "cillum",
  "dolore",
  "eu",
  "fugiat",
  "nulla",
  "pariatur",
  "excepteur",
  "sint",
  "occaecat",
  "cupidatat",
  "non",
  "proident",
  "sunt",
  "in",
  "culpa",
  "qui",
  "officia",
  "deserunt",
  "mollit",
  "anim",
  "id",
  "est",
  "laborum",
];

const generateSentence = (wordCount: number) => {
  const words = [];
  for (let i = 0; i < wordCount; i++) {
    words.push(LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)]);
  }
  let sentence = words.join(" ");
  sentence = sentence.charAt(0).toUpperCase() + sentence.slice(1) + ".";
  return sentence;
};

const generateParagraph = (sentenceCount: number) => {
  const sentences = [];
  for (let i = 0; i < sentenceCount; i++) {
    // Randomize sentence length between 5 and 15 words
    const wordsPerSentence = Math.floor(Math.random() * 10) + 5;
    sentences.push(generateSentence(wordsPerSentence));
  }
  return sentences.join(" ");
};

export default function LoremIpsumGenerator(): React.JSX.Element {
  const [count, setCount] = useState(3);
  const [type, setType] = useState<"paragraphs" | "sentences" | "words">(
    "paragraphs",
  );
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);
  const [startWithLorem, setStartWithLorem] = useState(true);

  const generateText = () => {
    let result = "";

    if (type === "paragraphs") {
      const paragraphs = [];
      for (let i = 0; i < count; i++) {
        // Randomize sentences per paragraph between 4 and 8
        const sentences = Math.floor(Math.random() * 4) + 4;
        let p = generateParagraph(sentences);
        if (i === 0 && startWithLorem) {
          // Replace start of first paragraph if needed
          const words = p.split(" ");
          words.splice(0, 5, "Lorem", "ipsum", "dolor", "sit", "amet,");
          p = words.join(" ");
        }
        paragraphs.push(p);
      }
      result = paragraphs.join("\n\n");
    } else if (type === "sentences") {
      const sentences = [];
      for (let i = 0; i < count; i++) {
        const wordsPerSentence = Math.floor(Math.random() * 10) + 5;
        sentences.push(generateSentence(wordsPerSentence));
      }
      result = sentences.join("\n\n");
      if (startWithLorem) {
        // Find the first sentence and replace its start
        const words = result.split("\n")[0].split(" ");
        words.splice(0, 5, "Lorem", "ipsum", "dolor", "sit", "amet,");

        // Reconstruct the result with the modified first sentence
        const resultLines = result.split("\n");
        resultLines[0] = words.join(" ");
        result = resultLines.join("\n");
      }
    } else if (type === "words") {
      const words = [];
      for (let i = 0; i < count; i++) {
        words.push(LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)]);
      }
      if (startWithLorem && count >= 5) {
        words.splice(0, 5, "lorem", "ipsum", "dolor", "sit", "amet");
      }
      result = words.join(" ");
      result = result.charAt(0).toUpperCase() + result.slice(1);
    }

    setOutput(result);
  };

  useEffect(() => {
    generateText();
  }, [count, type, startWithLorem]);

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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
      {/* Settings Panel */}
      <Card className="border border-border/80 bg-card shadow-xs self-start lg:sticky lg:top-6">
        <div className="px-5 py-4 border-b border-border/60">
          <h3 className="text-sm font-semibold flex items-center gap-2 text-foreground">
            Settings
          </h3>
        </div>
        <CardContent className="p-5 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Format
            </label>
            <div className="grid grid-cols-3 bg-muted/50 p-1 rounded-lg border border-border/40">
              {(["paragraphs", "sentences", "words"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    setType(t);
                    if (t === "words" && count < 5) setCount(50);
                    else if (t === "sentences" && count > 50) setCount(5);
                    else if (t === "paragraphs" && count > 20) setCount(3);
                  }}
                  className={`py-1.5 px-1 text-[11px] sm:text-xs font-medium rounded-md transition-all ${
                    type === t
                      ? "bg-background text-foreground shadow-sm border border-border/50 scale-100"
                      : "text-muted-foreground hover:text-foreground border border-transparent scale-[0.98] hover:scale-100"
                  }`}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Count
              </label>
              <span className="text-xs font-mono font-bold tabular-nums px-2 py-0.5 rounded-md bg-primary/10 text-primary">
                {count} {type}
              </span>
            </div>
            <RangeSlider
              min={1}
              max={type === "words" ? 500 : type === "sentences" ? 50 : 20}
              step={1}
              value={count}
              onChange={setCount}
              minLabel="1"
              maxLabel={
                type === "words" ? "500" : type === "sentences" ? "50" : "20"
              }
            />
          </div>

          <div className="flex items-center space-x-2 bg-muted/50 p-3 rounded-lg border border-border/40">
            <input
              type="checkbox"
              id="startWithLorem"
              checked={startWithLorem}
              onChange={(e) => setStartWithLorem(e.target.checked)}
              className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4"
            />
            <label
              htmlFor="startWithLorem"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Start with "Lorem ipsum..."
            </label>
          </div>

          <Button onClick={generateText} className="w-full gap-2 mt-2">
            <RefreshCw className="h-4 w-4" />
            Regenerate Text
          </Button>
        </CardContent>
      </Card>

      {/* Output Panel */}
      <Card className="border border-border/80 bg-card shadow-xs lg:col-span-2">
        <div className="px-5 py-4 border-b border-border/60 flex justify-between items-center bg-muted/20">
          <h3 className="text-sm font-semibold text-foreground">
            Generated Result
          </h3>
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
            className="w-full h-[500px] max-h-[600px] overflow-y-auto p-6 text-sm font-medium leading-relaxed resize-y border-0 focus-visible:ring-0 rounded-none bg-transparent custom-scrollbar"
          />
        </CardContent>
      </Card>
    </div>
  );
}
