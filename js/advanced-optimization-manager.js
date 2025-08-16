// Advanced Optimization Manager
// Coordinates all Phase 4 optimization modules
// Service Worker, WebP conversion, PWA capabilities

class AdvancedOptimizationManager {
    constructor() {
        this.modules = new Map();
        this.isInitialized = false;
        this.optimizationConfig = {
            enableServiceWorker: true,
            enableWebPConversion: true,
            enablePWA: true,
            enableOfflineSupport: true,
            enablePushNotifications: true,
            enableBackgroundSync: true
        };
        this.init();
    }

    async init() {
        try {
            console.log('🚀 Initializing Advanced Optimization Manager...');

            // Initialize Service Worker Manager
            if (this.optimizationConfig.enableServiceWorker) {
                await this.initializeServiceWorker();
            }

            // Initialize WebP Converter
            if (this.optimizationConfig.enableWebPConversion) {
                await this.initializeWebPConverter();
            }

            // Initialize PWA capabilities
            if (this.optimizationConfig.enablePWA) {
                await this.initializePWA();
            }

            // Setup performance monitoring
            this.setupPerformanceMonitoring();

            this.isInitialized = true;
            console.log('✅ Advanced Optimization Manager initialized successfully');

        } catch (error) {
            console.error('❌ Failed to initialize Advanced Optimization Manager:', error);
        }
    }

    async initializeServiceWorker() {
        try {
            if (typeof ServiceWorkerManager !== 'undefined') {
                const serviceWorkerManager = new ServiceWorkerManager();
                this.modules.set('serviceWorker', serviceWorkerManager);
                console.log('✅ Service Worker Manager initialized');
            } else {
                console.warn('⚠️ ServiceWorkerManager not available');
            }
        } catch (error) {
            console.error('❌ Failed to initialize Service Worker Manager:', error);
        }
    }

    async initializeWebPConverter() {
        try {
            if (typeof WebPConverter !== 'undefined') {
                const webpConverter = new WebPConverter();
                this.modules.set('webpConverter', webpConverter);
                console.log('✅ WebP Converter initialized');
            } else {
                console.warn('⚠️ WebPConverter not available');
            }
        } catch (error) {
            console.error('❌ Failed to initialize WebP Converter:', error);
        }
    }

    async initializePWA() {
        try {
            // Check if PWA is installable
            if ('serviceWorker' in navigator && 'PushManager' in window) {
                this.setupPWAInstallation();
                this.setupPushNotifications();
                console.log('✅ PWA capabilities initialized');
            } else {
                console.warn('⚠️ PWA not supported in this browser');
            }
        } catch (error) {
            console.error('❌ Failed to initialize PWA:', error);
        }
    }

    setupPWAInstallation() {
        // Listen for beforeinstallprompt event
        window.addEventListener('beforeinstallprompt', (e) => {
            console.log('📱 PWA installation prompt available');
            
            // Store the event for later use
            this.deferredPrompt = e;
            
            // Show custom install button if needed
            this.showInstallPrompt();
        });

        // Listen for app installed event
        window.addEventListener('appinstalled', () => {
            console.log('✅ PWA installed successfully');
            this.hideInstallPrompt();
            
            // Track installation
            if (window.gtag) {
                window.gtag('event', 'pwa_installed', {
                    event_category: 'PWA',
                    event_label: 'Installation'
                });
            }
        });
    }

