"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { 
  Clock, 
  Calendar, 
  Check, 
  Clipboard, 
  Pause, 
  Play, 
  ArrowRightLeft, 
  AlertCircle,
  ChevronDown
} from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Relative time helper
function getRelativeTime(epochMs: number): string {
  const diff = epochMs - Date.now();
  const absDiff = Math.abs(diff);
  const seconds = Math.floor(absDiff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  const prefix = diff < 0 ? "" : "in ";
  const suffix = diff < 0 ? " ago" : "";

  if (seconds < 5) return "just now";
  if (seconds < 60) return `${prefix}${seconds} second${seconds === 1 ? "" : "s"}${suffix}`;
  if (minutes < 60) return `${prefix}${minutes} minute${minutes === 1 ? "" : "s"}${suffix}`;
  if (hours < 24) return `${prefix}${hours} hour${hours === 1 ? "" : "s"}${suffix}`;
  return `${prefix}${days} day${days === 1 ? "" : "s"}${suffix}`;
}

export default function TimestampConverter(): React.JSX.Element {
  // --- TICKING CLOCK STATES ---
  const [currentUnix, setCurrentUnix] = useState<number>(Math.floor(Date.now() / 1000));
  const [currentMs, setCurrentMs] = useState<number>(Date.now());
  const [isClockRunning, setIsClockRunning] = useState<boolean>(true);
  const [copiedClockSec, setCopiedClockSec] = useState<boolean>(false);
  const [copiedClockMs, setCopiedClockMs] = useState<boolean>(false);

  // --- EPOCH TO DATE STATES ---
  const [epochInput, setEpochInput] = useState<string>(Math.floor(Date.now() / 1000).toString());
  const [unitMode, setUnitMode] = useState<"auto" | "seconds" | "ms">("auto");
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // --- DATE TO EPOCH STATES ---
  // Get current local YYYY-MM-DDTHH:MM for default value
  const getLocalDateTimeString = () => {
    const tzoffset = new Date().getTimezoneOffset() * 60000;
    const localISOTime = new Date(Date.now() - tzoffset).toISOString().slice(0, 16);
    return localISOTime;
  };
  const [dateInput, setDateInput] = useState<string>(getLocalDateTimeString());
  const [dateTz, setDateTz] = useState<"local" | "utc">("local");
  const [dateMsOffset, setDateMsOffset] = useState<number>(0);
  const [copiedEpochSec, setCopiedEpochSec] = useState<boolean>(false);
  const [copiedEpochMs, setCopiedEpochMs] = useState<boolean>(false);

  // Clock ticking side effect
  useEffect(() => {
    if (!isClockRunning) return;
    const timer = setInterval(() => {
      setCurrentUnix(Math.floor(Date.now() / 1000));
      setCurrentMs(Date.now());
    }, 250);
    return () => clearInterval(timer);
  }, [isClockRunning]);

  // Copy helpers
  const handleCopyText = (text: string, fieldName: string, setCopiedState?: (val: boolean) => void) => {
    navigator.clipboard.writeText(text);
    toast.success(`Copied ${fieldName} to clipboard!`);
    if (setCopiedState) {
      setCopiedState(true);
      setTimeout(() => setCopiedState(false), 2000);
    } else {
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2000);
    }
  };

  // --- EPOCH TO DATE CALCULATIONS ---
  const getEpochDetails = () => {
    const rawVal = epochInput.trim();
    if (!rawVal) {
      return { error: "Please enter a timestamp." };
    }

    const numVal = Number(rawVal);
    if (isNaN(numVal)) {
      return { error: "Invalid timestamp: Not a number." };
    }

    // Determine unit
    let isMs = false;
    if (unitMode === "ms") {
      isMs = true;
    } else if (unitMode === "seconds") {
      isMs = false;
    } else {
      // Auto: if length is 12 or more, or if value is greater than 30 billion (year 2920 in seconds)
      isMs = rawVal.length >= 12 || numVal > 30000000000;
    }

    const finalMs = isMs ? numVal : numVal * 1000;
    const dateObj = new Date(finalMs);

    // Validate date range
    if (isNaN(dateObj.getTime())) {
      return { error: "Invalid timestamp range." };
    }

    // Format outputs
    const localFormatter = new Intl.DateTimeFormat(undefined, {
      dateStyle: "full",
      timeStyle: "long"
    });

    const utcFormatter = new Intl.DateTimeFormat(undefined, {
      dateStyle: "full",
      timeStyle: "long",
      timeZone: "UTC"
    });

    return {
      detectedUnit: isMs ? "Milliseconds" : "Seconds",
      localStr: localFormatter.format(dateObj),
      utcStr: utcFormatter.format(dateObj),
      isoStr: dateObj.toISOString(),
      utcStringStr: dateObj.toUTCString(),
      relativeStr: getRelativeTime(finalMs)
    };
  };

  const epochDetails = getEpochDetails();

  // --- DATE TO EPOCH CALCULATIONS ---
  const getDateToEpochDetails = () => {
    if (!dateInput) {
      return { error: "Please pick a date." };
    }

    try {
      let parsedMs = 0;
      if (dateTz === "utc") {
        // Parse dateInput (YYYY-MM-DDTHH:MM) in UTC timezone
        const [yr, mo, dy, hr, mn] = dateInput.split(/[-T:]/).map(Number);
        parsedMs = Date.UTC(yr, mo - 1, dy, hr, mn, 0) + dateMsOffset;
      } else {
        // Parse in local system timezone
        parsedMs = new Date(dateInput).getTime() + dateMsOffset;
      }

      if (isNaN(parsedMs)) {
        return { error: "Invalid date value." };
      }

      const secVal = Math.floor(parsedMs / 1000);

      return {
        sec: secVal.toString(),
        ms: parsedMs.toString(),
        relative: getRelativeTime(parsedMs)
      };
    } catch {
      return { error: "Error parsing date." };
    }
  };

  const dateToEpochDetails = getDateToEpochDetails();

  return (
    <div className="flex flex-col gap-6">
      {/* Real-time Ticking Clock Card */}
      <Card className="border border-border/80 bg-card overflow-hidden shadow-sm">
        <CardContent className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Live Unix Epoch Clock</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="font-mono text-base font-bold text-foreground">{currentUnix}</span>
                <span className="text-[10px] font-mono text-muted-foreground font-semibold">seconds</span>
                <span className="text-muted-foreground">/</span>
                <span className="font-mono text-base font-bold text-foreground">{currentMs}</span>
                <span className="text-[10px] font-mono text-muted-foreground font-semibold">milliseconds</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsClockRunning(!isClockRunning)}
              className="h-8.5 px-3 cursor-pointer text-xs"
            >
              {isClockRunning ? <Pause className="h-3.5 w-3.5 mr-1.5" /> : <Play className="h-3.5 w-3.5 mr-1.5" />}
              {isClockRunning ? "Pause Clock" : "Resume Clock"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleCopyText(currentUnix.toString(), "current seconds timestamp", setCopiedClockSec)}
              className="h-8.5 px-3 cursor-pointer text-xs"
            >
              {copiedClockSec ? <Check className="h-3.5 w-3.5 mr-1.5 text-green-500" /> : <Clipboard className="h-3.5 w-3.5 mr-1.5" />}
              Copy Seconds
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleCopyText(currentMs.toString(), "current milliseconds timestamp", setCopiedClockMs)}
              className="h-8.5 px-3 cursor-pointer text-xs"
            >
              {copiedClockMs ? <Check className="h-3.5 w-3.5 mr-1.5 text-green-500" /> : <Clipboard className="h-3.5 w-3.5 mr-1.5" />}
              Copy Milliseconds
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Grid Converter Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        
        {/* Left Side: Epoch to Human Date */}
        <Card className="border border-border/80 bg-card shadow-sm">
          <CardHeader className="pb-4 border-b border-border/50">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Calendar className="h-4.5 w-4.5 text-primary" />
              Epoch to Human-Readable Date
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 flex flex-col gap-5">
            {/* Input and Mode Selector */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 flex flex-col gap-1.5">
                <label htmlFor="epoch-input" className="text-xs font-semibold text-muted-foreground">
                  Enter Unix Epoch Timestamp
                </label>
                <Input
                  id="epoch-input"
                  type="text"
                  value={epochInput}
                  onChange={(e) => setEpochInput(e.target.value)}
                  placeholder="e.g. 1719310800"
                  className="h-9.5 focus-visible:ring-primary shadow-sm font-mono"
                />
              </div>
              <div className="w-full sm:w-44 flex flex-col gap-1.5">
                <span className="text-xs font-semibold text-muted-foreground">
                  Timestamp Unit
                </span>
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex h-9.5 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-1.5 text-xs shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer text-left font-semibold text-foreground">
                    <span className="truncate">
                      {unitMode === "auto" && "Auto-Detect Unit"}
                      {unitMode === "seconds" && "Seconds (10 digits)"}
                      {unitMode === "ms" && "Milliseconds (13 digits)"}
                    </span>
                    <ChevronDown className="h-3.5 w-3.5 opacity-50 ml-1 shrink-0" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-(--anchor-width) min-w-[176px] text-xs">
                    <DropdownMenuItem onClick={() => setUnitMode("auto")}>
                      Auto-Detect Unit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setUnitMode("seconds")}>
                      Seconds (10 digits)
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setUnitMode("ms")}>
                      Milliseconds (13 digits)
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Conversion Output Panel */}
            <div className="flex flex-col gap-4 border-t border-border/40 pt-4">
              {"error" in epochDetails ? (
                <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-xs text-destructive flex items-start gap-2.5 font-semibold">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{epochDetails.error}</span>
                </div>
              ) : (
                <div className="flex flex-col gap-3.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Conversion Results</span>
                    <Badge variant="secondary" className="text-[10px] font-semibold">
                      Detected: {epochDetails.detectedUnit}
                    </Badge>
                  </div>

                  {/* Local Time Zone */}
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-muted-foreground">Local Time Zone</span>
                      <Button
                        variant="ghost"
                        size="xs"
                        onClick={() => handleCopyText(epochDetails.localStr || "", "local time")}
                        className="h-6 gap-1 text-[10px] cursor-pointer"
                      >
                        {copiedField === "local time" ? <Check className="h-3 w-3 text-green-500" /> : <Clipboard className="h-3 w-3" />}
                        Copy
                      </Button>
                    </div>
                    <div className="rounded-lg border border-border/50 bg-muted/15 px-3 py-2 text-xs font-semibold text-foreground leading-relaxed">
                      {epochDetails.localStr}
                    </div>
                  </div>

                  {/* UTC Time Zone */}
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-muted-foreground">UTC Time Zone</span>
                      <Button
                        variant="ghost"
                        size="xs"
                        onClick={() => handleCopyText(epochDetails.utcStr || "", "UTC time")}
                        className="h-6 gap-1 text-[10px] cursor-pointer"
                      >
                        {copiedField === "UTC time" ? <Check className="h-3 w-3 text-green-500" /> : <Clipboard className="h-3 w-3" />}
                        Copy
                      </Button>
                    </div>
                    <div className="rounded-lg border border-border/50 bg-muted/15 px-3 py-2 text-xs font-semibold text-foreground leading-relaxed">
                      {epochDetails.utcStr}
                    </div>
                  </div>

                  {/* ISO 8601 */}
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-muted-foreground">ISO 8601 String</span>
                      <Button
                        variant="ghost"
                        size="xs"
                        onClick={() => handleCopyText(epochDetails.isoStr || "", "ISO 8601 string")}
                        className="h-6 gap-1 text-[10px] cursor-pointer"
                      >
                        {copiedField === "ISO 8601 string" ? <Check className="h-3 w-3 text-green-500" /> : <Clipboard className="h-3 w-3" />}
                        Copy
                      </Button>
                    </div>
                    <div className="rounded-lg border border-border/50 bg-muted/15 px-3 py-2 text-xs font-mono text-foreground leading-relaxed">
                      {epochDetails.isoStr}
                    </div>
                  </div>

                  {/* RFC 2822 */}
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-muted-foreground">RFC 2822 / UTC String</span>
                      <Button
                        variant="ghost"
                        size="xs"
                        onClick={() => handleCopyText(epochDetails.utcStringStr || "", "RFC 2822 string")}
                        className="h-6 gap-1 text-[10px] cursor-pointer"
                      >
                        {copiedField === "RFC 2822 string" ? <Check className="h-3 w-3 text-green-500" /> : <Clipboard className="h-3 w-3" />}
                        Copy
                      </Button>
                    </div>
                    <div className="rounded-lg border border-border/50 bg-muted/15 px-3 py-2 text-xs font-mono text-foreground leading-relaxed">
                      {epochDetails.utcStringStr}
                    </div>
                  </div>

                  {/* Relative Human Time */}
                  <div className="flex justify-between items-center bg-primary/5 border border-primary/10 rounded-xl px-4 py-3 text-xs">
                    <span className="font-semibold text-muted-foreground">Relative Calendar Distance:</span>
                    <span className="font-bold text-primary">{epochDetails.relativeStr}</span>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Right Side: Human Date to Epoch */}
        <Card className="border border-border/80 bg-card shadow-sm">
          <CardHeader className="pb-4 border-b border-border/50">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <ArrowRightLeft className="h-4.5 w-4.5 text-primary" />
              Human-Readable Date to Epoch
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 flex flex-col gap-5">
            {/* Pick Date-Time */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="date-input" className="text-xs font-semibold text-muted-foreground">
                Select Date and Time
              </label>
              <Input
                id="date-input"
                type="datetime-local"
                value={dateInput}
                onChange={(e) => setDateInput(e.target.value)}
                className="h-9.5 focus-visible:ring-primary shadow-sm font-semibold select-none cursor-pointer"
              />
            </div>

            {/* Timezone and Milliseconds adjustments */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 flex flex-col gap-1.5">
                <span className="text-xs font-semibold text-muted-foreground">
                  Interpret Selected Date As
                </span>
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex h-9.5 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-1.5 text-xs shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer text-left font-semibold text-foreground">
                    <span className="truncate">
                      {dateTz === "local" ? "Local Time Zone (System Time)" : "Coordinated Universal Time (UTC/GMT)"}
                    </span>
                    <ChevronDown className="h-3.5 w-3.5 opacity-50 ml-1 shrink-0" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-(--anchor-width) min-w-[220px] text-xs">
                    <DropdownMenuItem onClick={() => setDateTz("local")}>
                      Local Time Zone (System Time)
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setDateTz("utc")}>
                      Coordinated Universal Time (UTC/GMT)
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="w-full sm:w-36 flex flex-col gap-1.5">
                <label htmlFor="ms-offset-input" className="text-xs font-semibold text-muted-foreground font-semibold">
                  Add Milliseconds
                </label>
                <Input
                  id="ms-offset-input"
                  type="number"
                  min={0}
                  max={999}
                  value={dateMsOffset}
                  onChange={(e) => setDateMsOffset(Math.max(0, Math.min(999, parseInt(e.target.value, 10) || 0)))}
                  className="h-9.5 focus-visible:ring-primary shadow-sm font-mono"
                />
              </div>
            </div>

            {/* Conversion Output Panel */}
            <div className="flex flex-col gap-4 border-t border-border/40 pt-4">
              {"error" in dateToEpochDetails ? (
                <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-xs text-destructive flex items-start gap-2.5 font-semibold">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{dateToEpochDetails.error}</span>
                </div>
              ) : (
                <div className="flex flex-col gap-3.5">
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Converted Epoch Output</span>

                  {/* Unix Epoch (Seconds) */}
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-muted-foreground">Seconds Timestamp (10 digits)</span>
                      <Button
                        variant="ghost"
                        size="xs"
                        onClick={() => handleCopyText(dateToEpochDetails.sec || "", "seconds timestamp", setCopiedEpochSec)}
                        className="h-6 gap-1 text-[10px] cursor-pointer"
                      >
                        {copiedEpochSec ? <Check className="h-3 w-3 text-green-500" /> : <Clipboard className="h-3 w-3" />}
                        Copy
                      </Button>
                    </div>
                    <div className="rounded-lg border border-border/50 bg-muted/15 px-3 py-2 text-xs font-mono font-bold text-foreground leading-relaxed">
                      {dateToEpochDetails.sec}
                    </div>
                  </div>

                  {/* Unix Epoch (Milliseconds) */}
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-muted-foreground">Milliseconds Timestamp (13 digits)</span>
                      <Button
                        variant="ghost"
                        size="xs"
                        onClick={() => handleCopyText(dateToEpochDetails.ms || "", "milliseconds timestamp", setCopiedEpochMs)}
                        className="h-6 gap-1 text-[10px] cursor-pointer"
                      >
                        {copiedEpochMs ? <Check className="h-3 w-3 text-green-500" /> : <Clipboard className="h-3 w-3" />}
                        Copy
                      </Button>
                    </div>
                    <div className="rounded-lg border border-border/50 bg-muted/15 px-3 py-2 text-xs font-mono font-bold text-foreground leading-relaxed">
                      {dateToEpochDetails.ms}
                    </div>
                  </div>

                  {/* Relative Distance */}
                  <div className="flex justify-between items-center bg-primary/5 border border-primary/10 rounded-xl px-4 py-3 text-xs">
                    <span className="font-semibold text-muted-foreground">Relative Calendar Distance:</span>
                    <span className="font-bold text-primary">{dateToEpochDetails.relative}</span>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
