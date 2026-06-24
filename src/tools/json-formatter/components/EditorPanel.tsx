import React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Terminal, Clipboard, FileWarning } from "lucide-react";

interface EditorPanelProps {
  inputRef: React.RefObject<HTMLTextAreaElement | null>;
  input: string;
  onChange: (val: string) => void;
  onPaste: () => void;
  error: string | null;
}

export default function EditorPanel({
  inputRef,
  input,
  onChange,
  onPaste,
  error,
}: EditorPanelProps): React.JSX.Element {
  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-foreground flex items-center gap-1.5">
          <Terminal className="h-4 w-4 text-muted-foreground" />
          Raw JSON Input
        </label>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={onPaste} className="h-8 text-xs gap-1">
            <Clipboard className="h-3.5 w-3.5" />
            Paste
          </Button>
          {error && (
            <span className="flex items-center gap-1 text-xs text-destructive font-medium bg-destructive/5 border border-destructive/25 px-2 py-0.5 rounded-full">
              <FileWarning className="h-3 w-3 animate-pulse" />
              Invalid
            </span>
          )}
          {!error && input.trim() && (
            <span className="flex items-center gap-1 text-xs text-green-600 font-medium bg-green-500/5 border border-green-500/25 px-2 py-0.5 rounded-full">
              ✓ Valid
            </span>
          )}
        </div>
      </div>
      <Textarea
        ref={inputRef}
        value={input}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste or type raw JSON here..."
        className="min-h-[300px] md:min-h-[450px] font-mono text-xs leading-relaxed border border-border focus-visible:ring-primary shadow-inner"
      />
    </div>
  );
}
