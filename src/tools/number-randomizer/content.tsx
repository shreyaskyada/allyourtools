import React from "react";

export default function NumberRandomizerContent() {
  return (
    <div className="flex flex-col gap-4 text-xs md:text-sm">
      <p>
        <strong>Random Number Generator</strong> is an intuitive tool for generating unpredictable numerical sequences. Whether you need a single dice roll or a massive list of lottery numbers, this utility handles it instantly.
      </p>

      <h4 className="font-semibold text-foreground mt-2">Core Features</h4>
      <ul className="list-disc list-inside space-y-1">
        <li><strong>Custom Ranges:</strong> Set exact minimum and maximum bounds.</li>
        <li><strong>Quantity Control:</strong> Generate anywhere from 1 to 1000 numbers in a single click.</li>
        <li><strong>Unique Mode:</strong> Ensure no number is repeated in your generated list (great for raffles).</li>
        <li><strong>Formatting Options:</strong> Output your numbers as a comma-separated list, newlines, or space-separated.</li>
      </ul>

      <h4 className="font-semibold text-foreground mt-2">Privacy & Speed</h4>
      <p>
        Instead of relying on server-side generation, this tool leverages your device's local processing power. Your generation parameters and the resulting numbers never leave your browser, ensuring total privacy and lightning-fast results.
      </p>
    </div>
  );
}
