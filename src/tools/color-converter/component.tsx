"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Copy, CheckCircle2 } from "lucide-react";
import { HexColorPicker } from "react-colorful";
import { toast } from "sonner";

// Basic conversion utilities
const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 };
};

const rgbToHex = (r: number, g: number, b: number) => {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
};

const rgbToHsl = (r: number, g: number, b: number) => {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
};

const hslToRgb = (h: number, s: number, l: number) => {
  s /= 100; l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return {
    r: Math.round(255 * f(0)),
    g: Math.round(255 * f(8)),
    b: Math.round(255 * f(4)),
  };
};

const rgbToCmyk = (r: number, g: number, b: number) => {
  let c = 1 - r / 255;
  let m = 1 - g / 255;
  let y = 1 - b / 255;
  let k = Math.min(c, Math.min(m, y));
  
  if (k === 1) {
    return { c: 0, m: 0, y: 0, k: 100 };
  }
  
  c = Math.round(((c - k) / (1 - k)) * 100);
  m = Math.round(((m - k) / (1 - k)) * 100);
  y = Math.round(((y - k) / (1 - k)) * 100);
  k = Math.round(k * 100);
  
  return { c, m, y, k };
};

// Formatter strings
const formatRgb = (rgb: {r: number, g: number, b: number}) => `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
const formatHsl = (hsl: {h: number, s: number, l: number}) => `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
const formatCmyk = (cmyk: {c: number, m: number, y: number, k: number}) => `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`;

export default function ColorConverter(): React.JSX.Element {
  const [hex, setHex] = useState("#3B82F6");
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);

  // Derived state
  const rgb = hexToRgb(hex);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);

  const rgbString = formatRgb(rgb);
  const hslString = formatHsl(hsl);
  const cmykString = formatCmyk(cmyk);

  const copyToClipboard = async (text: string, format: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedFormat(format);
      toast.success(`Copied ${format} to clipboard`);
      setTimeout(() => setCopiedFormat(null), 2000);
    } catch (err) {
      toast.error("Failed to copy text");
    }
  };

  const handleRgbChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const match = val.match(/\\d+/g);
    if (match && match.length >= 3) {
      const r = Math.min(255, Math.max(0, parseInt(match[0])));
      const g = Math.min(255, Math.max(0, parseInt(match[1])));
      const b = Math.min(255, Math.max(0, parseInt(match[2])));
      setHex(rgbToHex(r, g, b));
    }
  };

  const handleHslChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const match = val.match(/\\d+/g);
    if (match && match.length >= 3) {
      const h = Math.min(360, Math.max(0, parseInt(match[0])));
      const s = Math.min(100, Math.max(0, parseInt(match[1])));
      const l = Math.min(100, Math.max(0, parseInt(match[2])));
      const newRgb = hslToRgb(h, s, l);
      setHex(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
    }
  };

  const ValueRow = ({ label, value, rawStr, onChange }: { label: string, value: string, rawStr: string, onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void }) => (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{label}</label>
      <div className="flex gap-2">
        <Input 
          value={value} 
          onChange={onChange || (() => {})} 
          readOnly={!onChange}
          className="font-mono text-sm bg-background flex-1"
        />
        <Button 
          variant="secondary" 
          className="w-12 px-0 shrink-0" 
          onClick={() => copyToClipboard(rawStr, label)}
          title={`Copy ${label}`}
        >
          {copiedFormat === label ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
      
      <Card className="border border-border/80 bg-card shadow-xs">
        <CardContent className="p-6 flex flex-col items-center justify-center gap-6">
          <div 
            className="w-full aspect-video rounded-xl shadow-inner border border-border/50 transition-colors duration-200 flex items-end p-4"
            style={{ backgroundColor: hex }}
          >
            <div className="bg-background/80 backdrop-blur-md px-3 py-1.5 rounded-md text-foreground font-mono text-sm font-bold shadow-sm">
              {hex.toUpperCase()}
            </div>
          </div>
          
          <div className="w-full flex justify-center mt-2">
            <HexColorPicker 
              color={hex} 
              onChange={setHex} 
              style={{ width: '100%', maxWidth: '280px', height: '280px' }}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border border-border/80 bg-card shadow-xs">
        <CardContent className="p-6 flex flex-col gap-6">
          <ValueRow 
            label="HEX" 
            value={hex.toUpperCase()} 
            rawStr={hex.toUpperCase()} 
            onChange={(e) => {
              let val = e.target.value;
              if (!val.startsWith("#")) val = "#" + val;
              if (val.length <= 7) setHex(val);
            }} 
          />
          
          <ValueRow 
            label="RGB" 
            value={rgbString} 
            rawStr={rgbString}
            onChange={handleRgbChange}
          />

          <ValueRow 
            label="HSL" 
            value={hslString} 
            rawStr={hslString}
            onChange={handleHslChange}
          />

          <ValueRow 
            label="CMYK" 
            value={cmykString} 
            rawStr={cmykString}
            // CMYK to RGB conversion is tricky and less common to type manually, so we make it readonly for simplicity
          />
          
        </CardContent>
      </Card>

    </div>
  );
}
