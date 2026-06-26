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
  const toolMetadata = await getToolMetadata(slug);
  if (toolMetadata) return toolMetadata;

  const tool = getToolBySlug(slug);
  if (!tool) return {};
  return {
    title: `${tool.title} - Free Online Tool`,
    description: tool.description,
  };
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

  return (
    <Container className="py-10 flex-1">
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
