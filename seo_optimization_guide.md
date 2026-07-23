# SEO Optimization Guide for Toolverse Tools

This guide provides a standardized SEO blueprint to optimize every tool in the Toolverse catalog. Following this checklist ensures search engines can easily discover, crawl, and rank each utility.

---

## 1. On-Page SEO Checklist

Every tool page must follow strict semantic HTML structures and metadata templates to rank for high-intent search queries.

### A. Meta Tags & Titles
| Element | Recommended Length | Template Example |
| :--- | :--- | :--- |
| **Title Tag** | 50–60 characters | `[Tool Name] Online - Free & Instant \| Toolverse` <br> *Example:* `JSON Formatter Online - Free & Instant \| Toolverse` |
| **Meta Description** | 120–155 characters | `Best online [Tool Name]. [Action verb] your [data/images/files] client-side instantly. 100% secure, private, and free to use.` |

### B. Heading (HTML5) Hierarchy
Ensure the page layout has exactly one `<h1>` tag containing the primary search target:
- `<h1>`: `JSON Formatter & Validator` (Primary search keyword)
- `<h2>`: `How to use the JSON Formatter` (Secondary keyword / instructional)
- `<h2>`: `Key Features of our Tool` (Features & benefits)
- `<h2>`: `Frequently Asked Questions` (Accordion section for Rich Snippets)

---

## 2. Dynamic SEO Landing Pages (PNG to JPEG, etc.)

For tools with multiple configurations (like the Image Converter), create dedicated routes to match specific queries.

```
apps/web/app/tools/image-converter/
  ├── page.tsx                    # Matches "Image Converter"
  └── [conversion]/
        └── page.tsx              # Matches "png-to-jpeg", "webp-to-png", etc.
```

Inside `[conversion]/page.tsx`, statically pre-generate params:
```typescript
export async function generateStaticParams() {
  return [
    { conversion: 'png-to-jpeg' },
    { conversion: 'heic-to-jpeg' },
    { conversion: 'webp-to-png' }
  ];
}
```
*Note: Set the default selection state of the UI matching the URL parameter.*

---

## 3. Rich Schema Markup (JSON-LD)

Structured data helps search engines understand the tool's exact function and display Rich Results (FAQs, Software rating stars). Inject JSON-LD into the head of your pages:

### WebApplication Schema
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "JSON Formatter",
  "url": "https://toolverse.one/tools/json-formatter",
  "applicationCategory": "DeveloperApplication",
  "operatingSystem": "All",
  "browserRequirements": "Requires JavaScript. Requires HTML5.",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  }
}
</script>
```

### FAQPage Schema
Include this schema on the page if you have an FAQ accordion:
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [{
    "@type": "Question",
    "name": "Is my data sent to any servers?",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "No, all formatting and parsing operations run entirely client-side in your browser. Your data never leaves your computer."
    }
  }]
}
</script>
```

---

## 4. Semantic Content Requirements

To satisfy Google's **Helpful Content System**, a tool page must contain readable explanations alongside the interactive widget.

1. **How-To Section**: A numbered list outlining the steps to use the tool.
2. **Technical Details**: Brief paragraphs outlining the technical standards used (e.g. *“Uses the browser Canvas API for compression”*).
3. **Privacy Statement**: Explicit notice confirming that processing occurs client-side.

---

## 5. Technical Requirements Checklist

- [ ] **Static Generation (`○` or `●`)**: Build the route statically. Do not use dynamic imports or runtime SSR calls that block rendering.
- [ ] **Sitemap (`sitemap.xml`)**: Add the tool's URL to Next.js's dynamic sitemap builder (`app/sitemap.ts`).
- [ ] **Robots (`robots.txt`)**: Verify the path is not accidentally blocked.
- [ ] **Image Alt Text**: Verify all icons and illustrative images have meaningful `alt` descriptions.
