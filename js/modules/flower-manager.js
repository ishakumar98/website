// Flower Manager Module
// Handles flower logo bloom animation and hover interactions
// Simple, focused functionality without scaling complexity

class FlowerManager {
    constructor() {
        this.flowerElement = null;
        this.spinDirection = 'clockwise';
        this.isInitialized = false;
        this.hasBloomed = false;
        
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
                console.log('🖱️ Mouse ENTER - Flower hover started');
                this.toggleSpinDirection();
                // Register CSS hover animation with AnimationCoordinator
                if (window.animationCoordinator) {
                    console.log('🔧 Registering CSS animation with AnimationCoordinator');
                    window.animationCoordinator.registerCSSAnimation(this.flowerElement, 'rotate', 'flower-hover-rotate', window.animationCoordinator.priorities.HIGH);
                }
            });
            
            window.eventManager.addListener(this.flowerElement, 'mouseleave', () => {
                console.log('🖱️ Mouse LEAVE - Flower hover ended');
                
                // Unregister CSS animation when hover ends
                if (window.animationCoordinator) {
                    console.log('🔧 Unregistering CSS animation');
                    window.animationCoordinator.unregisterAnimation(this.flowerElement, 'flower-hover-rotate');
                }
                
                console.log('✅ Hover ended. Flower scaling remains independent of hover state.');
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
    
    // Flower scaling is now completely independent of hover state
    // It only responds to actual scroll events from ProjectScrollManager
    
    // Flower now only handles bloom and hover states
    // No more scrolling or scaling complexity
    
    triggerBloom() {
        if (this.flowerElement && !this.hasBloomed) {
            this.flowerElement.setAttribute('bloom', '');
            setTimeout(() => {
                this.hasBloomed = true;
                this.flowerElement.removeAttribute('bloom');
                this.flowerElement.setAttribute('logo', ''); // Enable hover effects
                // CSS will handle the reset naturally - no direct manipulation needed
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
