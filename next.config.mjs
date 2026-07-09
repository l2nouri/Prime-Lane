/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // @supabase/supabase-js feature-detects the runtime via a
    // `typeof process !== "undefined" ? process.version : ...` guard, used only
    // to build an internal telemetry string. It's a no-op in Edge Runtime, but
    // Next's edge bundler flags any static `process.version` reference as a
    // warning regardless of the guard. Known, benign, upstream limitation.
    config.ignoreWarnings = [
      ...(config.ignoreWarnings ?? []),
      {
        module: /node_modules\/@supabase\/supabase-js/,
        message: /A Node\.js API is used \(process\.version/,
      },
    ];
    return config;
  },
};

export default nextConfig;
