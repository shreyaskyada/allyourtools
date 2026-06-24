"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import { 
  Check, 
  Clipboard, 
  Trash2, 
  Key, 
  ShieldCheck, 
  ShieldAlert, 
  Clock, 
  Sparkles, 
  ChevronDown, 
  Terminal, 
  Info,
  Lock,
  Unlock,
  AlertTriangle
} from "lucide-react";
import { toast } from "sonner";
import { JSONTree } from "@/tools/json-formatter/components/JSONTree";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// --- Claim Explanations Dictionary ---
const claimDescriptions: Record<string, string> = {
  // Header
  alg: "Algorithm: The cryptographic algorithm used to secure the token (e.g. HS256, RS256).",
  typ: "Type: The type of the token (typically JWT).",
  kid: "Key ID: A hint indicating which key was used to secure the JWT.",
  jku: "JWK Set URL: A URI that refers to a resource for a set of JSON-encoded public keys.",
  jwk: "JSON Web Key: The public key that corresponds to the key used to sign the token.",
  x5u: "X.509 URL: A URI pointing to a set of X.509 public certificates.",
  x5c: "X.509 Certificate Chain: The X.509 public key certificate or certificate chain.",
  x5t: "X.509 Certificate SHA-1 Thumbprint: SHA-1 thumbprint of the X.509 certificate.",
  crit: "Critical: An array of header names that the client must recognize and process.",
  
  // Registered Payload Claims
  iss: "Issuer: Identifies the principal that issued the JWT.",
  sub: "Subject: Identifies the principal that is the subject of the JWT (e.g. user ID).",
  aud: "Audience: Identifies the recipients that the JWT is intended for.",
  exp: "Expiration Time: The time on or after which the JWT must not be accepted.",
  nbf: "Not Before: The time before which the JWT must not be accepted.",
  iat: "Issued At: The time at which the JWT was issued.",
  jti: "JWT ID: A unique identifier for the token (can prevent replay attacks).",
  
  // Common Private/Public Claims
  name: "Name: The subject's full name.",
  given_name: "Given Name: The subject's first or given name.",
  family_name: "Family Name: The subject's surname or family name.",
  middle_name: "Middle Name: The subject's middle name.",
  nickname: "Nickname: The casual name for the subject.",
  preferred_username: "Preferred Username: Shorthand name chosen by the subject.",
  profile: "Profile: URL of the subject's profile page.",
  picture: "Picture: URL of the subject's profile picture.",
  website: "Website: URL of the subject's web page.",
  email: "Email: The subject's email address.",
  email_verified: "Email Verified: Indicates if the subject's email has been verified.",
  gender: "Gender: The subject's gender.",
  birthdate: "Birthdate: The subject's date of birth.",
  zoneinfo: "Zone Info: The subject's time zone.",
  locale: "Locale: The subject's locale (language/country).",
  phone_number: "Phone Number: The subject's phone number.",
  phone_number_verified: "Phone Number Verified: Indicates if the subject's phone number has been verified.",
  address: "Address: The subject's preferred postal address.",
  updated_at: "Updated At: The time the subject's information was last updated.",
  role: "Role: The user authorization role.",
  roles: "Roles: List of user authorization roles.",
  admin: "Admin: Indicates if the user has administrative privileges.",
  scope: "Scope: List of OAuth scopes granted to the token.",
  scp: "Scope: Shortened notation for OAuth scopes."
};

// --- Base64Url Decoder ---
function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  return decodeURIComponent(
    atob(base64)
      .split("")
      .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
      .join("")
  );
}

// --- PEM to ArrayBuffer Helper ---
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

