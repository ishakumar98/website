// Performance Manager
// Coordinates all performance optimization modules
// Main entry point for performance optimization system

class PerformanceManager {
    constructor() {
        this.optimizers = new Map();
        this.monitor = null;
        this.isInitialized = false;
        this.performanceConfig = {
            enableImageOptimization: true,
            enableFontOptimization: true,
            enableCSSOptimization: true,
            enableMonitoring: true,
            lazyLoadThreshold: 50, // pixels from viewport
            criticalCSSThreshold: 0.8, // percentage of critical CSS
            performanceTargets: {
                lcp: 2500, // milliseconds
                fid: 100,  // milliseconds
                cls: 0.1   // score
            }
        };
        this.init();
    }

    async init() {
        try {
            // Initialize performance monitor first
            if (this.performanceConfig.enableMonitoring) {
                this.monitor = new PerformanceMonitor();
            }

            // Initialize optimization modules
            await this.initializeOptimizers();

            // Register optimizers with monitor
            this.registerOptimizers();

            // Start optimization process
            this.startOptimization();

            this.isInitialized = true;
    

        } catch (error) {
            // Handle initialization error silently
        }
    }

    async initializeOptimizers() {
        // Initialize Image Optimizer
        if (this.performanceConfig.enableImageOptimization) {
            try {
                const imageOptimizer = new ImageOptimizer();
                this.optimizers.set('image', imageOptimizer);
        
            } catch (error) {
                // Handle image optimizer error silently
            }
        }

        // Initialize Font Optimizer
        if (this.performanceConfig.enableFontOptimization) {
            try {
                const fontOptimizer = new FontOptimizer();
                this.optimizers.set('font', fontOptimizer);
        
            } catch (error) {
                // Handle font optimizer error silently
            }
        }

        // Initialize CSS Optimizer
        if (this.performanceConfig.enableCSSOptimization) {
            try {
                const cssOptimizer = new CSSOptimizer();
                this.optimizers.set('css', cssOptimizer);
        
            } catch (error) {
                // Handle CSS optimizer error silently
            }
        }
    }

    registerOptimizers() {
        // Register all optimizers with the performance monitor
        if (this.monitor) {
            this.optimizers.forEach((optimizer, name) => {
                this.monitor.registerOptimizer(name, optimizer);
            });
        }
    }

    startOptimization() {
        // Start optimization process for all modules
        this.optimizers.forEach((optimizer, name) => {
            this.optimizeModule(name, optimizer);
        });

        // Schedule periodic optimization checks
        this.scheduleOptimizationChecks();
    }

    optimizeModule(name, optimizer) {
        try {
            switch (name) {
                case 'image':
                    this.optimizeImages(optimizer);
                    break;
                case 'font':
                    this.optimizeFonts(optimizer);
                    break;
                case 'css':
                    this.optimizeCSS(optimizer);
                    break;
            }
        } catch (error) {
            // Handle optimization error silently
        }
    }

    optimizeImages(optimizer) {
        // Optimize project images
        const imageContainers = document.querySelectorAll('.project-images-section, .image-list');
        imageContainers.forEach(container => {
            if (optimizer.optimizeImageContainer) {
                optimizer.optimizeImageContainer(container);
            }
        });

        // Add lazy loading to all images
        const images = document.querySelectorAll('img:not([loading])');
        images.forEach(img => {
            if (optimizer.optimizeImage) {
                optimizer.optimizeImage(img);
            }
        });
    }

    optimizeFonts(optimizer) {
        // Font optimization is handled automatically by FontOptimizer
        // Just ensure it's working
        if (optimizer.getFontStatus) {
            const status = optimizer.getFontStatus('Tumla');
    
        }
    }

    optimizeCSS(optimizer) {
        // CSS optimization is handled automatically by CSSOptimizer
        // Just ensure it's working
        if (optimizer.getOptimizationMetrics) {
            const metrics = optimizer.getOptimizationMetrics();
    
        }
    }

