import React from "react";

export default function Content() {
  return (
    <>
      <p>
        A Universally Unique Identifier (UUID) is a standard identifier format that guarantees uniqueness across space and time. A UUID is written as a sequence of hexadecimal digits divided into 5 groups separated by hyphens (e.g. 8-4-4-4-12 characters for a total of 36 characters).
      </p>
      <p className="font-semibold text-foreground mt-4">Types of UUIDs:</p>
      <ul className="list-disc pl-4 mt-2 space-y-1">
        <li><strong>Version 4 (Random):</strong> Generated using random numbers. This is the most common version and does not leak timestamps or machine identifiers.</li>
        <li><strong>Version 1 (Time-based):</strong> Generated using a timestamp and computer identifier. Useful when sorting or ordering by creation time is desired.</li>
      </ul>
      <p className="mt-4 text-xs text-muted-foreground">
        Our generator performs all operations client-side in your browser. No identifiers are sent or stored anywhere.
      </p>
    </>
  );
}
