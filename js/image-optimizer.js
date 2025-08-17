// Image Optimization Module
// Handles lazy loading, responsive images, and performance optimization
// Extracted for better organization and performance

class ImageOptimizer {
    constructor() {
        this.images = [];
        this.observer = null;
        this.performanceMetrics = {
            loadTimes: [],
            totalImages: 0,
            loadedImages: 0
        };
        this.init();
    }

    init() {
        this.setupIntersectionObserver();
        this.optimizeExistingImages();
        this.setupPerformanceMonitoring();
    }

    setupIntersectionObserver() {
        // Use Intersection Observer for efficient lazy loading
        if ('IntersectionObserver' in window) {
            this.observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            this.loadImage(entry.target);
                            this.observer.unobserve(entry.target);
                        }
                    });
                },
                {
                    rootMargin: '50px', // Start loading 50px before image enters viewport
                    threshold: 0.1
                }
            );
        }
    }

    optimizeExistingImages() {
        // Find all project images that need optimization
        const projectImages = document.querySelectorAll('.project-images-section img, .image-list img');
        
        projectImages.forEach(img => {
            this.optimizeImage(img);
        });
    }

    optimizeImage(img) {
        // Add lazy loading attributes
        img.loading = 'lazy';
        img.decoding = 'async';
        
        // Add performance tracking
        img.addEventListener('load', () => this.trackImageLoad(img));
        img.addEventListener('error', () => this.handleImageError(img));
        
        // Start observing for lazy loading
        if (this.observer) {
            this.observer.observe(img);
        } else {
            // Fallback for older browsers
            this.loadImage(img);
        }
    }

    loadImage(img) {
        const startTime = performance.now();
        
        // Set loading state
        img.classList.add('image-loading');
        
        // Load image with error handling
        const tempImg = new Image();
        tempImg.onload = () => {
            img.src = tempImg.src;
            img.classList.remove('image-loading');
            img.classList.add('image-loaded');
            
            // Track performance
            const loadTime = performance.now() - startTime;
            this.trackImageLoad(img, loadTime);
        };
        
        tempImg.onerror = () => {
            this.handleImageError(img);
        };
        
        // Start loading
        tempImg.src = img.dataset.src || img.src;
    }

    trackImageLoad(img, loadTime = null) {
        this.performanceMetrics.loadedImages++;
        
        if (loadTime) {
            this.performanceMetrics.loadTimes.push(loadTime);
        }
        
        // Log performance metrics
        if (this.performanceMetrics.loadedImages === this.performanceMetrics.totalImages) {
            this.logPerformanceMetrics();
        }
    }

    handleImageError(img) {
        img.classList.add('image-error');
        img.classList.remove('image-loading');
        
        // Set fallback image
        img.src = 'images/placeholder.png';
        
        console.warn(`Failed to load image: ${img.dataset.src || img.src}`);
    }

    setupPerformanceMonitoring() {
        // Monitor Core Web Vitals
        if ('PerformanceObserver' in window) {
            try {
                const observer = new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        if (entry.entryType === 'largest-contentful-paint') {
                            this.trackLCP(entry);
                        }
                    }
                });
                observer.observe({ entryTypes: ['largest-contentful-paint'] });
            } catch (e) {
                console.warn('PerformanceObserver not supported:', e);
            }
        }
    }

    trackLCP(entry) {
        const lcp = entry.startTime;

        
        // Send to analytics if available
        if (window.gtag) {
            window.gtag('event', 'LCP', {
                value: Math.round(lcp),
                event_category: 'Performance'
            });
        }
    }

    logPerformanceMetrics() {
        const avgLoadTime = this.performanceMetrics.loadTimes.reduce((a, b) => a + b, 0) / this.performanceMetrics.loadTimes.length;
        

            totalImages: this.performanceMetrics.totalImages,
            loadedImages: this.performanceMetrics.loadedImages,
            averageLoadTime: `${avgLoadTime.toFixed(2)}ms`,
            totalLoadTime: `${this.performanceMetrics.loadTimes.reduce((a, b) => a + b, 0).toFixed(2)}ms`
        });
    }

    // Public API for manual optimization
    optimizeImageContainer(container) {
        const images = container.querySelectorAll('img');
        images.forEach(img => this.optimizeImage(img));
    }

    // Cleanup method
    destroy() {
        if (this.observer) {
            this.observer.disconnect();
        }
    }
}

// Export for use in other modules
if (typeof window !== 'undefined') {
    window.ImageOptimizer = ImageOptimizer;
}
