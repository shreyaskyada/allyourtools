import { Tool } from "@/types/tool";

export const tools: Tool[] = [
  {
    slug: "json-formatter",
    title: "JSON Formatter",
    description: "Format and validate JSON instantly.",
    category: "developer-tools",
    featured: true,
    fullWidth: true,
  },
  {
    slug: "uuid-generator",
    title: "UUID Generator",
    description: "Generate UUIDs instantly.",
    category: "developer-tools",
    featured: true,
  },
  {
    slug: "jwt-decoder",
    title: "JWT Decoder",
    description: "Decode, inspect, and verify JSON Web Tokens (JWT) instantly.",
    category: "developer-tools",
    featured: true,
    fullWidth: true,
  },
  {
    slug: "jwt-generator",
    title: "JWT Generator",
    description:
      "Generate and sign JSON Web Tokens (JWT) client-side instantly.",
    category: "developer-tools",
    featured: true,
    fullWidth: true,
  },
  {
    slug: "base64-image-converter",
    title: "Base64 Image Converter",
    description:
      "Convert images and videos to Base64 strings, or decode Base64 data URLs back to viewable media and files instantly.",
    category: "developer-tools",
    featured: true,
    fullWidth: true,
  },
  {
    slug: "timestamp-converter",
    title: "Timestamp Converter",
    description:
      "Convert Unix timestamps to human-readable dates and vice versa instantly.",
    category: "developer-tools",
    featured: true,
    fullWidth: true,
  },
  {
    slug: "timezone-converter",
    title: "Time Zone Converter",
    description:
      "Convert dates and times across multiple world time zones, calculate timezone offsets, and visualize cross-timezone meeting planners instantly.",
    category: "developer-tools",
    featured: true,
    fullWidth: true,
  },
  {
    slug: "word-counter",
    title: "Word Counter",
    description:
      "Count words, characters, sentences, and paragraphs, and analyze word density and reading time estimates instantly.",
    category: "text-content",
    featured: true,
    fullWidth: true,
  },
  {
    slug: "case-converter",
    title: "Case Converter",
    description:
      "Convert text case between UPPERCASE, lowercase, Title Case, Sentence case, camelCase, snake_case, PascalCase, and clean extra formatting instantly.",
    category: "text-content",
    featured: true,
    fullWidth: true,
  },
  {
    slug: "image-compressor",
    title: "Image Compressor",
    description:
      "Reduce image file size by customizing quality, scaling dimensions, and converting formats client-side instantly.",
    category: "image-tools",
    featured: true,
    fullWidth: true,
  },
  {
    slug: "image-converter",
    title: "Image Converter",
    description:
      "Convert images between JPEG, PNG, WebP, AVIF, GIF, BMP, and ICO formats client-side instantly with a live before-and-after preview.",
    category: "image-tools",
    featured: true,
    fullWidth: true,
  },
  {
    slug: "password-generator",
    title: "Password Generator",
    description:
      "Generate secure, random passwords with custom length, character sets, and a real-time strength indicator. 100% client-side.",
    category: "security-tools",
    featured: true,
    fullWidth: false,
  },
  {
    slug: "qr-code-generator",
    title: "QR Code Generator",
    description:
      "Generate QR codes for any URL, text, or contact information instantly. Customize size and colors, then download as PNG.",
    category: "utility-tools",
    featured: true,
    fullWidth: true,
  },
];
