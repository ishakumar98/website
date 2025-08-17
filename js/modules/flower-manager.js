// Flower Manager Module
// Handles flower logo animations, scaling, and interactions
// Coordinates with AnimationCoordinator for smooth animations

class FlowerManager {
    constructor() {
        this.flowerElement = null;
        this.currentScale = 1;
        this.spinDirection = 'clockwise';
        this.isInitialized = false;
        this.hasBloomed = false;
        this.scrollScalingPaused = false;
        this.lastScrollProgress = 0;
        this.init();
    }
    
    init() {
        this.findFlowerElement();
        if (this.flowerElement) {
            this.setupEventListeners();
            this.triggerBloom();
            this.isInitialized = true;
        }
    }
    
    findFlowerElement() {
        this.flowerElement = document.querySelector('.flower');
        if (!this.flowerElement) {
            console.warn('Flower element not found');
        }
    }
    
    setupEventListeners() {
        if (this.flowerElement && window.eventManager) {
            window.eventManager.addListener(this.flowerElement, 'mouseenter', () => {
                this.toggleSpinDirection();
                this.pauseScrollScaling();
                // Register CSS hover animation with AnimationCoordinator
                if (window.animationCoordinator) {
                    window.animationCoordinator.registerCSSAnimation(this.flowerElement, 'rotate', 'flower-hover-rotate', window.animationCoordinator.priorities.HIGH);
                }
            });
            
            window.eventManager.addListener(this.flowerElement, 'mouseleave', () => {
                // Wait for CSS animation to complete before resuming JS scaling
                setTimeout(() => {
                    this.scrollScalingPaused = false;
                    if (this.hasBloomed && typeof this.lastScrollProgress !== 'undefined') {
                        this.updateFlowerSize(this.lastScrollProgress);
                    }
                }, 1000); // Match the CSS animation duration
                
                // Unregister CSS animation when hover ends
                if (window.animationCoordinator) {
                    window.animationCoordinator.unregisterAnimation(this.flowerElement, 'flower-hover-rotate');
                }
            });
        }
    }
    
    toggleSpinDirection() {
        if (this.spinDirection === 'clockwise') {
            this.flowerElement.setAttribute('data-spin-direction', 'counter');
            this.spinDirection = 'counter';
        } else {
            this.flowerElement.removeAttribute('data-spin-direction');
            this.spinDirection = 'clockwise';
        }
    }
    
    pauseScrollScaling() {
        this.scrollScalingPaused = true;
    }
    
    resumeScrollScaling() {
        // Wait for CSS animation to complete before resuming JS scaling
        setTimeout(() => {
            this.scrollScalingPaused = false;
            if (this.hasBloomed && typeof this.lastScrollProgress !== 'undefined') {
                this.updateFlowerSize(this.lastScrollProgress);
            }
        }, 1000); // Match the CSS animation duration
    }
    
    updateFlowerSize(scrollProgress) {
        if (!this.flowerElement || !this.hasBloomed || this.scrollScalingPaused) return;
        
        this.lastScrollProgress = scrollProgress;
        
        // Calculate scale based on scroll progress
        const minScale = 0.3;
        const maxScale = 1;
        this.currentScale = maxScale - (scrollProgress * (maxScale - minScale));
        
        // Calculate margins based on scale
        const baseTopMargin = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--flower-margin-top')) || 2;
        const baseBottomMargin = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--flower-margin-bottom')) || 1.5;
        
        const currentTopMargin = baseTopMargin * this.currentScale;
        const currentBottomMargin = baseBottomMargin * this.currentScale;
        
        // Apply scroll-based scaling - AnimationCoordinator will handle CSS conflicts
        this.flowerElement.style.transform = `scale(${this.currentScale})`;
        this.flowerElement.style.marginTop = `${currentTopMargin}rem`;
        this.flowerElement.style.marginBottom = `${currentBottomMargin}rem`;
    }
    
    triggerBloom() {
        if (this.flowerElement && !this.hasBloomed) {
            this.flowerElement.setAttribute('bloom', '');
            setTimeout(() => {
                this.hasBloomed = true;
                this.flowerElement.removeAttribute('bloom');
                this.flowerElement.setAttribute('logo', ''); // Enable hover effects
                this.flowerElement.style.transform = '';
                this.flowerElement.style.marginTop = 'var(--flower-margin-top)';
                this.flowerElement.style.marginBottom = 'var(--flower-margin-bottom)';
            }, 2500);
        }
    }
    
    destroy() {
        if (this.flowerElement && window.eventManager) {
            window.eventManager.removeAllListeners(this.flowerElement);
        }
        this.flowerElement = null;
        this.isInitialized = false;
    }
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FlowerManager;
}

// Create global instance if not in module system
if (typeof window !== 'undefined') {
    window.FlowerManager = FlowerManager;
}
