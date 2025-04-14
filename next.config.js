/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  webpack: (config, { isServer }) => {
    // Handle missing modules by providing empty modules
    config.resolve.fallback = {
      ...config.resolve.fallback,
      '@/components/ui/use-toast': false,
      '@/components/ui/table': false,
      '@/components/ui/radio-group': false,
      '@/components/ui/SchoolCombobox': false,
    };
    return config;
  },
};

module.exports = nextConfig;
