"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Check, 
  Clipboard, 
  Trash2, 
  Upload, 
  Download, 
  RefreshCw, 
  Sparkles, 
  Terminal, 
  AlertTriangle,
  FileImage,
  FileVideo,
  FileArchive,
  ChevronDown
} from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

// --- Magic bytes MIME type detector ---
function detectMimeType(bytes: Uint8Array): string {
  if (bytes.length < 4) return "application/octet-stream";
  
  // PNG: 89 50 4E 47
  if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4E && bytes[3] === 0x47) {
    return "image/png";
  }
  // JPEG: FF D8 FF
  if (bytes[0] === 0xFF && bytes[1] === 0xD8 && bytes[2] === 0xFF) {
    return "image/jpeg";
  }
  // GIF: 47 49 46 38 ('GIF8')
  if (bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x38) {
    return "image/gif";
  }
  // WEBP: RIFF .... WEBP
  if (bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 &&
      bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50) {
    return "image/webp";
  }
  // BMP: 42 4D ('BM')
  if (bytes[0] === 0x42 && bytes[1] === 0x4D) {
    return "image/bmp";
  }
  // PDF: 25 50 44 46 ('%PDF')
  if (bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 && bytes[3] === 0x46) {
    return "application/pdf";
  }
  // MP4: 'ftyp' at bytes 4-7
  if (bytes[4] === 0x66 && bytes[5] === 0x74 && bytes[6] === 0x79 && bytes[7] === 0x70) {
    if (bytes.length >= 12) {
      const brand = String.fromCharCode(bytes[8], bytes[9], bytes[10], bytes[11]);
      if (brand === "heic" || brand === "heix" || brand === "hevc" || brand === "hevx" || brand === "mif1" || brand === "msf1") {
        return "image/heic";
      }
    }
    return "video/mp4";
  }
  // WEBM: 1A 45 DF A3
  if (bytes[0] === 0x1A && bytes[1] === 0x45 && bytes[2] === 0xDF && bytes[3] === 0xA3) {
    return "video/webm";
  }
  // OGG: 4F 67 67 53 ('OggS')
  if (bytes[0] === 0x4F && bytes[1] === 0x67 && bytes[2] === 0x67 && bytes[3] === 0x53) {
    return "video/ogg";
  }
  
  return "application/octet-stream";
}

interface ExtensionMap {
  mime: string;
  ext: string;
}

const mimeExtensions: Record<string, ExtensionMap> = {
  "image/png": { mime: "image/png", ext: "png" },
  "image/jpeg": { mime: "image/jpeg", ext: "jpg" },
  "image/webp": { mime: "image/webp", ext: "webp" },
  "image/gif": { mime: "image/gif", ext: "gif" },
  "image/bmp": { mime: "image/bmp", ext: "bmp" },
  "image/heic": { mime: "image/heic", ext: "heic" },
  "image/heif": { mime: "image/heif", ext: "heif" },
  "video/mp4": { mime: "video/mp4", ext: "mp4" },
  "video/webm": { mime: "video/webm", ext: "webm" },
  "video/ogg": { mime: "video/ogg", ext: "ogg" },
  "application/pdf": { mime: "application/pdf", ext: "pdf" },
  "application/octet-stream": { mime: "application/octet-stream", ext: "bin" }
};

const formatBytes = (bytes: number) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const truncateText = (val: string, maxLength = 1500) => {
  if (!val) return "";
  if (val.length <= maxLength) return val;
  return val.slice(0, maxLength) + `\n\n... [TRUNCATED - Total ${val.length.toLocaleString()} characters. Click 'Copy' to get the full code]`;
};

