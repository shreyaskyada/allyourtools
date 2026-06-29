import React from "react";

export default function TextDiffContent() {
  return (
    <div className="flex flex-col gap-4 text-xs md:text-sm">
      <p>
        <strong>Text Diff</strong> is an essential utility for developers, writers, and editors to instantly visualize the differences between two versions of text.
      </p>

      <h4 className="font-semibold text-foreground mt-2">Comparison Modes</h4>
      <ul className="list-disc list-inside space-y-1">
        <li><strong>Characters:</strong> The most granular mode. Perfect for finding small typos or single-letter changes in passwords or API keys.</li>
        <li><strong>Words:</strong> Best for comparing articles, essays, or natural language text. It highlights entire words that were changed.</li>
        <li><strong>Lines:</strong> The standard for comparing source code, configuration files, or CSV data.</li>
      </ul>

      <h4 className="font-semibold text-foreground mt-2">Privacy First</h4>
      <p>
        Unlike many online diff tools that send your data to a backend server for processing, this tool performs the heavy lifting directly on your device using WebAssembly and optimized JavaScript. Your sensitive code and documents are completely safe.
      </p>
    </div>
  );
}
