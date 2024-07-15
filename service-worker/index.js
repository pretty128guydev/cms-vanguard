import { clientsClaim } from "workbox-core";
import { ExpirationPlugin } from "workbox-expiration";
import {
  NetworkOnly,
  NetworkFirst,
  CacheFirst,
  StaleWhileRevalidate,
} from "workbox-strategies";
import {
  registerRoute,
  setDefaultHandler,
  setCatchHandler,
} from "workbox-routing";
import {
  matchPrecache,
  precacheAndRoute,
  cleanupOutdatedCaches,
} from "workbox-precaching";
import { BackgroundSyncPlugin } from "workbox-background-sync";

// Force the waiting service worker to become the active service worker
self.skipWaiting();
// Claim control of any clients immediately
clientsClaim();

// Precache files listed in WB_MANIFEST and clean up outdated caches
const WB_MANIFEST = self.__WB_MANIFEST || [];


WB_MANIFEST.push(
  { url: "/offline", revision: "1234567890" },
  { url: "/icons/site.webmanifest", revision: "1234567890" }
);

cleanupOutdatedCaches();
precacheAndRoute(WB_MANIFEST);

registerRoute(
  "/icons/site.webmanifest",
  new CacheFirst({
    cacheName: "manifest-cache",
    plugins: [
      new ExpirationPlugin({
        maxEntries: 1,
        maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
      }),
    ],
  }),
  "GET"
);

// Register route for caching icons
registerRoute(
  new RegExp("/icons/.*"),
  new CacheFirst({
    cacheName: "icons-cache",
    plugins: [
      new ExpirationPlugin({
        maxEntries: 20,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
        purgeOnQuotaError: true,
      }),
    ],
  }),
  "GET"
);

registerRoute(
  new RegExp("/images/.*"),
  new CacheFirst({
    cacheName: "images-cache",
    plugins: [
      new ExpirationPlugin({
        maxEntries: 20,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
        purgeOnQuotaError: true,
      }),
    ],
  }),
  "GET"
);

// Initialize BackgroundSyncPlugin for retrying failed POST requests
const bgSyncPlugin = new BackgroundSyncPlugin("apiPostQueue", {
  maxRetentionTime: 24 * 60, // Retry for max of 24 hours
});

// Register route for POST requests to /api/.* with background sync
registerRoute(
  new RegExp("/api/.*", "i"), // Improved regex for readability
  new NetworkOnly({
    plugins: [bgSyncPlugin], // Attach BackgroundSyncPlugin to handle retries
  }),
  "POST"
);

// Register route for GET requests to /api/.* with network-first strategy
registerRoute(
  /\/api\/.*$/i,
  new NetworkFirst({
    cacheName: "api-cache",
    networkTimeoutSeconds: 10,
    plugins: [
      new ExpirationPlugin({
        maxEntries: 16,
        maxAgeSeconds: 86400,
        purgeOnQuotaError: true,
      }),
    ],
  }),
  "GET"
);

// Register route for the homepage with network-first strategy
registerRoute(
  "/",
  new NetworkFirst({
    cacheName: "start-url",
    plugins: [
      new ExpirationPlugin({
        maxEntries: 1,
        maxAgeSeconds: 86400,
        purgeOnQuotaError: true,
      }),
    ],
  }),
  "GET"
);

// Register route for Google Fonts with cache-first strategy
registerRoute(
  /^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*/i,
  new CacheFirst({
    cacheName: "google-fonts",
    plugins: [
      new ExpirationPlugin({
        maxEntries: 4,
        maxAgeSeconds: 31536000, // 1 year
        purgeOnQuotaError: true,
      }),
    ],
  }),
  "GET"
);

// Register route for font assets with stale-while-revalidate strategy
registerRoute(
  /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
  new StaleWhileRevalidate({
    cacheName: "static-font-assets",
    plugins: [
      new ExpirationPlugin({
        maxEntries: 4,
        maxAgeSeconds: 604800, // 1 week
        purgeOnQuotaError: true,
      }),
    ],
  }),
  "GET"
);

// Register route for image assets with network-only strategy to observe placeholder images offline
registerRoute(
  /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
  new NetworkOnly({
    cacheName: "static-image-assets",
    plugins: [
      new ExpirationPlugin({
        maxEntries: 64,
        maxAgeSeconds: 86400,
        purgeOnQuotaError: true,
      }),
    ],
  }),
  "GET"
);

// Register route for JavaScript assets with stale-while-revalidate strategy
registerRoute(
  /\.(?:js)$/i,
  new StaleWhileRevalidate({
    cacheName: "static-js-assets",
    plugins: [
      new ExpirationPlugin({
        maxEntries: 32,
        maxAgeSeconds: 86400,
        purgeOnQuotaError: true,
      }),
    ],
  }),
  "GET"
);

