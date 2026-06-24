import type { Metadata } from "next";
import ClientHome from "./client-home";
import Container from "@/components/layout/Container";
import { tools } from "@/config/tools";
import { categories } from "@/config/categories";

export const metadata: Metadata = {
  title: "ToolVerse - Free Online Developer and Content Tools",
  description: "Browse 100+ free online developer utilities, text formatting calculators, design tools, and security converters. Private, fast, and secure.",
};

export default function HomePage() {
  return (
    <Container className="py-10 flex-1">
      <ClientHome tools={tools} categories={categories} />
    </Container>
  );
}
