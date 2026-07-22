import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://lenava.io";

  return [
    { url: `${baseUrl}/` },
    { url: `${baseUrl}/assessment` },
    { url: `${baseUrl}/contact` },
  ];
}