// Register route for CSS and Less assets with stale-while-revalidate strategy
registerRoute(
  /\.(?:css|less)$/i,
  new StaleWhileRevalidate({
    cacheName: "static-style-assets",
    plugins: [
      new ExpirationPlugin({
        maxEntries: 32,
        maxAgeSeconds: 86400,
        purgeOnQuotaError: true,
      }),
    ],
  }),
  "GET"
);

// Register route for JSON, XML, and CSV assets with network-first strategy
registerRoute(
  /\.(?:json|xml|csv|pdf|doc|docx)$/i,
  new NetworkFirst({
    cacheName: "static-data-assets",
    plugins: [
      new ExpirationPlugin({
        maxEntries: 32,
        maxAgeSeconds: 86400,
        purgeOnQuotaError: true,
      }),
    ],
  }),
  "GET"
);

// Register a default route for all other requests with network-first strategy
registerRoute(
  /.*/i,
  new NetworkFirst({
    cacheName: "others",
    networkTimeoutSeconds: 10,
    plugins: [
      new ExpirationPlugin({
        maxEntries: 32,
        maxAgeSeconds: 86400,
        purgeOnQuotaError: true,
      }),
    ],
  }),
  "GET"
);

registerRoute(
  /\/_next\/static\/css\/.*\.css$/,
  new CacheFirst({
    cacheName: "css-cache",
    plugins: [
      new ExpirationPlugin({
        maxEntries: 10,
        maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
        purgeOnQuotaError: true,
      }),
    ],
  }),
  "GET"
);



// Set catch handler to provide fallback responses when routes fail
setCatchHandler(async ({ event }) => {
  switch (event.request.destination) {
    case 'document':
      try {
        const response = await matchPrecache(event.request);
        if (response) {
          return response;
        } else {
          const offlinePage = await matchPrecache('/offline');
          if (offlinePage) {
            return offlinePage;
          } else {
            return new Response(
              `
                          <!DOCTYPE html>
                          <html lang="en">
                          <head>
                              <meta charset="UTF-8">
                              <meta name="viewport" content="width=device-width, initial-scale=1.0">
                              <title>Offline Page</title>
                              <style>
                                  body {
                                      display: flex;
                                      justify-content: center;
                                      align-items: center;
                                      height: 100vh;
                                      margin: 0;
                                      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                                      background: linear-gradient(135deg, #f5f7fa, #c3cfe2);
                                      color: #333;
                                  }
                                  .container {
                                      text-align: center;
                                      padding: 40px;
                                      border-radius: 12px;
                                      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
                                      background-color: #fff;
                                      max-width: 400px;
                                      width: 90%;
                                  }
                                  h1 {
                                      font-size: 2.5em;
                                      margin-bottom: 0.5em;
                                      color: #333;
                                  }
                                  p {
                                      font-size: 1.1em;
                                      margin-bottom: 1.5em;
                                      color: #666;
                                  }
                                  .icon {
                                      font-size: 4em;
                                      margin-bottom: 0.5em;
                                      color: #ff6b6b;
                                  }
                                  .btn {
                                      display: inline-block;
                                      padding: 12px 24px;
                                      font-size: 1.1em;
                                      color: #fff;
                                      background-color: #007bff;
                                      border: none;
                                      border-radius: 6px;
                                      text-decoration: none;
                                      cursor: pointer;
                                      transition: background-color 0.3s, transform 0.3s;
                                  }
                                  .btn:hover {
                                      background-color: #0056b3;
                                      transform: scale(1.05);
                                  }
                              </style>
                          </head>
                          <body>
                              <div class="container">
                                  <div class="icon">🚫</div>
                                  <h1>Offline Page</h1>
                                  <p>You are currently offline. Please check your internet connection.</p>
                                  <button class="btn" onclick="goBack()">Go Back</button>
                              </div>
                              <script>
                                  function goBack() {
                                      window.history.back();
                                  }
                              </script>
                          </body>
                          </html>
          
          
                        `,
              {
                headers: {
                  'Content-Type': 'text/html'
                }
              });
          }
        }
      } catch (error) {
        // If matchPrecache fails, fallback to offline page
        return caches.match(offlineFallbackPage);
      }
    case 'image':
      return await matchPrecache('/images/fallback.png');
    default:
      return new Response(`
              <div>
                  <h1>Offline Page</h1>
                  <p>You are currently offline. Please check your internet connection.</p>
              </div>
          `, {
        headers: {
          'Content-Type': 'text/html'
        }
      });
  }
});


// Set default handler to use stale-while-revalidate strategy for all other requests
setDefaultHandler(new StaleWhileRevalidate());
