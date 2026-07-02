import { notFound } from "next/navigation";
import {
  getToolBySlug,
  getRelatedTools,
  getToolFaq,
  getToolContent,
  getToolMetadata,
} from "@/lib/tools";
import { categories } from "@/config/categories";
import ToolLayout from "@/components/tools/ToolLayout";
import Container from "@/components/layout/Container";
import dynamic from "next/dynamic";
import { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) return {};

  const baseMetadata = {
    title: `${tool.title} - Free Online Tool`,
    description: tool.description,
    alternates: {
      canonical: `https://allyourtools.app/tools/${slug}`,
    },
  };

  const toolMetadata = await getToolMetadata(slug);
  if (toolMetadata) {
    return {
      ...toolMetadata,
      alternates: {
        canonical: `https://allyourtools.app/tools/${slug}`,
        ...toolMetadata.alternates,
      },
    };
  }

  return baseMetadata;
}

const toolComponents: Record<string, React.ComponentType> = {
  "json-formatter": dynamic(
    () => import("../../../tools/json-formatter/component"),
  ),
  "uuid-generator": dynamic(
    () => import("../../../tools/uuid-generator/component"),
  ),
  "jwt-decoder": dynamic(() => import("../../../tools/jwt-decoder/component")),
  "jwt-generator": dynamic(() => import("../../../tools/jwt-generator/component")),
  "base64-image-converter": dynamic(() => import("../../../tools/base64-image-converter/component")),
  "timestamp-converter": dynamic(() => import("../../../tools/timestamp-converter/component")),
  "timezone-converter": dynamic(() => import("../../../tools/timezone-converter/component")),
  "word-counter": dynamic(() => import("../../../tools/word-counter/component")),
  "case-converter": dynamic(() => import("../../../tools/case-converter/component")),
  "image-compressor": dynamic(() => import("../../../tools/image-compressor/component")),
  "image-converter": dynamic(() => import("../../../tools/image-converter/component")),
  "password-generator": dynamic(() => import("../../../tools/password-generator/component")),
  "qr-code-generator": dynamic(() => import("../../../tools/qr-code-generator/component")),
  "url-encoder-decoder": dynamic(() => import("../../../tools/url-encoder-decoder/component")),
  "color-converter": dynamic(() => import("../../../tools/color-converter/component")),
  "lorem-ipsum-generator": dynamic(() => import("../../../tools/lorem-ipsum-generator/component")),
  "text-diff": dynamic(() => import("../../../tools/text-diff/component")),
  "word-frequency-analyzer": dynamic(() => import("../../../tools/word-frequency-analyzer/component")),
  "text-reverser": dynamic(() => import("../../../tools/text-reverser/component")),
  "list-randomizer": dynamic(() => import("../../../tools/list-randomizer/component")),
  "number-randomizer": dynamic(() => import("../../../tools/number-randomizer/component")),
  "certificate-generator": dynamic(() => import("../../../tools/certificate-generator/component")),
  "name-wheel-picker": dynamic(() => import("../../../tools/name-wheel-picker/component")),
};

export default async function ToolPage({ params }: Props) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) {
    notFound();
  }

  const category = categories.find((c) => c.id === tool.category);
  if (!category) {
    notFound();
  }

  const ToolComponent = toolComponents[slug];
  if (!ToolComponent) {
    notFound();
  }

  const relatedTools = getRelatedTools(tool);
  const faqs = await getToolFaq(slug);
  const content = await getToolContent(slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: tool.title,
    description: tool.description,
    url: `https://allyourtools.app/tools/${slug}`,
    applicationCategory: category.name,
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

  return (
    <Container className="py-10 flex-1">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ToolLayout
        tool={tool}
        category={category}
        relatedTools={relatedTools}
        faqs={faqs}
        content={content}
      >
        <ToolComponent />
      </ToolLayout>
    </Container>
  );
}
