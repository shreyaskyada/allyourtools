"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  FileText, 
  Copy, 
  Trash2, 
  Sparkles, 
  Layers,
  RefreshCw,
  Type,
  Heading,
  Indent,
  Code,
  Eraser,
  AlignLeft,
  ChevronsUpDown,
  ClipboardPaste
} from "lucide-react";
import { toast } from "sonner";

const SAMPLE_TEXT = `hello world! THIS IS A TEST OF THE CASE CONVERTER UTILITY.
it can automatically convert sentence casing, remove <b>HTML tags</b>, clean up extra    spaces,
and also filter out duplicate lines if needed.

hello world!
this is another line.`;

export default function CaseConverter(): React.JSX.Element {
  const [text, setText] = useState<string>("");

  // Statistics
  const charCountWithSpaces = text.length;
  const charCountWithoutSpaces = text.replace(/\s/g, "").length;
  const wordsArray = text.trim().split(/\s+/).filter(w => w.length > 0);
  const wordCount = wordsArray.length;
  const lineCount = text === "" ? 0 : text.split("\n").length;

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

  const handlePaste = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      setText(clipboardText);
      toast.success("Text pasted from clipboard");
    } catch (err) {
      toast.error("Failed to read clipboard. Please paste manually.");
    }
  };

  // Case Transformation Functions
  const applyTransform = (transformFn: (str: string) => string, label: string) => {
    if (!text) {
      toast.warning("Please enter some text first!");
      return;
    }
    const result = transformFn(text);
    setText(result);
    toast.success(`Converted to ${label}`);
  };

  // Transform definitions
  const toUpperCase = (str: string) => str.toUpperCase();
  const toLowerCase = (str: string) => str.toLowerCase();
  
  const toTitleCase = (str: string) => {
    return str.replace(/\b\w+/g, (txt) => {
      return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase();
    });
  };

  const toSentenceCase = (str: string) => {
    const lower = str.toLowerCase();
    return lower.replace(/(^\s*|[.!?]\s+)([a-z])/g, (m, p1, p2) => p1 + p2.toUpperCase());
  };

  const toCamelCase = (str: string) => {
    return str
      .replace(/[^a-zA-Z0-9\s-_]+/g, "")
      .replace(/[-_]+/g, " ")
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase())
      .replace(/^[A-Z]/, (m) => m.toLowerCase());
  };

  const toPascalCase = (str: string) => {
    return str
      .replace(/[^a-zA-Z0-9\s-_]+/g, "")
      .replace(/[-_]+/g, " ")
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase())
      .replace(/^[a-z]/, (m) => m.toUpperCase());
  };

  const toSnakeCase = (str: string) => {
    return str
      .replace(/[^a-zA-Z0-9\s-_]+/g, "")
      .trim()
      .toLowerCase()
      .replace(/[\s-_]+/g, "_");
  };

  const toKebabCase = (str: string) => {
    return str
      .replace(/[^a-zA-Z0-9\s-_]+/g, "")
      .trim()
      .toLowerCase()
      .replace(/[\s-_]+/g, "-");
  };

  const toAlternatingCase = (str: string) => {
    let chars = str.split("");
    let upper = true;
    for (let i = 0; i < chars.length; i++) {
      if (/[a-zA-Z]/.test(chars[i])) {
        chars[i] = upper ? chars[i].toLowerCase() : chars[i].toUpperCase();
        upper = !upper;
      }
    }
    return chars.join("");
  };

  const toInverseCase = (str: string) => {
    return str
      .split("")
      .map((c) => (c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()))
      .join("");
  };

  // Cleanups
  const collapseSpaces = (str: string) => {
    return str
      .split("\n")
      .map((line) => line.replace(/[ \t]+/g, " ").trim())
      .join("\n");
  };

  const removeEmptyLines = (str: string) => {
    return str
      .split("\n")
      .filter((line) => line.trim().length > 0)
      .join("\n");
  };

  const removeDuplicateLines = (str: string) => {
    const lines = str.split("\n");
    return Array.from(new Set(lines)).join("\n");
  };

  const stripHtml = (str: string) => {
    return str.replace(/<[^>]*>/g, "");
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Stats Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border border-border/80 bg-card shadow-xs">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <Type className="h-4.5 w-4.5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground">Chars (With Spaces)</p>
              <h3 className="text-xl font-bold text-foreground font-mono leading-none mt-1">{charCountWithSpaces}</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/80 bg-card shadow-xs">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <Layers className="h-4.5 w-4.5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground">Chars (No Spaces)</p>
              <h3 className="text-xl font-bold text-foreground font-mono leading-none mt-1">{charCountWithoutSpaces}</h3>
            </div>
          </CardContent>
        </Card>

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
              <AlignLeft className="h-4.5 w-4.5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground">Lines</p>
              <h3 className="text-xl font-bold text-foreground font-mono leading-none mt-1">{lineCount}</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Workspace Card */}
      <Card className="border border-border/80 bg-card shadow-xs">
        <CardContent className="p-5 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <label htmlFor="case-converter-textarea" className="text-xs font-bold text-muted-foreground">
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
                onClick={handlePaste}
                className="h-8 text-xs cursor-pointer gap-1"
              >
                <ClipboardPaste className="h-3 w-3" />
                Paste
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
            id="case-converter-textarea"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type, paste, or load sample text to convert between upper, lower, title, sentence, camel, pascal, snake, or kebab case formats..."
            className="min-h-[220px] font-sans text-sm focus-visible:ring-primary leading-relaxed resize-y"
          />
        </CardContent>
      </Card>

      {/* Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Case Conversions */}
        <Card className="border border-border/80 bg-card shadow-xs">
          <div className="px-5 py-4 border-b border-border/60">
            <h3 className="text-sm font-semibold flex items-center gap-2 text-foreground">
              <Type className="h-4 w-4 text-primary" />
              Case Conversions
            </h3>
          </div>
          <CardContent className="p-5 grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            <Button 
              variant="outline" 
              className="text-xs justify-start h-9 gap-2 cursor-pointer font-medium"
              onClick={() => applyTransform(toUpperCase, "UPPERCASE")}
            >
              <Heading className="h-3.5 w-3.5 text-muted-foreground" />
              UPPERCASE
            </Button>
            <Button 
              variant="outline" 
              className="text-xs justify-start h-9 gap-2 cursor-pointer font-medium"
              onClick={() => applyTransform(toLowerCase, "lowercase")}
            >
              <Type className="h-3.5 w-3.5 text-muted-foreground" />
              lowercase
            </Button>
            <Button 
              variant="outline" 
              className="text-xs justify-start h-9 gap-2 cursor-pointer font-medium"
              onClick={() => applyTransform(toTitleCase, "Title Case")}
            >
              <Sparkles className="h-3.5 w-3.5 text-muted-foreground" />
              Title Case
            </Button>
            <Button 
              variant="outline" 
              className="text-xs justify-start h-9 gap-2 cursor-pointer font-medium"
              onClick={() => applyTransform(toSentenceCase, "Sentence case")}
            >
              <AlignLeft className="h-3.5 w-3.5 text-muted-foreground" />
              Sentence case
            </Button>
            <Button 
              variant="outline" 
              className="text-xs justify-start h-9 gap-2 cursor-pointer font-medium"
              onClick={() => applyTransform(toCamelCase, "camelCase")}
            >
              <Indent className="h-3.5 w-3.5 text-muted-foreground" />
              camelCase
            </Button>
            <Button 
              variant="outline" 
              className="text-xs justify-start h-9 gap-2 cursor-pointer font-medium"
              onClick={() => applyTransform(toPascalCase, "PascalCase")}
            >
              <Indent className="h-3.5 w-3.5 text-muted-foreground" />
              PascalCase
            </Button>
            <Button 
              variant="outline" 
              className="text-xs justify-start h-9 gap-2 cursor-pointer font-medium"
              onClick={() => applyTransform(toSnakeCase, "snake_case")}
            >
              <ChevronsUpDown className="h-3.5 w-3.5 text-muted-foreground" />
              snake_case
            </Button>
            <Button 
              variant="outline" 
              className="text-xs justify-start h-9 gap-2 cursor-pointer font-medium"
              onClick={() => applyTransform(toKebabCase, "kebab-case")}
            >
              <ChevronsUpDown className="h-3.5 w-3.5 text-muted-foreground" />
              kebab-case
            </Button>
            <Button 
              variant="outline" 
              className="text-xs justify-start h-9 gap-2 cursor-pointer font-medium"
              onClick={() => applyTransform(toAlternatingCase, "Alternating Case")}
            >
              <RefreshCw className="h-3.5 w-3.5 text-muted-foreground" />
              aLtErNaTiNg
            </Button>
            <Button 
              variant="outline" 
              className="text-xs justify-start h-9 gap-2 cursor-pointer font-medium col-span-2 sm:col-span-1"
              onClick={() => applyTransform(toInverseCase, "Inverse Case")}
            >
              <RefreshCw className="h-3.5 w-3.5 text-muted-foreground" />
              InVeRsE CaSe
            </Button>
          </CardContent>
        </Card>

        {/* Text Cleanups */}
        <Card className="border border-border/80 bg-card shadow-xs">
          <div className="px-5 py-4 border-b border-border/60">
            <h3 className="text-sm font-semibold flex items-center gap-2 text-foreground">
              <Eraser className="h-4 w-4 text-primary" />
              Text Cleanups
            </h3>
          </div>
          <CardContent className="p-5 flex flex-col gap-2">
            <Button 
              variant="outline" 
              className="text-xs justify-start h-9 gap-2.5 cursor-pointer font-medium"
              onClick={() => applyTransform(collapseSpaces, "Collapsed Spaces")}
            >
              <Indent className="h-3.5 w-3.5 text-muted-foreground" />
              Collapse Extra White Spaces
            </Button>
            <Button 
              variant="outline" 
              className="text-xs justify-start h-9 gap-2.5 cursor-pointer font-medium"
              onClick={() => applyTransform(removeEmptyLines, "Removed Empty Lines")}
            >
              <AlignLeft className="h-3.5 w-3.5 text-muted-foreground" />
              Remove Empty/Blank Lines
            </Button>
            <Button 
              variant="outline" 
              className="text-xs justify-start h-9 gap-2.5 cursor-pointer font-medium"
              onClick={() => applyTransform(removeDuplicateLines, "Removed Duplicate Lines")}
            >
              <Layers className="h-3.5 w-3.5 text-muted-foreground" />
              Remove Duplicate Lines
            </Button>
            <Button 
              variant="outline" 
              className="text-xs justify-start h-9 gap-2.5 cursor-pointer font-medium"
              onClick={() => applyTransform(stripHtml, "Stripped HTML Tags")}
            >
              <Code className="h-3.5 w-3.5 text-muted-foreground" />
              Strip HTML Tags
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
