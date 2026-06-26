"use client";

import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { QrCode, Download, Link, Type, User, Palette, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import QRCode from "qrcode";
import { HexColorPicker } from "react-colorful";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

// ------------------------------------------------------------------
// RangeSlider — premium filled-track slider (copied for local use)
// ------------------------------------------------------------------
interface RangeSliderProps {
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (v: number) => void;
  minLabel?: string;
  maxLabel?: string;
}

function RangeSlider({ min, max, step, value, onChange, minLabel, maxLabel }: RangeSliderProps) {
  const pct = ((value - min) / (max - min)) * 100;

  return (
    <div className="relative flex flex-col gap-1 select-none">
      <div className="relative h-6 flex items-center">
        <div className="absolute inset-x-0 h-1.5 rounded-full bg-border/70" />
        <div className="absolute h-1.5 rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="slider-range absolute inset-x-0 opacity-0 h-6 z-10"
          style={{ background: "transparent" }}
        />
        <div
          className="absolute w-4.5 h-4.5 rounded-full bg-primary border-2 border-background shadow-md pointer-events-none transition-transform hover:scale-110 z-20"
          style={{ left: `calc(${pct}% - 9px)` }}
        />
      </div>
      {(minLabel || maxLabel) && (
        <div className="flex justify-between">
          <span className="text-[10px] text-muted-foreground">{minLabel}</span>
          <span className="text-[10px] text-muted-foreground">{maxLabel}</span>
        </div>
      )}
    </div>
  );
}

// ------------------------------------------------------------------
// ColorPicker Component
// ------------------------------------------------------------------
const PRESET_COLORS = [
  "#000000", "#FFFFFF", "#EF4444", "#F97316", "#F59E0B", 
  "#84CC16", "#22C55E", "#06B6D4", "#3B82F6", "#6366F1", 
  "#D946EF", "#F43F5E"
];

const ColorPicker = ({ label, value, onChange }: { label: string, value: string, onChange: (v: string) => void }) => (
  <div className="flex flex-col gap-2">
    <label className="text-xs font-bold text-muted-foreground">{label}</label>
    <div className="relative flex items-center">
      <Popover>
        <PopoverTrigger
          type="button"
          className="absolute left-1.5 h-7 w-7 rounded-sm border border-border/80 shadow-sm overflow-hidden shrink-0 z-10 cursor-pointer transition-all hover:scale-110 active:scale-95"
          style={{ backgroundColor: value }}
          title="Pick a color"
        />
        <PopoverContent 
          className="w-auto p-4 flex flex-col gap-4 rounded-xl shadow-xl border-border/80" 
          align="start" 
          sideOffset={12}
        >
          <div className="rounded-lg shadow-sm">
            <HexColorPicker color={value} onChange={onChange} />
          </div>
          
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Presets</span>
            <div className="grid grid-cols-6 gap-2">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`h-6 w-6 rounded-md shadow-xs border transition-all hover:scale-110 active:scale-95 ${
                    value.toUpperCase() === c ? "border-primary ring-2 ring-primary/30" : "border-border/60 hover:border-border"
                  }`}
                  style={{ backgroundColor: c }}
                  onClick={() => onChange(c)}
                  title={c}
                />
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>
      <Input 
        type="text" 
        value={value} 
        onChange={(e) => {
          const val = e.target.value;
          onChange(val);
        }}
        className="h-10 pl-11 font-mono text-sm uppercase bg-background shadow-xs transition-colors focus-visible:ring-1 focus-visible:border-primary"
        maxLength={7}
      />
    </div>
  </div>
);

