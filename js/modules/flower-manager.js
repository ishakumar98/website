// Flower Manager Module
// Handles flower logo bloom animation and hover interactions
// Simple, focused functionality without scaling complexity

class FlowerManager {
    constructor() {
        this.flowerElement = null;
        this.spinDirection = 'clockwise';
        this.isInitialized = false;
        
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
                // Register CSS hover animation with AnimationCoordinator
                if (window.animationCoordinator) {
                    window.animationCoordinator.registerCSSAnimation(this.flowerElement, 'rotate', 'flower-hover-rotate', window.animationCoordinator.priorities.HIGH);
                }
            });
            
            window.eventManager.addListener(this.flowerElement, 'mouseleave', () => {
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
    
    // Flower now only handles bloom and hover states
    // No more scrolling or scaling complexity
    
    triggerBloom() {
        if (this.flowerElement) {
            // CSS handles the bloom animation via start-bloom class
            // After bloom completes, enable hover effects
            setTimeout(() => {
                this.flowerElement.setAttribute('logo', ''); // Enable hover effects
            }, 2250); // 1s scaleUp + 1.25s delay + 1s petal bloom
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
