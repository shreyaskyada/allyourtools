"use client";

import React from "react";

export interface RangeSliderProps {
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (v: number) => void;
  minLabel?: string;
  maxLabel?: string;
}

export function RangeSlider({ min, max, step, value, onChange, minLabel, maxLabel }: RangeSliderProps) {
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
          className="slider-range absolute inset-x-0 opacity-0 h-6 z-10 cursor-pointer"
          style={{ background: "transparent" }}
        />
        <div
          className="absolute w-4.5 h-4.5 rounded-full bg-primary border-2 border-background shadow-md pointer-events-none transition-transform hover:scale-110 z-20"
          style={{ left: `calc(${pct}% - 9px)` }}
        />
      </div>
      {(minLabel || maxLabel) && (
        <div className="flex justify-between mt-1">
          <span className="text-[10px] text-muted-foreground">{minLabel}</span>
          <span className="text-[10px] text-muted-foreground">{maxLabel}</span>
        </div>
      )}
    </div>
  );
}
