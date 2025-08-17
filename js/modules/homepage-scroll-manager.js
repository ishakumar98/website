// Homepage Scroll Manager Module
// Handles LSVP-style smooth scrolling for work section
// Properly implemented with working gradient scroll effect

class HomepageScrollManager {
    constructor() {
        this.workSection = null;
        this.fireworksContainer = null;
        this.isInitialized = false;
        this.isScrolling = false;
        
        // Position smoothing properties (LERP)
        this.lastTop = 100; // Start from CSS initial position (100vh = 100% of viewport)
        this.smoothingFactor = 0.15; // Lower = smoother but less responsive
        
        // Initialize lastTop from CSS position on first scroll
        this.isFirstScroll = true;
        
        // Scroll configuration
        this.config = {
            WORK_SECTION_SELECTOR: '.work-section',
            FIREWORKS_BACKGROUND: '#FCE8FF',  // Lavender background (fireworks)
            WORK_BACKGROUND: '#FFF5F8'        // Light pink background (work section)
        };
        
        this.init();
    }
    
    async init() {
        try {
            // Check if we're on homepage
            if (!this.isHomepage()) {
                return;
            }
            
            this.setupElements();
            this.setupEventListeners();
            
            this.isInitialized = true;
            console.log('HomepageScrollManager: Initialized successfully');
            
        } catch (error) {
            console.error('HomepageScrollManager: Initialization error:', error);
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
    
    setupElements() {
        // Find work section
        this.workSection = document.querySelector(this.config.WORK_SECTION_SELECTOR);
        if (!this.workSection) {
            console.error('HomepageScrollManager: Work section not found');
            return;
        }
        
        // Find fireworks container
        this.fireworksContainer = document.getElementById('fireworks-container');
        if (!this.fireworksContainer) {
            console.error('HomepageScrollManager: Fireworks container not found');
            return;
        }
        
        // Set initial background color to lavender
        this.setupBackgroundTransition();
        
        // Reset scroll position to top on page load/reload
        window.scrollTo(0, 0);
        
        // Set initial work section position
        this.setInitialWorkSectionPosition();
        
        console.log('HomepageScrollManager: Elements setup complete');
    }
    
    setInitialWorkSectionPosition() {
        if (!this.workSection) return;
        
        // Position top edge exactly at bottom of viewport
        const initialTop = window.innerHeight;
        this.workSection.style.top = initialTop + 'px';
        
        // Initialize lastTop for smoothing
        this.lastTop = initialTop;
    }
    
    setupBackgroundTransition() {
        if (!this.fireworksContainer) return;
        
        // Set initial background color to lavender
        this.fireworksContainer.style.backgroundColor = this.config.FIREWORKS_BACKGROUND;
        
        // Add smooth CSS transition for the background color
        this.fireworksContainer.style.transition = 'background-color var(--transition-smooth)';
        
        console.log('HomepageScrollManager: Background transition setup complete');
    }
    
    setupEventListeners() {
        // Register with ScrollManager for coordination
        if (window.scrollManager) {
            window.scrollManager.addScrollListener('work-section-scroll', this.handleScroll.bind(this), 'normal');
            console.log('HomepageScrollManager: Registered with ScrollManager');
        } else {
            console.error('HomepageScrollManager: ScrollManager not available');
        }
        
        // Register with EventManager for coordination
        if (window.eventManager) {
            // Use addListener for scroll events if needed
            this.eventListenerId = window.eventManager.addListener(window, 'scroll', this.handleScroll.bind(this), { passive: true });
            console.log('HomepageScrollManager: Registered with EventManager');
        } else {
            console.error('HomepageScrollManager: EventManager not available');
        }
    }
    
    // Ultra-smooth easing function for buttery smooth movement
    ultraSmoothEase(t) {
        // Use a very gradual curve that's extremely smooth
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }
    
    // Main scroll handler - implements the working gradient scroll effect
    handleScroll(event) {
        // Handle both ScrollManager calls and direct scroll events
        let scrollTop;
        if (typeof event === 'object' && event.type === 'scroll') {
            // Direct scroll event
            scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        } else {
            // ScrollManager call
            scrollTop = event;
        }
        
        if (this.isScrolling) return;
        this.isScrolling = true;
        
        requestAnimationFrame(() => {
            // On first scroll, initialize lastTop from CSS position
            if (this.isFirstScroll) {
                const computedStyle = window.getComputedStyle(this.workSection);
                this.lastTop = parseFloat(computedStyle.top);
                this.isFirstScroll = false;
            }
            
            // Calculate scroll progress (0 = fully collapsed, 1 = fully expanded)
            const maxScroll = this.workSection.offsetHeight;
            const scrollProgress = Math.min(Math.max(scrollTop / maxScroll, 0), 1);
            
            // Apply easing to the scroll progress
            const easedProgress = this.ultraSmoothEase(scrollProgress);
            
            // Calculate new top position
            // When scrollProgress = 0: top edge at bottom of viewport (fully collapsed)
            // When scrollProgress = 1: bottom edge at viewport bottom (fully expanded)
            let newTop = window.innerHeight - (easedProgress * maxScroll);
            
            // Add hard constraint to prevent the container from going beyond bounds
            const minTop = window.innerHeight - maxScroll; // Bottom edge at viewport bottom
            const maxTop = window.innerHeight; // Top edge at viewport bottom (CSS initial position)
            
            newTop = Math.max(minTop, Math.min(maxTop, newTop));
            
            // Apply position smoothing for ultra-smooth movement (LERP)
            if (scrollProgress === 0 || scrollProgress === 1) {
                // At the extremes, use exact positioning to ensure proper collapse/expand
                newTop = newTop;
            } else {
                // During mid-scroll, apply smoothing for smooth movement
                newTop = this.lastTop + (this.smoothingFactor * (newTop - this.lastTop));
            }
            this.lastTop = newTop;
            
            // Round the position to reduce jitter
            newTop = Math.round(newTop);
            
            // Apply the new position directly for smooth scrolling
            this.workSection.style.top = newTop + 'px';
            
            // Background color transition effect - EXACTLY as in the working version
            // Transition from #FCE8FF (lavender) to main page background color
            const initialColor = [252, 232, 255]; // #FCE8FF (lavender)
            const finalColor = [255, 245, 248]; // #FFF5F8 (main page background)
            
            const r = Math.round(initialColor[0] + (finalColor[0] - initialColor[0]) * easedProgress);
            const g = Math.round(initialColor[1] + (finalColor[1] - initialColor[1]) * easedProgress);
            const b = Math.round(initialColor[2] + (finalColor[2] - initialColor[2]) * easedProgress);
            
            // Apply background color change through the AnimationCoordinator system
            if (window.animationCoordinator) {
                window.animationCoordinator.registerJSAnimation(
                    this.fireworksContainer, 'background', 'fireworks-scroll', 'HIGH'
                );
            }
            
            // Update the fireworks container background
            this.fireworksContainer.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
            
            this.isScrolling = false;
        });
    }
    
    destroy() {
        // Clean up background elements
        if (this.fireworksContainer) {
            // Reset fireworks container background to default
            this.fireworksContainer.style.removeProperty('background-color');
            this.fireworksContainer.style.removeProperty('transition');
            this.fireworksContainer = null;
        }
        
        // Unregister from coordination systems
        if (window.scrollManager) {
            window.scrollManager.removeScrollListener('work-section-scroll');
        }
        
        if (window.eventManager && this.eventListenerId) {
            window.eventManager.removeListener(this.eventListenerId);
        }
        
        this.isInitialized = false;
        console.log('HomepageScrollManager: Destroyed');
    }
}

// Export for module system
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HomepageScrollManager;
} else if (typeof window !== 'undefined') {
    window.HomepageScrollManager = HomepageScrollManager;
}
