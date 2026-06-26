"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, RefreshCw, CheckCircle2, Shield, ShieldAlert, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

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
  const pct = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));

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
// Password Generator Component
// ------------------------------------------------------------------
export default function PasswordGenerator(): React.JSX.Element {
  const [password, setPassword] = useState("");
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [copied, setCopied] = useState(false);

  // Strength metrics
  const [strengthScore, setStrengthScore] = useState(0); // 0-4
  const [strengthLabel, setStrengthLabel] = useState("");
  const [strengthColor, setStrengthColor] = useState("");

  const generatePassword = useCallback(() => {
    let charset = "";
    if (includeLowercase) charset += "abcdefghijklmnopqrstuvwxyz";
    if (includeUppercase) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (includeNumbers) charset += "0123456789";
    if (includeSymbols) charset += "!@#$%^&*()_+~`|}{[]:;?><,./-=";

    if (charset === "") {
      setPassword("");
      return;
    }

    let newPassword = "";
    // Ensure at least one character from each selected set if possible, then fill the rest randomly
    const mandatoryChars: string[] = [];
    if (includeLowercase) mandatoryChars.push("abcdefghijklmnopqrstuvwxyz"[Math.floor(Math.random() * 26)]);
    if (includeUppercase) mandatoryChars.push("ABCDEFGHIJKLMNOPQRSTUVWXYZ"[Math.floor(Math.random() * 26)]);
    if (includeNumbers) mandatoryChars.push("0123456789"[Math.floor(Math.random() * 10)]);
    if (includeSymbols) {
      const symbols = "!@#$%^&*()_+~`|}{[]:;?><,./-=";
      mandatoryChars.push(symbols[Math.floor(Math.random() * symbols.length)]);
    }

    // Shuffle mandatory chars and start the password with them
    for (let i = mandatoryChars.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [mandatoryChars[i], mandatoryChars[j]] = [mandatoryChars[j], mandatoryChars[i]];
    }
    
    // Fill the remaining length
    const remainingLength = length - mandatoryChars.length;
    for (let i = 0; i < remainingLength; i++) {
        newPassword += charset[Math.floor(Math.random() * charset.length)];
    }

    // Insert mandatory characters randomly into the generated password
    for(const char of mandatoryChars) {
      const insertAt = Math.floor(Math.random() * (newPassword.length + 1));
      newPassword = newPassword.slice(0, insertAt) + char + newPassword.slice(insertAt);
    }
    
    // Safety check just in case we went over (shouldn't happen with the logic above unless length < mandatory types, which the slider prevents)
    newPassword = newPassword.slice(0, length);

    setPassword(newPassword);
    setCopied(false);
  }, [length, includeUppercase, includeLowercase, includeNumbers, includeSymbols]);

  // Evaluate password strength
  useEffect(() => {
    if (!password) {
      setStrengthScore(0);
      setStrengthLabel("");
      setStrengthColor("");
      return;
    }

    let score = 0;
    if (password.length > 8) score += 1;
    if (password.length >= 12) score += 1;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) score += 1;
    if (password.length >= 16 && (/[A-Z]/.test(password) || /[^A-Za-z0-9]/.test(password))) score += 1;
    
    // Cap at 4
    score = Math.min(4, score);
    setStrengthScore(score);

    switch (score) {
      case 0:
      case 1:
        setStrengthLabel("Weak");
        setStrengthColor("bg-red-500");
        break;
      case 2:
        setStrengthLabel("Fair");
        setStrengthColor("bg-amber-500");
        break;
      case 3:
        setStrengthLabel("Good");
        setStrengthColor("bg-blue-500");
        break;
      case 4:
        setStrengthLabel("Strong");
        setStrengthColor("bg-emerald-500");
        break;
      default:
        setStrengthLabel("");
        setStrengthColor("");
    }
  }, [password]);

  // Generate on mount and when settings change
  useEffect(() => {
    generatePassword();
  }, [generatePassword]);

  const copyToClipboard = async () => {
    if (!password) return;
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      toast.success("Password copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy text");
    }
  };

  const OptionToggle = ({ 
    label, 
    checked, 
    onChange 
  }: { 
    label: string, 
    checked: boolean, 
    onChange: (checked: boolean) => void 
  }) => (
    <div 
      className={`flex items-center justify-between p-3 rounded-lg border transition-colors cursor-pointer select-none ${
        checked ? "border-primary/50 bg-primary/5" : "border-border hover:border-primary/30"
      }`}
      onClick={() => {
        // Prevent unchecking the last option
        if (checked && [includeUppercase, includeLowercase, includeNumbers, includeSymbols].filter(Boolean).length === 1) {
          toast.error("You must select at least one character type");
          return;
        }
        onChange(!checked);
      }}
    >
      <span className="text-sm font-medium">{label}</span>
      <div className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${
        checked ? "bg-primary text-primary-foreground" : "border border-muted-foreground/30"
      }`}>
        {checked && <CheckCircle2 className="w-3.5 h-3.5" />}
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-4xl mx-auto">
      {/* ── Settings Panel ── */}
      <Card className="border border-border/80 bg-card shadow-xs">
        <div className="px-5 py-4 border-b border-border/60">
          <h3 className="text-sm font-semibold flex items-center gap-2 text-foreground">
            <Shield className="h-4 w-4 text-primary" />
            Password Settings
          </h3>
        </div>
        <CardContent className="p-5 flex flex-col gap-6">
          {/* Length Slider */}
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-muted-foreground">Password Length</label>
              <Input
                type="number"
                min={6}
                max={64}
                value={length || ""}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  if (!isNaN(val)) {
                    setLength(val);
                  }
                }}
                onBlur={() => {
                  if (length < 6) setLength(6);
                  if (length > 64) setLength(64);
                }}
                className="w-16 h-8 text-xs font-mono font-bold text-center bg-primary/10 text-primary border-transparent focus-visible:ring-1"
              />
            </div>
            <RangeSlider
              min={6}
              max={64}
              step={1}
              value={length}
              onChange={setLength}
              minLabel="6"
              maxLabel="64"
            />
          </div>

          {/* Character Types */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-muted-foreground mb-1">Character Types</label>
            <OptionToggle label="Uppercase (A-Z)" checked={includeUppercase} onChange={setIncludeUppercase} />
            <OptionToggle label="Lowercase (a-z)" checked={includeLowercase} onChange={setIncludeLowercase} />
            <OptionToggle label="Numbers (0-9)" checked={includeNumbers} onChange={setIncludeNumbers} />
            <OptionToggle label="Symbols (!@#$%)" checked={includeSymbols} onChange={setIncludeSymbols} />
          </div>
        </CardContent>
      </Card>

      {/* ── Result Panel ── */}
      <Card className="border border-border/80 bg-card shadow-xs self-start">
        <div className="px-5 py-4 border-b border-border/60">
          <h3 className="text-sm font-semibold flex items-center gap-2 text-foreground">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            Generated Password
          </h3>
        </div>
        <CardContent className="p-5 flex flex-col gap-5">
          
          {/* Password Display Box */}
          <div className="relative group">
            <div className="w-full min-h-24 p-4 rounded-xl border-2 border-border bg-muted/20 flex flex-wrap break-all items-center justify-center text-center text-xl sm:text-2xl font-mono font-medium tracking-wider text-foreground">
              {password || "Select options to generate"}
            </div>
            
            {password && (
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="secondary"
                  size="icon"
                  className="h-8 w-8 rounded-md bg-background shadow-sm hover:bg-muted"
                  onClick={copyToClipboard}
                  title="Copy password"
                >
                  {copied ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  className="h-8 w-8 rounded-md bg-background shadow-sm hover:bg-muted"
                  onClick={generatePassword}
                  title="Generate new password"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button onClick={copyToClipboard} className="flex-1 font-medium gap-2" variant="default" disabled={!password}>
              {copied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? "Copied!" : "Copy Password"}
            </Button>
            <Button onClick={generatePassword} className="font-medium gap-2" variant="outline">
              <RefreshCw className="h-4 w-4" />
              Regenerate
            </Button>
          </div>

          {/* Strength Meter */}
          {password && (
            <div className="mt-2 p-4 rounded-xl border border-border/60 bg-muted/10">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-semibold text-muted-foreground">Password Strength</span>
                <span className={`text-xs font-bold ${strengthScore >= 3 ? "text-emerald-500" : strengthScore === 2 ? "text-amber-500" : "text-red-500"}`}>
                  {strengthLabel}
                </span>
              </div>
              <div className="flex gap-1 h-1.5 w-full">
                {[1, 2, 3, 4].map((level) => (
                  <div 
                    key={level} 
                    className={`flex-1 rounded-full transition-colors duration-300 ${
                      strengthScore >= level ? strengthColor : "bg-muted-foreground/20"
                    }`} 
                  />
                ))}
              </div>
              {strengthScore < 3 && (
                <div className="flex items-start gap-1.5 mt-3 text-muted-foreground">
                  <ShieldAlert className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-500" />
                  <p className="text-[10px] leading-relaxed">
                    Try increasing the length or adding more character types to make your password stronger.
                  </p>
                </div>
              )}
            </div>
          )}

        </CardContent>
      </Card>
    </div>
  );
}
