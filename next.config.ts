import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // cacheComponents is off: it rejects the explicit `runtime = "nodejs"` on the streaming
  // route, and this single client-rendered page has nothing to cache.
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
