"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { 
  Check, 
  Clipboard, 
  Trash2, 
  Key, 
  Sparkles, 
  Terminal, 
  ArrowRight,
  Info,
  Lock,
  Unlock,
  AlertTriangle,
  RefreshCw,
  Eye,
  ChevronDown
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

// --- Static Key Templates ---
const RSA_PRIVATE_KEY = `-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCyIWSC3gpFMKph\n4tZXZ/NY7GzehHg0b/eGTuayhZKRFxAa3lsFuBw62zmiZ8kL8YlqQ6T5SR4/m4An\nn1NFZPDJj3vwolh8NmhmgcFBE50ffdu6LBsGe+Hmq8Z1tESwFiq5boLlIQx1oMD0\nINgzI+KsFEVKZsGAafzUZgHRAqIVtJ7ypQNK4Az4cgAdXbS/gbJB+9/fDlOvqnPj\nwcTBrK5rzTZvoQ5yR4b1BVu88/VRaD4hRKtZ233oR8CoS/i7VcukZDYSqI2krR7q\n8td/cQ34ebN5+oSEbDl7pB+Y/hccm60fztk/BaMH9fyMJkn2vTfYo7Sl4zF7WpL9\nQtmC2wzjAgMBAAECggEAFWWLHWh5eFfWUjK9XLtuUNNOvSh8CI8d1EK8VbD+FYfd\nKzUOtEWqEmx3OamuIyKiHHhqo80OIUWBo9YbWl27yfepGL26KOrKKJdTyjLbxUbI\nyCNNzb4UuQYPgopNqTnIa69kHAzCYotq512IoBVNQC6hJ2+SCmWbdTyZjEHSNrlg\n+UCpCi/3Lc0URcuq0cu9l8ivENB8INImW+AlioGCH7edKzdTnt+IMGOer6F7DodQ\nFegMSemOQ/rqw22DOWy0TQfn569NQbcZnaPjck73uOlBiu5aOcRmgbaBHYMzJNxf\nlGqTZY6Xd1c8O2HBOvCInIBU/FkqudptvHBeohWZuQKBgQDeiL502zKqiPLoRhw7\nUh+nLSOVLnM78eCtLWThXrSb0m5WncpJx1fL8POKOY+hXVXcQXtfu+EjFHqzapyv\nIBRi0yPbMUqR33Kn3Y4qJqbvuaz/Zx6UP7FIJfjQz2ZmnA77dDxg//NTuupR2C1F\nY0u3UImSwk7wfRzp5VyBxOpLiwKBgQDM6yrPnxMRIhjEh5RFYBjE8lUiVUMO+89z\nUgHPEVURtVRq4nTlFVMsbkICk8VdqQPrD9y8W8oOrnOgKg+cdSwCdaiVIB+QXkws\nDH5Q6KX6G+2uCQJUC7Eu7xoUpbEDAgalBBzWBJGu2ezIGNJsnFyGdyDws9zH9bXU\nGXZzf7vPCQKBgHS2O02GeTg/w0ZXHw9trvQ7FGJ1jjJuVWv+Vt5skUT4RK5g62tu\nhXmM0e446j+zeAigv1gibZ28a+4ViD/BD3AVVMTtQTLognXQGXO5+evY8gaxyrPu\nA8jXQXwiio5eYu02tUQaeT/81FBAlN3Dij6GmuDB0C0JMVTq2m2lHUypAoGAYABA\nczpUJW+y6MeXuBS4JfRd3BLTsr5XxvABdu/oyb4IyXZES1p9N9CDzk9KZIGdG0+4\nGupptA0YkE2EOMlQD+rtSsfc4ba7utszhlYoBA93f1QrKhK8NH/B2TByyDT3xfEy\nTTWgxqjD3E58rnNmiXxgC0RIR8meILq5Go0aAHkCgYBuMfZobv3m8Zrobivrv93a\nitjfH2ibddKX4KaYyYdhq98xigOvAxuaqd2tYgANJzaZDDxRstji+SrQksXbFfuW\n9PY6JLmsknuqnZm3Feog9guGXLzHzclxEKf4klo4lKSrmYcDQvVvT4XHaQeK1CEf\nrdpmSEXVq/PG17waApNCyw==\n-----END PRIVATE KEY-----`;

