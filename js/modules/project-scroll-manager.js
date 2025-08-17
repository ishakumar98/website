// Project Scroll Manager Module
// Handles LSVP-style smooth scrolling for project images with flower logo scaling
// Extracted from project-script.js for better organization

class ProjectScrollManager {
    constructor() {
        this.projectImagesSection = null;
        this.flowerElement = null;
        this.isInitialized = false;
        this.animationLoopActive = false;
        this.currentTop = 0;
        
        // Animation & Scroll Behavior configuration
        this.animationConfig = {
            LERP_FACTOR: parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--lerp-factor')) || 0.05,
            SCROLL_STOP_DELAY: getComputedStyle(document.documentElement).getPropertyValue('--animation-fast') || '100ms',
            VELOCITY_MULTIPLIER: 0.01,
            EASE_OUT_START: 0.65,
            EASE_OUT_POWER: 4.5,
            EASE_OUT_OFFSET: 0.892
        };
        
        this.init();
    }
    
    init() {
        // Try to initialize immediately
        this.tryInitialize();
        
        // Also listen for the event in case it comes later
        document.addEventListener('projectContentReady', () => {
            this.tryInitialize();
        });
        
        // Fallback: try again after a delay
        setTimeout(() => {
            this.tryInitialize();
        }, 1000);
    }
    
    tryInitialize() {
        if (this.isInitialized) return;
        
        console.log('ProjectScrollManager: Attempting to initialize...');
        
        this.findElements();
        if (this.projectImagesSection) {
            console.log('ProjectScrollManager: Found project images section, setting up scroll behavior...');
            this.setupScrollBehavior();
            this.isInitialized = true;
            console.log('ProjectScrollManager: Successfully initialized!');
        } else {
            console.log('ProjectScrollManager: Project images section not found, will retry...');
        }
    }
    
    findElements() {
        this.projectImagesSection = document.querySelector('.project-images-section');
        
        if (this.projectImagesSection) {
            this.flowerElement = this.projectImagesSection.querySelector('.flower');
        } else {
            this.flowerElement = null;
        }
        
        if (!this.projectImagesSection) {
            return;
        }
    }
    
    setupScrollBehavior() {
        if (!this.projectImagesSection) {
            return;
        }
        
        const viewportHeight = window.innerHeight;
        const projectImagesHeight = this.projectImagesSection.offsetHeight;
        
        // Calculate initial positioning for flower visibility
        let initialTop = this.calculateInitialPosition(viewportHeight);
        
        // LERP variables for smooth movement
        let currentTop = initialTop;
        let targetTop = initialTop;
        const lerpFactor = this.animationConfig.LERP_FACTOR;
        
        // Momentum variables for LSVP-style gooey feel
        let velocity = 0;
        let isScrolling = false;
        let lastScrollY = 0;
        let scrollTimeout;
        
        // Use the CSS position as the starting point
        const cssTop = getComputedStyle(this.projectImagesSection).top;
        const cssTopValue = parseFloat(cssTop);
        
        // Store the CSS position for our calculations
        this.initialTop = cssTopValue;
        
        // Register the CSS positioning with AnimationCoordinator to prevent conflicts
        if (window.AnimationCoordinator) {
            window.AnimationCoordinator.registerCSSAnimation(
                this.projectImagesSection,
                'top',
                'project-images-initial-position',
                window.AnimationCoordinator.priorities.MEDIUM
            );
        }
        
        // Initialize flower hover effects
        this.setupFlowerHoverEffects();
        
        // Don't start animation loop yet - wait for actual scrolling
        // Store the initial position for later use
        this.initialTop = initialTop;
        this.lerpFactor = lerpFactor;
        this.velocity = velocity;
        this.isScrolling = isScrolling;
        this.lastScrollY = lastScrollY;
        this.scrollTimeout = scrollTimeout;
        
        // Register with ScrollManager for coordination
        if (window.ScrollManager) {
            window.ScrollManager.registerScrollHandler('project-images-scroll', this.updateProjectImagesPosition.bind(this));
        }
        
        // Add scroll event listener to start animation loop when scrolling begins
        window.addEventListener('scroll', () => {
            if (!this.animationLoopActive && Math.abs(window.pageYOffset) > 5) {
                this.startAnimationLoop();
            }
        });
    }
    
