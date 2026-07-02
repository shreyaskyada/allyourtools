"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Copy, Download, Code, Eye, FileText } from "lucide-react";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const DEFAULT_MARKDOWN = `# Welcome to the Markdown Editor! 👋

This is a **live-updating** markdown editor and previewer.

## What is Markdown?
Markdown is a lightweight markup language that you can use to add formatting elements to plaintext text documents.

### Text Formatting
You can make text **bold**, *italic*, or ~~strikethrough~~.
You can also use \`inline code\` or blockquotes:
> "Simplicity is the ultimate sophistication." - Leonardo da Vinci

### Lists
1. First item
2. Second item
   - Unordered sub-list
   - Another item
3. Third item

### Task Lists
- [x] Create a new tool
- [x] Install react-markdown
- [ ] Take a break

### Code Blocks
\`\`\`javascript
function greet(name) {
  console.log(\`Hello, \${name}!\`);
}
greet("World");
\`\`\`

### Tables

| Syntax | Description |
| ----------- | ----------- |
| Header | Title |
| Paragraph | Text |

Enjoy writing! 🚀
`;

export default function MarkdownEditor(): React.JSX.Element {
  const [markdown, setMarkdown] = useState(DEFAULT_MARKDOWN);
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");

  const handleCopy = () => {
    navigator.clipboard.writeText(markdown);
    toast.success("Markdown copied to clipboard!");
  };

  const handleDownloadMd = () => {
    const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "document.md";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Markdown file downloaded!");
  };

  const handleDownloadHtml = async () => {
    try {
      const { marked } = await import("marked");
      const parsedHtml = await marked.parse(markdown);
      
      const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Markdown Export</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 2rem; color: #333; }
    pre { background: #f4f4f4; padding: 1rem; border-radius: 4px; overflow-x: auto; }
    code { background: #f4f4f4; padding: 0.2rem 0.4rem; border-radius: 3px; font-family: monospace; }
    blockquote { border-left: 4px solid #ddd; margin: 0; padding-left: 1rem; color: #666; }
    table { border-collapse: collapse; width: 100%; margin-bottom: 1rem; }
    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
    th { background-color: #f8f8f8; }
    img { max-width: 100%; height: auto; }
  </style>
</head>
<body>
  <div class="markdown-body">
    ${parsedHtml}
  </div>
</body>
</html>`;

      const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "document.html";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success("HTML file downloaded!");
    } catch (error) {
      toast.error("Failed to generate HTML");
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col h-full w-full gap-4">
      {/* Toolbar */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-muted/30 p-2 rounded-lg border border-border/50">
        
        {/* Mobile/Tablet View Toggles */}
        <div className="flex bg-background rounded-md p-1 border shadow-sm w-full lg:w-auto lg:hidden">
          <Button 
            variant={activeTab === "edit" ? "default" : "ghost"} 
            size="sm" 
            onClick={() => setActiveTab("edit")}
            className="flex-1 gap-2"
          >
            <Code className="w-4 h-4" /> Edit
          </Button>
          <Button 
            variant={activeTab === "preview" ? "default" : "ghost"} 
            size="sm" 
            onClick={() => setActiveTab("preview")}
            className="flex-1 gap-2"
          >
            <Eye className="w-4 h-4" /> Preview
          </Button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <Button variant="outline" size="sm" onClick={handleCopy} className="gap-2 shrink-0">
            <Copy className="w-4 h-4" /> Copy MD
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownloadMd} className="gap-2 shrink-0">
            <Download className="w-4 h-4" /> Download .md
          </Button>
          <Button variant="default" size="sm" onClick={handleDownloadHtml} className="gap-2 shrink-0">
            <Download className="w-4 h-4" /> Export HTML
          </Button>
        </div>
      </div>

      {/* Editor & Preview Area */}
      <div className="flex flex-col lg:flex-row gap-6 min-h-[600px] h-[calc(100vh-250px)] max-h-[1000px]">
        
        {/* Editor Pane */}
        <div className={`flex-1 flex-col h-full ${activeTab === "preview" ? "hidden lg:flex" : "flex"}`}>
          <div className="bg-muted px-4 py-2 border border-border/60 border-b-0 rounded-t-lg flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Markdown Input</span>
          </div>
          <Textarea
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            className="flex-1 p-6 font-mono text-sm leading-relaxed resize-none rounded-t-none rounded-b-lg border-border/60 focus-visible:ring-1 focus-visible:ring-primary shadow-inner bg-background/50"
            placeholder="Type your markdown here..."
            spellCheck={false}
          />
        </div>

        {/* Preview Pane */}
        <div className={`flex-1 flex-col h-full ${activeTab === "edit" ? "hidden lg:flex" : "flex"}`}>
          <div className="bg-primary/5 px-4 py-2 border border-border/60 border-b-0 rounded-t-lg flex items-center justify-between">
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">Live Preview</span>
          </div>
          <div className="flex-1 p-6 overflow-y-auto rounded-t-none rounded-b-lg border border-border/60 bg-card shadow-sm">
            <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none prose-headings:scroll-mt-20 prose-pre:bg-muted/50 prose-pre:border prose-pre:border-border/50 prose-img:rounded-xl">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {markdown}
              </ReactMarkdown>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
