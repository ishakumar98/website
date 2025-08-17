// Service Worker Manager
// Handles service worker registration, updates, and communication
// Provides offline capabilities and intelligent caching

class ServiceWorkerManager {
    constructor() {
        this.registration = null;
        this.isSupported = 'serviceWorker' in navigator;
        this.updateAvailable = false;
        this.init();
    }

    async init() {
        if (!this.isSupported) {
            return;
        }

        try {
            await this.registerServiceWorker();
            this.setupUpdateHandling();
            this.setupCommunication();
    
        } catch (error) {
            // Handle initialization error silently
        }
    }

    async registerServiceWorker() {
        try {
            this.registration = await navigator.serviceWorker.register('/sw.js', {
                scope: '/'
            });

    

            // Handle updates
            this.registration.addEventListener('updatefound', () => {
        
                this.handleUpdateFound();
            });

            return this.registration;
        } catch (error) {
            throw error;
        }
    }

    setupUpdateHandling() {
        if (!this.registration) return;

        // Check for waiting service worker
        if (this.registration.waiting) {
            this.handleWaitingServiceWorker();
        }

        // Listen for controller change
        navigator.serviceWorker.addEventListener('controllerchange', () => {
    
            this.handleControllerChange();
        });
    }

    handleUpdateFound() {
        const newWorker = this.registration.installing;
        
        newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed') {
                if (navigator.serviceWorker.controller) {
                    // Update available
                    this.updateAvailable = true;
                    this.showUpdateNotification();
                } else {
                    // First time installation
            
                }
            }
        });
    }

    handleWaitingServiceWorker() {
        this.updateAvailable = true;
        this.showUpdateNotification();
    }

    handleControllerChange() {
        // Reload page to use new service worker
        window.location.reload();
    }

    showUpdateNotification() {
        // Create update notification
        const notification = document.createElement('div');
        notification.className = 'service-worker-update-notification';
        notification.innerHTML = `
            <div class="update-content">
                <span>🔄 New version available</span>
                <button onclick="window.serviceWorkerManager.updateServiceWorker()">Update Now</button>
                <button onclick="this.parentElement.parentElement.remove()">Dismiss</button>
            </div>
        `;

        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #333;
            color: white;
            padding: 15px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 10000;
            font-family: -apple-system, BlinkMacSystemFont, sans-serif;
        `;

        notification.querySelector('.update-content').style.cssText = `
            display: flex;
            flex-direction: column;
            gap: 10px;
            align-items: center;
        `;

        notification.querySelectorAll('button').forEach(button => {
            button.style.cssText = `
                padding: 8px 16px;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 14px;
            `;
        });

        notification.querySelector('button:first-of-type').style.cssText += `
            background: #007AFF;
            color: white;
        `;

        notification.querySelector('button:last-of-type').style.cssText += `
            background: #666;
            color: white;
        `;

        document.body.appendChild(notification);

        // Auto-remove after 10 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 10000);
    }

    async updateServiceWorker() {
        if (!this.registration || !this.registration.waiting) {
            return;
        }

        try {
            // Send message to waiting service worker
            this.registration.waiting.postMessage({ type: 'SKIP_WAITING' });
            
            // Wait for controller change
            await new Promise(resolve => {
                navigator.serviceWorker.addEventListener('controllerchange', resolve, { once: true });
            });

    
        } catch (error) {
            // Handle service worker update error silently
        }
    }

    setupCommunication() {
        if (!navigator.serviceWorker.controller) return;

        // Listen for messages from service worker
        navigator.serviceWorker.addEventListener('message', event => {
            this.handleServiceWorkerMessage(event);
        });
    }

    handleServiceWorkerMessage(event) {
        const { type, data } = event.data;

        switch (type) {
            case 'CACHE_STATUS':
        
                break;
            case 'OFFLINE_MODE':
                this.handleOfflineMode(data);
                break;
            case 'CACHE_UPDATED':
                this.handleCacheUpdated(data);
                break;
            default:
        
        }
    }

    handleOfflineMode(data) {

        
        // Show offline indicator
        this.showOfflineIndicator();
    }

    handleCacheUpdated(data) {

        
        // Show cache update notification
        this.showCacheUpdateNotification(data);
    }

    showOfflineIndicator() {
        // Create offline indicator
        const indicator = document.createElement('div');
        indicator.id = 'offline-indicator';
        indicator.innerHTML = '📴 Offline Mode';
        indicator.style.cssText = `
            position: fixed;
            top: 20px;
            left: 20px;
            background: #FF3B30;
            color: white;
            padding: 8px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: bold;
            z-index: 10000;
            font-family: -apple-system, BlinkMacSystemFont, sans-serif;
        `;

        document.body.appendChild(indicator);
    }

    showCacheUpdateNotification(data) {
        // Create cache update notification
        const notification = document.createElement('div');
        notification.className = 'cache-update-notification';
        notification.innerHTML = `
            <div class="cache-content">
                <span>📦 Cache updated: ${data.cacheName}</span>
                <button onclick="this.parentElement.parentElement.remove()">OK</button>
            </div>
        `;

        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #34C759;
            color: white;
            padding: 12px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 10000;
            font-family: -apple-system, BlinkMacSystemFont, sans-serif;
        `;

        notification.querySelector('.cache-content').style.cssText = `
            display: flex;
            flex-direction: column;
            gap: 8px;
            align-items: center;
        `;

        notification.querySelector('button').style.cssText = `
            padding: 6px 12px;
            border: none;
            border-radius: 4px;
            background: white;
            color: #34C759;
            cursor: pointer;
            font-size: 12px;
        `;

        document.body.appendChild(notification);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }

    // Public API methods
    async getCacheStatus() {
        if (!navigator.serviceWorker.controller) {
            return { error: 'No service worker controller' };
        }

        return new Promise((resolve) => {
            const channel = new MessageChannel();
            
            channel.port1.onmessage = (event) => {
                if (event.data.type === 'CACHE_STATUS') {
                    resolve(event.data.data);
                }
            };

            navigator.serviceWorker.controller.postMessage(
                { type: 'GET_CACHE_STATUS' },
                [channel.port2]
            );
        });
    }

    async clearAllCaches() {
        try {
            const cacheNames = await caches.keys();
            await Promise.all(
                cacheNames.map(cacheName => caches.delete(cacheName))
            );
    
            return true;
        } catch (error) {
            return false;
        }
    }

    async getOfflineStatus() {
        if (!navigator.onLine) {
            return { offline: true, message: 'Device is offline' };
        }

        if (!navigator.serviceWorker.controller) {
            return { offline: false, message: 'No service worker active' };
        }

        return { offline: false, message: 'Online with service worker' };
    }

    // Performance monitoring integration
    async getCachePerformance() {
        try {
            const cacheNames = await caches.keys();
            const performanceData = {};

            for (const cacheName of cacheNames) {
                const cache = await caches.open(cacheName);
                const keys = await cache.keys();
                performanceData[cacheName] = {
                    size: keys.length,
                    urls: keys.map(request => request.url)
                };
            }

            return performanceData;
        } catch (error) {
            return {};
        }
    }

    // Cleanup method
    destroy() {
        // Remove offline indicator if present
        const offlineIndicator = document.getElementById('offline-indicator');
        if (offlineIndicator) {
            offlineIndicator.remove();
        }

        // Remove any other notifications
        const notifications = document.querySelectorAll('.service-worker-update-notification, .cache-update-notification');
        notifications.forEach(notification => notification.remove());


    }
}

// Export for use in other modules
if (typeof window !== 'undefined') {
    window.ServiceWorkerManager = ServiceWorkerManager;
}