// --- Dynamic Sample JWT Generator ---
async function generateSampleJWT(secret: string, isExpired: boolean = false): Promise<string> {
  const header = { alg: "HS256", typ: "JWT" };
  const now = Math.floor(Date.now() / 1000);
  const iat = isExpired ? now - 7200 : now;
  const exp = isExpired ? now - 3600 : now + 3600;
  
  const payload = {
    sub: "usr_1234567890",
    name: "John Doe",
    email: "john.doe@example.com",
    role: "admin",
    iat: iat,
    exp: exp,
    iss: "toolverse.com",
    aud: "api.toolverse.com"
  };
  
  const base64UrlEncode = (obj: unknown) => {
    const str = JSON.stringify(obj);
    const b64 = btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p1) => {
      return String.fromCharCode(parseInt(p1, 16));
    }));
    return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
  };

  const headerB64 = base64UrlEncode(header);
  const payloadB64 = base64UrlEncode(payload);
  
  const encoder = new TextEncoder();
  const secretData = encoder.encode(secret);
  const key = await window.crypto.subtle.importKey(
    "raw",
    secretData as any,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signatureBuffer = await window.crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(`${headerB64}.${payloadB64}`) as any
  );
  
  const signatureB64 = btoa(String.fromCharCode(...new Uint8Array(signatureBuffer)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
    
  return `${headerB64}.${payloadB64}.${signatureB64}`;
}

// --- Cryptographic Verification Logic ---
async function verifySignature(
  token: string,
  secretOrKey: string,
  secretIsBase64: boolean = false
): Promise<{ verified: boolean; error?: string }> {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return { verified: false, error: "Invalid JWT structure" };
    }
    const [headerB64, payloadB64, signatureB64] = parts;
    const headerJson = JSON.parse(base64UrlDecode(headerB64));
    const alg = headerJson.alg;
    if (!alg || alg === "none") {
      return { verified: false, error: "Algorithm 'none' does not support signature verification." };
    }

    const encoder = new TextEncoder();
    const messageData = encoder.encode(`${headerB64}.${payloadB64}`);
    
    // Decode signature
    const signatureBase64 = signatureB64.replace(/-/g, "+").replace(/_/g, "/");
    const rawSignature = atob(signatureBase64);
    const signatureBuffer = new Uint8Array(rawSignature.length);
    for (let i = 0; i < rawSignature.length; i++) {
      signatureBuffer[i] = rawSignature.charCodeAt(i);
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
        ["verify"]
      );
      const ok = await window.crypto.subtle.verify("HMAC", key, signatureBuffer as any, messageData as any);
      return { verified: ok };
    } else if (alg.startsWith("RS") || alg.startsWith("PS")) {
      const hashAlg = (alg === "RS384" || alg === "PS384") ? "SHA-384" : (alg === "RS512" || alg === "PS512") ? "SHA-512" : "SHA-256";
      const keyBuffer = pemToArrayBuffer(secretOrKey);
      const keyName = alg.startsWith("RS") ? "RSASSA-PKCS1-v1_5" : "RSA-PSS";
      
      const key = await window.crypto.subtle.importKey(
        "spki",
        keyBuffer as any,
        {
          name: keyName,
          hash: hashAlg,
        },
        false,
        ["verify"]
      );
      
      const params = alg.startsWith("RS") 
        ? "RSASSA-PKCS1-v1_5" 
        : { name: "RSA-PSS", saltLength: hashAlg === "SHA-256" ? 32 : hashAlg === "SHA-384" ? 48 : 64 };

      const ok = await window.crypto.subtle.verify(
        params,
        key,
        signatureBuffer as any,
        messageData as any
      );
      return { verified: ok };
    } else if (alg.startsWith("ES")) {
      const hashAlg = alg === "ES384" ? "SHA-384" : alg === "ES512" ? "SHA-512" : "SHA-256";
      const keyBuffer = pemToArrayBuffer(secretOrKey);
      const namedCurve = alg === "ES256" ? "P-256" : alg === "ES384" ? "P-384" : "P-521";
      
      const key = await window.crypto.subtle.importKey(
        "spki",
        keyBuffer as any,
        {
          name: "ECDSA",
          namedCurve: namedCurve,
        },
        false,
        ["verify"]
      );
      const ok = await window.crypto.subtle.verify(
        {
          name: "ECDSA",
          hash: hashAlg,
        },
        key,
        signatureBuffer as any,
        messageData as any
      );
      return { verified: ok };
    } else {
      return { verified: false, error: `Unsupported algorithm: ${alg}` };
    }
  } catch (err) {
    return { verified: false, error: err instanceof Error ? err.message : String(err) };
  }
}

// --- JWT Parsed Result Interface ---
interface ParseResult {
  header: Record<string, unknown> | null;
  payload: Record<string, unknown> | null;
  signature: string | null;
  headerRaw: string;
  payloadRaw: string;
  signatureRaw: string;
  error: string | null;
}

