import React from "react";

export default function CaseConverterContent() {
  return (
    <div className="flex flex-col gap-4 text-xs md:text-sm">
      <p>
        <strong>Case Converter</strong> is a client-side utility designed for quick and flexible text formatting, case conversions, and document cleanup operations.
      </p>

      <h4 className="font-semibold text-foreground mt-2">Case Conversion Styles</h4>
      <p>
        Convert your text to standard formats including UPPERCASE, lowercase, Title Case (capitalizing every word), Sentence case (capitalizing first word of sentences), camelCase, PascalCase, snake_case, kebab-case, and alternating cAsE.
      </p>

      <h4 className="font-semibold text-foreground mt-2">Document Cleanup Utilities</h4>
      <p>
        Clean up cluttered text with helper utilities. Collapse extra spaces down to a single space, strip out HTML tags completely, remove blank lines, or remove duplicate lines to get a clean, uniquely ordered text list.
      </p>

      <h4 className="font-semibold text-foreground mt-2">Instant Statistics</h4>
      <p>
        View quick statistics of your modified text, including live counts of words and characters, ensuring compliance with any length requirements after your transformations.
      </p>
    </div>
  );
}
