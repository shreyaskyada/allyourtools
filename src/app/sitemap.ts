import { MetadataRoute } from "next";
import { tools } from "@/config/tools";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://toolverse.com";
  
  const toolUrls = tools.map((tool) => ({
    url: `${baseUrl}/tools/${tool.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1.0,
    },
    ...toolUrls,
  ];
}
