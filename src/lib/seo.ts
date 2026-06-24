export function generateToolSchema(tool: {
  title: string;
  description: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": tool.title,
    "description": tool.description,
    "url": tool.url,
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "All",
  };
}
