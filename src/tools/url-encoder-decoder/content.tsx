import React from "react";

export default function UrlEncoderContent() {
  return (
    <div className="flex flex-col gap-4 text-xs md:text-sm">
      <p>
        <strong>URL Encoder / Decoder</strong> is a simple but essential tool designed to safely translate strings into percent-encoded formats, or decode them back into human-readable text.
      </p>

      <h4 className="font-semibold text-foreground mt-2">How it works</h4>
      <p>
        URLs can only contain certain safe characters. When you have spaces, emoji, or symbols like <code>&</code>, <code>=</code>, and <code>?</code> in your data, they must be translated into a valid ASCII format. For example, a space becomes <code>%20</code>. This tool performs that exact translation securely in your browser.
      </p>

      <h4 className="font-semibold text-foreground mt-2">When to use it</h4>
      <ul className="list-disc list-inside space-y-1">
        <li>Passing complex data through a URL query string parameter.</li>
        <li>Fixing broken links caused by unescaped spaces or symbols.</li>
        <li>Extracting human-readable text from messy, percent-encoded analytics parameters.</li>
      </ul>
    </div>
  );
}
