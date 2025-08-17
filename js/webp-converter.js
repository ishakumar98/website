// WebP Image Converter
// Provides modern image formats with fallbacks for better performance
// Converts images to WebP format when supported

class WebPConverter {
    constructor() {
        this.isWebPSupported = false;
        this.convertedImages = new Map();
        this.performanceMetrics = {
            conversions: 0,
            totalSizeReduction: 0,
            conversionTime: 0
        };
        this.init();
    }

    async init() {
        await this.checkWebPSupport();
        this.setupImageConversion();

    }

    async checkWebPSupport() {
        // Check WebP support using canvas
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        
        try {
            const dataURL = canvas.toDataURL('image/webp');
            this.isWebPSupported = dataURL.indexOf('data:image/webp') === 0;
        } catch (e) {
            this.isWebPSupported = false;
        }


        return this.isWebPSupported;
    }

    setupImageConversion() {
        if (!this.isWebPSupported) {
    
            return;
        }

        // Convert existing images
        this.convertExistingImages();
        
        // Watch for new images
        this.observeNewImages();
    }

    convertExistingImages() {
        const images = document.querySelectorAll('img:not([data-webp-converted])');
        images.forEach(img => this.convertImage(img));
    }

    observeNewImages() {
        // Use MutationObserver to watch for new images
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        // Check if node is an image
                        if (node.tagName === 'IMG') {
                            this.convertImage(node);
                        }
                        
                        // Check for images inside the node
                        const images = node.querySelectorAll && node.querySelectorAll('img:not([data-webp-converted])');
                        if (images) {
                            images.forEach(img => this.convertImage(img));
                        }
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    async convertImage(img) {
        if (!this.isWebPSupported || img.dataset.webpConverted) {
            return;
        }

        // Skip if already converted
        if (img.dataset.webpConverted) {
            return;
        }

        // Mark as converted to prevent double conversion
        img.dataset.webpConverted = 'true';

        try {
            const startTime = performance.now();
            
            // Get original image data
            const originalSrc = img.src;
            const originalSize = await this.getImageSize(originalSrc);
            
            // Convert to WebP
            const webpDataURL = await this.convertToWebP(img);
            
            if (webpDataURL) {
                // Calculate size reduction
                const webpSize = this.calculateDataURLSize(webpDataURL);
                const sizeReduction = originalSize - webpSize;
                
                // Update performance metrics
                this.performanceMetrics.conversions++;
                this.performanceMetrics.totalSizeReduction += sizeReduction;
                this.performanceMetrics.conversionTime += performance.now() - startTime;
                
                // Store conversion data
                this.convertedImages.set(img, {
                    originalSrc,
                    webpDataURL,
                    originalSize,
                    webpSize,
                    sizeReduction
                });
                
                // Apply WebP image
                img.src = webpDataURL;
                
        
        
                
                // Show conversion notification
                this.showConversionNotification(img, sizeReduction);
            }
        } catch (error) {
            console.warn('Failed to convert image to WebP:', img.src, error);
            img.dataset.webpConverted = 'false';
        }
    }

    async convertToWebP(img) {
        return new Promise((resolve) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            // Create a new image to avoid CORS issues
            const tempImg = new Image();
            tempImg.crossOrigin = 'anonymous';
            
            tempImg.onload = () => {
                try {
                    // Set canvas dimensions
                    canvas.width = tempImg.naturalWidth;
                    canvas.height = tempImg.naturalHeight;
                    
                    // Draw image to canvas
                    ctx.drawImage(tempImg, 0, 0);
                    
                    // Convert to WebP
                    const webpDataURL = canvas.toDataURL('image/webp', 0.85); // 85% quality
                    resolve(webpDataURL);
                } catch (error) {
                    console.warn('Canvas conversion failed:', error);
                    resolve(null);
                }
            };
            
            tempImg.onerror = () => {
                console.warn('Failed to load image for conversion:', img.src);
                resolve(null);
            };
            
            // Start loading
            tempImg.src = img.src;
        });
    }

    async getImageSize(src) {
        try {
            const response = await fetch(src);
            const blob = await response.blob();
            return blob.size;
        } catch (error) {
            console.warn('Failed to get image size:', error);
            return 0;
        }
    }

    calculateDataURLSize(dataURL) {
        // Approximate size calculation for data URLs
        const base64Length = dataURL.length - dataURL.indexOf(',') - 1;
        return Math.ceil(base64Length * 0.75); // Base64 is ~33% larger than binary
    }

