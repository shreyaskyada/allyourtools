import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Check, Clipboard } from "lucide-react";
import { JSONTree } from "./JSONTree";

interface ViewerPanelProps {
  formattedOutput: string;
  minifiedOutput: string;
  parsedData: unknown;
  copied: boolean;
  activeTab: string;
  onActiveTabChange: (tab: string) => void;
  onCopy: () => void;
  highlightJson: (json: string) => string;
}

export default function ViewerPanel({
  formattedOutput,
  minifiedOutput,
  parsedData,
  copied,
  activeTab,
  onActiveTabChange,
  onCopy,
  highlightJson,
}: ViewerPanelProps): React.JSX.Element {
  return (
    <div className="flex flex-col gap-2.5">
      <Tabs value={activeTab} onValueChange={onActiveTabChange} className="w-full flex flex-col h-full">
        <div className="flex items-center justify-between gap-2 mb-1">
          <TabsList className="flex w-full overflow-x-auto h-9 justify-start bg-muted p-1 rounded-lg gap-1 scrollbar-none">
            <TabsTrigger value="preview" className="text-xs px-2.5 py-1 flex-1 md:flex-initial text-center shrink-0">Prettified</TabsTrigger>
            <TabsTrigger value="minify" className="text-xs px-2.5 py-1 flex-1 md:flex-initial text-center shrink-0">Minified</TabsTrigger>
            <TabsTrigger value="tree" className="text-xs px-2.5 py-1 flex-1 md:flex-initial text-center shrink-0">Tree Explorer</TabsTrigger>
            <TabsTrigger value="text" className="text-xs px-2.5 py-1 flex-1 md:flex-initial text-center shrink-0">Raw Text</TabsTrigger>
          </TabsList>

          <Button
            variant="ghost"
            size="icon"
            onClick={onCopy}
            className="h-8 w-8 rounded-lg shrink-0 cursor-pointer"
            title="Copy output"
          >
            {copied ? <Check className="h-4 w-4 text-green-500" /> : <Clipboard className="h-4 w-4" />}
          </Button>
        </div>

        {/* Syntax Highlighted HTML view (Prettified) */}
        <TabsContent value="preview" className="flex-1 mt-0">
          <div className="border border-border rounded-md bg-muted/10 p-4 min-h-[300px] md:min-h-[450px] max-h-[500px] overflow-y-auto">
            {formattedOutput ? (
              <pre
                className="font-mono text-xs leading-relaxed whitespace-pre-wrap select-text"
                dangerouslySetInnerHTML={{ __html: highlightJson(formattedOutput) }}
              />
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground text-xs py-24 border border-dashed border-border/80 rounded-md">
                Prettified JSON will appear here...
              </div>
            )}
          </div>
        </TabsContent>

        {/* Minified view */}
        <TabsContent value="minify" className="flex-1 mt-0">
          <div className="border border-border rounded-md bg-muted/10 p-4 min-h-[300px] md:min-h-[450px] max-h-[500px] overflow-y-auto">
            {minifiedOutput ? (
              <pre
                className="font-mono text-xs leading-relaxed whitespace-pre-wrap select-text break-all"
                dangerouslySetInnerHTML={{ __html: highlightJson(minifiedOutput) }}
              />
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground text-xs py-24 border border-dashed border-border/80 rounded-md">
                Minified JSON will appear here...
              </div>
            )}
          </div>
        </TabsContent>

        {/* Collapsible Tree Explorer */}
        <TabsContent value="tree" className="flex-1 mt-0">
          <div className="border border-border rounded-md bg-muted/10 p-4 min-h-[300px] md:min-h-[450px] max-h-[500px] overflow-y-auto select-none">
            {parsedData ? (
              <div className="p-1">
                <JSONTree data={parsedData} />
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground text-xs py-24 border border-dashed border-border/80 rounded-md">
                Tree nodes will appear here...
              </div>
            )}
          </div>
        </TabsContent>

        {/* Plain text area */}
        <TabsContent value="text" className="flex-1 mt-0">
          <Textarea
            readOnly
            value={formattedOutput}
            placeholder="Raw text output will appear here..."
            className="min-h-[300px] md:min-h-[450px] font-mono text-xs leading-relaxed border border-border bg-muted/20"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
