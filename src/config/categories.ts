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
];