// --- Main Parsing Helper ---
function parseJwt(token: string): ParseResult {
  const trimmed = token.trim();
  if (!trimmed) {
    return { header: null, payload: null, signature: null, headerRaw: "", payloadRaw: "", signatureRaw: "", error: null };
  }

  const parts = trimmed.split(".");
  if (parts.length !== 3) {
    let header = null;
    let payload = null;
    const errorMsg = "JWT structure is invalid. A token must contain exactly 3 dot-separated parts (Header, Payload, Signature).";
    
    try {
      if (parts[0]) header = JSON.parse(base64UrlDecode(parts[0]));
    } catch {}
    try {
      if (parts[1]) payload = JSON.parse(base64UrlDecode(parts[1]));
    } catch {}

    return {
      header,
      payload,
      signature: null,
      headerRaw: parts[0] || "",
      payloadRaw: parts[1] || "",
      signatureRaw: parts[2] || "",
      error: errorMsg,
    };
  }

  const [headerB64, payloadB64, signatureB64] = parts;
  let header: Record<string, unknown> | null = null;
  let payload: Record<string, unknown> | null = null;
  let error: string | null = null;

  try {
    header = JSON.parse(base64UrlDecode(headerB64));
  } catch (e) {
    error = `Failed to parse Header: ${e instanceof Error ? e.message : "Invalid Base64 or JSON"}`;
  }

  try {
    payload = JSON.parse(base64UrlDecode(payloadB64));
  } catch (e) {
    if (!error) {
      error = `Failed to parse Payload: ${e instanceof Error ? e.message : "Invalid Base64 or JSON"}`;
    }
  }

  return {
    header,
    payload,
    signature: signatureB64,
    headerRaw: headerB64,
    payloadRaw: payloadB64,
    signatureRaw: signatureB64,
    error,
  };
}

function formatDuration(seconds: number): string {
  const absSeconds = Math.abs(seconds);
  const days = Math.floor(absSeconds / 86400);
  const hours = Math.floor((absSeconds % 86400) / 3600);
  const minutes = Math.floor((absSeconds % 3600) / 60);
  const secs = Math.floor(absSeconds % 60);
  
  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0 || days > 0) parts.push(`${hours}h`);
  if (minutes > 0 || hours > 0 || days > 0) parts.push(`${minutes}m`);
  parts.push(`${secs}s`);
  
  return parts.join(" ");
}

