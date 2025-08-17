// Letter Animation Manager Module
// Handles ISHA-style letter animations and hover effects
// Extracted from script.js for better organization

class LetterAnimationManager {
    constructor() {
        this.letters = [];
        this.nameDisplay = null;
        this.isInitialized = false;
        
        // Animation configuration - exact same as current implementation
        this.animationConfig = {
            ROTATION_RANGE: 12,      // -6 to +6 degrees
            TRANSLATE_Y_RANGE: 6,    // -3 to +3 pixels
            TRANSLATE_X_RANGE: 4,    // -2 to +2 pixels
            TRANSITION_DURATION: 'var(--transition-smooth)' // Uses your CSS variables
        };
        
        // Flower color palette from fireworks (enhancement)
        this.flowerColors = [
            '#537DBD', '#CA683E', '#D3B934', '#AF9E7D', '#D85959', 
            '#956750', '#277325', '#F3B524', '#972723', '#5B388B', 
            '#686B1C', '#142D86', '#A1A329', '#BF1E16', '#3853A5', 
            '#D7537E', '#E99F22', '#CE5310', '#613B31'
        ];
        
        this.init();
    }
    
    init() {
        // Check if we're on homepage
        if (!this.isHomepage()) {
            return;
        }
        
        this.findElements();
        this.setupEventListeners();
        this.isInitialized = true;
    }
    
    isHomepage() {
        // Check if we're on the homepage (including local development paths)
        const pathname = window.location.pathname;
        return pathname === '/' || 
               pathname === '/index.html' ||
               pathname.endsWith('/') ||
               pathname.includes('/index.html') ||
               pathname.includes('/website-project/index.html');
    }
    
    findElements() {
        this.letters = document.querySelectorAll('.name-display .letter');
        this.nameDisplay = document.querySelector('.name-display');
    }
    
    setupEventListeners() {
        if (!this.nameDisplay) {
            return;
        }
        
        // Try to use EventManager if available, otherwise fall back to direct listeners
        if (window.eventManager) {
            // Add mouseenter listener for random letter transforms
            window.eventManager.addListener(this.nameDisplay, 'mouseenter', (e) => {
                this.handleMouseEnter(e);
            });
            
            // Add mouseleave listener to reset letters
            window.eventManager.addListener(this.nameDisplay, 'mouseleave', (e) => {
                this.handleMouseLeave(e);
            });
        } else {
            // Fallback to direct event listeners
            this.nameDisplay.addEventListener('mouseenter', (e) => {
                this.handleMouseEnter(e);
            });
            
            this.nameDisplay.addEventListener('mouseleave', (e) => {
                this.handleMouseLeave(e);
            });
        }
        
        // Register CSS animations with AnimationCoordinator
        this.registerCSSAnimations();
    }
    
    handleMouseEnter(event) {
        this.letters.forEach((letter, index) => {
            // Skip space characters (exact same logic as current implementation)
            if (letter.textContent.trim() === '') return;
            
            const randomTransform = this.generateRandomTransform();
            const randomColor = this.getRandomFlowerColor();
            
            // Register with AnimationCoordinator to prevent conflicts if available
            if (window.animationCoordinator) {
                window.animationCoordinator.registerJSAnimation(
                    letter, 
                    'transform', 
                    `letter-hover-${index}`, 
                    window.animationCoordinator.priorities.HIGH
                );
            }
            
            // Apply the transform (exact same as current implementation)
            letter.style.setProperty('transform', randomTransform, 'important');
            
            // ENHANCEMENT: Add random flower color (preserves existing effect)
            letter.style.setProperty('color', randomColor, 'important');
        });
    }
    
    handleMouseLeave(event) {
        this.letters.forEach((letter, index) => {
            // Unregister animations to prevent conflicts if available
            if (window.animationCoordinator) {
                window.animationCoordinator.unregisterAnimation(letter, `letter-hover-${index}`);
            }
            
            // Reset to normal position (exact same as current implementation)
            letter.style.setProperty('transform', 'rotate(0deg) translateY(0px) translateX(0px)', 'important');
            
            // ENHANCEMENT: Reset color back to normal (preserves existing effect)
            letter.style.removeProperty('color');
        });
    }
    
    // Generate random transform values - exact same as current implementation
    generateRandomTransform() {
        const rotation = (Math.random() - 0.5) * this.animationConfig.ROTATION_RANGE; // -6 to +6 degrees
        const translateY = (Math.random() - 0.5) * this.animationConfig.TRANSLATE_Y_RANGE; // -3 to +3 pixels
        const translateX = (Math.random() - 0.5) * this.animationConfig.TRANSLATE_X_RANGE; // -2 to +2 pixels
        
        return `rotate(${rotation}deg) translateY(${translateY}px) translateX(${translateX}px)`;
    }
    
    // Generate random flower color (enhancement)
    getRandomFlowerColor() {
        return this.flowerColors[Math.floor(Math.random() * this.flowerColors.length)];
    }
    
    // Register CSS animations with AnimationCoordinator - exact same as current implementation
    registerCSSAnimations() {
        if (this.letters.length === 0 || !window.animationCoordinator) {
            return;
        }
        
        this.letters.forEach((letter, index) => {
            // Register the CSS transition with AnimationCoordinator (exact same as current)
            window.animationCoordinator.registerCSSAnimation(
                letter,
                'transform',
                `letter-css-${index}`,
                window.animationCoordinator.priorities.MEDIUM
            );
        });
    }
    
    // Public methods for external access
    getLetters() {
        return this.letters;
    }
    
    getLetterCount() {
        return this.letters.length;
    }
    
    getNameDisplay() {
        return this.nameDisplay;
    }
    
    isReady() {
        return this.isInitialized && this.letters.length > 0 && this.nameDisplay !== null;
    }
    
    // Refresh elements (useful if DOM changes)
    refreshElements() {
        this.findElements();
        this.setupEventListeners();
    }
    
    destroy() {
        // Clean up event listeners
        if (this.nameDisplay) {
            if (window.eventManager) {
                // Remove EventManager listeners
                window.eventManager.removeListener(this.nameDisplay, 'mouseenter');
                window.eventManager.removeListener(this.nameDisplay, 'mouseleave');
            } else {
                // Remove direct event listeners
                this.nameDisplay.removeEventListener('mouseenter', this.handleMouseEnter);
                this.nameDisplay.removeEventListener('mouseleave', this.handleMouseLeave);
            }
        }
        
        // Clean up letters
        this.letters = [];
        this.nameDisplay = null;
        this.isInitialized = false;
    }
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LetterAnimationManager;
}

// Create global instance if not in module system
if (typeof window !== 'undefined') {
    window.LetterAnimationManager = LetterAnimationManager;
}