    // Calculate initial position for flower visibility
    calculateInitialPosition(viewportHeight) {
        if (!this.flowerElement) {
            // Fallback: position container so top edge is at bottom of viewport
            return viewportHeight;
        }
        
        // Get the flower's actual rendered dimensions
        const flowerRect = this.flowerElement.getBoundingClientRect();
        const flowerHeight = flowerRect.height;
        
        // Get computed styles for margins
        const flowerStyles = getComputedStyle(this.flowerElement);
        const flowerTopMargin = parseFloat(flowerStyles.marginTop);
        const flowerBottomMargin = parseFloat(flowerStyles.marginBottom);
        
        // Get container padding (project-images-section has 16px top and bottom padding)
        const containerStyles = getComputedStyle(this.projectImagesSection);
        const containerTopPadding = parseFloat(containerStyles.paddingTop);
        const containerBottomPadding = parseFloat(containerStyles.paddingBottom);
        
        // Calculate total space the flower takes up including container padding
        const flowerTotalHeight = flowerHeight + flowerTopMargin + flowerBottomMargin;
        const containerPadding = containerTopPadding + containerBottomPadding;
        
        // Calculate where the image container should be positioned
        // We want the bottom of the flower to be visible at the bottom of the viewport
        // So: viewport bottom = flower bottom + flower bottom margin + container bottom padding
        const imageContainerStartPosition = viewportHeight - flowerTotalHeight - containerBottomPadding;
        
        // The content area height should be the space from top of viewport to where image container starts
        // This is simply the imageContainerStartPosition since it's measured from the top
        const contentAreaHeight = imageContainerStartPosition;
        
        // Update the CSS custom property for font sizing manager
        // This should be the HEIGHT of the content area
        document.documentElement.style.setProperty('--image-container-top', contentAreaHeight + 'px');
        
        // Also update the actual position of the image container to match our calculation
        this.projectImagesSection.style.top = imageContainerStartPosition + 'px';
        

        
        // Notify other modules that image container position is ready
        document.dispatchEvent(new CustomEvent('imageContainerPositionReady', {
            detail: {
                imageContainerTop: contentAreaHeight,
                viewportHeight: viewportHeight
            }
        }));
        

        
        return contentAreaHeight;
    }
    
    // Setup flower hover effects
    setupFlowerHoverEffects() {
        if (!this.flowerElement || !window.EventManager) return;
        
        let spinDirection = 'clockwise'; // Start with clockwise
        
        window.EventManager.addListener(this.flowerElement, 'mouseenter', () => {
            // Toggle spin direction on each hover
            if (spinDirection === 'clockwise') {
                this.flowerElement.setAttribute('data-spin-direction', 'counter');
                spinDirection = 'counter';
            } else {
                this.flowerElement.removeAttribute('data-spin-direction');
                spinDirection = 'clockwise';
            }
        });
    }
    
