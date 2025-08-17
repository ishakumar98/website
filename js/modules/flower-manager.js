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
                // Only allow hover effects if the flower has fully bloomed
                if (!this.flowerElement.hasAttribute('logo')) {
                    console.log('🚫 Flower not ready for hover - no logo attribute yet');
                    return;
                }
                
                this.toggleSpinDirection();
                // CSS transition handles the rotation automatically
                
                // DEBUG: Log current transform state
                const computedStyle = getComputedStyle(this.flowerElement);
                console.log('🖱️ Mouse ENTER - Flower hover started');
                console.log('Current transform:', computedStyle.transform);
                console.log('Current transition:', computedStyle.transition);
                console.log('Has logo attribute:', this.flowerElement.hasAttribute('logo'));
                console.log('Element classes:', this.flowerElement.className);
            });
            
            window.eventManager.addListener(this.flowerElement, 'mouseleave', () => {
                // CSS transition automatically returns to original position
                
                // DEBUG: Log transform state after hover
                const computedStyle = getComputedStyle(this.flowerElement);
                console.log('🖱️ Mouse LEAVE - Flower hover ended');
                console.log('Current transform:', computedStyle.transform);
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
            // After bloom completes, enable hover effects by setting [logo] attribute
            
            // Timing: 1s scaleUp + 1.25s delay + 1s petal bloom = 3.25s total
            setTimeout(() => {
                if (this.flowerElement) {
                    this.flowerElement.setAttribute('logo', '');
                    console.log('🌸 Flower bloom complete - [logo] attribute set, hover effects enabled');
                }
            }, 3250); // Total bloom time
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
