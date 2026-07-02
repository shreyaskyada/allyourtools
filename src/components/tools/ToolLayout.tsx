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
    <div className="flex flex-col gap-8 w-full">
      {/* Hero section */}
      <ToolHero
        title={tool.title}
        description={tool.description}
        categoryName={category.name}
        categorySlug={category.id}
      />

      {/* Main Tool Area */}
      <div
        className={
          tool.fullWidth
            ? "flex flex-col gap-8"
            : "grid grid-cols-1 lg:grid-cols-3 gap-8"
        }
      >
        {/* The Interactive Tool Workspace */}
        <div className={tool.fullWidth ? "w-full" : "lg:col-span-2"}>
          <div className="border border-border/80 bg-card rounded-2xl shadow-sm overflow-hidden flex flex-col h-full ring-1 ring-border/40 focus-within:ring-primary/20 transition-all duration-300">
            {/* Standardized Tool Header/Toolbar area could go here if tools didn't render their own */}
            <div className="p-4 sm:p-6 flex-1 flex flex-col">{children}</div>
          </div>
        </div>

        {/* Right Side / Bottom: Descriptive User Guide & About Content */}
        <div className="flex flex-col gap-6">
          <div className="border border-border/60 bg-muted/30 rounded-2xl p-5 md:p-6 text-sm">
            <h3 className="font-semibold text-foreground text-lg tracking-tight mb-4 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-primary rounded-full inline-block"></span>
              About {tool.title}
            </h3>
            <div className="text-muted-foreground leading-relaxed flex flex-col gap-4 prose prose-sm dark:prose-invert">
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

      {/* FAQs */}
      {faqs.length > 0 && (
        <div className="mt-4">
          <ToolFaq faqs={faqs} />
        </div>
      )}

      {/* Related tools */}
      <div className="mt-4">
        <RelatedTools relatedTools={relatedTools} />
      </div>
    </div>
  );
}
