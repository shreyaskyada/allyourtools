"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Upload,
  Download,
  Trash2,
  Sparkles,
  RefreshCw,
  Image as ImageIcon,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";

// ------------------------------------------------------------------
// Supported output formats
// ------------------------------------------------------------------
const OUTPUT_FORMATS = [
  { label: "JPEG", value: "image/jpeg", ext: "jpg", lossy: true, alpha: false },
  { label: "PNG", value: "image/png", ext: "png", lossy: false, alpha: true },
  { label: "WebP", value: "image/webp", ext: "webp", lossy: true, alpha: true },
  { label: "AVIF", value: "image/avif", ext: "avif", lossy: true, alpha: true },
  { label: "BMP", value: "image/bmp", ext: "bmp", lossy: false, alpha: false },
  { label: "GIF", value: "image/gif", ext: "gif", lossy: false, alpha: true },
];

// ------------------------------------------------------------------
// Format description badge
// ------------------------------------------------------------------
function FormatBadge({ alpha, lossy }: { alpha: boolean; lossy: boolean }) {
  return (
    <div className="flex gap-1 mt-1">
      {alpha && (
        <span className="text-[9px] px-1.5 py-0.5 rounded bg-violet-500/10 text-violet-500 font-bold">
          α
        </span>
      )}
      {lossy ? (
        <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-500 font-bold">
          Lossy
        </span>
      ) : (
        <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 font-bold">
          Lossless
        </span>
      )}
    </div>
  );
}

