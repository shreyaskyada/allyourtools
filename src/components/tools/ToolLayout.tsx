import { ReactNode } from "react";
import { Tool } from "@/types/tool";
import { Category } from "@/config/categories";
import ToolHero from "./ToolHero";
import ToolFaq from "./ToolFaq";
import RelatedTools from "./RelatedTools";

interface ToolLayoutProps {
  tool: Tool;
  category: Category;
  relatedTools: Tool[];
  faqs: { question: string; answer: string }[];
  content?: React.ComponentType | null;
  children: ReactNode;
}

export default function ToolLayout({
  tool,
  category,
  relatedTools,
  faqs,
  content: ToolContent,
  children,
}: ToolLayoutProps) {
  return (
    <div className="flex flex-col gap-10">
      {/* Hero section */}
      <ToolHero
        title={tool.title}
        description={tool.description}
        categoryName={category.name}
        categorySlug={category.id}
      />

      {/* Main Tool Area */}
      {tool.fullWidth ? (
        <div className="flex flex-col gap-10">
          {/* Workspace (Full Width) */}
          <div className="border border-border bg-card rounded-xl p-4 md:p-6 shadow-sm">
            {children}
          </div>

          {/* About Content (Bottom) */}
          <div className="border border-border bg-muted/20 rounded-xl p-4 md:p-6 text-sm">
            <h3 className="font-semibold text-foreground text-base mb-3">
              About {tool.title}
            </h3>
            <div className="text-muted-foreground leading-relaxed flex flex-col gap-4">
              {ToolContent ? (
                <ToolContent />
              ) : (
                <p>
                  Use this {tool.title.toLowerCase()} tool to format, analyze,
                  or generate data. This tool works completely offline in your
                  web browser. No data is sent to our servers, keeping your
                  information secure.
                </p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left Side: The Interactive Tool Workspace */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="border border-border bg-card rounded-xl p-4 md:p-6 shadow-sm">
              {children}
            </div>
          </div>

          {/* Right Side: Descriptive User Guide / About Content */}
          <div className="flex flex-col gap-6">
            <div className="border border-border bg-muted/20 rounded-xl p-4 md:p-6 text-sm">
              <h3 className="font-semibold text-foreground text-base mb-3">
                About {tool.title}
              </h3>
              <div className="text-muted-foreground leading-relaxed flex flex-col gap-4">
                {ToolContent ? (
                  <ToolContent />
                ) : (
                  <p>
                    Use this {tool.title.toLowerCase()} tool to format, analyze,
                    or generate data. This tool works completely offline in your
                    web browser. No data is sent to our servers, keeping your
                    information secure.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FAQs */}
      <ToolFaq faqs={faqs} />

      {/* Related tools */}
      <RelatedTools relatedTools={relatedTools} />
    </div>
  );
}