const RSA_PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAsiFkgt4KRTCqYeLWV2fz\nWOxs3oR4NG/3hk7msoWSkRcQGt5bBbgcOts5omfJC/GJakOk+UkeP5uAJ59TRWTw\nyY978KJYfDZoZoHBQROdH33buiwbBnvh5qvGdbREsBYquW6C5SEMdaDA9CDYMyPi\nrBRFSmbBgGn81GYB0QKiFbSe8qUDSuAM+HIAHV20v4GyQfvf3w5Tr6pz48HEwayu\na802b6EOckeG9QVbvPP1UWg+IUSrWdt96EfAqEv4u1XLpGQ2EqiNpK0e6vLXf3EN\n+HmzefqEhGw5e6QfmP4XHJutH87ZPwWjB/X8jCZJ9r032KO0peMxe1qS/ULZgtsM\n4wIDAQAB\n-----END PUBLIC KEY-----`;

const ECDSA_PRIVATE_KEY = `-----BEGIN PRIVATE KEY-----\nMIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQgMCn8+HxYKAxPPieh\nMoci/NuGqqEL9DFxkvhs7X0NRmehRANCAATAFBPrd0Vy5dgUcEXNjR1et/n7Lv0W\nngwyRyoqY21pjRiGkZv+aCcel/LR8AGy5oGlRkOdgOqKPetGD3w/81rj\n-----END PRIVATE KEY-----`;

const ECDSA_PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----\nMFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEwBQT63dFcuXYFHBFzY0dXrf5+y79\nFp4MMkcqKmNtaY0YhpGb/mgnHpfy0fABsuaBpUZDnYDqij3rRg98P/Na4w==\n-----END PUBLIC KEY-----`;

// --- PEM Array Buffer conversion ---
function pemToArrayBuffer(pem: string): ArrayBuffer {
  const b64 = pem
    .replace(/-----BEGIN [A-Z0-9 ]+-----/g, "")
    .replace(/-----END [A-Z0-9 ]+-----/g, "")
    .replace(/\s+/g, "");
  const binary = atob(b64);
  const buffer = new ArrayBuffer(binary.length);
  const view = new Uint8Array(buffer);
  for (let i = 0; i < binary.length; i++) {
    view[i] = binary.charCodeAt(i);
  }
  return buffer;
}

