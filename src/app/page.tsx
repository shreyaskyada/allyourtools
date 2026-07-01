import type { Metadata } from "next";
import { Suspense } from "react";
import ClientHome from "./client-home";
import Container from "@/components/layout/Container";
import { tools } from "@/config/tools";
import { categories } from "@/config/categories";

export const metadata: Metadata = {
  title: "AllYourTools - Free Online Developer and Content Tools",
  description: "Browse 100+ free online developer utilities, text formatting calculators, design tools, and security converters. Private, fast, and secure.",
};

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "AllYourTools",
    url: "https://allyourtools.app",
    description: "Browse 100+ free online developer utilities, text formatting calculators, design tools, and security converters. Private, fast, and secure.",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://allyourtools.app/tools/{search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <Container className="py-10 flex-1">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Suspense fallback={<div className="h-full flex items-center justify-center p-12 text-muted-foreground">Loading tools...</div>}>
        <ClientHome tools={tools} categories={categories} />
      </Suspense>
    </Container>
  );
}
