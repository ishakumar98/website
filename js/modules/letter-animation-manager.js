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
        try {
            // Check if we're on homepage
            if (!this.isHomepage()) {
                console.log('LetterAnimationManager: Not on homepage, skipping initialization');
                return;
            }
            
            this.findElements();
            this.setupEventListeners();
            this.isInitialized = true;
            console.log('LetterAnimationManager: Initialized successfully');
            
        } catch (error) {
            this.handleInitializationError(error);
        }
    }
    
    handleInitializationError(error) {
        this.initializationAttempts++;
        
        console.error('LetterAnimationManager: Initialization error:', {
            error: error.message,
            stack: error.stack,
            attempt: this.initializationAttempts,
            maxAttempts: this.maxInitializationAttempts
        });
        
        // Attempt to recover if we haven't exceeded max attempts
        if (this.initializationAttempts < this.maxInitializationAttempts) {
            console.log(`LetterAnimationManager: Retrying initialization (attempt ${this.initializationAttempts + 1}/${this.maxInitializationAttempts})`);
            setTimeout(() => this.init(), 1000 * this.initializationAttempts); // Exponential backoff
        } else {
            console.error('LetterAnimationManager: Max initialization attempts reached, giving up');
            // Could implement fallback behavior here
        }
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
        try {
            this.letters = document.querySelectorAll('.name-display .letter');
            this.nameDisplay = document.querySelector('.name-display');
            
            if (!this.nameDisplay) {
                throw new Error('Name display element not found');
            }
            
            if (this.letters.length === 0) {
                console.warn('LetterAnimationManager: No letter elements found');
            } else {
                console.log(`LetterAnimationManager: Found ${this.letters.length} letter elements`);
            }
            
        } catch (error) {
            console.error('LetterAnimationManager: Error finding elements:', error);
            throw error; // Re-throw to be caught by init()
        }
    }
    
    setupEventListeners() {
        if (!this.nameDisplay) {
            console.error('LetterAnimationManager: Cannot setup event listeners without name display element');
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
            console.error('LetterAnimationManager: Error setting up event listeners:', error);
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
            
            console.log('LetterAnimationManager: Event listeners registered with EventManager');
            
        } catch (error) {
            console.warn('LetterAnimationManager: Failed to register with EventManager, falling back to direct listeners:', error);
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
            
            console.log('LetterAnimationManager: Direct event listeners registered');
            
        } catch (error) {
            console.error('LetterAnimationManager: Error setting up direct event listeners:', error);
            throw error;
        }
    }
    
    handleMouseEnter(event) {
        if (!this.letters || this.letters.length === 0) {
            console.warn('LetterAnimationManager: No letters available for mouse enter handling');
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
                            console.warn(`LetterAnimationManager: Failed to register animation for letter ${index}:`, error);
                        }
                    }
                    
                    // Apply the transform (exact same as current implementation)
                    letter.style.setProperty('transform', randomTransform, 'important');
                    
                    // ENHANCEMENT: Add random flower color (preserves existing effect)
                    letter.style.setProperty('color', randomColor, 'important');
                    
                } catch (error) {
                    console.error(`LetterAnimationManager: Error handling mouse enter for letter ${index}:`, error);
                }
            });
            
        } catch (error) {
            console.error('LetterAnimationManager: Error in handleMouseEnter:', error);
        }
    }
    
    handleMouseLeave(event) {
        if (!this.letters || this.letters.length === 0) {
            console.warn('LetterAnimationManager: No letters available for mouse leave handling');
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
                            console.warn(`LetterAnimationManager: Failed to unregister animation for letter ${index}:`, error);
                        }
                    }
                    
                    // Reset to normal position (exact same as current implementation)
                    letter.style.setProperty('transform', 'rotate(0deg) translateY(0px) translateX(0px)', 'important');
                    
                    // ENHANCEMENT: Reset color back to normal (preserves existing effect)
                    letter.style.removeProperty('color');
                    
                } catch (error) {
                    console.error(`LetterAnimationManager: Error handling mouse leave for letter ${index}:`, error);
                }
            });
            
        } catch (error) {
            console.error('LetterAnimationManager: Error in handleMouseLeave:', error);
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
            console.error('LetterAnimationManager: Error generating random transform:', error);
            return 'rotate(0deg) translateY(0px) translateX(0px)'; // Fallback to no transform
        }
    }
    
    // Generate random flower color (enhancement)
    getRandomFlowerColor() {
        try {
            return this.flowerColors[Math.floor(Math.random() * this.flowerColors.length)];
        } catch (error) {
            console.error('LetterAnimationManager: Error getting random flower color:', error);
            return '#000000'; // Fallback to black
        }
    }
    
    // Register CSS animations with AnimationCoordinator - exact same as current implementation
    registerCSSAnimations() {
        if (this.letters.length === 0 || !window.animationCoordinator) {
            if (!window.animationCoordinator) {
                console.warn('LetterAnimationManager: AnimationCoordinator not available, skipping CSS animation registration');
            }
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
                    console.warn(`LetterAnimationManager: Failed to register CSS animation for letter ${index}:`, error);
                }
            });
            
            console.log('LetterAnimationManager: CSS animations registered successfully');
            
        } catch (error) {
            console.error('LetterAnimationManager: Error registering CSS animations:', error);
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
            console.log('LetterAnimationManager: Refreshing elements');
            this.findElements();
            this.setupEventListeners();
            console.log('LetterAnimationManager: Elements refreshed successfully');
        } catch (error) {
            console.error('LetterAnimationManager: Error refreshing elements:', error);
        }
    }
    
    destroy() {
        try {
            console.log('LetterAnimationManager: Destroying module');
            
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
                        console.log('LetterAnimationManager: EventManager listeners removed');
                    } catch (error) {
                        console.warn('LetterAnimationManager: Error removing EventManager listeners:', error);
                    }
                } else {
                    try {
                        // Remove direct event listeners
                        this.nameDisplay.removeEventListener('mouseenter', this.handleMouseEnter);
                        this.nameDisplay.removeEventListener('mouseleave', this.handleMouseLeave);
                        console.log('LetterAnimationManager: Direct event listeners removed');
                    } catch (error) {
                        console.warn('LetterAnimationManager: Error removing direct event listeners:', error);
                    }
                }
            }
            
            // Clean up letters
            this.letters = [];
            this.nameDisplay = null;
            this.isInitialized = false;
            
            console.log('LetterAnimationManager: Module destroyed successfully');
            
        } catch (error) {
            console.error('LetterAnimationManager: Error during destruction:', error);
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
            usingEventManager: window.eventManager && (this.eventListenerIds.mouseenter || this.eventListenerIds.mouseleave)
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
