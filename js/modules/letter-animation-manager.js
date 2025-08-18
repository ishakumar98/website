// Letter Animation Manager Module
// Handles ISHA-style letter animations and hover effects
// Extracted from script.js for better organization

class LetterAnimationManager {
    constructor() {
        this.letters = [];
        this.nameDisplay = null;
        this.isInitialized = false;
        this.initializationAttempts = 0;
        this.maxInitializationAttempts = 3;
        this.eventListenerIds = {
            mouseenter: null,
            mouseleave: null
        };
        
        // Animation configuration - using design system variables where possible
        this.animationConfig = {
            ROTATION_RANGE: 12,      // -6 to +6 degrees
            TRANSLATE_Y_RANGE: 6,    // -3 to +3 pixels
            TRANSLATE_X_RANGE: 4,    // -2 to +2 pixels
            TRANSITION_DURATION: 'var(--transition-smooth)', // Uses your CSS variables
            ANIMATION_TIMING: 'var(--animation-smooth)' // From design system
        };
        
        // Flower color palette - exact same as exploded flowers (fireworks)
        this.flowerColors = [
            '#537DBD', '#CA683E', '#D3B934', '#AF9E7D', '#D85959', 
            '#956750', '#277325', '#F3B524', '#972723', '#5B388B', 
            '#686B1C', '#142D86', '#A1A329', '#BF1E16', '#3853A5', 
            '#D7537E', '#E99F22', '#CE5310', '#613B31'
        ];
        
        this.init();
    }
    
    init() {
        try {
            // Check if we're on homepage
            if (!this.isHomepage()) {
        
                return;
            }
            
            this.findElements();
            this.setupEventListeners();
            this.isInitialized = true;
    
            
        } catch (error) {
            this.handleInitializationError(error);
        }
    }
    
    handleInitializationError(error) {
        this.initializationAttempts++;
        

        
        // Attempt to recover if we haven't exceeded max attempts
        if (this.initializationAttempts < this.maxInitializationAttempts) {

            setTimeout(() => this.init(), 1000 * this.initializationAttempts); // Exponential backoff
        } else {

            // Could implement fallback behavior here
        }
    }
    
    isHomepage() {
        // Check if we're on the homepage (including local development paths)
        const pathname = window.location.pathname;
        return pathname === '/' || 
               pathname === '/' ||
               pathname.endsWith('/') ||
               pathname.includes('/') ||
               pathname.includes('/website-project/');
    }
    
    findElements() {
        try {
            this.letters = document.querySelectorAll('.name-display .letter');
            this.nameDisplay = document.querySelector('.name-display');
            
            if (!this.nameDisplay) {
                throw new Error('Name display element not found');
            }
            

            
        } catch (error) {

            throw error; // Re-throw to be caught by init()
        }
    }
    
    setupEventListeners() {
        if (!this.nameDisplay) {

            return;
        }
        
        try {
            // Try to use EventManager if available, otherwise fall back to direct listeners
            if (window.eventManager) {
                this.setupEventManagerListeners();
            } else {
                this.setupDirectEventListeners();
            }
            
            // Register CSS animations with AnimationCoordinator
            this.registerCSSAnimations();
            
        } catch (error) {

            throw error; // Re-throw to be caught by init()
        }
    }
    
    setupEventManagerListeners() {
        try {
            // Add mouseenter listener for random letter transforms
            this.eventListenerIds.mouseenter = window.eventManager.addListener(this.nameDisplay, 'mouseenter', (e) => {
                this.handleMouseEnter(e);
            });
            
            // Add mouseleave listener to reset letters
            this.eventListenerIds.mouseleave = window.eventManager.addListener(this.nameDisplay, 'mouseleave', (e) => {
                this.handleMouseLeave(e);
            });
            

            
        } catch (error) {

            this.setupDirectEventListeners();
        }
    }
    
    setupDirectEventListeners() {
        try {
            // Fallback to direct event listeners
            this.nameDisplay.addEventListener('mouseenter', (e) => {
                this.handleMouseEnter(e);
            });
            
            this.nameDisplay.addEventListener('mouseleave', (e) => {
                this.handleMouseLeave(e);
            });
            

            
        } catch (error) {

            throw error;
        }
    }
    
    handleMouseEnter(event) {
        if (!this.letters || this.letters.length === 0) {
            return;
        }
        
        try {
            this.letters.forEach((letter, index) => {
                try {
                    // Skip space characters (exact same logic as current implementation)
                    if (letter.textContent.trim() === '') return;
                    
                    const randomTransform = this.generateRandomTransform();
                    const randomColor = this.getRandomFlowerColor();
                    
                    // Register with AnimationCoordinator to prevent conflicts if available
                    if (window.animationCoordinator) {
                        try {
                            window.animationCoordinator.registerJSAnimation(
                                letter, 
                                'transform', 
                                `letter-hover-${index}`, 
                                window.animationCoordinator.priorities.HIGH
                            );
                        } catch (error) {
                            // Animation registration failed
                        }
                    }
                    
                    // Apply the transform (exact same as current implementation)
                    letter.style.setProperty('transform', randomTransform, 'important');
                    
                    // ENHANCEMENT: Add random flower color (preserves existing effect)
                    letter.style.setProperty('color', randomColor, 'important');
                    
                } catch (error) {
                    // Error handling mouse enter for letter
                }
            });
            
        } catch (error) {
            // Error in handleMouseEnter
        }
    }
    
