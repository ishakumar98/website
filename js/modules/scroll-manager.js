// Scroll Manager Module
// Handles scroll-based image positioning and animations
// Extracted from project-script.js for better organization

class ProjectScrollManager {
    constructor() {
        this.projectImagesSection = null;
        this.projectImagesHeight = 0;
        this.initialTop = 0;
        this.currentTop = 0;
        this.targetTop = 0;
        this.velocity = 0;
        this.lastScrollY = 0;
        this.isScrolling = false;
        this.scrollTimeout = null;
        this.animationFrameId = null;
        this.isInitialized = false;
        
        // Animation configuration
        this.animationConfig = {
            SCROLL_STOP_DELAY: 100,
            VELOCITY_MULTIPLIER: 0.1,
            EASE_OUT_START: 0.65,
            EASE_OUT_OFFSET: 0.495,
            EASE_OUT_POWER: 3
        };
        
        this.init();
    }
    
    init() {
        this.findElements();
        this.calculateDimensions();
        this.setupResizeListener();
        this.isInitialized = true;
        console.log('ProjectScrollManager: Initialized');
    }
    
    findElements() {
        this.projectImagesSection = document.querySelector('.project-images-section');
    }
    
    calculateDimensions() {
        if (this.projectImagesSection) {
            this.projectImagesHeight = this.projectImagesSection.scrollHeight;
            this.initialTop = window.innerHeight - 100; // Start with flower visible
            this.currentTop = this.initialTop;
            this.targetTop = this.initialTop;
        }
    }
    
    setupResizeListener() {
        if (window.eventManager) {
            window.eventManager.addListener(window, 'resize', () => {
                this.handleResize();
            });
        }
    }
    
    handleResize() {
        this.calculateDimensions();
    }
    
    startAnimationLoop() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
        this.updateProjectImagesPosition();
    }
    
    stopAnimationLoop() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    }
    
    updateProjectImagesPosition() {
        // Use multiple scroll detection methods for better compatibility
        const scrollY = window.pageYOffset || window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
        const scrollDelta = scrollY - this.lastScrollY;
        this.lastScrollY = scrollY;
        
        // Detect if user is actively scrolling
        this.isScrolling = true;
        clearTimeout(this.scrollTimeout);
        this.scrollTimeout = setTimeout(() => {
            this.isScrolling = false;
        }, this.animationConfig.SCROLL_STOP_DELAY);
        
        // Apply scroll multiplier to slow down overall movement (LSVP technique)
        const scrollMultiplier = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--scroll-multiplier')) || 0.25;
        const adjustedScrollY = scrollY * scrollMultiplier;
        
        // Calculate scroll progress based on images container height
        const maxScroll = this.projectImagesHeight;
        const scrollProgress = Math.min(adjustedScrollY / maxScroll, 1);
        
        // Enhanced easing for more dramatic momentum building and deceleration
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
        
        // Calculate new top position
        const startTop = this.initialTop;
        const endTop = 0;
        this.targetTop = startTop + (endTop - startTop) * easedProgress;
        
        // Apply LERP for smooth movement
        const lerpFactor = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--lerp-factor')) || 0.05;
        this.currentTop += (this.targetTop - this.currentTop) * lerpFactor;
        
        // Apply momentum when scrolling
        if (this.isScrolling) {
            this.velocity += scrollDelta * this.animationConfig.VELOCITY_MULTIPLIER;
            this.currentTop += this.velocity;
        }
        
        // Apply damping to velocity
        const velocityDamping = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--velocity-damping')) || 0.95;
        this.velocity *= velocityDamping;
        
        // Clamp position to prevent overshooting
        this.currentTop = Math.max(endTop, Math.min(startTop, this.currentTop));
        
        // Apply the calculated position with animation coordination
        if (this.projectImagesSection) {
            if (window.animationCoordinator) {
                window.animationCoordinator.registerJSAnimation(
                    this.projectImagesSection, 
                    'translate', 
                    'project-images-scroll', 
                    window.animationCoordinator.priorities.CRITICAL
                );
            }
            
            this.projectImagesSection.style.top = this.currentTop + 'px';
        }
        
        // Continue animation loop
        this.animationFrameId = requestAnimationFrame(() => {
            this.updateProjectImagesPosition();
        });
    }
    
    getScrollProgress() {
        const scrollY = window.pageYOffset || window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
        const maxScroll = this.projectImagesHeight;
        return Math.min(scrollY / maxScroll, 1);
    }
    
    getCurrentPosition() {
        return this.currentTop;
    }
    
    isReady() {
        return this.isInitialized && this.projectImagesSection !== null;
    }
    
    destroy() {
        this.stopAnimationLoop();
        this.projectImagesSection = null;
        this.isInitialized = false;
        console.log('ProjectScrollManager: Destroyed');
    }
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProjectScrollManager;
}

// Create global instance if not in module system
if (typeof window !== 'undefined') {
    window.ProjectScrollManager = ProjectScrollManager;
}
