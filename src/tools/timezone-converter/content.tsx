import React from "react";

export default function TimezoneConverterContent() {
  return (
    <div className="flex flex-col gap-4 text-xs md:text-sm">
      <p>
        <strong>Time Zone Converter</strong> is an essential client-side utility for coordinators, developers, and remote workers to align and schedule times across international boundaries.
      </p>

      <h4 className="font-semibold text-foreground mt-2">Active Dashboard Clocks</h4>
      <p>
        Upon loading, the tool shows live-ticking regional clocks representing standard target cities (e.g. New York, London, Tokyo) alongside your system's detected local timezone.
      </p>

      <h4 className="font-semibold text-foreground mt-2">Dynamic Slider Conversion</h4>
      <p>
        Set a date, pick a source timezone, and slide the 24-hour bar. All active timezone cards update their calendar dates, offsets, and working hour grids in real-time, helping you plan meetings without manual calculations.
      </p>
    </div>
  );
}
