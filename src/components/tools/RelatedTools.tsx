import Link from "next/link";
import { Tool } from "@/types/tool";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

interface RelatedToolsProps {
  relatedTools: Tool[];
}

export default function RelatedTools({ relatedTools }: RelatedToolsProps) {
  if (!relatedTools || relatedTools.length === 0) return null;

  return (
    <div className="mt-16 border-t border-border pt-10">
      <h2 className="text-2xl font-bold tracking-tight text-foreground mb-6">
        Related Utilities
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {relatedTools.map((tool) => (
          <Link
            key={tool.slug}
            href={`/tools/${tool.slug}`}
            className="group block transition-all"
          >
            <Card className="h-full border border-border bg-card hover:border-primary/50 hover:shadow-sm transition-all duration-300">
              <CardHeader className="flex flex-col h-full justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors flex items-center justify-between w-full">
                    <span>{tool.title}</span>
                    <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-300" />
                  </CardTitle>
                  <CardDescription className="text-muted-foreground text-sm mt-2 line-clamp-2">
                    {tool.description}
                  </CardDescription>
                </div>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
