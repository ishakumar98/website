// Flower Manager Module
// Handles flower logo bloom animation and hover interactions
// Simple, focused functionality without scaling complexity

class FlowerManager {
    constructor() {
        this.flowerElement = null;
        this.isInitialized = false;
        
        // Don't auto-initialize - let ModuleLoader control when to start
        // this.init();
    }
    
    init() {
        console.log('🚀 FlowerManager initializing...');
        this.findFlowerElement();
        if (this.flowerElement) {
            console.log('✅ Flower element found, triggering bloom...');
            this.triggerBloom();
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
            console.log('  - Tag name:', this.flowerElement.tagName);
            console.log('  - Classes:', this.flowerElement.className);
            console.log('  - Current attributes:', this.flowerElement.attributes);
        } else {
            console.warn('❌ Flower element not found');
        }
    }
    

    

    
    // Flower now only handles bloom and hover states
    // No more scrolling or scaling complexity
    
    triggerBloom() {
        if (this.flowerElement) {
            console.log('🌸 Flower bloom triggered by CSS (flower-logo class)');
            
            // The flower-logo class automatically triggers blooming
            // We just need to ensure [intro] and [logo] attributes are set
            
            // Set [intro] attribute to trigger petal blooming
            this.flowerElement.setAttribute('intro', '');
            console.log('✅ [intro] attribute set for petal animations');
            
            // Set [logo] attribute immediately since blooming is automatic
            this.flowerElement.setAttribute('logo', '');
            console.log('✅ [logo] attribute set - hover effects enabled');
            
            // No need for animation listeners - CSS handles everything
            console.log('🌱 Flower blooming automatically via CSS');
        }
    }
    
    setupAnimationListener() {
        // Not needed with bloomtype structure - CSS handles all timing
        console.log('🌸 CSS handles all animation timing - no JavaScript needed');
    }
    
    setupHoverEffects() {
        console.log('🌸 CSS hover effects are automatic with bloomtype structure');
        console.log('✅ Hover effects ready');
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