    showConversionNotification(img, sizeReduction) {
        // Create conversion notification
        const notification = document.createElement('div');
        notification.className = 'webp-conversion-notification';
        notification.innerHTML = `
            <div class="conversion-content">
                <span>🔄 WebP conversion: ${(sizeReduction / 1024).toFixed(2)}KB saved</span>
                <button onclick="this.parentElement.parentElement.remove()">OK</button>
            </div>
        `;

        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 20px;
            background: #007AFF;
            color: white;
            padding: 10px;
            border-radius: 6px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            z-index: 9999;
            font-family: -apple-system, BlinkMacSystemFont, sans-serif;
            font-size: 12px;
        `;

        notification.querySelector('.conversion-content').style.cssText = `
            display: flex;
            align-items: center;
            gap: 10px;
        `;

        notification.querySelector('button').style.cssText = `
            padding: 4px 8px;
            border: none;
            border-radius: 3px;
            background: white;
            color: #007AFF;
            cursor: pointer;
            font-size: 11px;
        `;

        document.body.appendChild(notification);

        // Auto-remove after 3 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 3000);
    }

    // Public API methods
    async convertImageURL(imageURL) {
        if (!this.isWebPSupported) {
            return { supported: false, originalURL: imageURL };
        }

        try {
            const startTime = performance.now();
            
            // Create temporary image element
            const tempImg = document.createElement('img');
            tempImg.src = imageURL;
            
            // Wait for image to load
            await new Promise((resolve, reject) => {
                tempImg.onload = resolve;
                tempImg.onerror = reject;
            });
            
            // Convert to WebP
            const webpDataURL = await this.convertToWebP(tempImg);
            
            if (webpDataURL) {
                const conversionTime = performance.now() - startTime;
                return {
                    supported: true,
                    originalURL: imageURL,
                    webpDataURL: webpDataURL,
                    conversionTime: conversionTime
                };
            }
            
            return { supported: false, originalURL: imageURL };
        } catch (error) {
            console.error('Failed to convert image URL:', error);
            return { supported: false, originalURL: imageURL, error: error.message };
        }
    }

    getConversionStats() {
        return {
            ...this.performanceMetrics,
            convertedImages: this.convertedImages.size,
            averageSizeReduction: this.performanceMetrics.conversions > 0 
                ? this.performanceMetrics.totalSizeReduction / this.performanceMetrics.conversions 
                : 0,
            averageConversionTime: this.performanceMetrics.conversions > 0 
                ? this.performanceMetrics.conversionTime / this.performanceMetrics.conversions 
                : 0
        };
    }

    async batchConvert(images) {
        if (!this.isWebPSupported) {
    
            return [];
        }

        const results = [];
        const batchSize = 5; // Process 5 images at a time
        
        for (let i = 0; i < images.length; i += batchSize) {
            const batch = images.slice(i, i + batchSize);
            const batchPromises = batch.map(img => this.convertImage(img));
            
            try {
                await Promise.all(batchPromises);
                results.push(...batch.map(img => ({ success: true, element: img })));
            } catch (error) {
                console.error('Batch conversion failed:', error);
                results.push(...batch.map(img => ({ success: false, element: img, error: error.message })));
            }
        }
        
        return results;
    }

    // Fallback methods for unsupported browsers
    getFallbackImage(originalSrc) {
        // Try to find a WebP fallback
        const webpFallback = originalSrc.replace(/\.(png|jpg|jpeg)$/i, '.webp');
        
        // Check if fallback exists
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(webpFallback);
            img.onerror = () => resolve(originalSrc);
            img.src = webpFallback;
        });
    }

    // Performance monitoring integration
    getPerformanceMetrics() {
        return {
            webpSupported: this.isWebPSupported,
            conversions: this.performanceMetrics.conversions,
            totalSizeReduction: this.performanceMetrics.totalSizeReduction,
            averageSizeReduction: this.performanceMetrics.conversions > 0 
                ? this.performanceMetrics.totalSizeReduction / this.performanceMetrics.conversions 
                : 0,
            conversionTime: this.performanceMetrics.conversionTime
        };
    }

    // Cleanup method
    destroy() {
        // Remove all conversion notifications
        const notifications = document.querySelectorAll('.webp-conversion-notification');
        notifications.forEach(notification => notification.remove());
        
        // Clear conversion data
        this.convertedImages.clear();
        

    }
}

// Export for use in other modules
if (typeof window !== 'undefined') {
    window.WebPConverter = WebPConverter;
}
