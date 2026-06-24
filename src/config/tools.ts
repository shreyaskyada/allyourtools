import { Tool } from "@/types/tool";

export const tools: Tool[] = [
  {
    slug: "json-formatter",
    title: "JSON Formatter",
    description: "Format and validate JSON instantly.",
    category: "developer-tools",
    featured: true,
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
];
