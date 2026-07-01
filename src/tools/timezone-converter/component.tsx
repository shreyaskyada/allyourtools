"use client";

import React, { useState, useEffect } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Clock,
  Plus,
  Trash2,
  RefreshCw,
  ChevronDown,
  Copy,
  Check,
  MapPin,
  Info,
  Calendar,
  Sliders,
  Share2,
  ArrowUp,
  ArrowDown,
  Pin,
  CalendarDays,
  ExternalLink,
  Users
} from "lucide-react";
import { toast } from "sonner";

// Major timezones list
const AVAILABLE_TIMEZONES = [
  { value: "UTC", label: "Coordinated Universal Time (UTC/GMT)" },
  { value: "America/New_York", label: "New York (EST/EDT - UTC-5/-4)" },
  { value: "America/Los_Angeles", label: "Los Angeles (PST/PDT - UTC-8/-7)" },
  { value: "America/Chicago", label: "Chicago (CST/CDT - UTC-6/-5)" },
  { value: "America/Denver", label: "Denver (MST/MDT - UTC-7/-6)" },
  { value: "America/Phoenix", label: "Phoenix (MST - UTC-7)" },
  { value: "America/Toronto", label: "Toronto (EST/EDT - UTC-5/-4)" },
  { value: "America/Sao_Paulo", label: "São Paulo (BRT - UTC-3)" },
  { value: "Europe/London", label: "London (GMT/BST - UTC+0/+1)" },
  { value: "Europe/Paris", label: "Paris (CET/CEST - UTC+1/+2)" },
  { value: "Europe/Berlin", label: "Berlin (CET/CEST - UTC+1/+2)" },
  { value: "Europe/Moscow", label: "Moscow (MSK - UTC+3)" },
  { value: "Asia/Kolkata", label: "India (IST - UTC+5:30)" },
  { value: "Asia/Tokyo", label: "Tokyo (JST - UTC+9)" },
  { value: "Asia/Singapore", label: "Singapore (SGT - UTC+8)" },
  { value: "Asia/Hong_Kong", label: "Hong Kong (HKT - UTC+8)" },
  { value: "Asia/Seoul", label: "Seoul (KST - UTC+9)" },
  { value: "Asia/Dubai", label: "Dubai (GST - UTC+4)" },
  { value: "Asia/Shanghai", label: "Shanghai (CST - UTC+8)" },
  { value: "Australia/Sydney", label: "Sydney (AEST/AEDT - UTC+10/+11)" },
  { value: "Australia/Perth", label: "Perth (AWST - UTC+8)" },
  { value: "Pacific/Auckland", label: "Auckland (NZST/NZDT - UTC+12/+13)" },
  { value: "Africa/Johannesburg", label: "Johannesburg (SAST - UTC+2)" },
  { value: "Africa/Cairo", label: "Cairo (EET - UTC+2)" }
];

// Hour category helper with style configurations
function getHourStyle(hour: number, isSelected: boolean): { bg: string; text: string; border: string; label: string; indicator: string } {
  if (hour >= 9 && hour < 17) {
    return {
      bg: isSelected
        ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20 border-emerald-600 scale-105"
        : "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
      text: "text-emerald-500",
      border: "border-emerald-500/30",
      label: "Work Hours",
      indicator: "🟢"
    };
  } else if (hour >= 22 || hour < 6) {
    return {
      bg: isSelected
        ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20 border-indigo-700 scale-105"
        : "bg-indigo-950/20 hover:bg-indigo-950/30 text-indigo-400 dark:text-indigo-300 border-indigo-500/15",
      text: "text-indigo-400",
      border: "border-indigo-500/15",
      label: "Sleep Hours",
      indicator: "🌙"
    };
  } else {
    return {
      bg: isSelected
        ? "bg-amber-500 text-white shadow-md shadow-amber-500/20 border-amber-600 scale-105"
        : "bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/20",
      text: "text-amber-500",
      border: "border-amber-500/25",
      label: "Personal Time",
      indicator: "🏠"
    };
  }
}

// Hour badge helper to avoid color contrast issues
function getHourBadgeStyle(hour: number): string {
  if (hour >= 9 && hour < 17) {
    return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
  } else if (hour >= 22 || hour < 6) {
    return "bg-indigo-950/30 text-indigo-400 dark:text-indigo-300 border-indigo-500/15";
  } else {
    return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
  }
}

