import React from "react";

export default function Base64ImageConverterContent() {
  return (
    <div className="flex flex-col gap-4 text-xs md:text-sm">
      <p>
        <strong>Base64 Image Converter</strong> is a client-side developer utility for converting image and video assets to and from text-encoded Base64 representations. 
      </p>

      <h4 className="font-semibold text-foreground mt-2">Encoding Images and Videos</h4>
      <p>
        Converting images and video files to Base64 creates a Data URI that can be embedded directly into source files (HTML, CSS, JSON). This technique loads media inline, removing the need for external server requests.
      </p>

      <h4 className="font-semibold text-foreground mt-2">Decoding Base64 Code</h4>
      <p>
        The decoder accepts two main formatting types:
      </p>
      <ul className="list-disc list-inside space-y-1.5 pl-2 text-muted-foreground">
        <li><strong>Data URL</strong>: Formats containing standard metadata headers (e.g. <code>data:image/png;base64,iVBORw0...</code>).</li>
        <li><strong>Plain Base64</strong>: Raw string blocks (e.g. <code>iVBORw0...</code>). The decoder automatically scans the magic bytes of the binary stream to auto-detect standard mime formats (PNG, JPEG, GIF, WebP, BMP, MP4, WebM, PDF).</li>
      </ul>
    </div>
  );
}