    handleMouseLeave(event) {
        if (!this.letters || this.letters.length === 0) {
            return;
        }
        
        try {
            this.letters.forEach((letter, index) => {
                try {
                    // Unregister animations to prevent conflicts if available
                    if (window.animationCoordinator) {
                        try {
                            window.animationCoordinator.unregisterAnimation(letter, `letter-hover-${index}`);
                        } catch (error) {
                            // Animation unregistration failed
                        }
                    }
                    
                    // Reset to normal position (exact same as current implementation)
                    letter.style.setProperty('transform', 'rotate(0deg) translateY(0px) translateX(0px)', 'important');
                    
                    // ENHANCEMENT: Reset color back to normal (preserves existing effect)
                    letter.style.removeProperty('color');
                    
                } catch (error) {
                    // Error handling mouse leave for letter
                }
            });
            
        } catch (error) {
            // Error in handleMouseLeave
        }
    }
    
    // Generate random transform values - exact same as current implementation
    generateRandomTransform() {
        try {
            const rotation = (Math.random() - 0.5) * this.animationConfig.ROTATION_RANGE; // -6 to +6 degrees
            const translateY = (Math.random() - 0.5) * this.animationConfig.TRANSLATE_Y_RANGE; // -3 to +3 pixels
            const translateX = (Math.random() - 0.5) * this.animationConfig.TRANSLATE_X_RANGE; // -2 to +2 pixels
            
            return `rotate(${rotation}deg) translateY(${translateY}px) translateX(${translateX}px)`;
        } catch (error) {
            return 'rotate(0deg) translateY(0px) translateX(0px)'; // Fallback to no transform
        }
    }
    
    // Get random flower color - always use the same palette as exploded flowers
    getRandomFlowerColor() {
        try {
            // Always use the same color palette as the exploded flowers
            return this.flowerColors[Math.floor(Math.random() * this.flowerColors.length)];
        } catch (error) {
            return '#000000'; // Fallback to black
        }
    }
    

    
    // Register CSS animations with AnimationCoordinator - exact same as current implementation
    registerCSSAnimations() {
        if (this.letters.length === 0 || !window.animationCoordinator) {
            return;
        }
        
        try {
            this.letters.forEach((letter, index) => {
                try {
                    // Register the CSS transition with AnimationCoordinator (exact same as current)
                    window.animationCoordinator.registerCSSAnimation(
                        letter,
                        'transform',
                        `letter-css-${index}`,
                        window.animationCoordinator.priorities.MEDIUM
                    );
                } catch (error) {
                    // CSS animation registration failed
                }
            });
            

            
        } catch (error) {
            // Error registering CSS animations
        }
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
        try {
            this.findElements();
            this.setupEventListeners();
        } catch (error) {
            // Error refreshing elements
        }
    }
    
    destroy() {
        try {
            
            // Clean up event listeners
            if (this.nameDisplay) {
                if (window.eventManager) {
                    try {
                        // Remove EventManager listeners using stored IDs
                        if (this.eventListenerIds.mouseenter) {
                            window.eventManager.removeListener(this.eventListenerIds.mouseenter);
                        }
                        if (this.eventListenerIds.mouseleave) {
                            window.eventManager.removeListener(this.eventListenerIds.mouseleave);
                        }

                    } catch (error) {

                    }
                } else {
                    try {
                        // Remove direct event listeners
                        this.nameDisplay.removeEventListener('mouseenter', this.handleMouseEnter);
                        this.nameDisplay.removeEventListener('mouseleave', this.handleMouseLeave);

                    } catch (error) {

                    }
                }
            }
            
            // Clean up letters
            this.letters = [];
            this.nameDisplay = null;
            this.isInitialized = false;
            

            
        } catch (error) {
            // Error during destruction
        }
    }
    
    // Public methods for external access
    getStatus() {
        return {
            isInitialized: this.isInitialized,
            lettersCount: this.letters.length,
            nameDisplayFound: this.nameDisplay !== null,
            initializationAttempts: this.initializationAttempts,
            eventManagerAvailable: !!window.eventManager,
            eventListenersActive: {
                mouseenter: !!this.eventListenerIds.mouseenter,
                mouseleave: !!this.eventListenerIds.mouseleave
            },
            usingEventManager: window.eventManager && (this.eventListenerIds.mouseenter || this.eventListenerIds.mouseleave),
            colorPalette: {
                designSystemColors: this.getDesignSystemColors().length,
                fallbackColors: this.flowerColors.length - this.getDesignSystemColors().length,
                totalColors: this.flowerColors.length,
                designSystemColorsAvailable: this.getDesignSystemColors().length > 0
            },
            animationConfig: this.animationConfig
        };
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
