import withPWAInit from "@ducanh2912/next-pwa";
import webpack from "webpack";

const withPWA = withPWAInit({
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  extendDefaultRuntimeCaching: true,
  reloadOnOnline: true,
  swcMinify: true,
  dest: "public",
  customWorkerSrc: "service-worker",
  customWorkerDest: "public",
  customWorkerPrefix: "sw",
  register: true,
  skipWaiting: true,
  fallbacks: {
    document: "/offline",
  },
  workboxOptions: {
    disableDevLogs: true,
    runtimeCaching: [
      // Your runtimeCaching array
    ],
  },
});

export default withPWA({
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.pexels.com" },
      { protocol: "https", hostname: "*.itexpertnow.com" },
      { protocol: "https", hostname: "itexpertnow.com" },
    ],
  },
  webpack(config) {
    config.plugins.push(
      new webpack.NormalModuleReplacementPlugin(
        /^isomorphic-form-data$/,
        `${config.context}/form-data-mock.js`
      )
    );
    return config;
  },
  env:{
    test:"test123"
  }
});
