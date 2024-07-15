    import { skipWaiting, clientsClaim } from 'workbox-core';
    import { ExpirationPlugin } from 'workbox-expiration';
    import { NetworkOnly, NetworkFirst, CacheFirst, StaleWhileRevalidate } from 'workbox-strategies';
    import { registerRoute, setDefaultHandler, setCatchHandler } from 'workbox-routing';
    import { matchPrecache, precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching';
    import { BackgroundSyncPlugin } from 'workbox-background-sync';

    // Force the waiting service worker to become the active service worker
    skipWaiting();
    // Claim control of any clients immediately
    clientsClaim();

    // Precache files listed in WB_MANIFEST and clean up outdated caches
    const WB_MANIFEST = self.__WB_MANIFEST || [];
    WB_MANIFEST.push(
        { url: '/offline', revision: '1234567890' },  // Add your offline page here
        { url: '/icons/site.webmanifest', revision: '1234567890' }
    );


    // Define offline fallback page
    const offlineFallbackPage = '/offline';


    cleanupOutdatedCaches();
    precacheAndRoute(WB_MANIFEST);

    registerRoute(
        '/icons/site.webmanifest',
        new CacheFirst({
            cacheName: 'manifest-cache',
            plugins: [
                new ExpirationPlugin({
                    maxEntries: 1,
                    maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
                }),
            ],
        }),
        'GET'
    );

    // Register route for caching icons
    registerRoute(
        new RegExp('/icons/.*'),
        new CacheFirst({
            cacheName: 'icons-cache',
            plugins: [
                new ExpirationPlugin({
                    maxEntries: 20,
                    maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
                    purgeOnQuotaError: true,
                }),
            ],
        }),
        'GET'
    );


    registerRoute(
        new RegExp('/images/.*'),
        new CacheFirst({
            cacheName: 'images-cache',
            plugins: [
                new ExpirationPlugin({
                    maxEntries: 20,
                    maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
                    purgeOnQuotaError: true,
                }),
            ],
        }),
        'GET'
    );

    // Initialize BackgroundSyncPlugin for retrying failed POST requests
    const bgSyncPlugin = new BackgroundSyncPlugin('apiPostQueue', {
        maxRetentionTime: 24 * 60, // Retry for max of 24 hours
    });


    // Register route for POST requests to /api/.* with background sync
    registerRoute(
        new RegExp('/api/.*', 'i'), // Improved regex for readability
        new NetworkOnly({
            plugins: [bgSyncPlugin], // Attach BackgroundSyncPlugin to handle retries
        }),
        'POST'
    );


    // Register route for GET requests to /api/.* with network-first strategy
    registerRoute(
        /\/api\/.*$/i,
        new NetworkFirst({
            cacheName: 'api-cache',
            networkTimeoutSeconds: 10,
            plugins: [
                new ExpirationPlugin({
                    maxEntries: 16,
                    maxAgeSeconds: 86400,
                    purgeOnQuotaError: true,
                }),
            ],
        }),
        'GET'
    );

    // Register route for the homepage with network-first strategy
    registerRoute(
        '/',
        new NetworkFirst({
            cacheName: 'start-url',
            plugins: [
                new ExpirationPlugin({
                    maxEntries: 1,
                    maxAgeSeconds: 86400,
                    purgeOnQuotaError: true,
                }),
            ],
        }),
        'GET'
    );



    // Register route for Google Fonts with cache-first strategy
    registerRoute(
        /^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*/i,
        new CacheFirst({
            cacheName: 'google-fonts',
            plugins: [
                new ExpirationPlugin({
                    maxEntries: 4,
                    maxAgeSeconds: 31536000, // 1 year
                    purgeOnQuotaError: true,
                }),
            ],
        }),
        'GET'
    );

    // Register route for font assets with stale-while-revalidate strategy
    registerRoute(
        /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
        new StaleWhileRevalidate({
            cacheName: 'static-font-assets',
            plugins: [
                new ExpirationPlugin({
                    maxEntries: 4,
                    maxAgeSeconds: 604800, // 1 week
                    purgeOnQuotaError: true,
                }),
            ],
        }),
        'GET'
    );

    // Register route for image assets with network-only strategy to observe placeholder images offline
    registerRoute(
        /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
        new NetworkOnly({
            cacheName: 'static-image-assets',
            plugins: [
                new ExpirationPlugin({
                    maxEntries: 64,
                    maxAgeSeconds: 86400,
                    purgeOnQuotaError: true,
                }),
            ],
        }),
        'GET'
    );

    // Register route for JavaScript assets with stale-while-revalidate strategy
    registerRoute(
        /\.(?:js)$/i,
        new StaleWhileRevalidate({
            cacheName: 'static-js-assets',
            plugins: [
                new ExpirationPlugin({
                    maxEntries: 32,
                    maxAgeSeconds: 86400,
                    purgeOnQuotaError: true,
                }),
            ],
        }),
        'GET'
    );

    // Register route for CSS and Less assets with stale-while-revalidate strategy
    registerRoute(
        /\.(?:css|less)$/i,
        new StaleWhileRevalidate({
            cacheName: 'static-style-assets',
            plugins: [
                new ExpirationPlugin({
                    maxEntries: 32,
                    maxAgeSeconds: 86400,
                    purgeOnQuotaError: true,
                }),
            ],
        }),
        'GET'
    );

    // Register route for JSON, XML, and CSV assets with network-first strategy
    registerRoute(
        /\.(?:json|xml|csv|pdf|doc|docx)$/i,
        new NetworkFirst({
            cacheName: 'static-data-assets',
            plugins: [
                new ExpirationPlugin({
                    maxEntries: 32,
                    maxAgeSeconds: 86400,
                    purgeOnQuotaError: true,
                }),
            ],
        }),
        'GET'
    );

    // Register a default route for all other requests with network-first strategy
    registerRoute(
        /.*/i,
        new NetworkFirst({
            cacheName: 'others',
            networkTimeoutSeconds: 10,
            plugins: [
                new ExpirationPlugin({
                    maxEntries: 32,
                    maxAgeSeconds: 86400,
                    purgeOnQuotaError: true,
                }),
            ],
        }),
        'GET'
    );

    registerRoute(
        /\/_next\/static\/css\/.*\.css$/,
        new CacheFirst({
            cacheName: 'css-cache',
            plugins: [
                new ExpirationPlugin({
                    maxEntries: 10,
                    maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
                    purgeOnQuotaError: true,
                }),
            ],
        }),
        'GET'
    );

    // Set default handler to use stale-while-revalidate strategy for all other requests
    setDefaultHandler(new StaleWhileRevalidate());

    // Set catch handler to provide fallback responses when routes fail
    setCatchHandler(async ({ event }) => {
        switch (event.request.destination) {
            case 'document':
                try {
                    const response = await matchPrecache(event.request);
                    if (response) {
                        return response;
                    } else {
                        // If not precached, fallback to offline page
                        return caches.match(offlineFallbackPage);
                    }
                } catch (error) {
                    // If matchPrecache fails, fallback to offline page
                    return caches.match(offlineFallbackPage);
                }
            case 'image':
                return caches.match('/images/fallback.png');
            default:
                return Response.error();
        }
    });
