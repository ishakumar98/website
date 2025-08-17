// Performance Monitor Module
// Tracks Core Web Vitals, custom metrics, and provides performance insights
// Central hub for all performance optimization modules

class PerformanceMonitor {
    constructor() {
        this.metrics = {
            navigation: {},
            paint: {},
            layout: {},
            resources: {},
            custom: {}
        };
        this.observers = new Map();
        this.optimizers = new Map();
        this.init();
    }

    init() {
        this.setupCoreWebVitals();
        this.setupPerformanceObservers();
        this.setupResourceTiming();
        this.setupCustomMetrics();
        this.startMonitoring();
    }

    setupCoreWebVitals() {
        // Monitor Largest Contentful Paint (LCP)
        if ('PerformanceObserver' in window) {
            try {
                const lcpObserver = new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    const lastEntry = entries[entries.length - 1];
                    this.metrics.paint.lcp = lastEntry.startTime;
                    this.trackMetric('LCP', lastEntry.startTime);
                });
                lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
                this.observers.set('lcp', lcpObserver);
            } catch (e) {
                console.warn('LCP observer not supported:', e);
            }

            // Monitor First Input Delay (FID)
            try {
                const fidObserver = new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    entries.forEach(entry => {
                        this.metrics.paint.fid = entry.processingStart - entry.startTime;
                        this.trackMetric('FID', this.metrics.paint.fid);
                    });
                });
                fidObserver.observe({ entryTypes: ['first-input'] });
                this.observers.set('fid', fidObserver);
            } catch (e) {
                console.warn('FID observer not supported:', e);
            }

            // Monitor Cumulative Layout Shift (CLS)
            try {
                let clsValue = 0;
                const clsObserver = new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        if (!entry.hadRecentInput) {
                            clsValue += entry.value;
                        }
                    }
                    this.metrics.layout.cls = clsValue;
                    this.trackMetric('CLS', clsValue);
                });
                clsObserver.observe({ entryTypes: ['layout-shift'] });
                this.observers.set('cls', clsObserver);
            } catch (e) {
                console.warn('CLS observer not supported:', e);
            }
        }
    }

    setupPerformanceObservers() {
        // Monitor paint timing
        if ('PerformanceObserver' in window) {
            try {
                const paintObserver = new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        this.metrics.paint[entry.name] = entry.startTime;
                        this.trackMetric(`Paint_${entry.name}`, entry.startTime);
                    }
                });
                paintObserver.observe({ entryTypes: ['paint'] });
                this.observers.set('paint', paintObserver);
            } catch (e) {
                console.warn('Paint observer not supported:', e);
            }

            // Monitor long tasks
            try {
                const longTaskObserver = new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        if (entry.duration > 50) { // Tasks longer than 50ms
                            this.trackMetric('LongTask', entry.duration);
                            console.warn(`Long task detected: ${entry.duration}ms`, entry);
                        }
                    }
                });
                longTaskObserver.observe({ entryTypes: ['longtask'] });
                this.observers.set('longtask', longTaskObserver);
            } catch (e) {
                console.warn('Long task observer not supported:', e);
            }
        }
    }

    setupResourceTiming() {
        // Monitor resource loading performance
        if ('PerformanceObserver' in window) {
            try {
                const resourceObserver = new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        this.trackResource(entry);
                    }
                });
                resourceObserver.observe({ entryTypes: ['resource'] });
                this.observers.set('resource', resourceObserver);
            } catch (e) {
                console.warn('Resource observer not supported:', e);
            }
        }

        // Monitor navigation timing
        if ('PerformanceNavigationTiming' in window) {
            const navigation = performance.getEntriesByType('navigation')[0];
            if (navigation) {
                this.metrics.navigation = {
                    dns: navigation.domainLookupEnd - navigation.domainLookupStart,
                    tcp: navigation.connectEnd - navigation.connectStart,
                    ttfb: navigation.responseStart - navigation.requestStart,
                    domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
                    load: navigation.loadEventEnd - navigation.loadEventStart
                };
            }
        }
    }

    setupCustomMetrics() {
        // Monitor custom performance metrics
        this.metrics.custom = {
            imageLoadTimes: [],
            fontLoadTimes: [],
            cssOptimization: {},
            jsExecution: {}
        };
    }

    startMonitoring() {
        // Start continuous monitoring
        this.monitorFrameRate();
        this.monitorMemoryUsage();
        this.monitorNetworkActivity();
        
        // Log initial metrics
        setTimeout(() => {
            this.logPerformanceReport();
        }, 2000);
    }

    monitorFrameRate() {
        let frameCount = 0;
        let lastTime = performance.now();
        
        const countFrames = () => {
            frameCount++;
            const currentTime = performance.now();
            
            if (currentTime - lastTime >= 1000) {
                const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
                this.metrics.custom.fps = fps;
                
                if (fps < 30) {
                    console.warn(`Low frame rate detected: ${fps} FPS`);
                }
                
                frameCount = 0;
                lastTime = currentTime;
            }
            
            requestAnimationFrame(countFrames);
        };
        
        requestAnimationFrame(countFrames);
    }

    monitorMemoryUsage() {
        if ('memory' in performance) {
            setInterval(() => {
                const memory = performance.memory;
                this.metrics.custom.memory = {
                    used: memory.usedJSHeapSize,
                    total: memory.totalJSHeapSize,
                    limit: memory.jsHeapSizeLimit
                };
                
                // Warn about memory issues
                const usagePercent = (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100;
                if (usagePercent > 80) {
                    console.warn(`High memory usage: ${usagePercent.toFixed(1)}%`);
                }
            }, 5000);
        }
    }

    monitorNetworkActivity() {
        // Monitor network requests and responses
        const originalFetch = window.fetch;
        const originalXHR = window.XMLHttpRequest;
        
        // Intercept fetch requests
        window.fetch = async (...args) => {
            const startTime = performance.now();
            try {
                const response = await originalFetch(...args);
                const duration = performance.now() - startTime;
                this.trackMetric('Fetch_Request', duration);
                return response;
            } catch (error) {
                const duration = performance.now() - startTime;
                this.trackMetric('Fetch_Error', duration);
                throw error;
            }
        };
        
        // Intercept XHR requests
        const originalOpen = originalXHR.prototype.open;
        originalXHR.prototype.open = function(...args) {
            this._startTime = performance.now();
            return originalOpen.apply(this, args);
        };
        
        const originalSend = originalXHR.prototype.send;
        originalXHR.prototype.send = function(...args) {
            this.addEventListener('load', () => {
                const duration = performance.now() - this._startTime;
                this.trackMetric('XHR_Request', duration);
            });
            
            this.addEventListener('error', () => {
                const duration = performance.now() - this._startTime;
                this.trackMetric('XHR_Error', duration);
            });
            
            return originalSend.apply(this, args);
        };
    }

    trackMetric(name, value) {
        // Track custom performance metrics
        if (!this.metrics.custom[name]) {
            this.metrics.custom[name] = [];
        }
        
        this.metrics.custom[name].push({
            value: value,
            timestamp: performance.now()
        });
        
        // Keep only last 100 values
        if (this.metrics.custom[name].length > 100) {
            this.metrics.custom[name] = this.metrics.custom[name].slice(-100);
        }
    }

    trackResource(entry) {
        // Track resource loading performance
        const resourceType = entry.initiatorType;
        const duration = entry.duration;
        
        if (!this.metrics.resources[resourceType]) {
            this.metrics.resources[resourceType] = [];
        }
        
        this.metrics.resources[resourceType].push({
            name: entry.name,
            duration: duration,
            size: entry.transferSize,
            timestamp: performance.now()
        });
        
        // Track slow resources
        if (duration > 1000) {
            console.warn(`Slow resource: ${entry.name} took ${duration.toFixed(0)}ms`);
        }
    }

    // Register optimization modules
    registerOptimizer(name, optimizer) {
        this.optimizers.set(name, optimizer);
    }

    // Get optimization metrics from all modules
    getOptimizationMetrics() {
        const metrics = {};
        
        this.optimizers.forEach((optimizer, name) => {
            if (optimizer.getOptimizationMetrics) {
                metrics[name] = optimizer.getOptimizationMetrics();
            }
        });
        
        return metrics;
    }

    // Generate comprehensive performance report
    logPerformanceReport() {
        const report = {
            timestamp: new Date().toISOString(),
            coreWebVitals: {
                lcp: this.metrics.paint.lcp,
                fid: this.metrics.paint.fid,
                cls: this.metrics.layout.cls
            },
            navigation: this.metrics.navigation,
            resources: this.metrics.resources,
            custom: this.metrics.custom,
            optimization: this.getOptimizationMetrics()
        };
        

        
        // Send to analytics if available
        if (window.gtag) {
            window.gtag('event', 'performance_report', {
                event_category: 'Performance',
                custom_map: {
                    lcp: report.coreWebVitals.lcp,
                    fid: report.coreWebVitals.fid,
                    cls: report.coreWebVitals.cls
                }
            });
        }
        
        return report;
    }

    // Public API for performance insights
    getPerformanceScore() {
        let score = 100;
        
        // Deduct points for poor performance
        if (this.metrics.paint.lcp > 2500) score -= 20;
        if (this.metrics.paint.fid > 100) score -= 20;
        if (this.metrics.layout.cls > 0.1) score -= 20;
        
        return Math.max(0, score);
    }

    getPerformanceRecommendations() {
        const recommendations = [];
        
        if (this.metrics.paint.lcp > 2500) {
            recommendations.push('Optimize Largest Contentful Paint - consider image optimization and critical CSS');
        }
        
        if (this.metrics.paint.fid > 100) {
            recommendations.push('Reduce First Input Delay - optimize JavaScript execution and event handling');
        }
        
        if (this.metrics.layout.cls > 0.1) {
            recommendations.push('Minimize Cumulative Layout Shift - ensure stable layout during page load');
        }
        
        return recommendations;
    }

    // Cleanup method
    destroy() {
        // Disconnect all observers
        this.observers.forEach(observer => {
            observer.disconnect();
        });
        
        this.observers.clear();
        this.optimizers.clear();
    }
}

// Export for use in other modules
if (typeof window !== 'undefined') {
    window.PerformanceMonitor = PerformanceMonitor;
}
