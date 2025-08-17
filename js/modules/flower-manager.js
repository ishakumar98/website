// Flower Manager Module
// Handles flower logo bloom animation and hover interactions
// Simple, focused functionality without scaling complexity

class FlowerManager {
    constructor() {
        this.flowerElement = null;
        this.isInitialized = false;
        
        this.init();
    }
    
    init() {
        this.findFlowerElement();
        if (this.flowerElement) {
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
    

    

    
    // Flower now only handles bloom and hover states
    // No more scrolling or scaling complexity
    
    triggerBloom() {
        if (this.flowerElement) {
            // CSS handles the bloom animation via start-bloom class
            // Set [intro] attribute to trigger petal blooming - CSS handles all timing
            this.flowerElement.setAttribute('intro', '');
            
            // Listen for CSS animation completion to automatically set [logo] state
            this.setupAnimationListener();
        }
    }
    
    setupAnimationListener() {
        // Listen for the last petal animation to complete
        const lastPetal = this.flowerElement.querySelector('.bottom:after');
        if (lastPetal) {
            // Use CSS animation events to detect when blooming is complete
            this.flowerElement.addEventListener('animationend', (event) => {
                if (event.animationName === 'bottomRight') {
                    // Last petal animation completed - set logo state for hover effects
                    this.flowerElement.setAttribute('logo', '');
                    console.log('🌸 Flower bloom complete - CSS animation finished, hover effects enabled');
                }
            });
        }
    }
    
    destroy() {
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
