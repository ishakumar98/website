// Flower Manager Module
// Handles all flower logo animations, scaling, and interactions
// Extracted from project-script.js for better organization

class FlowerManager {
    constructor() {
        this.flowerElement = null;
        this.currentScale = 1;
        this.spinDirection = 'clockwise';
        this.isInitialized = false;
        
        this.init();
    }
    
    init() {
        // Wait for project content to be ready before initializing
        document.addEventListener('projectContentReady', () => {
                    this.findFlowerElement();
        this.setupEventListeners();
        this.isInitialized = true;
    });
    }
    
    findFlowerElement() {
        const projectImagesSection = document.querySelector('.project-images-section');
        if (projectImagesSection) {
            this.flowerElement = projectImagesSection.querySelector('.flower-logo');
        }
    }
    
    setupEventListeners() {
        if (this.flowerElement && window.eventManager) {
            // Initialize alternating spin direction for flower hover
            window.eventManager.addListener(this.flowerElement, 'mouseenter', () => {
                this.toggleSpinDirection();
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
    
    updateFlowerSize(scrollProgress) {
        if (!this.flowerElement) return;
        
        // Calculate scale based on scroll progress (bloomtype-style)
        const minScale = 0.8;
        const maxScale = 1.2;
        this.currentScale = minScale + (scrollProgress * (maxScale - minScale));
        
        // Calculate margins for positioning
        const maxTopMargin = 1.5; // 1.5rem
        const minTopMargin = 0.5; // 0.5rem
        const currentTopMargin = maxTopMargin - (scrollProgress * (maxTopMargin - minTopMargin));
        
        const minBottomMargin = 0.25; // 0.25rem
        const maxBottomMargin = 1.5; // 1.5rem
        const currentBottomMargin = maxBottomMargin - (scrollProgress * (maxBottomMargin - minBottomMargin));
        
        // Apply the transform and margins with animation coordination
        if (window.animationCoordinator) {
            window.animationCoordinator.registerJSAnimation(
                this.flowerElement, 
                'scale', 
                'flower-scroll-scale', 
                window.animationCoordinator.priorities.CRITICAL
            );
        }
        
        this.flowerElement.style.transform = `scale(${this.currentScale}) rotate(0deg)`;
        this.flowerElement.style.marginTop = `${currentTopMargin}rem`;
        this.flowerElement.style.marginBottom = `${currentBottomMargin}rem`;
    }
    
    getFlowerElement() {
        return this.flowerElement;
    }
    
    isReady() {
        return this.isInitialized && this.flowerElement !== null;
    }
    
    destroy() {
        if (this.flowerElement && window.eventManager) {
            // Clean up event listeners if needed
            this.flowerElement = null;
        }
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
