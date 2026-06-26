import React from "react";

export default function QRCodeGeneratorContent() {
  return (
    <div className="flex flex-col gap-4 text-xs md:text-sm">
      <p>
        <strong>QR Code Generator</strong> is a fast, reliable tool for creating static QR codes directly in your browser. 
      </p>

      <h4 className="font-semibold text-foreground mt-2">Versatile Data Types</h4>
      <p>
        Easily generate QR codes for website URLs, plain text messages, or contact information. The generated codes are static, meaning they never expire and don't rely on third-party redirection services.
      </p>

      <h4 className="font-semibold text-foreground mt-2">Custom Styling</h4>
      <p>
        Personalize your QR codes to match your brand or design needs. You can customize the foreground (pattern) color and the background color. We recommend keeping high contrast (dark foreground, light background) to ensure the code remains scannable.
      </p>

      <h4 className="font-semibold text-foreground mt-2">High-Quality Export</h4>
      <p>
        Once you are satisfied with your QR code, you can download it as a crisp, high-resolution PNG file ready for use in print materials, digital displays, or social media.
      </p>
    </div>
  );
}
