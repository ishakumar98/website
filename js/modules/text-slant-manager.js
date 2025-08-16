// Text Slant Manager Module
// Handles ISHA-style text slant effects and font variation animations
// Extracted from project-script.js for better organization

class TextSlantManager {
    constructor() {
        this.letters = [];
        this.isActive = false;
        this.isInitialized = false;
        
        // Slant configuration
        this.slantConfig = {
            MOUSE_RADIUS: 200,
            MAX_WEIGHT_VALUE: 100,
            MIN_WEIGHT_VALUE: 25,
            TRANSITION_DURATION: 400
        };
        
        this.init();
    }
    
    init() {
        this.findLetters();
        this.setupEventListeners();
        this.isInitialized = true;
        console.log('TextSlantManager: Initialized');
    }
    
    findLetters() {
        this.letters = document.querySelectorAll(".project-description .letter");
    }
    
    setupEventListeners() {
        if (!window.eventManager || this.letters.length === 0) return;
        
        // Only add mousemove listener for non-touch devices
        if (!window.matchMedia("(pointer: coarse)").matches) {
            window.eventManager.addListener(document, "mousemove", (e) => {
                this.handleMouseMove(e);
            });
        }
    }
    
    handleMouseMove(e) {
        if (this.letters.length === 0) return;
        
        this.letters.forEach((span, index) => {
            // Skip space characters
            if (span.textContent.trim() === '') return;
            
            const rect = span.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            // Calculate distance from mouse to letter center (like ISHA does)
            const distance = Math.sqrt(Math.pow(e.clientX - centerX, 2) + Math.pow(e.clientY - centerY, 2));
            
            if (distance < this.slantConfig.MOUSE_RADIUS) {
                // Map distance to weight using constants - higher weight when closer to mouse
                const weightValue = this.map(distance, 0, this.slantConfig.MOUSE_RADIUS, this.slantConfig.MAX_WEIGHT_VALUE, this.slantConfig.MIN_WEIGHT_VALUE);
                span.style.transition = '0ms';
                span.style.fontVariationSettings = `"wght" ${weightValue}`;
            } else {
                // Smooth transition back to normal weight when far from mouse
                span.style.transition = `font-variation-settings ${this.slantConfig.TRANSITION_DURATION}ms ease-out`;
                span.style.fontVariationSettings = '"wght" 25';
            }
        });
    }
    
    // Utility function for mapping values
    map(value, x1, y1, x2, y2) {
        return (value - x1) * (y2 - x2) / (y1 - x1) + x2;
    }
    
    activate() {
        this.isActive = true;
        this.findLetters(); // Refresh letters in case DOM changed
    }
    
    deactivate() {
        this.isActive = false;
        // Reset all letters to normal weight
        this.letters.forEach(span => {
            if (span.textContent.trim() !== '') {
                span.style.transition = `font-variation-settings ${this.slantConfig.TRANSITION_DURATION}ms ease-out`;
                span.style.fontVariationSettings = '"wght" 25';
            }
        });
    }
    
    getLetters() {
        return this.letters;
    }
    
    getLetterCount() {
        return this.letters.length;
    }
    
    isReady() {
        return this.isInitialized && this.letters.length > 0;
    }
    
    destroy() {
        this.deactivate();
        this.letters = [];
        this.isInitialized = false;
        console.log('TextSlantManager: Destroyed');
    }
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TextSlantManager;
}

// Create global instance if not in module system
if (typeof window !== 'undefined') {
    window.TextSlantManager = TextSlantManager;
}
