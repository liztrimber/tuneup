import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Tuneup",
    short_name: "Tuneup",
    description: "Weekly conversations for busy parents",
    start_url: "/",
    display: "standalone",
    background_color: "#F8FAFC",
    theme_color: "#F8FAFC",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