    // Start the animation loop (only called when scrolling begins)
    startAnimationLoop() {
        if (this.animationLoopActive) return; // Prevent multiple loops
        
        this.animationLoopActive = true;
        
        // Initialize currentTop to match the current CSS position to prevent jumping
        const currentCSSTop = getComputedStyle(this.projectImagesSection).top;
        this.currentTop = parseFloat(currentCSSTop);
        
        // Unregister CSS positioning since JS is now controlling it
        if (window.AnimationCoordinator) {
            window.AnimationCoordinator.unregisterAnimation(
                this.projectImagesSection, 
                'project-images-initial-position'
            );
        }
        
        const updateProjectImagesPosition = () => {
            if (!this.animationLoopActive) return; // Stop if disabled
            
            // Use multiple scroll detection methods for better compatibility
            const scrollY = window.pageYOffset || window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
            const scrollDelta = scrollY - this.lastScrollY;
            this.lastScrollY = scrollY;
            
            // Detect if user is actively scrolling
            this.isScrolling = true;
            clearTimeout(this.scrollTimeout);
            this.scrollTimeout = setTimeout(() => {
                this.isScrolling = false;
            }, parseInt(this.animationConfig.SCROLL_STOP_DELAY));
            
            // Apply scroll multiplier to slow down overall movement (LSVP technique)
            const scrollMultiplier = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--scroll-multiplier')) || 0.25;
            const adjustedScrollY = scrollY * scrollMultiplier;
            
            // Calculate scroll progress based on images container height
            const maxScroll = this.projectImagesSection.offsetHeight;
            const scrollProgress = Math.min(adjustedScrollY / maxScroll, 1);
            
            // Update flower size based on scroll progress (bloomtype-style)
            if (window.flowerManager && window.flowerManager.isReady()) {
                window.flowerManager.updateFlowerSize(scrollProgress);
            }
            
            // Enhanced easing for more dramatic momentum building and deceleration
            let easedProgress = this.calculateEasedProgress(scrollProgress);
            
            // Calculate new top position
            const startTop = this.initialTop;
            const endTop = 0;
            const targetTop = startTop + (endTop - startTop) * easedProgress;
            
            // Apply LERP for smooth movement
            this.currentTop += (targetTop - this.currentTop) * this.lerpFactor;
            
            // Apply momentum when scrolling
            if (this.isScrolling) {
                this.velocity += scrollDelta * this.animationConfig.VELOCITY_MULTIPLIER;
                this.currentTop += this.velocity;
            }
            
            // Apply damping to velocity
            this.velocity *= parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--velocity-damping')) || 0.95;
            
            // Clamp position to prevent overshooting
            this.currentTop = Math.max(endTop, Math.min(startTop, this.currentTop));
            
            // Apply the calculated position with animation coordination
            if (window.AnimationCoordinator) {
                window.AnimationCoordinator.registerJSAnimation(
                    this.projectImagesSection, 
                    'top', 
                    'project-images-scroll', 
                    window.AnimationCoordinator.priorities.CRITICAL
                );
            }
            
            this.projectImagesSection.style.top = this.currentTop + 'px';
            
            // Continue animation loop
            requestAnimationFrame(updateProjectImagesPosition);
        };
        
        // Start the loop
        updateProjectImagesPosition();
    }
    
    // Calculate eased progress for smooth animation
    calculateEasedProgress(scrollProgress) {
        let easedProgress;
        
        if (scrollProgress < 0.25) {
            // Start even slower (0-25% of scroll) - more dramatic slow start
            easedProgress = scrollProgress * scrollProgress * scrollProgress * 0.3;
        } else if (scrollProgress < this.animationConfig.EASE_OUT_START) {
            // Build momentum (25-65% of scroll) - more aggressive acceleration
            easedProgress = 0.012 + (scrollProgress - 0.25) * 2.2;
        } else {
            // Ease out with very dramatic deceleration (65-100% of scroll)
            const finalProgress = (scrollProgress - this.animationConfig.EASE_OUT_START) / 0.35;
            easedProgress = this.animationConfig.EASE_OUT_OFFSET + (1 - Math.pow(1 - finalProgress, this.animationConfig.EASE_OUT_POWER));
        }
        
        return easedProgress;
    }
    
    // Handle window resize
    handleResize() {
        if (!this.isInitialized) return;
        
        // Get the CSS position (which should already be correct)
        const cssTop = getComputedStyle(this.projectImagesSection).top;
        const cssTopValue = parseFloat(cssTop);
        
        // Update our stored initial position
        this.initialTop = cssTopValue;
    }
    
    // Check if initialized
    isReady() {
        return this.isInitialized;
    }
    
    // Destroy and cleanup
    destroy() {
        this.isInitialized = false;
        
        // Stop animation loop
        this.animationLoopActive = false;
        
        // Re-register CSS positioning for fallback
        if (window.AnimationCoordinator) {
            window.AnimationCoordinator.registerCSSAnimation(
                this.projectImagesSection,
                'top',
                'project-images-initial-position',
                window.AnimationCoordinator.priorities.MEDIUM
            );
        }
        
        // Unregister from ScrollManager
        if (window.ScrollManager) {
            window.ScrollManager.unregisterScrollHandler('project-images-scroll');
        }
    }
}

// Export for module system
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProjectScrollManager;
} else if (typeof window !== 'undefined') {
    window.ProjectScrollManager = ProjectScrollManager;
}