// ------------------------------------------------------------------
// Component
// ------------------------------------------------------------------
export default function ImageConverter(): React.JSX.Element {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalSrc, setOriginalSrc] = useState<string>("");
  const [originalDimensions, setOriginalDimensions] = useState({ width: 0, height: 0 });
  const [detectedFormat, setDetectedFormat] = useState<string>("");

  const [outputFormat, setOutputFormat] = useState("image/webp");
  const [convertedBlob, setConvertedBlob] = useState<Blob | null>(null);
  const [convertedSrc, setConvertedSrc] = useState<string>("");
  const [converting, setConverting] = useState(false);

  const [isDragOver, setIsDragOver] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const originalSrcRef = useRef<string>("");
  const convertedSrcRef = useRef<string>("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (originalSrcRef.current) URL.revokeObjectURL(originalSrcRef.current);
      if (convertedSrcRef.current) URL.revokeObjectURL(convertedSrcRef.current);
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const setOriginalBlobUrl = (url: string) => {
    if (originalSrcRef.current) URL.revokeObjectURL(originalSrcRef.current);
    originalSrcRef.current = url;
    setOriginalSrc(url);
  };

  const setConvertedBlobUrl = (blob: Blob) => {
    if (convertedSrcRef.current) URL.revokeObjectURL(convertedSrcRef.current);
    const url = URL.createObjectURL(blob);
    convertedSrcRef.current = url;
    setConvertedBlob(blob);
    setConvertedSrc(url);
  };

  // ------------------------------------------------------------------
  // Core conversion — reads from File via FileReader (no stale URLs)
  // ------------------------------------------------------------------
  const runConversion = useCallback((file: File, fmt: string) => {
    setConverting(true);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      if (!dataUrl) {
        toast.error("Failed to read image.");
        setConverting(false);
        return;
      }
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          toast.error("Canvas context unavailable.");
          setConverting(false);
          return;
        }

        // Fill white for formats that don't support alpha
        const targetFmt = OUTPUT_FORMATS.find((f) => f.value === fmt);
        if (targetFmt && !targetFmt.alpha) {
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        ctx.drawImage(img, 0, 0);

        // Quality: 0.92 for lossy formats by default
        const quality = targetFmt?.lossy ? 0.92 : undefined;

        canvas.toBlob(
          (blob) => {
            if (blob) {
              setConvertedBlobUrl(blob);
            } else {
              toast.error("Conversion failed — format may not be supported in this browser.");
            }
            setConverting(false);
          },
          fmt,
          quality
        );
      };
      img.onerror = () => {
        toast.error("Failed to load image for conversion.");
        setConverting(false);
      };
      img.src = dataUrl;
    };
    reader.onerror = () => {
      toast.error("Failed to read image file.");
      setConverting(false);
    };
    reader.readAsDataURL(file);
  }, []);

  // Debounce conversion when format changes
  useEffect(() => {
    if (!originalFile) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      runConversion(originalFile, outputFormat);
    }, 200);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [originalFile, outputFormat, runConversion]);

  // ------------------------------------------------------------------
  // File upload handler
  // ------------------------------------------------------------------
  const handleFileChange = async (file: File) => {
    const isImage = file.type.startsWith("image/") || file.name.toLowerCase().endsWith(".heic");
    if (!isImage) {
      toast.error("Please upload a valid image file.");
      return;
    }

    let activeFile = file;

    if (file.name.toLowerCase().endsWith(".heic")) {
      try {
        toast.info("Converting HEIC to JPEG…");
        const heic2any = (await import("heic2any")).default;
        const result = await heic2any({ blob: file, toType: "image/jpeg", quality: 0.9 });
        const blob = Array.isArray(result) ? result[0] : result;
        activeFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".jpg", {
          type: "image/jpeg",
          lastModified: Date.now(),
        });
      } catch (err: any) {
        toast.error("HEIC conversion failed: " + (err.message || String(err)));
        return;
      }
    }

    // Detect input format label
    const fmt = OUTPUT_FORMATS.find((f) => f.value === activeFile.type);
    setDetectedFormat(fmt ? fmt.label : activeFile.type.split("/")[1]?.toUpperCase() || "Unknown");

    const previewUrl = URL.createObjectURL(activeFile);
    setOriginalBlobUrl(previewUrl);
    setOriginalFile(activeFile);

    const img = new Image();
    img.onload = () => {
      setOriginalDimensions({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = () => toast.error("Could not read image dimensions.");
    img.src = previewUrl;
  };

  // ------------------------------------------------------------------
  // Download
  // ------------------------------------------------------------------
  const handleDownload = () => {
    if (!convertedBlob || !originalFile) return;
    const targetFmt = OUTPUT_FORMATS.find((f) => f.value === outputFormat);
    const ext = targetFmt?.ext || "bin";
    const baseName = originalFile.name.replace(/\.[^/.]+$/, "");
    const link = document.createElement("a");
    link.download = `${baseName}.${ext}`;
    link.href = convertedSrcRef.current;
    link.click();
    toast.success(`Downloaded as ${baseName}.${ext}`);
  };

  // ------------------------------------------------------------------
  // Reset
  // ------------------------------------------------------------------
  const handleReset = () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (originalSrcRef.current) URL.revokeObjectURL(originalSrcRef.current);
    if (convertedSrcRef.current) URL.revokeObjectURL(convertedSrcRef.current);
    originalSrcRef.current = "";
    convertedSrcRef.current = "";
    setOriginalFile(null);
    setOriginalSrc("");
    setConvertedBlob(null);
    setConvertedSrc("");
    setOriginalDimensions({ width: 0, height: 0 });
    setDetectedFormat("");
    setConverting(false);
    toast.success("Workspace cleared");
  };

  // ------------------------------------------------------------------
  // Helpers
  // ------------------------------------------------------------------
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const targetFmtInfo = OUTPUT_FORMATS.find((f) => f.value === outputFormat);

  // ------------------------------------------------------------------
  // Render
  // ------------------------------------------------------------------
  return (
    <div className="flex flex-col gap-6">
      {!originalFile ? (
        /* ── Dropzone ── */
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setIsDragOver(false); if (e.dataTransfer.files[0]) handleFileChange(e.dataTransfer.files[0]); }}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-12 text-center flex flex-col items-center justify-center gap-4 cursor-pointer transition-all min-h-[300px] ${
            isDragOver
              ? "border-primary bg-primary/5 scale-[0.99]"
              : "border-border hover:border-primary/50 bg-card hover:bg-muted/10"
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
            accept="image/*,.heic"
            className="hidden"
          />
          <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <Upload className="h-7 w-7" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-foreground">Upload an Image to Convert</h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
              Supports JPEG, PNG, WebP, GIF, BMP, and Apple HEIC. Drag & drop or click to browse.
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5 justify-center">
            {OUTPUT_FORMATS.map((f) => (
              <Badge key={f.value} variant="outline" className="text-[10px] font-bold px-2 py-0.5">
                {f.label}
              </Badge>
            ))}
          </div>
        </div>
      ) : (
        /* ── Active Workspace ── */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ── Image Panels (2 cols) ── */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Original */}
              <Card className="border border-border/80 bg-card shadow-xs overflow-hidden">
                <div className="p-3 border-b border-border/60 bg-muted/20 flex justify-between items-center">
                  <h4 className="text-xs font-bold text-muted-foreground flex items-center gap-1.5">
                    <ImageIcon className="h-3.5 w-3.5" />
                    Original
                    {detectedFormat && (
                      <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-muted text-foreground">
                        {detectedFormat}
                      </span>
                    )}
                  </h4>
                  <Badge variant="secondary" className="font-mono text-[10px] font-bold">
                    {formatBytes(originalFile.size)}
                  </Badge>
                </div>
                <div className="p-4 flex items-center justify-center min-h-[260px] max-h-[360px] overflow-hidden bg-muted/10">
                  {originalSrc && (
                    <img
                      src={originalSrc}
                      alt="Original"
                      className="max-h-[300px] w-auto max-w-full object-contain rounded-sm shadow-xs select-none"
                    />
                  )}
                </div>
                <div className="p-3 bg-card border-t border-border/40 text-center text-xs text-muted-foreground font-mono">
                  {originalDimensions.width} × {originalDimensions.height} px
                </div>
              </Card>

              {/* Converted */}
              <Card className="border border-border/80 bg-card shadow-xs overflow-hidden">
                <div className="p-3 border-b border-border/60 bg-muted/20 flex justify-between items-center">
                  <h4 className="text-xs font-bold text-muted-foreground flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-primary" />
                    Converted
                    <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary">
                      {targetFmtInfo?.label}
                    </span>
                  </h4>
                  {convertedBlob && (
                    <Badge variant="secondary" className="font-mono text-[10px] font-bold">
                      {formatBytes(convertedBlob.size)}
                    </Badge>
                  )}
                </div>
                <div className="p-4 flex items-center justify-center min-h-[260px] max-h-[360px] overflow-hidden bg-muted/10 relative">
                  {converting && (
                    <div className="absolute inset-0 bg-background/60 flex flex-col gap-2 items-center justify-center z-10 backdrop-blur-sm">
                      <RefreshCw className="h-6 w-6 text-primary animate-spin" />
                      <span className="text-xs font-medium text-muted-foreground">Converting…</span>
                    </div>
                  )}
                  {convertedSrc && (
                    <img
                      src={convertedSrc}
                      alt="Converted"
                      className="max-h-[300px] w-auto max-w-full object-contain rounded-sm shadow-xs select-none"
                    />
                  )}
                </div>
                <div className="p-3 bg-card border-t border-border/40 text-center text-xs text-muted-foreground font-mono">
                  {originalDimensions.width} × {originalDimensions.height} px
                </div>
              </Card>
            </div>

            {/* Action Bar */}
            <div className="flex justify-between items-center gap-3">
              <div className="flex items-center gap-2">
                {/* Upload new */}
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*,.heic"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        handleReset();
                        handleFileChange(e.target.files[0]);
                      }
                    }}
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    title=""
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="cursor-pointer text-xs gap-1.5 h-9 font-medium pointer-events-none"
                  >
                    <Upload className="h-3.5 w-3.5" />
                    Upload New Image
                  </Button>
                </div>
                {/* Clear */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleReset}
                  title="Clear workspace"
                  className="h-9 w-9 text-muted-foreground hover:text-destructive hover:bg-destructive/8 cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
              <Button
                variant="default"
                size="sm"
                onClick={handleDownload}
                disabled={!convertedBlob || converting}
                className="font-medium cursor-pointer text-xs gap-1.5 h-9"
              >
                <Download className="h-3.5 w-3.5" />
                Download .{targetFmtInfo?.ext}
              </Button>
            </div>
          </div>

          {/* ── Format Picker (1 col) ── */}
          <Card className="border border-border/80 bg-card shadow-xs self-start">
            <div className="px-5 py-4 border-b border-border/60">
              <h3 className="text-sm font-semibold flex items-center gap-2 text-foreground">
                <ArrowRight className="h-4 w-4 text-primary" />
                Convert To
              </h3>
            </div>
            <CardContent className="p-4 flex flex-col gap-2">
              {OUTPUT_FORMATS.map((fmt) => {
                const isSelected = outputFormat === fmt.value;
                const isSameFormat = detectedFormat === fmt.label;
                return (
                  <button
                    key={fmt.value}
                    type="button"
                    onClick={() => setOutputFormat(fmt.value)}
                    disabled={isSameFormat}
                    className={`w-full rounded-lg px-3 py-3 text-left flex items-center justify-between gap-3 transition-all cursor-pointer border ${
                      isSelected
                        ? "border-primary/60 bg-primary/8 text-foreground"
                        : "border-border/50 bg-transparent hover:border-border hover:bg-muted/30 text-muted-foreground hover:text-foreground"
                    } ${isSameFormat ? "opacity-40 cursor-not-allowed" : ""}`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold">{fmt.label}</span>
                        <span className="text-[10px] font-mono text-muted-foreground">.{fmt.ext}</span>
                        {isSameFormat && (
                          <span className="text-[10px] text-muted-foreground">(current)</span>
                        )}
                      </div>
                      <FormatBadge alpha={fmt.alpha} lossy={fmt.lossy} />
                    </div>
                    {isSelected && (
                      <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                    )}
                  </button>
                );
              })}

              {/* Transparency warning */}
              {outputFormat !== "image/png" && outputFormat !== "image/webp" && outputFormat !== "image/avif" && outputFormat !== "image/gif" && (
                <p className="text-[10px] text-amber-600 dark:text-amber-400 leading-relaxed mt-2 bg-amber-500/8 border border-amber-500/20 rounded-lg px-3 py-2">
                  ⚠ This format does not support transparency. Transparent areas will be filled with white.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