// --- Dynamic Token Signer ---
async function signJWT(
  headerObj: Record<string, unknown>,
  payloadObj: Record<string, unknown>,
  secretOrKey: string,
  secretIsBase64: boolean
): Promise<string> {
  const alg = headerObj.alg;
  if (typeof alg !== "string") {
    throw new Error("Header alg property must be a string");
  }

  const base64UrlEncode = (str: string) => {
    const b64 = btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p1) => {
      return String.fromCharCode(parseInt(p1, 16));
    }));
    return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
  };
  
  const headerB64 = base64UrlEncode(JSON.stringify(headerObj));
  const payloadB64 = base64UrlEncode(JSON.stringify(payloadObj));
  const message = `${headerB64}.${payloadB64}`;
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  
  if (alg === "none") {
    return `${message}.`;
  }
  
  if (alg.startsWith("HS")) {
    const hashAlg = alg === "HS384" ? "SHA-384" : alg === "HS512" ? "SHA-512" : "SHA-256";
    let keyData: Uint8Array;
    if (secretIsBase64) {
      const base64 = secretOrKey.replace(/-/g, "+").replace(/_/g, "/");
      const raw = atob(base64);
      keyData = new Uint8Array(raw.length);
      for (let i = 0; i < raw.length; i++) {
        keyData[i] = raw.charCodeAt(i);
      }
    } else {
      keyData = encoder.encode(secretOrKey);
    }
    
    const key = await window.crypto.subtle.importKey(
      "raw",
      keyData as any,
      { name: "HMAC", hash: hashAlg },
      false,
      ["sign"]
    );
    const sigBuffer = await window.crypto.subtle.sign("HMAC", key, data as any);
    const sigB64 = btoa(String.fromCharCode(...new Uint8Array(sigBuffer)))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=/g, "");
    return `${message}.${sigB64}`;
  } else if (alg.startsWith("RS") || alg.startsWith("PS")) {
    const hashAlg = (alg === "RS384" || alg === "PS384") ? "SHA-384" : (alg === "RS512" || alg === "PS512") ? "SHA-512" : "SHA-256";
    const keyBuffer = pemToArrayBuffer(secretOrKey);
    const keyName = alg.startsWith("RS") ? "RSASSA-PKCS1-v1_5" : "RSA-PSS";
    
    const key = await window.crypto.subtle.importKey(
      "pkcs8",
      keyBuffer as any,
      {
        name: keyName,
        hash: hashAlg,
      },
      false,
      ["sign"]
    );
    
    const params = alg.startsWith("RS")
      ? "RSASSA-PKCS1-v1_5"
      : { name: "RSA-PSS", saltLength: hashAlg === "SHA-256" ? 32 : hashAlg === "SHA-384" ? 48 : 64 };
       
    const sigBuffer = await window.crypto.subtle.sign(params, key, data as any);
    const sigB64 = btoa(String.fromCharCode(...new Uint8Array(sigBuffer)))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=/g, "");
    return `${message}.${sigB64}`;
  } else if (alg.startsWith("ES")) {
    const hashAlg = alg === "ES384" ? "SHA-384" : alg === "ES512" ? "SHA-512" : "SHA-256";
    const keyBuffer = pemToArrayBuffer(secretOrKey);
    const namedCurve = alg === "ES256" ? "P-256" : alg === "ES384" ? "P-384" : "P-521";
    
    const key = await window.crypto.subtle.importKey(
      "pkcs8",
      keyBuffer as any,
      {
        name: "ECDSA",
        namedCurve: namedCurve,
      },
      false,
      ["sign"]
    );
    const sigBuffer = await window.crypto.subtle.sign(
      {
        name: "ECDSA",
        hash: hashAlg,
      },
      key,
      data as any
    );
    const sigB64 = btoa(String.fromCharCode(...new Uint8Array(sigBuffer)))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=/g, "");
    return `${message}.${sigB64}`;
  } else {
    throw new Error(`Unsupported algorithm: ${alg}`);
  }
}