    showInstallPrompt() {
        // Create install prompt
        const installPrompt = document.createElement('div');
        installPrompt.id = 'pwa-install-prompt';
        installPrompt.innerHTML = `
            <div class="install-content">
                <span>📱 Install Portfolio App</span>
                <button onclick="window.advancedOptimizationManager.installPWA()">Install</button>
                <button onclick="this.parentElement.parentElement.remove()">Dismiss</button>
            </div>
        `;

        installPrompt.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #007AFF;
            color: white;
            padding: 15px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 10001;
            font-family: -apple-system, BlinkMacSystemFont, sans-serif;
        `;

        installPrompt.querySelector('.install-content').style.cssText = `
            display: flex;
            flex-direction: column;
            gap: 10px;
            align-items: center;
        `;

        installPrompt.querySelectorAll('button').forEach(button => {
            button.style.cssText = `
                padding: 8px 16px;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 14px;
            `;
        });

        installPrompt.querySelector('button:first-of-type').style.cssText += `
            background: white;
            color: #007AFF;
        `;

        installPrompt.querySelector('button:last-of-type').style.cssText += `
            background: rgba(255,255,255,0.2);
            color: white;
        `;

        document.body.appendChild(installPrompt);

        // Auto-remove after 15 seconds
        setTimeout(() => {
            if (installPrompt.parentElement) {
                installPrompt.remove();
            }
        }, 15000);
    }

    hideInstallPrompt() {
        const installPrompt = document.getElementById('pwa-install-prompt');
        if (installPrompt) {
            installPrompt.remove();
        }
    }

    async installPWA() {
        if (!this.deferredPrompt) {
            console.log('No installation prompt available');
            return;
        }

        try {
            // Show the install prompt
            this.deferredPrompt.prompt();

            // Wait for the user to respond
            const { outcome } = await this.deferredPrompt.userChoice;
            console.log(`PWA installation: ${outcome}`);

            // Clear the deferred prompt
            this.deferredPrompt = null;

            // Hide the custom prompt
            this.hideInstallPrompt();

        } catch (error) {
            console.error('PWA installation failed:', error);
        }
    }

    setupPushNotifications() {
        if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
            return;
        }

        // Request notification permission
        this.requestNotificationPermission();
    }

    async requestNotificationPermission() {
        try {
            const permission = await Notification.requestPermission();
            
            if (permission === 'granted') {
                console.log('✅ Notification permission granted');
                this.subscribeToPushNotifications();
            } else {
                console.log('❌ Notification permission denied');
            }
        } catch (error) {
            console.error('Failed to request notification permission:', error);
        }
    }

    async subscribeToPushNotifications() {
        try {
            const registration = await navigator.serviceWorker.ready;
            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: this.urlBase64ToUint8Array('YOUR_VAPID_PUBLIC_KEY')
            });

            console.log('✅ Push notification subscription created:', subscription);
            
            // Send subscription to server (if you have one)
            // await this.sendSubscriptionToServer(subscription);
            
        } catch (error) {
            console.error('Failed to subscribe to push notifications:', error);
        }
    }

    urlBase64ToUint8Array(base64String) {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
            .replace(/-/g, '+')
            .replace(/_/g, '/');

        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);

        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }

    setupPerformanceMonitoring() {
        // Monitor advanced optimization performance
        setInterval(() => {
            this.logOptimizationMetrics();
        }, 30000); // Every 30 seconds
    }

    logOptimizationMetrics() {
        const metrics = this.getOptimizationMetrics();
        console.log('📊 Advanced Optimization Metrics:', metrics);
        
        // Send to analytics if available
        if (window.gtag) {
            window.gtag('event', 'advanced_optimization_metrics', {
                event_category: 'Performance',
                custom_map: {
                    service_worker_active: metrics.serviceWorker.active ? 1 : 0,
                    webp_conversions: metrics.webpConverter.conversions,
                    pwa_installed: metrics.pwa.installed ? 1 : 0
                }
            });
        }
    }

    getOptimizationMetrics() {
        const metrics = {
            serviceWorker: { active: false, cacheStatus: null },
            webpConverter: { conversions: 0, sizeReduction: 0 },
            pwa: { installed: false, installable: false }
        };

        // Get Service Worker metrics
        const serviceWorker = this.modules.get('serviceWorker');
        if (serviceWorker) {
            metrics.serviceWorker.active = !!navigator.serviceWorker.controller;
            metrics.serviceWorker.cacheStatus = serviceWorker.getCacheStatus();
        }

        // Get WebP Converter metrics
        const webpConverter = this.modules.get('webpConverter');
        if (webpConverter) {
            const webpMetrics = webpConverter.getPerformanceMetrics();
            metrics.webpConverter = webpMetrics;
        }

        // Get PWA metrics
        metrics.pwa.installed = window.matchMedia('(display-mode: standalone)').matches;
        metrics.pwa.installable = !!this.deferredPrompt;

        return metrics;
    }

    // Public API methods
    async getServiceWorkerStatus() {
        const serviceWorker = this.modules.get('serviceWorker');
        if (serviceWorker) {
            return await serviceWorker.getOfflineStatus();
        }
        return { error: 'Service Worker not available' };
    }

    async getWebPConversionStats() {
        const webpConverter = this.modules.get('webpConverter');
        if (webpConverter) {
            return webpConverter.getConversionStats();
        }
        return { error: 'WebP Converter not available' };
    }

    async getPWAStatus() {
        return {
            installed: window.matchMedia('(display-mode: standalone)').matches,
            installable: !!this.deferredPrompt,
            supported: 'serviceWorker' in navigator && 'PushManager' in window
        };
    }

    async clearAllCaches() {
        const serviceWorker = this.modules.get('serviceWorker');
        if (serviceWorker) {
            return await serviceWorker.clearAllCaches();
        }
        return false;
    }

    async batchConvertImages(images) {
        const webpConverter = this.modules.get('webpConverter');
        if (webpConverter) {
            return await webpConverter.batchConvert(images);
        }
        return [];
    }

    // Configuration management
    updateConfig(newConfig) {
        this.optimizationConfig = { ...this.optimizationConfig, ...newConfig };
        console.log('⚙️ Advanced optimization configuration updated:', this.optimizationConfig);
    }

    // Cleanup method
    destroy() {
        // Cleanup all modules
        this.modules.forEach(module => {
            if (module.destroy) {
                module.destroy();
            }
        });

        // Remove PWA install prompt
        this.hideInstallPrompt();

        // Clear deferred prompt
        this.deferredPrompt = null;

        this.modules.clear();
        this.isInitialized = false;
        console.log('🧹 Advanced Optimization Manager cleaned up');
    }
}

// Export for use in other modules
if (typeof window !== 'undefined') {
    window.AdvancedOptimizationManager = AdvancedOptimizationManager;
}