export default function JwtDecoder() {
  const [token, setToken] = useState("");
  const [secretOrKey, setSecretOrKey] = useState("");
  const [secretIsBase64, setSecretIsBase64] = useState(false);
  const [copiedPart, setCopiedPart] = useState<string | null>(null);
  
  // Timer States
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [tokenStatus, setTokenStatus] = useState<"active" | "expired" | "no-exp" | "invalid">("no-exp");
  
  // Signature verification state
  const [verificationResult, setVerificationResult] = useState<{ verified: boolean | null; error?: string }>({ verified: null });

  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Focus on entry
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Parse Token
  const decoded = parseJwt(token);

  // Clear all states
  const handleClear = () => {
    setToken("");
    setSecretOrKey("");
    setSecretIsBase64(false);
    setVerificationResult({ verified: null });
  };

  // Clipboard operations
  const handleCopy = (text: string, part: string) => {
    if (!text.trim()) {
      toast.error("Nothing to copy.");
      return;
    }
    navigator.clipboard.writeText(text);
    setCopiedPart(part);
    toast.success(`Copied ${part} to clipboard!`);
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setToken(text);
        toast.success("Token pasted!");
      } else {
        toast.error("Clipboard is empty.");
      }
    } catch {
      toast.error("Failed to read clipboard. Please paste manually.");
    }
  };

  // Expiration countdown effect
  useEffect(() => {
    if (decoded.error || !decoded.payload) {
      setTokenStatus(decoded.error ? "invalid" : "no-exp");
      setTimeRemaining(null);
      return;
    }

    const exp = decoded.payload.exp;
    if (typeof exp !== "number") {
      setTokenStatus("no-exp");
      setTimeRemaining(null);
      return;
    }

    const updateTimer = () => {
      const now = Math.floor(Date.now() / 1000);
      const diff = exp - now;
      setTimeRemaining(diff);
      setTokenStatus(diff > 0 ? "active" : "expired");
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [token, decoded.payload, decoded.error]);

  // Signature verification effect
  useEffect(() => {
    let active = true;

    async function runVerification() {
      if (!token.trim()) {
        if (active) setVerificationResult({ verified: null });
        return;
      }

      if (decoded.error || !decoded.signature) {
        if (active) setVerificationResult({ verified: null, error: decoded.error || "Missing signature" });
        return;
      }

      const alg = decoded.header?.alg;
      if (!alg || alg === "none" || typeof alg !== "string") {
        if (active) setVerificationResult({ verified: false, error: "Algorithm 'none' is insecure and cannot be verified." });
        return;
      }

      if (!secretOrKey.trim()) {
        if (active) setVerificationResult({ verified: null, error: "Provide a verification secret or key." });
        return;
      }

      const result = await verifySignature(token, secretOrKey, secretIsBase64);
      if (active) {
        setVerificationResult(result);
      }
    }

    runVerification();

    return () => {
      active = false;
    };
  }, [token, secretOrKey, secretIsBase64, decoded.header, decoded.signature, decoded.error]);

  // Copied indicator reset
  useEffect(() => {
    if (copiedPart) {
      const timer = setTimeout(() => setCopiedPart(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [copiedPart]);

  // Loading sample tokens
  const loadSample = async (type: "hs256-active" | "hs256-expired" | "rs256") => {
    if (type === "rs256") {
      const pem = `-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAu9vSzfLPhf2yklo8z5xK\nUd2/J5uHjZfPY/c8/QaU7p3UroUbPZHQC25mnoADDAWqLe4KzWCnoJ+3QpKpOy3R\nScy5O81V6l4V7XlU1/lRzTBZOQm569kqEENwcX8/FMFPO4XC6yOpVr5zR7iZqsTW\nWSkKnqj0hzVXSMidHTaQOnIio7ylYhSomHk5bQHyxbCDkArUXEDC4WGOwXpkCOWk\n2pZIi209qtnXYrEfUo75d9WGBvpf15hGlLloKsAJrO+dzea0WB6cjndxwmCMByE6\nDt0DG8xAuq4W+QNzZ29x662dKusdad9UMdSkU7dvoB7xfF/JvaZ6pALZoQiisT5O\nRQIDAQAB\n-----END PUBLIC KEY-----`;
      const rsaToken = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5ODc2NTQzMjEwIiwibmFtZSI6IlJTQSBUZXN0ZXIiLCJyb2xlIjoiZGV2ZWxvcGVyIiwiaWF0IjoxNzgyMzE4Mzk3LCJleHAiOjE4MTM4NTQzOTcsImlzcyI6InRvb2x2ZXJzZS5jb20ifQ.F5R_B88JDrlbACqzpyg9BmFerXEDocjzrJphixvKim0qXxvLAW4lMjLZGCZ3khBQ3ia5JvWh3kLC-4FRd0EQQckZa0aHuMFLQYruk2GPMspevD2lInyM0DcYkLWm4-BC4iYoGzxASJPxfEFyLY1tiLa5EJR0xoLxxE_GLN_1ueO3oF2b-BtvnHpGiWH4_3GW5ZF6olpvUYqa482WCbN1KPCidsxGieUSmhohPqLVOFxCX-cuN44K_zoy2lsjfKA9uNTc48CMc36PnKQSbfgv9PSrfu3z4urfPF5VSmyxuaNzt_qNjYvEJU12q7CkH-3-3f0bbrQy_raTNX5jLfL7Jw";
      setToken(rsaToken);
      setSecretOrKey(pem);
      setSecretIsBase64(false);
      toast.success("Loaded RS256 RSA sample token and public key!");
    } else {
      const isExpired = type === "hs256-expired";
      const secret = "your-256-bit-secret";
      try {
        const jwt = await generateSampleJWT(secret, isExpired);
        setToken(jwt);
        setSecretOrKey(secret);
        setSecretIsBase64(false);
        toast.success(isExpired ? "Loaded Expired HS256 sample token!" : "Loaded Active HS256 sample token!");
      } catch (err) {
        console.error(err);
        toast.error("Failed to generate sample token.");
      }
    }
  };

  // Safe syntax highlight function
  const highlightJson = (jsonString: string, type: "header" | "payload") => {
    if (!jsonString) return "";
    const safeStr = jsonString
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    return safeStr.replace(
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g,
      (match) => {
        let cls = "text-amber-600 dark:text-amber-400";
        if (/^"/.test(match)) {
          if (/:$/.test(match)) {
            cls = type === "header" 
              ? "text-rose-500 font-semibold" 
              : "text-violet-500 font-semibold";
          } else {
            cls = "text-green-600 dark:text-green-400";
          }
        } else if (/true|false/.test(match)) {
          cls = "text-purple-600 dark:text-purple-400 font-medium";
        } else if (/null/.test(match)) {
          cls = "text-rose-500 font-medium";
        }
        return `<span class="${cls}">${match}</span>`;
      }
    );
  };

  // Date Formatter Helper
  const formatTimestamp = (sec: unknown) => {
    if (typeof sec !== "number") return "-";
    return new Date(sec * 1000).toLocaleString();
  };

  // Generate Remaining Progress Percentage
  const getProgressPercent = () => {
    if (!decoded.payload) return 0;
    const { iat, exp } = decoded.payload;
    if (typeof iat !== "number" || typeof exp !== "number") return 0;
    const total = exp - iat;
    if (total <= 0) return 0;
    const now = Date.now() / 1000;
    const elapsed = now - iat;
    const percent = ((exp - now) / total) * 100;
    return Math.max(0, Math.min(100, percent));
  };

  const hasExp = decoded.payload && typeof decoded.payload.exp === "number";
  const hasIat = decoded.payload && typeof decoded.payload.iat === "number";

  return (
    <TooltipProvider>
      <div className="flex flex-col gap-6">
        
        {/* Top Control Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">Load Demo Token:</span>
            <DropdownMenu>
              <DropdownMenuTrigger className="flex h-9 w-44 items-center justify-between rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer">
                Select Sample
                <ChevronDown className="h-4 w-4 opacity-50" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-52">
                <DropdownMenuItem onClick={() => loadSample("hs256-active")}>
                  HS256 - Active Token
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => loadSample("hs256-expired")}>
                  HS256 - Expired Token
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => loadSample("rs256")}>
                  RS256 - RSA Public Key
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={handleClear} className="text-destructive hover:bg-destructive/5 border-destructive/20">
              <Trash2 className="mr-1.5 h-4 w-4" />
              Clear All
            </Button>
          </div>
        </div>

        {/* Workspace Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT SIDE: Encoded Input & Signature Verification (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Input card */}
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                  <Terminal className="h-4 w-4 text-muted-foreground" />
                  Encoded JWT Token
                </label>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm" onClick={handlePaste} className="h-8 text-xs gap-1">
                    <Clipboard className="h-3.5 w-3.5" />
                    Paste
                  </Button>
                </div>
              </div>
              <Textarea
                ref={inputRef}
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Paste your base64-encoded JWT token here..."
                className="min-h-[220px] font-mono text-xs leading-relaxed border border-border focus-visible:ring-primary shadow-inner"
              />
            </div>

            {/* Token visual representation */}
            <div className="flex flex-col gap-2.5">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Token Structure (Color Coded)
              </h3>
              {token ? (
                <div className="font-mono text-xs leading-relaxed break-all whitespace-pre-wrap select-all border border-border p-3.5 bg-muted/15 rounded-xl">
                  <span className="text-rose-500 font-semibold">{token.split('.')[0]}</span>
                  {token.split('.')[1] !== undefined && (
                    <>
                      <span className="text-muted-foreground font-bold mx-0.5">.</span>
                      <span className="text-violet-500 font-semibold">{token.split('.')[1]}</span>
                    </>
                  )}
                  {token.split('.')[2] !== undefined && (
                    <>
                      <span className="text-muted-foreground font-bold mx-0.5">.</span>
                      <span className="text-cyan-500 font-semibold">{token.split('.')[2]}</span>
                    </>
                  )}
                </div>
              ) : (
                <div className="h-16 flex items-center justify-center text-muted-foreground text-xs border border-dashed border-border/80 rounded-xl bg-muted/5">
                  Paste a token to see its structure
                </div>
              )}
            </div>

            {/* Signature Verification Block */}
            <Card className="border border-border">
              <CardHeader className="pb-3 border-b border-border/60">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Key className="h-4 w-4 text-muted-foreground" />
                  Signature Verification
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 flex flex-col gap-4">
                
                {/* Dynamically adjust the keys depending on alg */}
                {decoded.header?.alg ? (
                  <div className="flex flex-col gap-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-muted-foreground">
                        Algorithm: <strong className="text-foreground">{String(decoded.header.alg)}</strong>
                      </span>
                      {String(decoded.header.alg).startsWith("HS") && (
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

                    {String(decoded.header.alg).startsWith("HS") ? (
                      <div className="flex flex-col gap-1.5">
                        <input
                          type="text"
                          value={secretOrKey}
                          onChange={(e) => setSecretOrKey(e.target.value)}
                          placeholder="Enter HMAC Secret..."
                          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        />
                        <p className="text-[10px] text-muted-foreground">
                          For HMAC-SHA algorithms, verify signature by entering the signing secret key.
                        </p>
                      </div>
                    ) : String(decoded.header.alg).startsWith("RS") || 
                        String(decoded.header.alg).startsWith("PS") || 
                        String(decoded.header.alg).startsWith("ES") ? (
                      <div className="flex flex-col gap-1.5">
                        <Textarea
                          value={secretOrKey}
                          onChange={(e) => setSecretOrKey(e.target.value)}
                          placeholder="Paste PEM Public Key (starts with -----BEGIN PUBLIC KEY-----)..."
                          className="min-h-[140px] font-mono text-[10px]"
                        />
                        <p className="text-[10px] text-muted-foreground">
                          For RSA/ECDSA asymmetric algorithms, verify the token by pasting the PEM public key.
                        </p>
                      </div>
                    ) : (
                      <div className="rounded-lg bg-amber-500/5 border border-amber-500/25 p-3 text-xs text-amber-600 flex gap-2">
                        <AlertTriangle className="h-4 w-4 shrink-0" />
                        <span>The token algorithm is set to <strong>{String(decoded.header.alg)}</strong>, which does not support standard cryptographic key verification in this tool.</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-xs text-muted-foreground py-4 text-center">
                    Enter a token to configure verification
                  </div>
                )}

                {/* Status Indicator */}
                {token.trim() && (
                  <div className="border-t border-border pt-4">
                    {verificationResult.verified === true ? (
                      <div className="rounded-xl border border-green-500/30 bg-green-500/5 p-3 text-xs text-green-600 dark:text-green-400 flex items-start gap-2.5 font-medium animate-fade-in">
                        <ShieldCheck className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold">Signature Verified</p>
                          <p className="text-[10px] text-muted-foreground mt-0.5">The signature matches the payload. The integrity of this token is cryptographically confirmed.</p>
                        </div>
                      </div>
                    ) : verificationResult.verified === false ? (
                      <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-xs text-destructive flex items-start gap-2.5 font-medium animate-fade-in">
                        <ShieldAlert className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold">Invalid Signature</p>
                          <p className="text-[10px] text-muted-foreground mt-0.5">
                            {verificationResult.error || "The signature does not match the payload. The token structure might be correct, but the keys do not align or the token has been altered."}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="rounded-xl border border-border bg-muted/30 p-3 text-xs text-muted-foreground flex items-start gap-2.5 animate-fade-in">
                        <Info className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-foreground">Signature Verification Pending</p>
                          <p className="text-[10px] text-muted-foreground mt-0.5">
                            {verificationResult.error || "Please enter the matching secret or public key to verify this token's authenticity."}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

          </div>

          {/* RIGHT SIDE: Decoded breakdown and details (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-6">

            {/* Token Meta Status Ribbon */}
            {token.trim() && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                
                {/* Alg metadata card */}
                <div className="border border-border rounded-xl p-3.5 bg-card flex flex-col gap-1 shadow-sm">
                  <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Algorithm</span>
                  <div className="flex items-center justify-between mt-0.5">
                    <span className="font-bold text-foreground font-mono text-sm">
                      {decoded.header?.alg ? String(decoded.header.alg) : "-"}
                    </span>
                    <Badge variant="outline" className="text-[10px]">
                      {decoded.header?.typ ? String(decoded.header.typ) : "JWT"}
                    </Badge>
                  </div>
                </div>

                {/* Expiration Card */}
                <div className="border border-border rounded-xl p-3.5 bg-card flex flex-col gap-1 shadow-sm sm:col-span-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Token Expiry Status</span>
                    {tokenStatus === "active" && (
                      <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/10 border-green-500/25 border font-semibold text-[10px]">
                        ✓ Active
                      </Badge>
                    )}
                    {tokenStatus === "expired" && (
                      <Badge variant="destructive" className="font-semibold text-[10px]">
                        ✕ Expired
                      </Badge>
                    )}
                    {tokenStatus === "no-exp" && (
                      <Badge variant="outline" className="text-[10px]">No exp Claim</Badge>
                    )}
                    {tokenStatus === "invalid" && (
                      <Badge variant="destructive" className="text-[10px]">Error</Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mt-1.5">
                    <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="text-xs font-semibold text-foreground">
                      {tokenStatus === "active" && timeRemaining !== null && (
                        <span>{formatDuration(timeRemaining)} remaining</span>
                      )}
                      {tokenStatus === "expired" && timeRemaining !== null && (
                        <span className="text-destructive font-medium">Expired {formatDuration(timeRemaining)} ago</span>
                      )}
                      {tokenStatus === "no-exp" && (
                        <span className="text-muted-foreground text-xs">This token has no expiration timestamp.</span>
                      )}
                      {tokenStatus === "invalid" && (
                        <span className="text-destructive text-xs">Invalid token structure.</span>
                      )}
                    </span>
                  </div>

                  {/* Expiry Lifespan Progress Bar */}
                  {tokenStatus === "active" && hasExp && hasIat && (
                    <div className="w-full bg-muted rounded-full h-1.5 mt-2.5 overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-1000 ${
                          getProgressPercent() < 15 
                            ? "bg-gradient-to-r from-red-500 to-amber-500 animate-pulse" 
                            : "bg-gradient-to-r from-green-500 to-emerald-400"
                        }`}
                        style={{ width: `${getProgressPercent()}%` }}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Decoded tabs views */}
            <div className="flex flex-col gap-2.5">
              <Tabs defaultValue="payload" className="w-full flex flex-col h-full">
                <div className="flex items-center justify-between mb-1.5">
                  <TabsList className="grid w-auto grid-cols-3 h-9">
                    <TabsTrigger value="payload" className="text-xs px-3.5">
                      Payload
                    </TabsTrigger>
                    <TabsTrigger value="header" className="text-xs px-3.5">
                      Header
                    </TabsTrigger>
                    <TabsTrigger value="explorer" className="text-xs px-3.5">
                      Tree Explorer
                    </TabsTrigger>
                  </TabsList>

                  <div className="flex items-center gap-1.5">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleCopy(
                        decoded.payloadRaw ? JSON.stringify(decoded.payload, null, 2) : "", 
                        "Payload"
                      )}
                      className="h-8 w-8 rounded-lg"
                      title="Copy payload JSON"
                      disabled={!decoded.payloadRaw}
                    >
                      {copiedPart === "Payload" ? <Check className="h-4 w-4 text-green-500" /> : <Clipboard className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                {/* --- TAB CONTENT: PAYLOAD --- */}
                <TabsContent value="payload" className="flex-1 mt-0">
                  <div className="border border-border rounded-xl bg-muted/10 p-4 min-h-[300px] max-h-[420px] overflow-y-auto relative">
                    {decoded.payloadRaw ? (
                      <div className="flex flex-col gap-1.5">
                        <pre
                          className="font-mono text-xs leading-relaxed whitespace-pre-wrap select-text"
                          dangerouslySetInnerHTML={{ __html: highlightJson(JSON.stringify(decoded.payload, null, 2), "payload") }}
                        />
                      </div>
                    ) : (
                      <div className="h-full flex items-center justify-center text-muted-foreground text-xs py-28 border border-dashed border-border/80 rounded-xl">
                        Decoded payload JSON will appear here...
                      </div>
                    )}
                  </div>
                </TabsContent>

                {/* --- TAB CONTENT: HEADER --- */}
                <TabsContent value="header" className="flex-1 mt-0">
                  <div className="border border-border rounded-xl bg-muted/10 p-4 min-h-[300px] max-h-[420px] overflow-y-auto relative">
                    {decoded.headerRaw ? (
                      <pre
                        className="font-mono text-xs leading-relaxed whitespace-pre-wrap select-text"
                        dangerouslySetInnerHTML={{ __html: highlightJson(JSON.stringify(decoded.header, null, 2), "header") }}
                      />
                    ) : (
                      <div className="h-full flex items-center justify-center text-muted-foreground text-xs py-28 border border-dashed border-border/80 rounded-xl">
                        Decoded header JSON will appear here...
                      </div>
                    )}
                  </div>
                </TabsContent>

                {/* --- TAB CONTENT: EXPLORER --- */}
                <TabsContent value="explorer" className="flex-1 mt-0">
                  <div className="border border-border rounded-xl bg-muted/10 p-4 min-h-[300px] max-h-[420px] overflow-y-auto">
                    {decoded.payload || decoded.header ? (
                      <div className="flex flex-col gap-4 p-1 select-none">
                        <div>
                          <h4 className="text-xs font-semibold text-rose-500 font-mono mb-2 border-b border-border/60 pb-1 uppercase tracking-wide">
                            Header
                          </h4>
                          <JSONTree data={decoded.header} />
                        </div>
                        <div className="mt-2">
                          <h4 className="text-xs font-semibold text-violet-500 font-mono mb-2 border-b border-border/60 pb-1 uppercase tracking-wide">
                            Payload
                          </h4>
                          <JSONTree data={decoded.payload} />
                        </div>
                      </div>
                    ) : (
                      <div className="h-full flex items-center justify-center text-muted-foreground text-xs py-28 border border-dashed border-border/80 rounded-xl">
                        Tree explorer nodes will appear here...
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Claims Explanation Table */}
            {decoded.payload && (
              <div className="flex flex-col gap-3">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
                  <Info className="h-4.5 w-4.5 text-muted-foreground" />
                  Claims Breakdown
                </h3>
                
                <div className="border border-border rounded-xl overflow-x-auto bg-card shadow-sm">
                  <div className="max-h-[220px] overflow-y-auto">
                    <table className="min-w-full divide-y divide-border text-xs">
                      <thead className="bg-muted/40 font-medium text-muted-foreground sticky top-0 border-b border-border z-10">
                        <tr>
                          <th className="px-4 py-2 text-left">Claim</th>
                          <th className="px-4 py-2 text-left">Interpretation / Meaning</th>
                          <th className="px-4 py-2 text-left">Value</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/60">
                        {/* Header Claims */}
                        {Object.entries(decoded.header || {}).map(([key, val]) => (
                          <tr key={`header-${key}`} className="hover:bg-muted/15">
                            <td className="px-4 py-2.5 font-mono font-semibold text-rose-500 whitespace-nowrap">
                              {key}
                            </td>
                            <td className="px-4 py-2.5 text-muted-foreground">
                              {claimDescriptions[key] || "Custom header property"}
                            </td>
                            <td className="px-4 py-2.5 font-mono text-[11px] text-foreground font-medium break-all">
                              {JSON.stringify(val)}
                            </td>
                          </tr>
                        ))}

                        {/* Payload Claims */}
                        {Object.entries(decoded.payload || {}).map(([key, val]) => {
                          const isTimestamp = (key === "exp" || key === "iat" || key === "nbf" || key === "auth_time" || key === "updated_at");
                          return (
                            <tr key={`payload-${key}`} className="hover:bg-muted/15">
                              <td className="px-4 py-2.5 font-mono font-semibold text-violet-500 whitespace-nowrap">
                                {key}
                              </td>
                              <td className="px-4 py-2.5 text-muted-foreground">
                                {claimDescriptions[key] || "Custom claim payload property"}
                              </td>
                              <td className="px-4 py-2.5 font-mono text-[11px] text-foreground font-medium break-all">
                                {isTimestamp ? (
                                  <div className="flex flex-col gap-0.5">
                                    <span>{String(val)}</span>
                                    <span className="text-[10px] text-muted-foreground font-sans">
                                      ({formatTimestamp(val)})
                                    </span>
                                  </div>
                                ) : (
                                  JSON.stringify(val)
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Error box */}
            {decoded.error && (
              <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-xs text-destructive font-mono leading-relaxed shadow-sm">
                <p className="font-semibold mb-1 flex items-center gap-1.5 text-sm">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  Structure Error
                </p>
                <p className="mt-1.5">{decoded.error}</p>
              </div>
            )}
            
          </div>
          
        </div>
      </div>
    </TooltipProvider>
  );
}