function base64ToBlob(base64Str: string, defaultType = "application/octet-stream"): { blob: Blob; mimeType: string; extension: string } {
  let cleanB64 = base64Str.trim();
  let mimeType = defaultType;
  
  if (cleanB64.startsWith("data:")) {
    const match = cleanB64.match(/^data:([^;]+);base64,(.*)$/);
    if (match) {
      mimeType = match[1];
      cleanB64 = match[2];
    }
  }
  
  cleanB64 = cleanB64.replace(/-/g, "+").replace(/_/g, "/");
  const pad = cleanB64.length % 4;
  if (pad === 2) cleanB64 += "==";
  else if (pad === 3) cleanB64 += "=";
  cleanB64 = cleanB64.replace(/\s+/g, "");
  
  const raw = atob(cleanB64);
  const rawLength = raw.length;
  const uInt8Array = new Uint8Array(rawLength);
  
  for (let i = 0; i < rawLength; ++i) {
    uInt8Array[i] = raw.charCodeAt(i);
  }
  
  const blob = new Blob([uInt8Array], { type: mimeType });
  
  let extension = "bin";
  if (mimeExtensions[mimeType]) {
    extension = mimeExtensions[mimeType].ext;
  }
  
  return { blob, mimeType, extension };
}

export default function Base64ImageConverter() {
  // --- ENCODE STATES ---
  const [encFile, setEncFile] = useState<File | null>(null);
  const [encBase64, setEncBase64] = useState("");
  const [encDataUri, setEncDataUri] = useState("");
  const [encLoading, setEncLoading] = useState(false);
  const [encCopiedType, setEncCopiedType] = useState<string | null>(null);
  const [encDimensions, setEncDimensions] = useState<{ width: number; height: number } | null>(null);
  const [encDuration, setEncDuration] = useState<number | null>(null);

  // --- DECODE STATES ---
  const [hasDecInput, setHasDecInput] = useState(false);
  const decTextRef = useRef("");
  const decodeIdRef = useRef(0);
  const [decError, setDecError] = useState<string | null>(null);
  const [decPreviewUrl, setDecPreviewUrl] = useState<string | null>(null);
  const [decMimeType, setDecMimeType] = useState("application/octet-stream");
  const [decExtension, setDecExtension] = useState("bin");
  const [decFileSize, setDecFileSize] = useState(0);
  const [decBlob, setDecBlob] = useState<Blob | null>(null);
  const [decManualType, setDecManualType] = useState<string | null>(null);
  const [decDimensions, setDecDimensions] = useState<{ width: number; height: number } | null>(null);
  const [decDuration, setDecDuration] = useState<number | null>(null);

  const decInputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-clears copy checks
  useEffect(() => {
    if (encCopiedType) {
      const t = setTimeout(() => setEncCopiedType(null), 2000);
      return () => clearTimeout(t);
    }
  }, [encCopiedType]);

  // Decode cleanup preview URIs
  useEffect(() => {
    return () => {
      if (decPreviewUrl) {
        URL.revokeObjectURL(decPreviewUrl);
      }
    };
  }, [decPreviewUrl]);

  // --- ENCODE HANDLERS ---
  const processEncFile = async (file: File) => {
    let activeFile = file;
    const isHeic = activeFile.type === "image/heic" || 
                   activeFile.type === "image/heif" || 
                   activeFile.name.toLowerCase().endsWith(".heic") || 
                   activeFile.name.toLowerCase().endsWith(".heif");

    setEncLoading(true);
    setEncFile(null);
    setEncBase64("");
    setEncDataUri("");
    setEncDimensions(null);
    setEncDuration(null);

    if (isHeic) {
      try {
        toast.info("Converting HEIC image to JPEG...");
        const heic2any = (await import("heic2any")).default;
        const result = await heic2any({
          blob: activeFile,
          toType: "image/jpeg",
          quality: 0.85
        });
        const blob = Array.isArray(result) ? result[0] : result;
        activeFile = new File([blob], activeFile.name.replace(/\.[^/.]+$/, "") + ".jpg", {
          type: "image/jpeg",
          lastModified: new Date().getTime()
        });
      } catch (err: any) {
        console.error("HEIC conversion failed:", err);
        toast.error("Failed to convert HEIC image: " + (err.message || String(err)));
        setEncLoading(false);
        return;
      }
    }

    const isImg = activeFile.type.startsWith("image/");
    const isVid = activeFile.type.startsWith("video/");

    if (!isImg && !isVid) {
      toast.error("Unsupported format. Please select an image or video file.");
      setEncLoading(false);
      return;
    }

    setEncFile(activeFile);

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result && typeof e.target.result === "string") {
        const fullUri = e.target.result;
        setEncDataUri(fullUri);

        const payload = fullUri.split(";base64,")[1] || "";
        setEncBase64(payload);

        if (isImg) {
          const img = new Image();
          img.onload = () => {
            setEncDimensions({ width: img.width, height: img.height });
          };
          img.src = fullUri;
        } else if (isVid) {
          const video = document.createElement("video");
          video.preload = "metadata";
          video.onloadedmetadata = () => {
            setEncDimensions({ width: video.videoWidth, height: video.videoHeight });
            setEncDuration(video.duration);
          };
          video.src = URL.createObjectURL(activeFile);
        }
        toast.success(`Uploaded ${activeFile.name} successfully!`);
      }
      setEncLoading(false);
    };
    reader.onerror = () => {
      toast.error("Failed to convert the file.");
      setEncLoading(false);
    };
    reader.readAsDataURL(activeFile);
  };

  const handleEncDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processEncFile(e.dataTransfer.files[0]);
    }
  };

  const handleEncFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processEncFile(e.target.files[0]);
    }
  };

  const handleClearEnc = () => {
    setEncFile(null);
    setEncBase64("");
    setEncDataUri("");
    setEncDimensions(null);
    setEncDuration(null);
  };

  const handleEncCopy = (type: "raw" | "uri" | "html" | "css") => {
    let text = "";
    if (type === "raw") text = encBase64;
    else if (type === "uri") text = encDataUri;
    else if (type === "html") {
      text = encFile?.type.startsWith("image/") 
        ? `<img src="${encDataUri}" alt="${encFile?.name || 'Embedded Image'}" />`
        : `<video controls src="${encDataUri}"></video>`;
    } else if (type === "css") {
      text = `background-image: url("${encDataUri}");`;
    }

    if (!text) return;
    navigator.clipboard.writeText(text);
    setEncCopiedType(type);
    toast.success("Copied to clipboard!");
  };

  // --- DECODE HANDLERS ---
  const runDecode = async (text: string, manualMimeType = decManualType) => {
    const trimmed = text.trim();
    if (!trimmed) {
      handleClearDec();
      return;
    }

    decodeIdRef.current += 1;
    const currentId = decodeIdRef.current;

    try {
      let cleanB64 = trimmed;
      let parsedMime = "";

      if (cleanB64.startsWith("data:")) {
        const match = cleanB64.match(/^data:([^;]+);base64,(.*)$/);
        if (match) {
          parsedMime = match[1];
          cleanB64 = match[2];
        }
      }

      // Clean base64url characters only if present
      if (/[-_]/.test(cleanB64)) {
        cleanB64 = cleanB64.replace(/-/g, "+").replace(/_/g, "/");
      }
      
      // Pad if needed
      const pad = cleanB64.length % 4;
      if (pad === 2) cleanB64 += "==";
      else if (pad === 3) cleanB64 += "=";
      
      // Clean whitespaces/newlines only if present
      if (/[\s\r\n]/.test(cleanB64)) {
        cleanB64 = cleanB64.replace(/[\s\r\n]+/g, "");
      }

      if (!parsedMime) {
        // Decode just the first 32 characters of base64 to detect the MIME type!
        const sampleB64 = cleanB64.slice(0, 32);
        try {
          const sampleRaw = atob(sampleB64);
          const sampleBytes = new Uint8Array(sampleRaw.length);
          for (let i = 0; i < sampleRaw.length; ++i) {
            sampleBytes[i] = sampleRaw.charCodeAt(i);
          }
          parsedMime = detectMimeType(sampleBytes);
        } catch (e) {
          parsedMime = "application/octet-stream";
        }
      }

      if (currentId !== decodeIdRef.current) return;

      const finalMime = manualMimeType || parsedMime;
      const mapped = mimeExtensions[finalMime] || { mime: finalMime, ext: "bin" };

      let fileBlob: Blob;
      try {
        const dataUrl = trimmed.startsWith("data:") 
          ? trimmed 
          : `data:${finalMime};base64,${cleanB64}`;
        const res = await fetch(dataUrl);
        fileBlob = await res.blob();
      } catch (fetchErr) {
        // Fallback to synchronous decode in case fetch fails
        const raw = atob(cleanB64);
        const rawLength = raw.length;
        const uInt8Array = new Uint8Array(rawLength);
        for (let i = 0; i < rawLength; ++i) {
          uInt8Array[i] = raw.charCodeAt(i);
        }
        fileBlob = new Blob([uInt8Array], { type: finalMime });
      }

      if (currentId !== decodeIdRef.current) return;

      let previewBlob = fileBlob;
      let previewMime = mapped.mime;
      let previewExt = mapped.ext;

      const isHeic = finalMime === "image/heic" || finalMime === "image/heif";

      if (isHeic) {
        try {
          const heic2any = (await import("heic2any")).default;
          const converted = await heic2any({
            blob: fileBlob,
            toType: "image/jpeg",
            quality: 0.85
          });
          if (currentId !== decodeIdRef.current) return;
          previewBlob = Array.isArray(converted) ? converted[0] : converted;
          previewMime = "image/jpeg";
          previewExt = "jpg";
        } catch (heicErr) {
          console.error("HEIC decoding preview failed:", heicErr);
        }
      }

      const objUrl = URL.createObjectURL(previewBlob);

      if (currentId !== decodeIdRef.current) {
        URL.revokeObjectURL(objUrl);
        return;
      }

      if (decPreviewUrl) {
        URL.revokeObjectURL(decPreviewUrl);
      }

      setDecBlob(fileBlob);
      setDecPreviewUrl(objUrl);
      setDecMimeType(previewMime);
      setDecExtension(previewExt);
      setDecFileSize(fileBlob.size);
      setDecError(null);
      setDecDimensions(null);
      setDecDuration(null);

      const isImg = previewMime.startsWith("image/");
      const isVid = previewMime.startsWith("video/");

      if (isImg) {
        const img = new Image();
        img.onload = () => {
          if (currentId === decodeIdRef.current) {
            setDecDimensions({ width: img.width, height: img.height });
          }
        };
        img.src = objUrl;
      } else if (isVid) {
        const video = document.createElement("video");
        video.preload = "metadata";
        video.onloadedmetadata = () => {
          if (currentId === decodeIdRef.current) {
            setDecDimensions({ width: video.videoWidth, height: video.videoHeight });
            setDecDuration(video.duration);
          }
        };
        video.src = objUrl;
      }

    } catch (err) {
      if (currentId === decodeIdRef.current) {
        setDecError("Invalid Base64 format or corrupt content payload.");
        setDecBlob(null);
        if (decPreviewUrl) {
          URL.revokeObjectURL(decPreviewUrl);
        }
        setDecPreviewUrl(null);
        setDecDimensions(null);
        setDecDuration(null);
      }
    }
  };

  useEffect(() => {
    runDecode(decTextRef.current, decManualType);
  }, [decManualType]);

  const handleClearDec = () => {
    decodeIdRef.current += 1;
    if (decInputRef.current) {
      decInputRef.current.value = "";
    }
    decTextRef.current = "";
    setHasDecInput(false);
    setDecError(null);
    setDecBlob(null);
    if (decPreviewUrl) {
      URL.revokeObjectURL(decPreviewUrl);
    }
    setDecPreviewUrl(null);
    setDecMimeType("application/octet-stream");
    setDecExtension("bin");
    setDecFileSize(0);
    setDecManualType(null);
    setDecDimensions(null);
    setDecDuration(null);
  };

  const handleDecPaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        if (decInputRef.current) {
          decInputRef.current.value = text;
        }
        decTextRef.current = text;
        setHasDecInput(true);
        setDecManualType(null);
        runDecode(text, null);
        toast.success("Pasted from clipboard!");
      }
    } catch {
      toast.error("Failed to read clipboard.");
    }
  };

  const handleDownloadDec = () => {
    if (!decBlob || !decPreviewUrl) return;
    const link = document.createElement("a");
    link.href = decPreviewUrl;
    link.download = `decoded_file.${decExtension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`File saved as decoded_file.${decExtension}!`);
  };

  const isImage = decMimeType.startsWith("image/");
  const isVideo = decMimeType.startsWith("video/");

  return (
    <div className="flex flex-col gap-6">
      <Tabs defaultValue="encode" className="w-full flex flex-col">
        <TabsList className="grid w-fit grid-cols-2 h-9 mb-4">
          <TabsTrigger value="encode" className="text-xs px-6 cursor-pointer">
            <Upload className="h-3.5 w-3.5 mr-1.5" />
            Encode Image/Video
          </TabsTrigger>
          <TabsTrigger value="decode" className="text-xs px-6 cursor-pointer">
            <Download className="h-3.5 w-3.5 mr-1.5" />
            Decode Base64 Code
          </TabsTrigger>
        </TabsList>

        {/* --- ENCODE TAB VIEW --- */}
        <TabsContent value="encode" className="flex flex-col gap-5 mt-0 outline-none">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Left side: upload area and properties */}
            <div className="flex flex-col gap-5">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Terminal className="h-3.5 w-3.5 text-muted-foreground" />
                Image or Video Input File
              </label>

              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleEncDrop}
                className="border-2 border-dashed border-border hover:border-primary/50 transition-colors rounded-xl p-10 flex flex-col items-center justify-center text-center gap-3 cursor-pointer bg-muted/5 relative group min-h-[160px]"
              >
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleEncFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Upload className="h-9 w-9 text-muted-foreground group-hover:text-primary transition-colors" />
                <div>
                  <p className="font-semibold text-foreground text-sm">Drag and drop file here</p>
                  <p className="text-muted-foreground text-xs mt-0.5">Supports images & videos (MP4, WebM)</p>
                </div>
              </div>

              {encLoading && (
                <div className="flex items-center justify-center gap-2 text-muted-foreground py-4">
                  <RefreshCw className="h-4 w-4 animate-spin text-primary" />
                  <span className="text-xs">Converting media...</span>
                </div>
              )}

              {encFile && !encLoading && (
                <Card className="border border-border animate-fade-in bg-card overflow-hidden">
                  <CardHeader className="pb-3 border-b border-border/60 flex flex-row items-center justify-between">
                    <CardTitle className="text-xs font-semibold flex items-center gap-2">
                      {encFile.type.startsWith("image/") ? <FileImage className="h-4 w-4 text-primary" /> : <FileVideo className="h-4 w-4 text-primary" />}
                      Media Visual Preview
                    </CardTitle>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={handleClearEnc} 
                      className="h-8 w-8 text-destructive hover:bg-destructive/5 rounded-lg cursor-pointer shrink-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardHeader>
                  <CardContent className="pt-4 flex flex-col gap-4">
                    <div className="relative flex items-center justify-center bg-muted/20 border border-border/40 rounded-xl overflow-hidden min-h-[220px] max-h-[350px]">
                      {encFile.type.startsWith("image/") ? (
                        <img 
                          src={encDataUri} 
                          alt="Encoded Preview" 
                          className="max-h-[320px] object-contain rounded-lg p-2 selection:bg-transparent"
                        />
                      ) : (
                        <video 
                          controls 
                          src={encDataUri} 
                          className="w-full max-h-[320px] rounded-lg p-2"
                        />
                      )}
                    </div>

                    <div className="flex flex-col gap-1 border-t border-border/40 pt-3 text-[11px] font-mono text-muted-foreground">
                      <div className="flex justify-between">
                        <span>Filename:</span>
                        <span className="text-foreground font-semibold truncate max-w-[200px]">{encFile.name}</span>
                      </div>
                      <div className="flex justify-between mt-1">
                        <span>Mime Type:</span>
                        <span className="text-foreground font-semibold">{encFile.type}</span>
                      </div>
                      <div className="flex justify-between mt-1">
                        <span>File Size:</span>
                        <span className="text-foreground font-semibold">{formatBytes(encFile.size)}</span>
                      </div>
                      {encDimensions && (
                        <div className="flex justify-between mt-1">
                          <span>Dimensions:</span>
                          <span className="text-foreground font-semibold">{encDimensions.width} × {encDimensions.height}px</span>
                        </div>
                      )}
                      {encDuration !== null && (
                        <div className="flex justify-between mt-1">
                          <span>Duration:</span>
                          <span className="text-foreground font-semibold">{encDuration.toFixed(2)}s</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right side: generated copiers */}
            <div className="flex flex-col gap-5">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-muted-foreground" />
                Base64 Code Output Snippets
              </label>

              {encBase64 ? (
                <div className="flex flex-col gap-3.5 animate-fade-in">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-muted-foreground">Raw Base64 string</span>
                      <Button 
                        onClick={() => handleEncCopy("raw")} 
                        variant="ghost" 
                        size="xs" 
                        className="h-7 gap-1 text-[11px] cursor-pointer"
                      >
                        {encCopiedType === "raw" ? <Check className="h-3 w-3 text-green-500" /> : <Clipboard className="h-3 w-3" />}
                        Copy Raw
                      </Button>
                    </div>
                    <Textarea readOnly value={truncateText(encBase64)} className="min-h-[75px] max-h-[100px] font-mono text-[10px] bg-muted/15" />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-muted-foreground">Data URL</span>
                      <Button 
                        onClick={() => handleEncCopy("uri")} 
                        variant="ghost" 
                        size="xs" 
                        className="h-7 gap-1 text-[11px] cursor-pointer"
                      >
                        {encCopiedType === "uri" ? <Check className="h-3 w-3 text-green-500" /> : <Clipboard className="h-3 w-3" />}
                        Copy URI
                      </Button>
                    </div>
                    <Textarea readOnly value={truncateText(encDataUri)} className="min-h-[75px] max-h-[100px] font-mono text-[10px] bg-muted/15" />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-muted-foreground">HTML Embed Tag</span>
                      <Button 
                        onClick={() => handleEncCopy("html")} 
                        variant="ghost" 
                        size="xs" 
                        className="h-7 gap-1 text-[11px] cursor-pointer"
                      >
                        {encCopiedType === "html" ? <Check className="h-3 w-3 text-green-500" /> : <Clipboard className="h-3 w-3" />}
                        Copy Tag
                      </Button>
                    </div>
                    <Textarea 
                      readOnly 
                      value={truncateText(encFile?.type.startsWith("image/") 
                        ? `<img src="${encDataUri}" alt="${encFile?.name || 'Embedded Image'}" />` 
                        : `<video controls src="${encDataUri}"></video>`)} 
                      className="min-h-[60px] max-h-[80px] font-mono text-[10px] bg-muted/15" 
                    />
                  </div>

                  {encFile?.type.startsWith("image/") && (
                    <div className="flex flex-col gap-1.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-muted-foreground">CSS Background Code</span>
                        <Button 
                          onClick={() => handleEncCopy("css")} 
                          variant="ghost" 
                          size="xs" 
                          className="h-7 gap-1 text-[11px] cursor-pointer"
                        >
                          {encCopiedType === "css" ? <Check className="h-3 w-3 text-green-500" /> : <Clipboard className="h-3 w-3" />}
                          Copy CSS
                        </Button>
                      </div>
                      <Textarea readOnly value={truncateText(`background-image: url("${encDataUri}");`)} className="min-h-[60px] max-h-[80px] font-mono text-[10px] bg-muted/15" />
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-72 flex items-center justify-center text-muted-foreground text-xs border border-dashed border-border/80 rounded-xl bg-muted/5">
                  Upload an image or video file to view Base64 code tags
                </div>
              )}
            </div>

          </div>
        </TabsContent>

        {/* --- DECODE TAB VIEW --- */}
        <TabsContent value="decode" className="flex flex-col gap-5 mt-0 outline-none">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Left side: inputs and format overrides */}
            <div className="flex flex-col gap-5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Terminal className="h-3.5 w-3.5 text-muted-foreground" />
                  Paste Base64 Code or Data URL
                </label>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={handleDecPaste} className="h-7 px-2.5 text-xs gap-1 cursor-pointer">
                    <Clipboard className="h-3 w-3" />
                    Paste
                  </Button>
                  {hasDecInput && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={handleClearDec} 
                      className="h-7 px-2.5 text-xs text-destructive hover:bg-destructive/5 gap-1 cursor-pointer"
                    >
                      <Trash2 className="h-3 w-3" />
                      Clear
                    </Button>
                  )}
                </div>
              </div>

              <Textarea
                ref={decInputRef}
                onChange={(e) => {
                  const val = e.target.value;
                  decTextRef.current = val;
                  setHasDecInput(!!val.trim());
                  setDecManualType(null);
                  runDecode(val, null);
                }}
                placeholder="Paste standard Data URL (data:image/png;base64,...) or plain Base64 string here..."
                className="h-36 font-mono text-xs leading-relaxed border border-border focus-visible:ring-primary shadow-inner resize-y overflow-y-auto"
              />

              {hasDecInput && !decError && (
                <div className="flex flex-wrap items-center justify-between gap-3 border border-border/60 bg-muted/10 p-3 rounded-xl text-xs">
                  <span className="text-muted-foreground">Force Decoded Format Override:</span>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex h-8 items-center justify-between gap-1.5 rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer">
                      {decManualType ? `Format: .${mimeExtensions[decManualType]?.ext || "bin"}` : "Auto-Detected Format"}
                      <ChevronDown className="h-3 w-3 opacity-50" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-48 text-xs max-h-60 overflow-y-auto" align="end">
                      <DropdownMenuItem onClick={() => setDecManualType(null)}>
                        Auto-Detected Format
                      </DropdownMenuItem>
                      {Object.keys(mimeExtensions).map((key) => (
                        <DropdownMenuItem key={key} onClick={() => setDecManualType(key)}>
                          .{mimeExtensions[key].ext.toUpperCase()} ({key})
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
            </div>

            {/* Right side: visual previews */}
            <div className="flex flex-col gap-5">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                {decMimeType.startsWith("image/") ? <FileImage className="h-3.5 w-3.5 text-muted-foreground" /> : decMimeType.startsWith("video/") ? <FileVideo className="h-3.5 w-3.5 text-muted-foreground" /> : <FileArchive className="h-3.5 w-3.5 text-muted-foreground" />}
                Decoded Visual Media Output
              </label>

              {decPreviewUrl && !decError ? (
                <div className="flex flex-col gap-4 animate-fade-in">
                  <div className="relative flex items-center justify-center bg-muted/20 border border-border/40 rounded-xl overflow-hidden min-h-[220px] max-h-[350px]">
                    {isImage && (
                      <img 
                        src={decPreviewUrl} 
                        alt="Decoded Visual Media" 
                        className="max-h-[320px] object-contain rounded-lg p-2 selection:bg-transparent"
                      />
                    )}
                    {isVideo && (
                      <video 
                        controls 
                        src={decPreviewUrl} 
                        className="w-full max-h-[320px] rounded-lg p-2"
                      />
                    )}
                    {!isImage && !isVideo && (
                      <div className="flex flex-col items-center gap-2 p-8 text-center text-muted-foreground">
                        <FileArchive className="h-10 w-10 text-primary opacity-60" />
                        <div>
                          <p className="font-semibold text-foreground text-xs">Binary Stream Decoded</p>
                          <p className="text-[10px] mt-0.5">Preview not supported for MIME type: {decMimeType}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="rounded-xl border border-border/60 bg-muted/10 p-3.5 flex flex-col gap-1.5 font-mono text-[11px] text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Detected MIME Type:</span>
                      <span className="text-foreground font-semibold">{decMimeType}</span>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span>Guessed Extension:</span>
                      <span className="text-foreground font-semibold">.{decExtension}</span>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span>File Size:</span>
                      <span className="text-foreground font-semibold">{formatBytes(decFileSize)}</span>
                    </div>
                    {decDimensions && (
                      <div className="flex justify-between mt-1">
                        <span>Dimensions:</span>
                        <span className="text-foreground font-semibold">{decDimensions.width} × {decDimensions.height}px</span>
                      </div>
                    )}
                    {decDuration !== null && (
                      <div className="flex justify-between mt-1">
                        <span>Duration:</span>
                        <span className="text-foreground font-semibold">{decDuration.toFixed(2)}s</span>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end pt-1">
                    <Button onClick={handleDownloadDec} variant="default" size="sm" className="h-8 px-4 text-xs gap-1.5 cursor-pointer">
                      <Download className="h-3.5 w-3.5" />
                      Download File
                    </Button>
                  </div>
                </div>
              ) : decError ? (
                <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-xs text-destructive font-mono leading-relaxed flex items-start gap-2.5 shadow-sm animate-fade-in">
                  <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Decryption Failure</p>
                    <p className="mt-1 leading-normal opacity-90">{decError}</p>
                  </div>
                </div>
              ) : (
                <div className="h-72 flex items-center justify-center text-muted-foreground text-xs border border-dashed border-border/80 rounded-xl bg-muted/5">
                  Paste Base64 code to visually preview the decoded media
                </div>
              )}
            </div>

          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