// Convert date timezone helpers
const formatDateTz = (date: Date, timeZone: string): string => {
  try {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: "full",
      timeZone,
    }).format(date);
  } catch {
    return date.toDateString();
  }
};

const formatTimeTz = (date: Date, timeZone: string): string => {
  try {
    return new Intl.DateTimeFormat(undefined, {
      timeStyle: "short",
      timeZone,
    }).format(date);
  } catch {
    return date.toLocaleTimeString();
  }
};

const getGmtOffset = (date: Date, timeZone: string): string => {
  try {
    const parts = new Intl.DateTimeFormat(undefined, {
      timeZone,
      timeZoneName: "longOffset"
    }).formatToParts(date);
    const tzPart = parts.find(p => p.type === "timeZoneName");
    return tzPart ? tzPart.value : "GMT";
  } catch {
    return "GMT";
  }
};

const getOffsetDiffMinutes = (date: Date, tzA: string, tzB: string): number => {
  try {
    const getUtcMs = (tz: string) => {
      const parts = new Intl.DateTimeFormat('en-US', {
        timeZone: tz,
        year: 'numeric', month: 'numeric', day: 'numeric',
        hour: 'numeric', minute: 'numeric', second: 'numeric',
        hour12: false
      }).formatToParts(date);

      const year = parseInt(parts.find(p => p.type === 'year')!.value, 10);
      const month = parseInt(parts.find(p => p.type === 'month')!.value, 10) - 1;
      const day = parseInt(parts.find(p => p.type === 'day')!.value, 10);
      const hour = parseInt(parts.find(p => p.type === 'hour')!.value, 10);
      const minute = parseInt(parts.find(p => p.type === 'minute')!.value, 10);
      const second = parseInt(parts.find(p => p.type === 'second')!.value, 10);

      return Date.UTC(year, month, day, hour, minute, second);
    };

    const msA = getUtcMs(tzA);
    const msB = getUtcMs(tzB);
    return (msB - msA) / 60000;
  } catch {
    return 0;
  }
};

const formatOffsetDiff = (diffMin: number): string => {
  if (diffMin === 0) return "Same time";
  const hours = diffMin / 60;
  const prefix = hours > 0 ? "+" : "";
  if (hours % 1 === 0) {
    return `${prefix}${hours}h`;
  }
  return `${prefix}${hours.toFixed(1)}h`;
};

const getHourInTz = (date: Date, timeZone: string): number => {
  try {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone,
      hour: 'numeric',
      hour12: false
    }).formatToParts(date);
    return parseInt(parts.find(p => p.type === 'hour')!.value, 10) % 24;
  } catch {
    return date.getHours();
  }
};

interface MeetingSlot {
  label: string;
  score: number;
  quality: "Optimal" | "Fair" | "Poor";
  times: { tzName: string; formatted: string; isSleep: boolean; label: string }[];
  dateObj: Date;
}

