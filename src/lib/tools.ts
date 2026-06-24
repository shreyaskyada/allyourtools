import { Tool } from "@/types/tool";
import { tools } from "@/config/tools";

export function getToolBySlug(slug: string): Tool | undefined {
  return tools.find((t) => t.slug === slug);
}

export function getRelatedTools(tool: Tool, limit = 3): Tool[] {
  return tools
    .filter((t) => t.category === tool.category && t.slug !== tool.slug)
    .slice(0, limit);
}

export async function getToolMetadata(slug: string) {
  try {
    const toolModule = await import(`@/tools/${slug}/metadata`);
    return toolModule.metadata || null;
  } catch {
    return null;
  }
}

export async function getToolFaq(slug: string): Promise<{ question: string; answer: string }[]> {
  try {
    const toolModule = await import(`@/tools/${slug}/faq`);
    return toolModule.faq || [];
  } catch {
    return [];
  }
}

export async function getToolContent(slug: string) {
  try {
    const toolModule = await import(`@/tools/${slug}/content`);
    return toolModule.default || null;
  } catch {
    return null;
  }
}