export default function JwtGenerator() {
  const [alg, setAlg] = useState<string>("HS256");
  const [secretOrKey, setSecretOrKey] = useState<string>("your-256-bit-secret");
  const [secretIsBase64, setSecretIsBase64] = useState<boolean>(false);
  
  // Custom Raw Editors
  const [headerInput, setHeaderInput] = useState<string>('{\n  "alg": "HS256",\n  "typ": "JWT"\n}');
  const [payloadInput, setPayloadInput] = useState<string>('{\n  "sub": "usr_1234567890",\n  "name": "John Doe",\n  "admin": true,\n  "iat": 1516239022\n}');
  
  // JSON Parse Errors
  const [headerError, setHeaderError] = useState<string | null>(null);
  const [payloadError, setPayloadError] = useState<string | null>(null);
  
  // Signature error
  const [signingError, setSigningError] = useState<string | null>(null);

  // Result Token
  const [generatedToken, setGeneratedToken] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);

  // Form claim helpers state
  const [sub, setSub] = useState("usr_1234567890");
  const [iss, setIss] = useState("allyourtools.app");
  const [aud, setAud] = useState("api.allyourtools.app");
  const [expOffset, setExpOffset] = useState("3600"); // 1 hour
  const [addIat, setAddIat] = useState(true);
  const [addNbf, setAddNbf] = useState(false);
  const [jti, setJti] = useState(true);
  const [uuidSeed, setUuidSeed] = useState("6db448cf-9a99-4d2a-89ea-6ab410d5402c");

  // Sync state variables -> payload editor
  const rebuildPayloadFromHelpers = () => {
    try {
      const payload: Record<string, unknown> = {};
      if (sub) payload.sub = sub;
      if (iss) payload.iss = iss;
      if (aud) payload.aud = aud;
      
      const now = Math.floor(Date.now() / 1000);
      if (addIat) payload.iat = now;
      if (addNbf) payload.nbf = now;
      
      if (expOffset !== "none") {
        payload.exp = now + parseInt(expOffset, 10);
      }
      
      if (jti && uuidSeed) {
        payload.jti = uuidSeed;
      }

      setPayloadInput(JSON.stringify(payload, null, 2));
      setPayloadError(null);
    } catch (err) {
      console.error(err);
    }
  };

  // Re-load initial sample key depending on alg
  useEffect(() => {
    // 1. Update Header JSON alg
    try {
      const parsed = JSON.parse(headerInput);
      parsed.alg = alg;
      setHeaderInput(JSON.stringify(parsed, null, 2));
      setHeaderError(null);
    } catch {
      setHeaderInput(JSON.stringify({ alg, typ: "JWT" }, null, 2));
      setHeaderError(null);
    }

    // 2. Load template private key
    if (alg.startsWith("HS")) {
      setSecretOrKey("your-256-bit-secret");
    } else if (alg.startsWith("RS") || alg.startsWith("PS")) {
      setSecretOrKey(RSA_PRIVATE_KEY);
    } else if (alg.startsWith("ES")) {
      setSecretOrKey(ECDSA_PRIVATE_KEY);
    } else {
      setSecretOrKey("");
    }
  }, [alg]);

  // Handle live serializations on builder variables change
  useEffect(() => {
    rebuildPayloadFromHelpers();
  }, [sub, iss, aud, expOffset, addIat, addNbf, jti, uuidSeed]);

  // Generate UUID
  const refreshJti = () => {
    const uuid = crypto.randomUUID();
    setUuidSeed(uuid);
  };

  // Real-time JWT Generator Effect
  useEffect(() => {
    if (headerError || payloadError) {
      setGeneratedToken("");
      return;
    }

    let active = true;

    async function generate() {
      try {
        const headerObj = JSON.parse(headerInput);
        const payloadObj = JSON.parse(payloadInput);
        const token = await signJWT(headerObj, payloadObj, secretOrKey, secretIsBase64);
        if (active) {
          setGeneratedToken(token);
          setSigningError(null);
        }
      } catch (err) {
        if (active) {
          setGeneratedToken("");
          setSigningError(err instanceof Error ? err.message : String(err));
        }
      }
    }

    // Debounce generation slightly
    const timer = setTimeout(() => {
      generate();
    }, 200);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [headerInput, payloadInput, secretOrKey, secretIsBase64, headerError, payloadError]);

  // Auto parsing validation on editor changes
  const handleHeaderChange = (val: string) => {
    setHeaderInput(val);
    try {
      const parsed = JSON.parse(val);
      if (parsed.alg && parsed.alg !== alg) {
        setAlg(parsed.alg);
      }
      setHeaderError(null);
    } catch (e) {
      setHeaderError(e instanceof Error ? e.message : "Invalid JSON syntax");
    }
  };

  const handlePayloadChange = (val: string) => {
    setPayloadInput(val);
    try {
      JSON.parse(val);
      setPayloadError(null);
    } catch (e) {
      setPayloadError(e instanceof Error ? e.message : "Invalid JSON syntax");
    }
  };

  const handleCopy = () => {
    if (!generatedToken) return;
    navigator.clipboard.writeText(generatedToken);
    setCopied(true);
    toast.success("Copied generated JWT to clipboard!");
  };

  useEffect(() => {
    if (copied) {
      const t = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(t);
    }
  }, [copied]);

  // Formatter JSON helper
  const prettifyTextareas = () => {
    try {
      const hObj = JSON.parse(headerInput);
      setHeaderInput(JSON.stringify(hObj, null, 2));
      setHeaderError(null);
    } catch {}
    try {
      const pObj = JSON.parse(payloadInput);
      setPayloadInput(JSON.stringify(pObj, null, 2));
      setPayloadError(null);
    } catch {}
  };

  // Get matching public key for validation link
  const getPublicKeyLinkParam = () => {
    if (alg.startsWith("HS")) {
      return secretOrKey;
    } else if (alg.startsWith("RS") || alg.startsWith("PS")) {
      return RSA_PUBLIC_KEY;
    } else if (alg.startsWith("ES")) {
      return ECDSA_PUBLIC_KEY;
    }
    return "";
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* Top Configuration bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">Select Algorithm:</span>
          <DropdownMenu>
            <DropdownMenuTrigger className="flex h-9 w-28 items-center justify-between rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer">
              {alg}
              <ChevronDown className="h-4 w-4 opacity-50" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-28 max-h-60 overflow-y-auto">
              {["HS256", "HS384", "HS512", "RS256", "RS384", "RS512", "ES256", "ES384", "ES512", "none"].map((item) => (
                <DropdownMenuItem key={item} onClick={() => setAlg(item)}>
                  {item}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={prettifyTextareas}>
            Format JSON
          </Button>
        </div>
      </div>

      {/* Editor Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT PANEL: CONFIGURATION (6 columns) */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          
          {/* Form claim helper Card */}
          <Card className="border border-border">
            <CardHeader className="pb-3 border-b border-border/60">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                Payload Claim Builder
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 flex flex-col gap-4 text-xs">
              
              {/* Grid builder inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-muted-foreground">Subject (sub)</label>
                  <input
                    type="text"
                    value={sub}
                    onChange={(e) => setSub(e.target.value)}
                    placeholder="User ID, subject..."
                    className="flex h-8 w-full rounded-md border border-input bg-transparent px-2.5 py-1 text-xs shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-muted-foreground">Issuer (iss)</label>
                  <input
                    type="text"
                    value={iss}
                    onChange={(e) => setIss(e.target.value)}
                    placeholder="Token issuer..."
                    className="flex h-8 w-full rounded-md border border-input bg-transparent px-2.5 py-1 text-xs shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-muted-foreground">Audience (aud)</label>
                  <input
                    type="text"
                    value={aud}
                    onChange={(e) => setAud(e.target.value)}
                    placeholder="Audience recipient..."
                    className="flex h-8 w-full rounded-md border border-input bg-transparent px-2.5 py-1 text-xs shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-muted-foreground">Expiration Lifetime</label>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex h-8 w-full items-center justify-between rounded-md border border-input bg-transparent px-2.5 py-1 text-xs shadow-sm transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer">
                      {expOffset === "none" ? "No Expiration" : 
                       expOffset === "300" ? "5 Minutes" : 
                       expOffset === "3600" ? "1 Hour" : 
                       expOffset === "86400" ? "1 Day" : 
                       expOffset === "604800" ? "7 Days" : "Custom"}
                      <ChevronDown className="h-3 w-3 opacity-50" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-48 text-xs">
                      <DropdownMenuItem onClick={() => setExpOffset("none")}>No Expiration</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setExpOffset("300")}>5 Minutes</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setExpOffset("3600")}>1 Hour</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setExpOffset("86400")}>1 Day</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setExpOffset("604800")}>7 Days</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap gap-x-6 gap-y-2.5 pt-1.5 border-t border-border/40">
                <label className="flex items-center gap-1.5 text-muted-foreground select-none cursor-pointer">
                  <input
                    type="checkbox"
                    checked={addIat}
                    onChange={(e) => setAddIat(e.target.checked)}
                    className="rounded border-input text-primary focus:ring-ring"
                  />
                  Issued At (iat)
                </label>
                <label className="flex items-center gap-1.5 text-muted-foreground select-none cursor-pointer">
                  <input
                    type="checkbox"
                    checked={addNbf}
                    onChange={(e) => setAddNbf(e.target.checked)}
                    className="rounded border-input text-primary focus:ring-ring"
                  />
                  Not Before (nbf)
                </label>
                <label className="flex items-center gap-1.5 text-muted-foreground select-none cursor-pointer">
                  <input
                    type="checkbox"
                    checked={jti}
                    onChange={(e) => setJti(e.target.checked)}
                    className="rounded border-input text-primary focus:ring-ring"
                  />
                  Token ID (jti)
                </label>
              </div>

              {/* UUID Seed control if JTI toggle selected */}
              {jti && (
                <div className="flex items-center gap-2 mt-1 bg-muted/40 p-2.5 rounded-lg border border-border/40">
                  <div className="flex-1 flex flex-col gap-0.5">
                    <span className="text-[10px] text-muted-foreground font-semibold uppercase">Token UUID</span>
                    <span className="font-mono text-[10px] truncate select-all">{uuidSeed}</span>
                  </div>
                  <Button variant="ghost" size="icon" onClick={refreshJti} className="h-7 w-7 rounded-md shrink-0" title="Generate New UUID">
                    <RefreshCw className="h-3.5 w-3.5" />
                  </Button>
                </div>
              )}

            </CardContent>
          </Card>

          {/* Key signing configuration */}
          <Card className="border border-border">
            <CardHeader className="pb-3 border-b border-border/60">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Key className="h-4 w-4 text-muted-foreground" />
                Signing Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 flex flex-col gap-3">
              {alg !== "none" ? (
                <div className="flex flex-col gap-2.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground">
                      Signing Algorithm: <strong className="text-foreground">{alg}</strong>
                    </span>
                    {alg.startsWith("HS") && (
                      <label className="flex items-center gap-1.5 text-muted-foreground select-none cursor-pointer">
                        <input
                          type="checkbox"
                          checked={secretIsBase64}
                          onChange={(e) => setSecretIsBase64(e.target.checked)}
                          className="rounded border-input text-primary focus:ring-ring"
                        />
                        Secret is Base64
                      </label>
                    )}
                  </div>

                  {alg.startsWith("HS") ? (
                    <input
                      type="text"
                      value={secretOrKey}
                      onChange={(e) => setSecretOrKey(e.target.value)}
                      placeholder="Enter HMAC Secret..."
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    />
                  ) : (
                    <div className="flex flex-col gap-1.5">
                      <Textarea
                        value={secretOrKey}
                        onChange={(e) => setSecretOrKey(e.target.value)}
                        placeholder="Paste PKCS#8 Private Key (starts with -----BEGIN PRIVATE KEY-----)..."
                        className="min-h-[120px] font-mono text-[10px]"
                      />
                      <p className="text-[10px] text-muted-foreground leading-normal">
                        Pre-populated with a valid, secure key template for instant testing. Replace with your custom private key as needed.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="rounded-lg bg-amber-500/5 border border-amber-500/25 p-3 text-xs text-amber-600 flex gap-2">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  <span>The token algorithm is set to <strong>none</strong>. No signature will be generated, and the key configuration is skipped.</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* RIGHT PANEL: RAW EDITORS & RESULT (6 columns) */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          
          {/* Header & Payload Editor Tabs */}
          <div className="flex flex-col gap-2.5">
            <Tabs defaultValue="payload" className="w-full flex flex-col h-full">
              <TabsList className="grid w-auto grid-cols-2 h-9 mb-1.5">
                <TabsTrigger value="payload" className="text-xs px-3.5">
                  Payload JSON
                </TabsTrigger>
                <TabsTrigger value="header" className="text-xs px-3.5">
                  Header JSON
                </TabsTrigger>
              </TabsList>

              {/* PAYLOAD EDIT TAB */}
              <TabsContent value="payload" className="flex-1 mt-0 flex flex-col gap-2">
                <Textarea
                  value={payloadInput}
                  onChange={(e) => handlePayloadChange(e.target.value)}
                  placeholder="Paste or write payload JSON here..."
                  className="min-h-[220px] font-mono text-xs leading-relaxed"
                />
                {payloadError && (
                  <div className="rounded-lg border border-destructive/20 bg-destructive/5 px-3.5 py-2 text-[10px] text-destructive font-mono leading-relaxed">
                    Syntax Error: {payloadError}
                  </div>
                )}
              </TabsContent>

              {/* HEADER EDIT TAB */}
              <TabsContent value="header" className="flex-1 mt-0 flex flex-col gap-2">
                <Textarea
                  value={headerInput}
                  onChange={(e) => handleHeaderChange(e.target.value)}
                  placeholder="Paste or write header JSON here..."
                  className="min-h-[220px] font-mono text-xs leading-relaxed"
                />
                {headerError && (
                  <div className="rounded-lg border border-destructive/20 bg-destructive/5 px-3.5 py-2 text-[10px] text-destructive font-mono leading-relaxed">
                    Syntax Error: {headerError}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Generated Result Card */}
          <Card className="border border-border bg-card">
            <CardHeader className="pb-3 border-b border-border/60 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Terminal className="h-4 w-4 text-muted-foreground" />
                Generated Token
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCopy}
                className="h-8 w-8 rounded-lg shrink-0"
                disabled={!generatedToken}
                title="Copy generated token"
              >
                {copied ? <Check className="h-4 w-4 text-green-500" /> : <Clipboard className="h-4 w-4" />}
              </Button>
            </CardHeader>
            <CardContent className="pt-4 flex flex-col gap-4">
              
              {/* Highlighted result token */}
              {generatedToken ? (
                <div className="flex flex-col gap-4 animate-fade-in">
                  
                  {/* Color visual stack */}
                  <div className="font-mono text-xs leading-relaxed break-all whitespace-pre-wrap select-all border border-border p-3.5 bg-muted/15 rounded-xl">
                    <span className="text-rose-500 font-semibold">{generatedToken.split('.')[0]}</span>
                    {generatedToken.split('.')[1] !== undefined && (
                      <>
                        <span className="text-muted-foreground font-bold mx-0.5">.</span>
                        <span className="text-violet-500 font-semibold">{generatedToken.split('.')[1]}</span>
                      </>
                    )}
                    {generatedToken.split('.')[2] !== undefined && (
                      <>
                        <span className="text-muted-foreground font-bold mx-0.5">.</span>
                        <span className="text-cyan-500 font-semibold">{generatedToken.split('.')[2]}</span>
                      </>
                    )}
                  </div>

                  {/* Redirection / Validation Handshake */}
                  <div className="flex justify-end pt-1">
                    <Link
                      href={`/tools/jwt-decoder?token=${encodeURIComponent(generatedToken)}&key=${encodeURIComponent(getPublicKeyLinkParam())}`}
                      className="inline-flex items-center gap-1.5 text-xs text-primary font-medium hover:underline focus:outline-none"
                    >
                      <Eye className="h-4 w-4" />
                      Verify in JWT Decoder
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>

                </div>
              ) : signingError ? (
                <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-xs text-destructive font-mono leading-relaxed flex items-start gap-2.5">
                  <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Signing Failure</p>
                    <p className="mt-1 leading-normal">{signingError}</p>
                  </div>
                </div>
              ) : (
                <div className="h-24 flex items-center justify-center text-muted-foreground text-xs border border-dashed border-border/80 rounded-xl bg-muted/5">
                  Provide valid JSON headers/payloads to generate a token
                </div>
              )}

            </CardContent>
          </Card>

        </div>

      </div>

    </div>
  );
}
