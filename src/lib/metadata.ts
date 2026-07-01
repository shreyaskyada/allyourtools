import { Metadata } from "next";

export function createMetadata(
  title: string,
  description: string,
  options?: {
    canonical?: string;
    ogImage?: string;
    noIndex?: boolean;
  }
): Metadata {
  const siteName = "AllYourTools";
  const defaultTitle = `${title} | ${siteName}`;

  return {
    title: defaultTitle,
    description,
    metadataBase: new URL("https://allyourtools.app"),
    alternates: {
      canonical: options?.canonical || "/",
    },
    openGraph: {
      title: defaultTitle,
      description,
      type: "website",
      siteName,
      images: [
        {
          url: options?.ogImage || "/og-image.png",
          width: 1200,
          height: 630,
          alt: defaultTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: defaultTitle,
      description,
      images: [options?.ogImage || "/og-image.png"],
    },
    robots: {
      index: !options?.noIndex,
      follow: !options?.noIndex,
    },
  };
}
