import React from "react";

export default function ColorConverterContent() {
  return (
    <div className="flex flex-col gap-4 text-xs md:text-sm">
      <p>
        <strong>Color Converter</strong> is a comprehensive utility for designers and developers to seamlessly translate colors across different formats.
      </p>

      <h4 className="font-semibold text-foreground mt-2">Designed for Web & Print</h4>
      <p>
        Whether you found a perfect HEX color online and need to convert it to HSL for a CSS variable, or you're preparing a digital design for print (CMYK), this tool provides instant, mathematically accurate conversions.
      </p>

      <h4 className="font-semibold text-foreground mt-2">How to use it</h4>
      <p>
        Simply interact with the visual color picker, or manually type your values into any of the format fields (HEX, RGB, HSL, or CMYK). As you edit one format, all other formats instantly update in real-time. Use the copy buttons to grab the exact CSS syntax for your stylesheet.
      </p>
    </div>
  );
}
