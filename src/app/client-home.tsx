"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { Tool } from "@/types/tool";
import { Category } from "@/config/categories";
import { Search, Sparkles, TrendingUp, Clock, Grid, Zap } from "lucide-react";
import ToolCard from "@/components/tools/ToolCard";
import CategoryCard from "@/components/tools/CategoryCard";
import { useSearchParams } from "next/navigation";

interface ClientHomeProps {
  tools: Tool[];
  categories: Category[];
}

// Extracted Search Input Component to isolate animation re-renders
function AnimatedSearchInput({
  searchQuery,
  setSearchQuery,
  inputRef,
}: {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
}) {
  const placeholders = useMemo(
    () => [
      "Search 'JSON formatter'...",
      "Search 'Image compressor'...",
      "Search 'UUID generator'...",
      "Search 'JWT decoder'...",
      "Search 'Color converter'...",
    ],
    [],
  );

  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    const currentString = placeholders[placeholderIndex];

    if (isDeleting) {
      timer = setTimeout(() => {
        setDisplayText((prev) => prev.slice(0, -1));
        if (displayText.length <= 1) {
          setIsDeleting(false);
          setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
        }
      }, 30);
    } else {
      timer = setTimeout(() => {
        setDisplayText(currentString.slice(0, displayText.length + 1));
        if (displayText.length >= currentString.length) {
          timer = setTimeout(() => setIsDeleting(true), 2000);
        }
      }, 70);
    }

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, placeholderIndex, placeholders]);

  return (
    <div className="relative w-full max-w-2xl mt-6 group">
      <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-3xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
      <div className="relative flex items-center bg-card border-2 border-border/60 hover:border-border focus-within:border-primary/50 focus-within:ring-4 focus-within:ring-primary/10 rounded-2xl shadow-sm transition-all duration-300">
        <Search className="absolute left-5 h-6 w-6 text-muted-foreground group-focus-within:text-primary transition-colors" />
        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={searchQuery ? "" : displayText}
          className="w-full h-16 pl-14 pr-16 bg-transparent border-none outline-none text-lg text-foreground placeholder:text-muted-foreground/60 rounded-2xl"
        />
        <div className="absolute right-4 flex items-center gap-1 opacity-50">
          <kbd className="hidden sm:inline-flex h-6 items-center gap-1 rounded border bg-muted px-2 font-mono text-[10px] font-medium text-muted-foreground">
            <span className="text-xs">⌘</span>K
          </kbd>
        </div>
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-4 text-xs font-semibold bg-muted text-muted-foreground px-2 py-1 rounded-md hover:bg-muted-foreground/20 transition-colors"
          >
            ESC
          </button>
        )}
      </div>
    </div>
  );
}

export default function ClientHome({ tools, categories }: ClientHomeProps) {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync search query if URL changes
  useEffect(() => {
    setSearchQuery(searchParams.get("q") || "");
  }, [searchParams]);

  // Keyboard shortcut to focus search (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const filteredTools = tools.filter((tool) => {
    const query = searchQuery.toLowerCase();
    return (
      tool.title.toLowerCase().includes(query) ||
      tool.description.toLowerCase().includes(query) ||
      tool.category.toLowerCase().includes(query)
    );
  });

  const getToolsByCategory = (categoryId: string) => {
    return tools.filter((t) => t.category === categoryId);
  };

  const featuredTools = tools.filter((t) => t.featured).slice(0, 4);
  const trendingTools = tools.slice(4, 8);

  const handleSuggestionClick = (query: string) => {
    setSearchQuery(query);
    inputRef.current?.focus();
  };

  return (
    <div className="flex flex-col gap-16 pb-10">
      {/* Hero Search Section */}
      <div className="flex flex-col items-center text-center gap-6 max-w-4xl mx-auto pt-10 md:pt-20 px-4 w-full">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 border border-border/50 text-sm font-medium text-muted-foreground mb-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <span>Your all-in-one workspace</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground bg-clip-text text-transparent bg-gradient-to-br from-foreground to-foreground/70 leading-tight">
          100+ Developer & Content Tools,
          <br /> All In One Place.
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl">
          Format JSON, convert images, generate UUIDs, and more—instantly,
          securely, and completely in your browser.
        </p>

        <AnimatedSearchInput 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          inputRef={inputRef}
        />

        {/* Suggestion Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-4 max-w-2xl">
          <span className="text-sm text-muted-foreground font-medium mr-2 hidden sm:inline-block">
            Popular:
          </span>
          <button
            onClick={() => handleSuggestionClick("JSON Formatter")}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-card border border-border hover:border-primary/50 text-xs font-medium text-foreground transition-all shadow-sm hover:shadow-md"
          >
            <Zap className="h-3 w-3 text-yellow-500" />
            JSON Formatter
          </button>
          <button
            onClick={() => handleSuggestionClick("Base64")}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-card border border-border hover:border-primary/50 text-xs font-medium text-foreground transition-all shadow-sm hover:shadow-md"
          >
            Base64 Converter
          </button>
          <button
            onClick={() => handleSuggestionClick("JWT Decoder")}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-card border border-border hover:border-primary/50 text-xs font-medium text-foreground transition-all shadow-sm hover:shadow-md"
          >
            JWT Decoder
          </button>
          <button
            onClick={() => handleSuggestionClick("Color")}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-card border border-border hover:border-primary/50 text-xs font-medium text-foreground transition-all shadow-sm hover:shadow-md"
          >
            Color Converter
          </button>
        </div>
      </div>

      {/* Content Area */}
      {searchQuery ? (
        /* Search Results View */
        <div className="flex flex-col gap-6 w-full">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Search className="h-4 w-4" />
            <h2 className="text-lg font-semibold text-foreground">
              Search Results
            </h2>
            <span className="text-sm">({filteredTools.length})</span>
          </div>

          {filteredTools.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredTools.map((tool) => (
                <ToolCard key={tool.slug} tool={tool} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center border-2 border-dashed border-border/60 rounded-3xl bg-muted/10">
              <div className="h-16 w-16 bg-muted rounded-2xl flex items-center justify-center mb-4 text-muted-foreground">
                <Search className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">
                No tools found
              </h3>
              <p className="text-muted-foreground max-w-md">
                We couldn't find anything matching "{searchQuery}". Try using
                different keywords or browse our categories.
              </p>
              <button
                onClick={() => setSearchQuery("")}
                className="mt-6 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                Clear Search
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Default Discovery View */
        <div className="flex flex-col gap-16 w-full">
          {/* Categories Grid (Moved to top) */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
                  <Grid className="h-4 w-4" />
                </div>
                <h2 className="text-xl font-bold tracking-tight text-foreground">
                  Browse by Category
                </h2>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {categories.map((category) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  toolCount={getToolsByCategory(category.id).length}
                />
              ))}
            </div>
          </div>

          {/* Most Popular / Featured */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-orange-500/10 text-orange-500 flex items-center justify-center">
                  <TrendingUp className="h-4 w-4" />
                </div>
                <h2 className="text-xl font-bold tracking-tight text-foreground">
                  Trending Tools
                </h2>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {featuredTools.map((tool) => (
                <ToolCard key={tool.slug} tool={tool} />
              ))}
            </div>
          </div>

          {/* Recently Added (Simulated) */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-green-500/10 text-green-500 flex items-center justify-center">
                  <Clock className="h-4 w-4" />
                </div>
                <h2 className="text-xl font-bold tracking-tight text-foreground">
                  Recently Added
                </h2>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {trendingTools.map((tool) => (
                <ToolCard key={tool.slug} tool={tool} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
