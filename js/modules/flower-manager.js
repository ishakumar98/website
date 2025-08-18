// Flower Manager Module - Bloomtype minimal approach
// Just sets attributes and lets CSS handle everything

class FlowerManager {
    constructor() {
        this.flowerElement = null;
        this.isInitialized = false;
    }
    
    init() {
        console.log('🚀 FlowerManager initializing...');
        this.findFlowerElement();
        if (this.flowerElement) {
            console.log('✅ Flower element found, setting attributes...');
            this.setupFlower();
            this.isInitialized = true;
            console.log('✅ FlowerManager initialization complete');
        } else {
            console.log('❌ No flower element found during initialization');
        }
    }
    
    findFlowerElement() {
        console.log('🔍 Searching for flower element...');
        this.flowerElement = document.querySelector('.flower');
        if (this.flowerElement) {
            console.log('✅ Flower element found:', this.flowerElement);
        } else {
            console.warn('❌ Flower element not found');
        }
    }
    
    setupFlower() {
        if (this.flowerElement) {
            // Set [intro] attribute to trigger petal animations
            this.flowerElement.setAttribute('intro', '');
            console.log('✅ [intro] attribute set for petal animations');
            
            // Set [logo] attribute to enable hover effects
            this.flowerElement.setAttribute('logo', '');
            console.log('✅ [logo] attribute set - hover effects enabled');
            
            // CSS handles all animations and interactions
            console.log('🌱 Flower setup complete - CSS handles everything');
        }
    }
    
    // Public method for ModuleLoader to call
    initialize() {
        if (!this.isInitialized) {
            this.init();
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

