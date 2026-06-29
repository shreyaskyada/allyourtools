import React from "react";

export default function TextReverserContent() {
  return (
    <div className="flex flex-col gap-4 text-xs md:text-sm">
      <p>
        <strong>Text Reverser</strong> is a versatile tool for manipulating text strings, offering everything from standard programmatic reversals to fun typographic tricks.
      </p>

      <h4 className="font-semibold text-foreground mt-2">Available Modes</h4>
      <ul className="list-disc list-inside space-y-1">
        <li><strong>Characters:</strong> Reverses the entire string letter by letter.</li>
        <li><strong>Words:</strong> Reverses the order of words in the string while keeping the letters within the words intact.</li>
        <li><strong>Upside Down:</strong> Uses Unicode character mapping to literally flip your text upside down. (Great for social media!)</li>
      </ul>

      <h4 className="font-semibold text-foreground mt-2">Privacy & Speed</h4>
      <p>
        All text transformations happen instantaneously directly in your browser. No data is ever sent to a server.
      </p>
    </div>
  );
}
