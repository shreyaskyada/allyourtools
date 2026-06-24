"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Tool } from "@/types/tool";
import { Category } from "@/config/categories";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Code, FileText, Palette, Calculator, Search, ArrowRight, Sparkles } from "lucide-react";

interface ClientHomeProps {
  tools: Tool[];
  categories: Category[];
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Code,
  FileText,
  Palette,
  Calculator,
};

export default function ClientHome({ tools, categories }: ClientHomeProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTools = tools.filter((tool) => {
    const query = searchQuery.toLowerCase();
    return (
      tool.title.toLowerCase().includes(query) ||
      tool.description.toLowerCase().includes(query) ||
      tool.category.toLowerCase().includes(query)
    );
  });

  return (
    <div className="flex flex-col gap-10">
      {/* Hero Header */}
      <div className="flex flex-col items-center text-center gap-4 max-w-3xl mx-auto py-10">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
          <Sparkles className="h-3 w-3" />
          <span>All utilities run locally in your browser</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-foreground via-foreground/90 to-muted-foreground bg-clip-text text-transparent">
          Free Online Developer Tools
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Clean, private, and instant tools. Your data is processed entirely client-side and never saved or sent to any server.
        </p>

        {/* Search Input */}
        <div className="relative w-full max-w-lg mt-4 shadow-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tools (e.g. JSON Formatter, UUID)..."
            className="pl-10 h-11 rounded-lg border-border focus-visible:ring-primary focus-visible:ring-1"
          />
        </div>
      </div>

      {/* Featured Tools (Only shown when not searching) */}
      {!searchQuery && (
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-bold tracking-tight">Featured Utilities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tools
              .filter((t) => t.featured)
              .map((tool) => (
                <Link key={tool.slug} href={`/tools/${tool.slug}`} className="group">
                  <Card className="h-full border border-primary/20 bg-primary/5 hover:bg-primary/10 hover:border-primary/40 transition-all duration-300">
                    <CardHeader className="flex flex-row justify-between items-start gap-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors">
                            {tool.title}
                          </CardTitle>
                          <Badge variant="default" className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0">
                            Featured
                          </Badge>
                        </div>
                        <CardDescription className="text-muted-foreground text-sm leading-relaxed">
                          {tool.description}
                        </CardDescription>
                      </div>
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-card text-foreground group-hover:text-primary transition-colors">
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    </CardHeader>
                  </Card>
                </Link>
              ))}
          </div>
        </div>
      )}

      {/* Category List */}
      <div className="flex flex-col gap-12 mt-4">
        {categories.map((category) => {
          const categoryTools = filteredTools.filter((t) => t.category === category.id);
          if (categoryTools.length === 0) return null;

          const IconComponent = iconMap[category.icon] || Code;

          return (
            <div key={category.id} id={category.id} className="scroll-mt-20 flex flex-col gap-4">
              <div className="flex items-center gap-3 border-b border-border/80 pb-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                  <IconComponent className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-foreground">{category.name}</h2>
                  <p className="text-xs text-muted-foreground">{category.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {categoryTools.map((tool) => (
                  <Link key={tool.slug} href={`/tools/${tool.slug}`} className="group">
                    <Card className="h-full border border-border hover:border-primary/50 hover:shadow-sm transition-all duration-300">
                      <CardHeader className="flex flex-col h-full justify-between gap-4">
                        <div>
                          <CardTitle className="text-base font-semibold group-hover:text-primary transition-colors flex items-center justify-between w-full">
                            <span>{tool.title}</span>
                            <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-300" />
                          </CardTitle>
                          <CardDescription className="text-muted-foreground text-xs mt-1.5 leading-relaxed line-clamp-2">
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
        })}
      </div>

      {filteredTools.length === 0 && (
        <div className="text-center py-20 text-muted-foreground border border-dashed border-border rounded-lg">
          <Search className="h-10 w-10 mx-auto opacity-35 mb-2" />
          <p className="text-base">No tools match your query: &quot;{searchQuery}&quot;</p>
          <button onClick={() => setSearchQuery("")} className="text-xs text-primary font-medium underline mt-1 hover:text-primary/80">
            Clear search filter
          </button>
        </div>
      )}
    </div>
  );
}
