import React from "react";

export default function ImageConverterContent() {
  return (
    <div className="flex flex-col gap-4 text-xs md:text-sm">
      <p>
        <strong>Image Converter</strong> is a client-side image format conversion utility. Upload any image and instantly convert it to the format best suited for your project — no server required.
      </p>

      <h4 className="font-semibold text-foreground mt-2">Modern Format Support</h4>
      <p>
        Convert between JPEG, PNG, WebP, AVIF, GIF, and BMP. WebP and AVIF are next-generation formats that deliver dramatically smaller file sizes compared to traditional JPEG and PNG, while maintaining high visual fidelity.
      </p>

      <h4 className="font-semibold text-foreground mt-2">Transparency Preservation</h4>
      <p>
        PNG and WebP preserve image transparency (alpha channel). When converting to formats that don&apos;t support transparency such as JPEG or BMP, a white background fill is applied automatically so your image remains complete.
      </p>

      <h4 className="font-semibold text-foreground mt-2">Live Before & After Preview</h4>
      <p>
        See both your original image and the converted output side-by-side before downloading. File size and format details update in real-time as you switch target formats.
      </p>
    </div>
  );
}
