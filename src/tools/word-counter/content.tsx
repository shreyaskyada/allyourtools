import React from "react";

export default function WordCounterContent() {
  return (
    <div className="flex flex-col gap-4 text-xs md:text-sm">
      <p>
        <strong>Word Counter</strong> is a comprehensive text analysis utility designed for writers, editors, students, SEO professionals, and content creators. It provides real-time counts, reading metrics, and semantic keyword distributions fully client-side.
      </p>

      <h4 className="font-semibold text-foreground mt-2">Real-time Statistics</h4>
      <p>
        Get instant word, character (with and without spaces), sentence, and paragraph counts. The counts update immediately as you type or paste text into the input workspace.
      </p>

      <h4 className="font-semibold text-foreground mt-2">Keyword Density Analyzer</h4>
      <p>
        Analyze content vocabulary and check keyword frequency. Discarding standard grammatical filler words (stop words) highlights the core keywords, helping you optimize content for SEO.
      </p>

      <h4 className="font-semibold text-foreground mt-2">Readability & Estimation Metrics</h4>
      <p>
        Track the reading ease of your content using reading and speaking speed benchmarks. Aligning readability indices helps guarantee that your paragraphs match target audiences.
      </p>
    </div>
  );
}