    scheduleOptimizationChecks() {
        // Check performance every 30 seconds
        setInterval(() => {
            this.checkPerformance();
        }, 30000);

        // Check for new content every 10 seconds
        setInterval(() => {
            this.checkForNewContent();
        }, 10000);
    }

    checkPerformance() {
        if (!this.monitor) return;

        const score = this.monitor.getPerformanceScore();
        const recommendations = this.monitor.getPerformanceRecommendations();

        // Log performance status


        if (recommendations.length > 0) {
    
        }

        // Take action if performance is poor
        if (score < 70) {
            this.triggerPerformanceOptimization();
        }
    }

    checkForNewContent() {
        // Check for dynamically added content that needs optimization
        const newImages = document.querySelectorAll('img:not([data-optimized])');
        if (newImages.length > 0) {
            const imageOptimizer = this.optimizers.get('image');
            if (imageOptimizer) {
                newImages.forEach(img => {
                    img.setAttribute('data-optimized', 'true');
                    if (imageOptimizer.optimizeImage) {
                        imageOptimizer.optimizeImage(img);
                    }
                });
            }
        }
    }

    triggerPerformanceOptimization() {


        // Aggressive image optimization
        const imageOptimizer = this.optimizers.get('image');
        if (imageOptimizer) {
            this.aggressiveImageOptimization(imageOptimizer);
        }

        // CSS optimization
        const cssOptimizer = this.optimizers.get('css');
        if (cssOptimizer) {
            this.aggressiveCSSOptimization(cssOptimizer);
        }
    }

    aggressiveImageOptimization(optimizer) {
        // Reduce image quality for better performance
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            if (img.src.includes('.png') || img.src.includes('.jpg')) {
                // Add low-quality fallback
                img.style.filter = 'contrast(0.9) brightness(0.95)';
            }
        });
    }

    aggressiveCSSOptimization(optimizer) {
        // Remove non-critical CSS rules
        const nonCriticalStyles = document.querySelectorAll('link[rel="stylesheet"]:not([href*="critical"])');
        nonCriticalStyles.forEach(link => {
            link.media = 'print';
        });
    }

    // Public API for manual optimization
    async optimizePage() {
        if (!this.isInitialized) {
            await this.init();
        }



        // Force optimization of all modules
        this.optimizers.forEach((optimizer, name) => {
            this.optimizeModule(name, optimizer);
        });

        // Generate performance report
        if (this.monitor) {
            const report = this.monitor.logPerformanceReport();
            return report;
        }

        return null;
    }

    // Get optimization status
    getOptimizationStatus() {
        const status = {
            initialized: this.isInitialized,
            optimizers: {},
            performance: null
        };

        // Get status from each optimizer
        this.optimizers.forEach((optimizer, name) => {
            if (optimizer.getOptimizationMetrics) {
                status.optimizers[name] = optimizer.getOptimizationMetrics();
            } else if (optimizer.getFontMetrics) {
                status.optimizers[name] = optimizer.getFontMetrics();
            }
        });

        // Get performance metrics
        if (this.monitor) {
            status.performance = {
                score: this.monitor.getPerformanceScore(),
                recommendations: this.monitor.getPerformanceRecommendations()
            };
        }

        return status;
    }

    // Configuration management
    updateConfig(newConfig) {
        this.performanceConfig = { ...this.performanceConfig, ...newConfig };

    }

    // Cleanup method
    destroy() {
        // Cleanup all optimizers
        this.optimizers.forEach(optimizer => {
            if (optimizer.destroy) {
                optimizer.destroy();
            }
        });

        // Cleanup monitor
        if (this.monitor) {
            this.monitor.destroy();
        }

        this.optimizers.clear();
        this.isInitialized = false;

    }
}

// Export for use in other modules
if (typeof window !== 'undefined') {
    window.PerformanceManager = PerformanceManager;
}
