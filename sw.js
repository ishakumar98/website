// Service Worker for Portfolio Website
// Provides offline support, intelligent caching, and performance optimization

const CACHE_NAME = 'portfolio-v1.0.0';
const STATIC_CACHE = 'portfolio-static-v1.0.0';
const DYNAMIC_CACHE = 'portfolio-dynamic-v1.0.0';
const IMAGE_CACHE = 'portfolio-images-v1.0.0';

// Cache strategies
const CACHE_STRATEGIES = {
    STATIC: 'cache-first',
    DYNAMIC: 'stale-while-revalidate',
    IMAGES: 'cache-first',
    API: 'network-first'
};

// Files to cache immediately
const STATIC_FILES = [
    '/',
    '/',
    '/calendar-project.html',
    '/project-template.html',
            '/js/css/main.css',

    '/js/scroll-manager.js',
    '/js/event-manager.js',
    '/js/animation-coordinator.js',
    '/js/script.js',
    '/js/scroll-behavior.js',
            '/js/homepage/fireworks.js',
    
    '/js/image-optimizer.js',
    '/js/font-optimizer.js',
    '/js/css-optimizer.js',
    '/js/performance-monitor.js',
    '/js/performance-manager.js',
    '/js/css/variables.css',
    '/js/css/utilities.css',
    '/js/css/typography.css',
    '/js/css/layout.css',
    '/js/css/components.css',
    '/js/css/main.css',
    '/fonts/akke-trial/variable/AkkeVariable[XHGT,opsz,wdth,wght].ttf',
    '/fonts/Tumla-trial/variable/Tumla-TRIALVariableVF.ttf',
    '/images/folder.svg',
    '/images/text-file-icon.png',
    '/images/text-file-icon.svg'
];

// Install event - cache static files
self.addEventListener('install', event => {
    
    
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then(cache => {
        
                return cache.addAll(STATIC_FILES);
            })
            .then(() => {
        
                return self.skipWaiting();
            })
            .catch(error => {
                // Handle cache error silently
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    
    
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (cacheName !== STATIC_CACHE && 
                            cacheName !== DYNAMIC_CACHE && 
                            cacheName !== IMAGE_CACHE) {
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                return self.clients.claim();
            })
    );
});

// Fetch event - handle all network requests
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }
    
    // Handle different types of requests
    if (isImageRequest(request)) {
        event.respondWith(handleImageRequest(request));
    } else if (isStaticRequest(request)) {
        event.respondWith(handleStaticRequest(request));
    } else if (isAPIRequest(request)) {
        event.respondWith(handleAPIRequest(request));
    } else {
        event.respondWith(handleDynamicRequest(request));
    }
});

// Check if request is for an image
function isImageRequest(request) {
    const url = new URL(request.url);
    return url.pathname.match(/\.(png|jpg|jpeg|gif|svg|webp)$/i) ||
           url.pathname.includes('/images/');
}

// Check if request is for static assets
function isStaticRequest(request) {
    const url = new URL(request.url);
    return url.pathname.match(/\.(css|js|ttf|woff|woff2)$/i) ||
           url.pathname.includes('/fonts/') ||
           url.pathname.includes('/js/');
}

// Check if request is for API
function isAPIRequest(request) {
    const url = new URL(request.url);
    return url.pathname.includes('/api/') ||
           url.pathname.includes('project-data.json');
}

// Handle image requests with cache-first strategy
async function handleImageRequest(request) {
    try {
        // Try cache first
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // If not in cache, fetch from network
        const networkResponse = await fetch(request);
        
        // Cache the response for future use
        if (networkResponse.ok) {
            const cache = await caches.open(IMAGE_CACHE);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        // Return fallback image if available
        const fallbackResponse = await caches.match('/images/placeholder.png');
        if (fallbackResponse) {
            return fallbackResponse;
        }
        
        // Return a simple text response as last resort
        return new Response('Image not available', {
            status: 404,
            statusText: 'Not Found'
        });
    }
}

// Handle static requests with cache-first strategy
async function handleStaticRequest(request) {
    try {
        // Try cache first
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // If not in cache, fetch from network
        const networkResponse = await fetch(request);
        
        // Cache the response for future use
        if (networkResponse.ok) {
            const cache = await caches.open(STATIC_CACHE);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        return new Response('Asset not available', {
            status: 404,
            statusText: 'Not Found'
        });
    }
}

// Handle API requests with network-first strategy
async function handleAPIRequest(request) {
    try {
        // Try network first
        const networkResponse = await fetch(request);
        
        // Cache successful responses
        if (networkResponse.ok) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        // Try cache as fallback
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        return new Response('API not available offline', {
            status: 503,
            statusText: 'Service Unavailable'
        });
    }
}

// Handle dynamic requests with stale-while-revalidate strategy
async function handleDynamicRequest(request) {
    try {
        // Try cache first for immediate response
        const cachedResponse = await caches.match(request);
        
        // Fetch from network in background
        const networkPromise = fetch(request).then(async response => {
            if (response.ok) {
                const cache = await caches.open(DYNAMIC_CACHE);
                cache.put(request, response.clone());
            }
            return response;
        }).catch(() => null);
        
        // Return cached response if available, otherwise wait for network
        if (cachedResponse) {
            return cachedResponse;
        }
        
        return await networkPromise;
    } catch (error) {
        return new Response('Content not available', {
            status: 404,
            statusText: 'Not Found'
        });
    }
}

// Background sync for offline actions
self.addEventListener('sync', event => {
    if (event.tag === 'background-sync') {
        event.waitUntil(performBackgroundSync());
    }
});

// Perform background sync tasks
async function performBackgroundSync() {
    try {
        // Sync any pending data
        
        // You can add specific sync logic here
        // For example, syncing form submissions, analytics, etc.
        
    } catch (error) {
        // Handle background sync error silently
    }
}

// Push notification handling
self.addEventListener('push', event => {
    if (event.data) {
        const data = event.data.json();
        const options = {
            body: data.body || 'New update available',
            icon: '/images/folder.svg',
            badge: '/images/folder.svg',
            tag: 'portfolio-update',
            data: data
        };
        
        event.waitUntil(
            self.registration.showNotification('Portfolio Update', options)
        );
    }
});

// Notification click handling
self.addEventListener('notificationclick', event => {
    event.notification.close();
    
    event.waitUntil(
        clients.openWindow('/')
    );
});

// Message handling for communication with main thread
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'GET_CACHE_STATUS') {
        event.ports[0].postMessage({
            type: 'CACHE_STATUS',
            data: {
                staticCache: STATIC_CACHE,
                dynamicCache: DYNAMIC_CACHE,
                imageCache: IMAGE_CACHE
            }
        });
    }
});

// Error handling
self.addEventListener('error', event => {
    // Handle service worker error silently
});

// Unhandled rejection handling
self.addEventListener('unhandledrejection', event => {
    // Handle unhandled rejection silently
});