// ------------------------------------------------------------------
// QR Code Generator Component
// ------------------------------------------------------------------
export default function QRCodeGenerator(): React.JSX.Element {
  const [activeTab, setActiveTab] = useState<"url" | "text" | "vcard">("url");
  
  // Data inputs
  const [url, setUrl] = useState("https://example.com");
  const [text, setText] = useState("");
  
  // vCard inputs
  const [vCard, setVCard] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    website: "",
    company: "",
  });

  // Settings
  const [size, setSize] = useState(256);
  const [margin, setMargin] = useState(4);
  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");

  // Output
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [generating, setGenerating] = useState(false);

  // Combine data based on active tab
  const getQrData = () => {
    switch (activeTab) {
      case "url":
        return url || "https://example.com";
      case "text":
        return text || "Hello World";
      case "vcard":
        const parts = [
          "BEGIN:VCARD",
          "VERSION:3.0",
          `N:${vCard.lastName};${vCard.firstName};;;`,
          `FN:${vCard.firstName} ${vCard.lastName}`,
          vCard.company ? `ORG:${vCard.company}` : "",
          vCard.phone ? `TEL;TYPE=WORK,VOICE:${vCard.phone}` : "",
          vCard.email ? `EMAIL:${vCard.email}` : "",
          vCard.website ? `URL:${vCard.website}` : "",
          "END:VCARD",
        ];
        return parts.filter(Boolean).join("\\n");
      default:
        return "";
    }
  };

  // Generate QR code
  useEffect(() => {
    const generate = async () => {
      setGenerating(true);
      try {
        const data = getQrData();
        const dataUrl = await QRCode.toDataURL(data, {
          width: size,
          margin: margin,
          color: {
            dark: fgColor,
            light: bgColor,
          },
          errorCorrectionLevel: "M",
        });
        setQrDataUrl(dataUrl);
      } catch (err) {
        console.error(err);
      } finally {
        setGenerating(false);
      }
    };

    // Debounce to prevent lag while typing or dragging sliders
    const timeout = setTimeout(generate, 300);
    return () => clearTimeout(timeout);
  }, [activeTab, url, text, vCard, size, margin, fgColor, bgColor]);

  const handleDownload = () => {
    if (!qrDataUrl) return;
    const link = document.createElement("a");
    link.download = `qrcode_${Date.now()}.png`;
    link.href = qrDataUrl;
    link.click();
    toast.success("QR Code downloaded!");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* ── Settings Panel (2 cols) ── */}
      <div className="lg:col-span-2 flex flex-col gap-6">
        
        {/* Data Input Card */}
        <Card className="border border-border/80 bg-card shadow-xs">
          <div className="px-1 py-1 border-b border-border/60 flex">
            <button
              className={`flex-1 py-3 text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${
                activeTab === "url" ? "text-primary border-b-2 border-primary" : "text-muted-foreground hover:bg-muted/30"
              }`}
              onClick={() => setActiveTab("url")}
            >
              <Link className="h-4 w-4" /> URL
            </button>
            <button
              className={`flex-1 py-3 text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${
                activeTab === "text" ? "text-primary border-b-2 border-primary" : "text-muted-foreground hover:bg-muted/30"
              }`}
              onClick={() => setActiveTab("text")}
            >
              <Type className="h-4 w-4" /> Text
            </button>
            <button
              className={`flex-1 py-3 text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${
                activeTab === "vcard" ? "text-primary border-b-2 border-primary" : "text-muted-foreground hover:bg-muted/30"
              }`}
              onClick={() => setActiveTab("vcard")}
            >
              <User className="h-4 w-4" /> Contact
            </button>
          </div>
          <CardContent className="p-5">
            {activeTab === "url" && (
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-muted-foreground">Website URL</label>
                <Input
                  placeholder="https://example.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="font-mono"
                />
              </div>
            )}
            {activeTab === "text" && (
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-muted-foreground">Plain Text</label>
                <Textarea
                  placeholder="Enter your message here..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="min-h-[120px]"
                />
              </div>
            )}
            {activeTab === "vcard" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-muted-foreground">First Name</label>
                  <Input value={vCard.firstName} onChange={(e) => setVCard({...vCard, firstName: e.target.value})} />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-muted-foreground">Last Name</label>
                  <Input value={vCard.lastName} onChange={(e) => setVCard({...vCard, lastName: e.target.value})} />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-muted-foreground">Phone</label>
                  <Input type="tel" value={vCard.phone} onChange={(e) => setVCard({...vCard, phone: e.target.value})} />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-muted-foreground">Email</label>
                  <Input type="email" value={vCard.email} onChange={(e) => setVCard({...vCard, email: e.target.value})} />
                </div>
                <div className="flex flex-col gap-2 sm:col-span-2">
                  <label className="text-xs font-bold text-muted-foreground">Company</label>
                  <Input value={vCard.company} onChange={(e) => setVCard({...vCard, company: e.target.value})} />
                </div>
                <div className="flex flex-col gap-2 sm:col-span-2">
                  <label className="text-xs font-bold text-muted-foreground">Website</label>
                  <Input value={vCard.website} onChange={(e) => setVCard({...vCard, website: e.target.value})} />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Style Options Card */}
        <Card className="border border-border/80 bg-card shadow-xs">
          <div className="px-5 py-4 border-b border-border/60">
            <h3 className="text-sm font-semibold flex items-center gap-2 text-foreground">
              <Palette className="h-4 w-4 text-primary" />
              Design & Layout
            </h3>
          </div>
          <CardContent className="p-5 flex flex-col gap-6">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <ColorPicker label="Foreground Color" value={fgColor} onChange={setFgColor} />
              <ColorPicker label="Background Color" value={bgColor} onChange={setBgColor} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-2">
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-muted-foreground">Resolution Size</label>
                  <span className="text-xs font-mono font-bold tabular-nums px-2 py-0.5 rounded-md bg-primary/10 text-primary">
                    {size}px
                  </span>
                </div>
                <RangeSlider
                  min={128}
                  max={1024}
                  step={32}
                  value={size}
                  onChange={setSize}
                  minLabel="Small"
                  maxLabel="Large"
                />
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-muted-foreground">Margin</label>
                  <span className="text-xs font-mono font-bold tabular-nums px-2 py-0.5 rounded-md bg-primary/10 text-primary">
                    {margin}
                  </span>
                </div>
                <RangeSlider
                  min={0}
                  max={10}
                  step={1}
                  value={margin}
                  onChange={setMargin}
                  minLabel="None"
                  maxLabel="Wide"
                />
              </div>
            </div>

          </CardContent>
        </Card>
      </div>

      {/* ── Preview Panel (1 col) ── */}
      <Card className="border border-border/80 bg-card shadow-xs self-start sticky top-6">
        <div className="px-5 py-4 border-b border-border/60 flex justify-between items-center">
          <h3 className="text-sm font-semibold flex items-center gap-2 text-foreground">
            <QrCode className="h-4 w-4 text-primary" />
            Live Preview
          </h3>
          {generating && <RefreshCw className="h-3.5 w-3.5 text-muted-foreground animate-spin" />}
        </div>
        <CardContent className="p-6 flex flex-col items-center gap-6">
          <div 
            className="w-full aspect-square max-w-[280px] rounded-xl border border-border/40 shadow-sm flex items-center justify-center overflow-hidden transition-opacity"
            style={{ 
              backgroundColor: bgColor,
              opacity: generating ? 0.7 : 1,
            }}
          >
            {qrDataUrl ? (
              <img src={qrDataUrl} alt="Generated QR Code" className="w-full h-full object-contain" />
            ) : (
              <QrCode className="h-12 w-12 text-muted/30" />
            )}
          </div>
          
          <Button 
            className="w-full font-medium gap-2 h-11" 
            onClick={handleDownload}
            disabled={!qrDataUrl || generating}
          >
            <Download className="h-4 w-4" />
            Download PNG
          </Button>

          <p className="text-center text-[10px] text-muted-foreground leading-relaxed max-w-[240px]">
            Check your QR code with your phone camera before printing or distributing it.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
