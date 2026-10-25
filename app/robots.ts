import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/settings"],
    },
    sitemap: "https://vibecheck.campus.edu/sitemap.xml",
  };
}
