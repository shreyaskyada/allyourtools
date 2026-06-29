import React from "react";

export default function WordFrequencyContent() {
  return (
    <div className="flex flex-col gap-4 text-xs md:text-sm">
      <p>
        <strong>Word Frequency Analyzer</strong> is a powerful tool for writers, editors, and SEO professionals to instantly understand the composition of their text.
      </p>

      <h4 className="font-semibold text-foreground mt-2">Why analyze word frequency?</h4>
      <ul className="list-disc list-inside space-y-1">
        <li><strong>SEO Optimization:</strong> Ensure your target keywords appear often enough to rank in search engines, but not so often that you get penalized for keyword stuffing.</li>
        <li><strong>Improve Writing:</strong> We all have "crutch words" we rely on too much (like "really", "very", "just"). This tool highlights those duplicates so you can edit them out.</li>
        <li><strong>Data Analysis:</strong> Quickly summarize large bodies of text to understand the core topics being discussed.</li>
      </ul>

      <h4 className="font-semibold text-foreground mt-2">Features</h4>
      <p>
        The analyzer provides a sorted table of all unique words, their total occurrences, and their percentage density relative to the entire text. It runs entirely in your browser for maximum privacy and speed.
      </p>
    </div>
  );
}
