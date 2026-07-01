"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, Clipboard, Trash2, RefreshCw, FileJson, FileWarning, ChevronDown, Sparkles, Terminal } from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { JSONTree } from "./components/JSONTree";

// --- Main JSON Formatter Component ---
export default function JsonFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [parsedData, setParsedData] = useState<unknown>(null);
  const [indent, setIndent] = useState("2");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState<{ size: number; rootType: string } | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const sampleJson = {
    name: "AllYourTools",
    version: "1.0.0",
    description: "Multi-tool web app suite",
    features: ["offline processing", "client-side validation", "responsive UI"],
    active: true,
    stats: {
      tools: 100,
      speed: "instant",
      private: true
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const loadSample = () => {
    setInput(JSON.stringify(sampleJson, null, 2));
    setError(null);
  };

  const handlePrettify = () => {
    if (!input.trim()) {
      toast.error("Please enter some JSON first.");
      return;
    }

    try {
      const parsed = JSON.parse(input);
      const space = indent === "tab" ? "\t" : parseInt(indent, 10);
      const formatted = JSON.stringify(parsed, null, space);
      setOutput(formatted);
      setError(null);
      toast.success("JSON Prettified!");
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg || "Invalid JSON structure.");
      toast.error("Failed to prettify. Invalid JSON.");
    }
  };

  const handleMinify = () => {
    if (!input.trim()) {
      toast.error("Please enter some JSON first.");
      return;
    }

    try {
      const parsed = JSON.parse(input);
      const minified = JSON.stringify(parsed);
      setOutput(minified);
      setError(null);
      toast.success("JSON Minified!");
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg || "Invalid JSON structure.");
      toast.error("Failed to minify. Invalid JSON.");
    }
  };

  const handleValidate = () => {
    if (!input.trim()) {
      toast.error("Please enter some JSON first.");
      return;
    }

    try {
      JSON.parse(input);
      setError(null);
      toast.success("Valid JSON structure!");
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg || "Invalid JSON structure.");
      toast.error("Invalid JSON structure.");
    }
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
    setParsedData(null);
    setError(null);
    setStats(null);
  };

  const handleCopy = () => {
    const textToCopy = output || input;
    if (!textToCopy.trim()) {
      toast.error("Nothing to copy.");
      return;
    }
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    toast.success("Copied to clipboard!");
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setInput(text);
        toast.success("Pasted from clipboard!");
      } else {
        toast.error("Clipboard is empty.");
      }
    } catch {
      toast.error("Failed to read clipboard. Please paste manually.");
    }
  };

  // Safe syntax highlight function
  const highlightJson = (jsonString: string) => {
    if (!jsonString) return "";
    const safeStr = jsonString
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    return safeStr.replace(
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g,
      (match) => {
        let cls = "text-amber-600 dark:text-amber-400";
        if (/^"/.test(match)) {
          if (/:$/.test(match)) {
            cls = "text-blue-600 dark:text-blue-400 font-semibold";
          } else {
            cls = "text-green-600 dark:text-green-400";
          }
        } else if (/true|false/.test(match)) {
          cls = "text-purple-600 dark:text-purple-400 font-medium";
        } else if (/null/.test(match)) {
          cls = "text-rose-500 font-medium";
        }
        return `<span class="${cls}">${match}</span>`;
      }
    );
  };

  // Auto-format and calculate statistics on change
  useEffect(() => {
    let frameId: number;

    if (!input.trim()) {
      frameId = requestAnimationFrame(() => {
        setOutput("");
        setParsedData(null);
        setError(null);
        setStats(null);
      });
      return () => cancelAnimationFrame(frameId);
    }

    try {
      const parsed = JSON.parse(input);
      const space = indent === "tab" ? "\t" : parseInt(indent, 10);
      const formatted = JSON.stringify(parsed, null, space);
      frameId = requestAnimationFrame(() => {
        setParsedData(parsed);
        setOutput(formatted);
        setError(null);
        setStats({
          size: new Blob([input]).size,
          rootType: Array.isArray(parsed) ? "Array" : typeof parsed === "object" ? "Object" : typeof parsed
        });
      });
    } catch {
      // Don't update the output or show an error immediately to allow typing
    }

    const timer = setTimeout(() => {
      try {
        JSON.parse(input);
        frameId = requestAnimationFrame(() => {
          setError(null);
        });
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        frameId = requestAnimationFrame(() => {
          setError(msg || "Invalid JSON structure.");
        });
      }
    }, 1000);

    return () => {
      clearTimeout(timer);
      if (frameId) {
        cancelAnimationFrame(frameId);
      }
    };
  }, [input, indent]);

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  return (
    <div className="flex flex-col gap-6">
      {/* Top Configuration bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
        {/* Indent Dropdown Menu */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">Indent Size:</span>
          <DropdownMenu>
            <DropdownMenuTrigger className="flex h-9 w-28 items-center justify-between rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer">
              {indent === "tab" ? "Tab" : `${indent} Spaces`}
              <ChevronDown className="h-4 w-4 opacity-50" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-28">
              <DropdownMenuItem onClick={() => setIndent("2")}>
                2 Spaces
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIndent("4")}>
                4 Spaces
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIndent("tab")}>
                Tab
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Global actions */}
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={loadSample}>
            Load Sample
          </Button>
          <Button variant="outline" size="sm" onClick={handleClear} className="text-destructive hover:bg-destructive/5">
            <Trash2 className="mr-1.5 h-4 w-4" />
            Clear
          </Button>
        </div>
      </div>

      {/* Editor Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-foreground flex items-center gap-1.5">
              <Terminal className="h-4 w-4 text-muted-foreground" />
              Raw JSON Input
            </label>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" onClick={handlePaste} className="h-8 text-xs gap-1">
                <Clipboard className="h-3.5 w-3.5" />
                Paste
              </Button>
              {error && (
                <span className="flex items-center gap-1 text-xs text-destructive font-medium bg-destructive/5 border border-destructive/25 px-2 py-0.5 rounded-full">
                  <FileWarning className="h-3 w-3 animate-pulse" />
                  Invalid
                </span>
              )}
              {!error && input.trim() && (
                <span className="flex items-center gap-1 text-xs text-green-600 font-medium bg-green-500/5 border border-green-500/25 px-2 py-0.5 rounded-full">
                  ✓ Valid
                </span>
              )}
            </div>
          </div>
          <Textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste or type raw JSON here..."
            className="min-h-[400px] font-mono text-xs leading-relaxed border border-border focus-visible:ring-primary shadow-inner"
          />
        </div>

        {/* Output Panel with tab views */}
        <div className="flex flex-col gap-2.5">
          <Tabs defaultValue="preview" className="w-full flex flex-col h-full">
            <div className="flex items-center justify-between mb-0.5">
              <TabsList className="grid w-auto grid-cols-3 h-9">
                <TabsTrigger value="preview" className="text-xs px-3">Prettified</TabsTrigger>
                <TabsTrigger value="tree" className="text-xs px-3">Tree Explorer</TabsTrigger>
                <TabsTrigger value="text" className="text-xs px-3">Raw Text</TabsTrigger>
              </TabsList>

              <Button
                variant="ghost"
                size="icon"
                onClick={handleCopy}
                className="h-8 w-8 rounded-lg"
                title="Copy output"
              >
                {copied ? <Check className="h-4 w-4 text-green-500" /> : <Clipboard className="h-4 w-4" />}
              </Button>
            </div>

            {/* Syntax Highlighted HTML view */}
            <TabsContent value="preview" className="flex-1 mt-0">
              <div className="border border-border rounded-md bg-muted/10 p-4 min-h-[400px] max-h-[500px] overflow-y-auto">
                {output ? (
                  <pre
                    className="font-mono text-xs leading-relaxed whitespace-pre-wrap select-text"
                    dangerouslySetInnerHTML={{ __html: highlightJson(output) }}
                  />
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground text-xs py-32 border border-dashed border-border/80 rounded-md">
                    Prettified JSON will appear here...
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Collapsible Tree Explorer */}
            <TabsContent value="tree" className="flex-1 mt-0">
              <div className="border border-border rounded-md bg-muted/10 p-4 min-h-[400px] max-h-[500px] overflow-y-auto select-none">
                {parsedData ? (
                  <div className="p-1">
                    <JSONTree data={parsedData} />
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground text-xs py-32 border border-dashed border-border/80 rounded-md">
                    Tree nodes will appear here...
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Plain text area */}
            <TabsContent value="text" className="flex-1 mt-0">
              <Textarea
                readOnly
                value={output}
                placeholder="Raw text output will appear here..."
                className="min-h-[400px] font-mono text-xs leading-relaxed border border-border bg-muted/20"
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Metrics Banner */}
      {stats && (
        <div className="flex flex-wrap gap-6 items-center rounded-lg border border-border bg-muted/40 px-4 py-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span>Root Element: <strong className="text-foreground font-semibold">{stats.rootType}</strong></span>
          </div>
          <div>
            Size: <strong className="text-foreground font-semibold">{stats.size} Bytes</strong>
          </div>
          <div>
            Characters: <strong className="text-foreground font-semibold">{input.length}</strong>
          </div>
        </div>
      )}

      {/* Parsing Error alerts */}
      {error && (
        <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4 text-xs text-destructive font-mono leading-relaxed shadow-sm">
          <p className="font-semibold mb-1">JSON Syntax Error:</p>
          <p>{error}</p>
        </div>
      )}

      {/* Compression Action buttons */}
      <div className="flex flex-wrap gap-3 mt-2">
        <Button onClick={handlePrettify} variant="default" className="flex-1 sm:flex-initial">
          <Sparkles className="mr-1.5 h-4 w-4" />
          Prettify JSON
        </Button>
        <Button onClick={handleMinify} variant="secondary" className="flex-1 sm:flex-initial">
          <RefreshCw className="mr-1.5 h-4 w-4" />
          Minify JSON
        </Button>
        <Button onClick={handleValidate} variant="outline" className="flex-1 sm:flex-initial">
          <FileJson className="mr-1.5 h-4 w-4" />
          Validate JSON
        </Button>
      </div>
    </div>
  );
}
