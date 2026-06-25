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
    description: "Generate and sign JSON Web Tokens (JWT) client-side instantly.",
    category: "developer-tools",
    featured: true,
    fullWidth: true,
  },
  {
    slug: "base64-image-converter",
    title: "Base64 Image Converter",
    description: "Convert images and videos to Base64 strings, or decode Base64 data URLs back to viewable media and files instantly.",
    category: "developer-tools",
    featured: true,
    fullWidth: true,
  },
];