export default function TimezoneConverter(): React.JSX.Element {
  const localTz = typeof Intl !== "undefined" ? Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC" : "UTC";

  // States
  const [baseDate, setBaseDate] = useState<Date>(new Date());
  const [isLive, setIsLive] = useState<boolean>(true);
  const [copiedTz, setCopiedTz] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isShareOpen, setIsShareOpen] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Set up timezone list
  const initialTzs = [localTz, "UTC", "America/New_York", "Europe/London", "Asia/Tokyo"].filter(
    (v, i, a) => a.indexOf(v) === i
  );
  const [activeTzs, setActiveTzs] = useState<string[]>(initialTzs);

  // Live ticking
  useEffect(() => {
    if (!isLive) return;
    const timer = setInterval(() => {
      setBaseDate(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, [isLive]);

  // Adjust time of baseDate
  const handleTimeChange = (timeString: string) => {
    if (!timeString) return;
    setIsLive(false);

    const [hours, minutes] = timeString.split(":").map(Number);
    const updatedDate = new Date(baseDate);
    updatedDate.setHours(hours, minutes, 0, 0);
    setBaseDate(updatedDate);
  };

  const getTimeString = () => {
    const hours = String(baseDate.getHours()).padStart(2, "0");
    const minutes = String(baseDate.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  // Adjust baseDate date picker
  const handleDateChange = (dateString: string) => {
    if (!dateString) return;
    setIsLive(false);

    const [year, month, day] = dateString.split("-").map(Number);
    const updatedDate = new Date(baseDate);
    updatedDate.setFullYear(year, month - 1, day);
    setBaseDate(updatedDate);
  };

  // Preset Date calculations
  const getNextMonday = () => {
    const d = new Date();
    const day = d.getDay();
    const diff = d.getDate() + (day === 0 ? 1 : 8 - day);
    d.setDate(diff);
    return d;
  };

  // Toggle Live Clock
  const handleResetToNow = () => {
    setIsLive(true);
    setBaseDate(new Date());
  };

  // Copy TZ value
  const handleCopyTimezone = (tzName: string) => {
    const formatted = `${formatTimeTz(baseDate, tzName)} on ${formatDateTz(baseDate, tzName)} (${tzName})`;
    navigator.clipboard.writeText(formatted);
    toast.success(`Copied: ${formatted}`);
    setCopiedTz(tzName);
    setTimeout(() => setCopiedTz(null), 2000);
  };

  // Add Timezone
  const handleAddTz = (tz: string) => {
    if (activeTzs.includes(tz)) {
      toast.warning("Timezone is already added.");
      return;
    }
    setActiveTzs([...activeTzs, tz]);
    toast.success(`Added timezone: ${tz.split("/").pop()?.replace(/_/g, " ")}`);
  };

  // Remove Timezone
  const handleRemoveTz = (tz: string) => {
    if (activeTzs.length <= 1) {
      toast.error("You must keep at least one timezone.");
      return;
    }
    setActiveTzs(activeTzs.filter(t => t !== tz));
    toast.success(`Removed timezone: ${tz.split("/").pop()?.replace(/_/g, " ")}`);
  };

  // Move timezone in list
  const handleMoveTz = (index: number, direction: "up" | "down") => {
    if (direction === "up" && index > 0) {
      const updated = [...activeTzs];
      const temp = updated[index];
      updated[index] = updated[index - 1];
      updated[index - 1] = temp;
      setActiveTzs(updated);
      toast.success("Rearranged timezone list");
    } else if (direction === "down" && index < activeTzs.length - 1) {
      const updated = [...activeTzs];
      const temp = updated[index];
      updated[index] = updated[index + 1];
      updated[index + 1] = temp;
      setActiveTzs(updated);
      toast.success("Rearranged timezone list");
    }
  };

  // Pin timezone as local primary (move to index 0)
  const handlePinTz = (index: number) => {
    if (index === 0) return;
    const updated = [...activeTzs];
    const target = updated.splice(index, 1)[0];
    updated.unshift(target);
    setActiveTzs(updated);
    toast.success(`Pinned ${target.split("/").pop()?.replace(/_/g, " ")} as primary timezone`);
  };

  // Click on block shifts workspace time to that hour
  const handleBlockClick = (tz: string, targetHour: number) => {
    setIsLive(false);
    try {
      const currentHourInTz = getHourInTz(baseDate, tz);
      const diffHours = targetHour - currentHourInTz;

      const parts = new Intl.DateTimeFormat('en-US', {
        timeZone: tz,
        minute: 'numeric',
        second: 'numeric'
      }).formatToParts(baseDate);

      const currentMins = parseInt(parts.find(p => p.type === 'minute')?.value || "0", 10);
      const currentSecs = parseInt(parts.find(p => p.type === 'second')?.value || "0", 10);

      const msAdjustment = (diffHours * 3600000) - (currentMins * 60000) - (currentSecs * 1000);
      const updatedDate = new Date(baseDate.getTime() + msAdjustment);
      setBaseDate(updatedDate);

      const hourLabel = targetHour === 0 ? "12 AM" : targetHour === 12 ? "12 PM" : targetHour > 12 ? `${targetHour - 12} PM` : `${targetHour} AM`;
      toast.success(`Set time to ${hourLabel} in ${tz.split("/").pop()?.replace(/_/g, " ")}`);
    } catch {
      // Fallback
      const currentHourInTz = getHourInTz(baseDate, tz);
      const diffHours = targetHour - currentHourInTz;
      const updatedDate = new Date(baseDate.getTime() + diffHours * 3600000);
      updatedDate.setMinutes(0, 0, 0);
      setBaseDate(updatedDate);
    }
  };

  // Master Time Slider change handler (15-minute intervals)
  const handleSliderChange = (sliderValue: number) => {
    setIsLive(false);
    const hours = Math.floor(sliderValue / 4);
    const minutes = (sliderValue % 4) * 15;
    const updatedDate = new Date(baseDate);
    updatedDate.setHours(hours, minutes, 0, 0);
    setBaseDate(updatedDate);
  };

  const getLocalDateString = () => {
    const year = baseDate.getFullYear();
    const month = String(baseDate.getMonth() + 1).padStart(2, "0");
    const day = String(baseDate.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Filter timezones for search
  const filteredTzs = AVAILABLE_TIMEZONES.filter(
    (tz) =>
      tz.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tz.value.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Generate meeting options for Planner
  const getMeetingSlots = (): MeetingSlot[] => {
    const primaryTz = activeTzs[0];
    const slots: MeetingSlot[] = [];

    for (let h = 0; h < 24; h++) {
      const currentHourInPrimary = getHourInTz(baseDate, primaryTz);
      const diffHours = h - currentHourInPrimary;

      let currentMins = 0;
      try {
        const parts = new Intl.DateTimeFormat('en-US', {
          timeZone: primaryTz,
          minute: 'numeric'
        }).formatToParts(baseDate);
        currentMins = parseInt(parts.find(p => p.type === 'minute')?.value || "0", 10);
      } catch {}

      const slotDate = new Date(baseDate.getTime() + (diffHours * 3600000) - (currentMins * 60000));
      slotDate.setSeconds(0, 0);

      let totalScore = 0;
      let sleepCount = 0;
      let workCount = 0;
      const times: MeetingSlot["times"] = [];

      activeTzs.forEach((tz) => {
        const hr = getHourInTz(slotDate, tz);
        const isSleep = hr >= 22 || hr < 6;
        const isWork = hr >= 9 && hr < 17;

        let score = 1; // Personal
        let label = "Personal";
        if (isSleep) {
          score = -5;
          sleepCount++;
          label = "Sleep";
        } else if (isWork) {
          score = 2;
          workCount++;
          label = "Work";
        }
        totalScore += score;

        let formattedTime = "";
        try {
          formattedTime = new Intl.DateTimeFormat(undefined, {
            timeStyle: "short",
            timeZone: tz
          }).format(slotDate);
        } catch {
          formattedTime = `${hr}:00`;
        }

        times.push({
          tzName: tz.split("/").pop()?.replace(/_/g, " ") || tz,
          formatted: formattedTime,
          isSleep,
          label
        });
      });

      let quality: MeetingSlot["quality"] = "Fair";
      if (sleepCount > 0) {
        quality = "Poor";
      } else if (workCount === activeTzs.length) {
        quality = "Optimal";
      }

      slots.push({
        label: `${h === 0 ? "12 AM" : h === 12 ? "12 PM" : h > 12 ? `${h - 12} PM` : `${h} AM`}`,
        score: totalScore,
        quality,
        times,
        dateObj: slotDate
      });
    }

    // Sort: Optimal > Fair > Poor, then score descending
    const qualityWeight = { Optimal: 3, Fair: 2, Poor: 1 };
    return [...slots]
      .sort((a, b) => {
        if (qualityWeight[a.quality] !== qualityWeight[b.quality]) {
          return qualityWeight[b.quality] - qualityWeight[a.quality];
        }
        return b.score - a.score;
      })
      .slice(0, 4); // return top 4
  };

  const meetingSlots = getMeetingSlots();

  // Share template values
  const getShareText = () => {
    const formattedDate = formatDateTz(baseDate, activeTzs[0]);
    let text = `📅 Meeting Schedule: ${formattedDate}\n\n`;
    activeTzs.forEach((tz) => {
      const city = tz.split("/").pop()?.replace(/_/g, " ") || tz;
      text += `- 🕒 ${city}: ${formatTimeTz(baseDate, tz)} (${getGmtOffset(baseDate, tz)})\n`;
    });
    text += `\nConverted via AllYourTools Timezone Converter`;
    return text;
  };

  const handleCopyShareText = () => {
    navigator.clipboard.writeText(getShareText());
    toast.success("Meeting details copied to clipboard!");
  };

  const getGoogleCalendarUrl = () => {
    const formatUtcDate = (d: Date) => d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    const startDate = formatUtcDate(baseDate);
    const endDate = formatUtcDate(new Date(baseDate.getTime() + 60 * 60 * 1000));
    const title = encodeURIComponent("Sync Meeting");
    const details = encodeURIComponent(getShareText());
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startDate}/${endDate}&details=${details}`;
  };

  const getOutlookCalendarUrl = () => {
    const startDate = baseDate.toISOString();
    const endDate = new Date(baseDate.getTime() + 60 * 60 * 1000).toISOString();
    const title = encodeURIComponent("Sync Meeting");
    const details = encodeURIComponent(getShareText());
    return `https://outlook.live.com/calendar/0/deeplink/compose?path=/calendar/action/compose&rru=addevent&subject=${title}&startdt=${startDate}&enddt=${endDate}&body=${details}`;
  };

  if (!mounted) {
    return (
      <div className="flex items-center justify-center p-12 min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="h-8 w-8 animate-spin text-primary opacity-60" />
          <p className="text-xs text-muted-foreground font-semibold">Loading Time Zone Converter...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Control Header Card */}
      <Card className="border border-border/80 bg-card shadow-sm">
        <CardContent className="p-5 flex flex-col gap-5">
          <div className="flex flex-col md:flex-row items-center gap-4 justify-between">
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
              {/* Date Pick & Presets */}
              <div className="flex flex-col gap-1.5 w-full sm:w-56">
                <label htmlFor="base-date-pick" className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  Select Date
                </label>
                <Input
                  id="base-date-pick"
                  type="date"
                  value={getLocalDateString()}
                  onChange={(e) => handleDateChange(e.target.value)}
                  className="h-9.5 font-semibold text-xs cursor-pointer select-none"
                />
                {/* Date presets */}
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-5 px-2 text-[10px] hover:bg-muted font-bold text-muted-foreground"
                    onClick={() => {
                      setIsLive(false);
                      const d = new Date();
                      d.setHours(baseDate.getHours(), baseDate.getMinutes(), 0, 0);
                      setBaseDate(d);
                      toast.success("Set to Today");
                    }}
                  >
                    Today
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-5 px-2 text-[10px] hover:bg-muted font-bold text-muted-foreground"
                    onClick={() => {
                      setIsLive(false);
                      const d = new Date();
                      d.setDate(d.getDate() + 1);
                      d.setHours(baseDate.getHours(), baseDate.getMinutes(), 0, 0);
                      setBaseDate(d);
                      toast.success("Set to Tomorrow");
                    }}
                  >
                    Tomorrow
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-5 px-2 text-[10px] hover:bg-muted font-bold text-muted-foreground"
                    onClick={() => {
                      setIsLive(false);
                      const d = getNextMonday();
                      d.setHours(baseDate.getHours(), baseDate.getMinutes(), 0, 0);
                      setBaseDate(d);
                      toast.success("Set to Next Monday");
                    }}
                  >
                    Next Mon
                  </Button>
                </div>
              </div>

              {/* Time Selector */}
              <div className="flex flex-col gap-1.5 w-full sm:w-44 self-start">
                <label htmlFor="base-time-pick" className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  Select Time
                </label>
                <Input
                  id="base-time-pick"
                  type="time"
                  value={getTimeString()}
                  onChange={(e) => handleTimeChange(e.target.value)}
                  className="h-9.5 font-semibold text-xs cursor-pointer select-none"
                />
              </div>
            </div>

            {/* Top Action buttons */}
            <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto justify-end self-start md:self-center">
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetToNow}
                className="h-9 px-3.5 cursor-pointer text-xs flex items-center gap-1.5"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${isLive ? "animate-spin text-emerald-500" : ""}`} />
                {isLive ? "Live Clock Active" : "Reset to Current Time"}
              </Button>

              <Dialog open={isShareOpen} onOpenChange={setIsShareOpen}>
                <DialogTrigger
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" }),
                    "h-9 px-3.5 text-xs flex items-center gap-1.5 cursor-pointer"
                  )}
                >
                  <Share2 className="h-3.5 w-3.5" />
                  Share Meeting
                </DialogTrigger>
                <DialogContent className="w-full max-w-md sm:max-w-lg">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-base font-bold">
                      <CalendarDays className="h-5 w-5 text-primary" />
                      Share Sync Meeting
                    </DialogTitle>
                    <DialogDescription className="text-xs text-muted-foreground">
                      Review conversions and copy coordinates or add this directly to calendars.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex flex-col gap-4 mt-2">
                    {/* Plain Text Display */}
                    <div className="relative">
                      <pre className="p-3 text-[11px] font-mono border rounded-lg bg-muted/30 whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
                        {getShareText()}
                      </pre>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={handleCopyShareText}
                        className="absolute right-2.5 bottom-2.5 h-7 text-[10px] gap-1 cursor-pointer"
                      >
                        <Copy className="h-3 w-3" />
                        Copy Details
                      </Button>
                    </div>

                    <div className="flex flex-col gap-2">
                      <h4 className="text-xs font-bold text-foreground">Direct Calendar Actions</h4>
                      <div className="grid grid-cols-2 gap-3.5">
                        <a
                          href={getGoogleCalendarUrl()}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-1.5 rounded-lg border border-border p-2.5 text-center text-xs font-bold transition hover:bg-muted/50 cursor-pointer"
                        >
                          <ExternalLink className="h-3.5 w-3.5 text-blue-500" />
                          Google Calendar
                        </a>
                        <a
                          href={getOutlookCalendarUrl()}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-1.5 rounded-lg border border-border p-2.5 text-center text-xs font-bold transition hover:bg-muted/50 cursor-pointer"
                        >
                          <ExternalLink className="h-3.5 w-3.5 text-blue-600" />
                          Outlook Calendar
                        </a>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Add Time Zone Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger className="flex h-9 items-center justify-between gap-1.5 rounded-md border border-input bg-transparent px-3.5 py-1.5 text-xs shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer text-left font-semibold text-foreground">
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  Add Time Zone
                  <ChevronDown className="h-3.5 w-3.5 opacity-50 ml-1" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64 text-xs max-h-72 overflow-y-auto" align="end">
                  <div className="p-2 border-b border-border/50 sticky top-0 bg-popover z-10">
                    <Input
                      type="text"
                      placeholder="Search time zone or city..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="h-8 text-xs font-medium focus-visible:ring-primary shadow-sm"
                    />
                  </div>
                  {filteredTzs.length === 0 ? (
                    <div className="text-center text-muted-foreground p-3 text-[11px]">No zones found</div>
                  ) : (
                    filteredTzs.map((tz) => (
                      <DropdownMenuItem
                        key={tz.value}
                        onClick={() => handleAddTz(tz.value)}
                        disabled={activeTzs.includes(tz.value)}
                        className="cursor-pointer py-1.5 flex justify-between items-center"
                      >
                        <span>{tz.label}</span>
                        {activeTzs.includes(tz.value) && (
                          <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground font-semibold">Added</span>
                        )}
                      </DropdownMenuItem>
                    ))
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Master time slider */}
          <div className="flex flex-col gap-4 border-t border-border/40 pt-4">
            {/* Master Time Slider */}
            <div className="flex flex-col gap-2 bg-muted/20 border border-border/40 p-4 rounded-xl">
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Sliders className="h-3.5 w-3.5" />
                  Drag Slider to Scrub Time (15m Intervals)
                </span>
                <span className="font-mono text-primary font-bold bg-primary/10 border border-primary/20 px-2.5 py-0.5 rounded-full text-[11px]">
                  {formatTimeTz(baseDate, activeTzs[0])} ({activeTzs[0].split("/").pop()?.replace(/_/g, " ")})
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="95"
                value={baseDate.getHours() * 4 + Math.floor(baseDate.getMinutes() / 15)}
                onChange={(e) => handleSliderChange(parseInt(e.target.value, 10))}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary focus:outline-none focus:ring-1 focus:ring-primary py-1"
              />
              <div className="flex justify-between text-[9px] text-muted-foreground font-bold px-1 font-mono">
                <span>12:00 AM (Midnight)</span>
                <span>6:00 AM</span>
                <span>12:00 PM (Noon)</span>
                <span>6:00 PM</span>
                <span>11:45 PM</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timezone Cards Listing */}
      <div className="flex flex-col gap-4">
        {activeTzs.map((tz, index) => {
          const isMainTz = index === 0;
          const currentHour = getHourInTz(baseDate, tz);
          const offsetMinutes = getOffsetDiffMinutes(baseDate, activeTzs[0], tz);
          const offsetDiffFormatted = formatOffsetDiff(offsetMinutes);
          const gmtOffset = getGmtOffset(baseDate, tz);
          const formattedTime = formatTimeTz(baseDate, tz);
          const formattedDate = formatDateTz(baseDate, tz);
          const activeStyle = getHourStyle(currentHour, true);
          const badgeStyle = getHourBadgeStyle(currentHour);

          return (
            <Card key={tz} className={`border bg-card overflow-hidden shadow-sm relative group transition-all duration-200 ${
              isMainTz ? "border-primary/30 ring-1 ring-primary/15" : "border-border/80"
            }`}>
              <CardContent className="p-5 flex flex-col gap-4">

                {/* Timezone Main info row */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                      isMainTz ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                    }`}>
                      <MapPin className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-1.5">
                        <h3 className="font-bold text-foreground text-sm tracking-tight">
                          {tz.split("/").pop()?.replace(/_/g, " ")}
                        </h3>
                        <Badge variant="secondary" className="text-[9px] py-0 px-1.5 font-mono font-bold leading-normal">
                          {gmtOffset}
                        </Badge>
                        {!isMainTz && (
                          <Badge variant="outline" className={`text-[9px] py-0 px-1.5 font-bold leading-normal ${
                            offsetMinutes >= 0 
                              ? "border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/5" 
                              : "border-amber-500/30 text-amber-600 dark:text-amber-400 bg-amber-500/5"
                          }`}>
                            {offsetDiffFormatted} {offsetMinutes > 0 ? "ahead" : offsetMinutes < 0 ? "behind" : ""}
                          </Badge>
                        )}
                        {isMainTz && (
                          <Badge variant="outline" className="text-[9px] py-0 px-1.5 border-primary/30 text-primary bg-primary/5 font-extrabold leading-normal">
                            Primary Home
                          </Badge>
                        )}
                      </div>
                      <p className="text-[11px] font-semibold text-muted-foreground mt-0.5">{tz}</p>
                    </div>
                  </div>

                  {/* Visual Date-Time values & interactive buttons */}
                  <div className="flex items-center gap-4 justify-between md:justify-end">
                    <div className="text-right">
                      <p className="font-mono text-2xl font-black text-foreground leading-none tracking-tight">{formattedTime}</p>
                      <p className="text-xs text-muted-foreground mt-1 font-semibold">{formattedDate}</p>
                    </div>

                    <div className="flex items-center gap-1">
                      {/* Move Up Button */}
                      <button
                        type="button"
                        disabled={index === 0}
                        onClick={() => handleMoveTz(index, "up")}
                        className="h-8 w-8 rounded-lg cursor-pointer opacity-40 group-hover:opacity-100 disabled:opacity-20 transition-all hover:bg-muted flex items-center justify-center disabled:cursor-not-allowed text-foreground"
                        title="Move Up"
                      >
                        <ArrowUp className="h-3.5 w-3.5" />
                      </button>

                      {/* Move Down Button */}
                      <button
                        type="button"
                        disabled={index === activeTzs.length - 1}
                        onClick={() => handleMoveTz(index, "down")}
                        className="h-8 w-8 rounded-lg cursor-pointer opacity-40 group-hover:opacity-100 disabled:opacity-20 transition-all hover:bg-muted flex items-center justify-center disabled:cursor-not-allowed text-foreground"
                        title="Move Down"
                      >
                        <ArrowDown className="h-3.5 w-3.5" />
                      </button>

                      {/* Pin to Home Button */}
                      {!isMainTz && (
                        <button
                          type="button"
                          onClick={() => handlePinTz(index)}
                          className="h-8 w-8 rounded-lg cursor-pointer opacity-40 group-hover:opacity-100 hover:text-primary transition-all hover:bg-muted flex items-center justify-center text-foreground"
                          title="Pin as Primary Timezone"
                        >
                          <Pin className="h-3.5 w-3.5" />
                        </button>
                      )}

                      {/* Copy Action Button */}
                      <button
                        type="button"
                        onClick={() => handleCopyTimezone(tz)}
                        className="h-8 w-8 rounded-lg cursor-pointer hover:bg-muted flex items-center justify-center text-foreground"
                        title="Copy Time details"
                      >
                        {copiedTz === tz ? <Check className="h-4.5 w-4.5 text-green-500 animate-bounce" /> : <Copy className="h-4.5 w-4.5" />}
                      </button>

                      {/* Remove timezone Button */}
                      {!isMainTz && (
                        <button
                          type="button"
                          onClick={() => handleRemoveTz(tz)}
                          className="h-8 w-8 rounded-lg text-destructive hover:bg-destructive/10 cursor-pointer flex items-center justify-center transition-colors hover:bg-destructive/5"
                          title="Remove Timezone"
                        >
                          <Trash2 className="h-4.5 w-4.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* 24-hour visual blocks visualizer */}
                <div className="flex flex-col gap-1.5 border-t border-border/40 pt-4">
                  <div className="flex items-center justify-between text-[10px] font-semibold text-muted-foreground mb-1.5">
                    <span className="flex items-center gap-1">
                      <Info className="h-3.5 w-3.5 text-primary/75" />
                      Click any hour cell to synchronize all time zones to that hour.
                    </span>
                    <span className={`font-bold px-2 py-0.5 rounded-full border text-[9px] ${badgeStyle}`}>
                      {activeStyle.indicator} {activeStyle.label} at Selected Time
                    </span>
                  </div>

                  {/* 24 slots grid */}
                  <div className="grid grid-cols-24 gap-1 w-full bg-muted/20 border border-border/30 rounded-xl p-2 overflow-x-auto min-w-[320px]">
                    {Array.from({ length: 24 }).map((_, h) => {
                      const isSelected = h === currentHour;
                      const style = getHourStyle(h, isSelected);

                      return (
                        <button
                          key={h}
                          onClick={() => handleBlockClick(tz, h)}
                          className={`
                            h-8.5 rounded-md flex flex-col items-center justify-center font-mono text-[10px] font-bold border transition-all cursor-pointer select-none outline-none focus:ring-1 focus:ring-primary/40
                            ${style.bg}
                            ${isSelected ? 'ring-2 ring-primary/30 ring-offset-1 dark:ring-offset-card relative z-10 font-extrabold' : ''}
                          `}
                          title={`Click to set schedule to ${h}:00 (${style.label})`}
                        >
                          <span>{h}</span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex justify-between items-center text-[9px] text-muted-foreground font-semibold mt-1.5 px-1 font-mono">
                    <span>12 AM (Midnight)</span>
                    <span className="text-emerald-500 font-bold flex items-center gap-1">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Working Hours (9am-5pm)
                    </span>
                    <span>12 PM (Noon)</span>
                    <span className="text-indigo-400 font-bold flex items-center gap-1">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-indigo-400"></span> Sleeping Hours (10pm-6am)
                    </span>
                    <span>11 PM</span>
                  </div>
                </div>

              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Meeting Overlap Planner Panel */}
      {activeTzs.length > 1 && (
        <Card className="border border-border/80 bg-card shadow-sm mt-2">
          <CardHeader className="p-5 pb-2 border-b border-border/40">
            <CardTitle className="text-sm font-bold flex items-center gap-1.5 text-foreground">
              <Users className="h-4.5 w-4.5 text-primary" />
              Smart Meeting Overlap Planner
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Calculated overlap windows based on waking & working slots across all active locations.
            </p>
          </CardHeader>
          <CardContent className="p-5 flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {meetingSlots.map((slot, sIdx) => {
                const isOptimal = slot.quality === "Optimal";
                const isFair = slot.quality === "Fair";
                const statusBg = isOptimal 
                  ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" 
                  : isFair 
                    ? "bg-amber-500/10 text-amber-500 border-amber-500/20" 
                    : "bg-muted text-muted-foreground border-transparent";

                return (
                  <div 
                    key={sIdx} 
                    className="flex flex-col justify-between p-4 border border-border/60 bg-muted/10 rounded-xl gap-3 hover:border-primary/20 transition"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-bold text-foreground">
                          {slot.label} Slot
                        </span>
                        <span className="text-[10px] text-muted-foreground font-semibold">
                          (in {activeTzs[0].split("/").pop()?.replace(/_/g, " ")})
                        </span>
                      </div>
                      <Badge className={`text-[10px] font-bold py-0.5 px-2 ${statusBg}`}>
                        {slot.quality === "Optimal" ? "🟢 Best Overlap" : "🟡 Fair Overlap"}
                      </Badge>
                    </div>

                    {/* Zone Times list */}
                    <div className="flex flex-col gap-1.5">
                      {slot.times.map((t, tIdx) => (
                        <div key={tIdx} className="flex justify-between text-xs font-medium">
                          <span className="text-muted-foreground font-semibold">{t.tzName}</span>
                          <span className={`font-mono flex items-center gap-1 ${
                            t.isSleep 
                              ? "text-indigo-400 dark:text-indigo-300 font-normal" 
                              : t.label === "Work" 
                                ? "text-emerald-500 font-extrabold" 
                                : "text-amber-500 font-bold"
                          }`}>
                            {t.isSleep ? "🌙" : t.label === "Work" ? "💼" : "🏠"} {t.formatted}
                          </span>
                        </div>
                      ))}
                    </div>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setIsLive(false);
                        setBaseDate(slot.dateObj);
                        toast.success(`Adjusted schedule to slot starting at ${slot.label}`);
                      }}
                      className="w-full text-xs h-8 cursor-pointer mt-1"
                    >
                      Apply This Meeting Time
                    </Button>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
