"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Check, Clipboard, Trash2, Settings, Zap, ChevronDown, Sliders } from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function UuidGenerator(): React.JSX.Element {
  const [version, setVersion] = useState<"4" | "1">("4");
  const [quantity, setQuantity] = useState<number>(5);
  const [uppercase, setUppercase] = useState<boolean>(false);
  const [hyphens, setHyphens] = useState<boolean>(true);
  const [uuids, setUuids] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState<boolean>(false);

  const generateV4 = (): string => {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
      return crypto.randomUUID();
    }
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };

  const generateV1 = (): string => {
    let d = new Date().getTime();
    let d2 = (typeof performance !== "undefined" && performance.now && performance.now() * 1000) || 0;
    return "xxxxxxxx-xxxx-1xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      let r = Math.random() * 16;
      if (d > 0) {
        r = (d + r) % 16 | 0;
        d = Math.floor(d / 16);
      } else {
        r = (d2 + r) % 16 | 0;
        d2 = Math.floor(d2 / 16);
      }
      return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
    });
  };

  const handleGenerate = () => {
    const qty = Math.max(1, Math.min(100, quantity));
    const results: string[] = [];
    
    for (let i = 0; i < qty; i++) {
      let uuid = version === "4" ? generateV4() : generateV1();
      
      if (!hyphens) {
        uuid = uuid.replace(/-/g, "");
      }
      
      if (uppercase) {
        uuid = uuid.toUpperCase();
      } else {
        uuid = uuid.toLowerCase();
      }
      
      results.push(uuid);
    }
    
    setUuids(results);
    setCopiedAll(false);
    toast.success(`Generated ${qty} UUID v${version}s!`);
  };

  const handleCopySingle = (uuid: string, index: number) => {
    navigator.clipboard.writeText(uuid);
    setCopiedIndex(index);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleCopyAll = () => {
    if (uuids.length === 0) {
      toast.error("No UUIDs to copy.");
      return;
    }
    navigator.clipboard.writeText(uuids.join("\n"));
    setCopiedAll(true);
    toast.success("Copied all identifiers!");
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const handleClear = () => {
    setUuids([]);
    setCopiedAll(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      {/* Configuration Column (Left) */}
      <div className="lg:col-span-1 border border-border bg-card rounded-xl p-5 flex flex-col gap-6 shadow-sm">
        <div className="flex items-center gap-2 border-b border-border pb-3">
          <Sliders className="h-4.5 w-4.5 text-primary" />
          <h2 className="text-base font-bold text-foreground">Configuration</h2>
        </div>

        {/* UUID version selection */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5 uppercase tracking-wider">
            <Settings className="h-3.5 w-3.5" />
            UUID Version
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger className="flex h-9.5 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-1.5 text-sm shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer text-left">
              <span className="truncate mr-2 font-medium">
                {version === "4" ? "Version 4 (Random)" : "Version 1 (Time-based)"}
              </span>
              <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-(--anchor-width) min-w-[180px]">
              <DropdownMenuItem onClick={() => setVersion("4")}>
                Version 4 (Random)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setVersion("1")}>
                Version 1 (Time-based)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Quantity Selection */}
        <div className="flex flex-col gap-2">
          <label htmlFor="quantity-input" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Quantity (1-100)
          </label>
          <Input
            id="quantity-input"
            type="number"
            min={1}
            max={100}
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 1)}
            className="h-9.5 focus-visible:ring-primary shadow-sm"
          />
        </div>

        {/* Switch Toggles */}
        <div className="flex flex-col gap-3">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Formatting Options
          </span>

          {/* Uppercase toggle panel */}
          <label className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/10 hover:bg-muted/20 cursor-pointer transition-all select-none group">
            <div className="flex flex-col gap-0.5 max-w-[80%]">
              <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">Uppercase</span>
              <span className="text-[11px] text-muted-foreground leading-snug">Capitalize hex letters (A-F)</span>
            </div>
            <input
              type="checkbox"
              checked={uppercase}
              onChange={(e) => setUppercase(e.target.checked)}
              className="h-4.5 w-4.5 rounded border-input text-primary focus:ring-primary cursor-pointer accent-primary"
            />
          </label>

          {/* Hyphen toggle panel */}
          <label className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/10 hover:bg-muted/20 cursor-pointer transition-all select-none group">
            <div className="flex flex-col gap-0.5 max-w-[80%]">
              <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">Hyphens</span>
              <span className="text-[11px] text-muted-foreground leading-snug">Include standard dash dividers</span>
            </div>
            <input
              type="checkbox"
              checked={hyphens}
              onChange={(e) => setHyphens(e.target.checked)}
              className="h-4.5 w-4.5 rounded border-input text-primary focus:ring-primary cursor-pointer accent-primary"
            />
          </label>
        </div>

        {/* Trigger Button */}
        <Button onClick={handleGenerate} size="lg" className="w-full cursor-pointer mt-2 font-semibold shadow-md active:scale-98 transition-transform">
          <Zap className="mr-2 h-4 w-4 fill-current text-amber-400" />
          Generate UUIDs
        </Button>
      </div>

      {/* Output Column (Right) */}
      <div className="lg:col-span-2 flex flex-col gap-4">
        {/* Output Header */}
        <div className="flex items-center justify-between gap-4 border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <span className="text-base font-bold text-foreground">Generated Identifiers</span>
            {uuids.length > 0 && (
              <Badge variant="secondary" className="px-2 py-0.5 text-xs font-semibold">
                {uuids.length} items
              </Badge>
            )}
          </div>
          {uuids.length > 0 && (
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={handleCopyAll} className="h-8 text-xs cursor-pointer gap-1">
                {copiedAll ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Clipboard className="h-3.5 w-3.5" />}
                Copy All
              </Button>
              <Button variant="ghost" size="sm" onClick={handleClear} className="h-8 text-xs text-destructive hover:bg-destructive/5 cursor-pointer gap-1">
                <Trash2 className="h-3.5 w-3.5" />
                Clear
              </Button>
            </div>
          )}
        </div>

        {/* Output List container */}
        {uuids.length > 0 ? (
          <div className="border border-border rounded-xl bg-muted/5 divide-y divide-border overflow-hidden shadow-inner">
            <div className="max-h-[420px] overflow-y-auto font-mono text-xs leading-relaxed scrollbar-none">
              {uuids.map((uuid, idx) => (
                <div key={idx} className="flex items-center justify-between p-3.5 group hover:bg-muted/40 transition-colors">
                  <div className="flex items-center gap-4 truncate">
                    <span className="text-[11px] text-muted-foreground select-none font-sans font-semibold bg-muted px-1.5 py-0.5 rounded border border-border w-7 text-center">
                      {idx + 1}
                    </span>
                    <span className="select-all truncate text-foreground font-medium text-xs tracking-wide">
                      {uuid}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleCopySingle(uuid, idx)}
                    className="h-8 w-8 opacity-75 group-hover:opacity-100 transition-opacity cursor-pointer shrink-0 ml-2"
                    title="Copy identifier"
                  >
                    {copiedIndex === idx ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Clipboard className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
                    )}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="border border-dashed border-border/80 rounded-xl py-24 flex flex-col items-center justify-center text-muted-foreground text-center bg-muted/5 px-6">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 border border-primary/20 animate-pulse">
              <Zap className="h-5 w-5 text-primary" />
            </div>
            <h3 className="text-sm font-bold text-foreground mb-1">No UUIDs Generated Yet</h3>
            <p className="text-xs text-muted-foreground max-w-sm leading-relaxed">
              Configure parameters in the left panel and click the generate button to create unique identifiers.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
