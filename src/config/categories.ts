export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string; // Lucide icon component name as a string reference
}

export const categories: Category[] = [
  {
    id: "developer-tools",
    name: "Developer Tools",
    description: "Formatters, generators, converters, and other developer utilities.",
    icon: "Code",
  },
  {
    id: "text-content",
    name: "Text & Content",
    description: "Utilities to manipulate, analyze, and format text data.",
    icon: "FileText",
  },
  {
    id: "image-tools",
    name: "Image Tools",
    description: "Compress, resize, and convert image formats client-side instantly.",
    icon: "Image",
  },
  {
    id: "design-color",
    name: "Design & Color",
    description: "Color converters, generators, and styling tools.",
    icon: "Palette",
  },
  {
    id: "math-calc",
    name: "Math & Calculation",
    description: "Calculators and mathematical utility tools.",
    icon: "Calculator",
  },
  {
    id: "security-tools",
    name: "Security Tools",
    description: "Password generators and other security utilities.",
    icon: "Shield",
  },
  {
    id: "utility-tools",
    name: "Utility Tools",
    description: "Handy generators and conversion utilities for everyday tasks.",
    icon: "Wrench",
  },
];
