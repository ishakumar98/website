// Homepage Scroll Manager Module
// Handles LSVP-style smooth scrolling for work section
// Properly implemented with working gradient scroll effect

class HomepageScrollManager {
    constructor() {
        // Core elements
        this.workSection = null;
        this.fireworksContainer = null;
        
        // Scroll state
        this.isScrolling = false;
        this.isFirstScroll = true;
        this.lastTop = 0;
        this.smoothingFactor = 0.1; // LERP smoothing factor
        
        // Configuration - using design system variables where possible
        this.config = {
            // Colors from design system
            FIREWORKS_BACKGROUND: 'var(--color-background-lighter)',  // #FCE8FF (lavender)
            WORK_BACKGROUND: 'var(--color-background)',               // #FFF5F8 (light pink)
            
            // Selectors
            WORK_SECTION_SELECTOR: '.work-section',
            
            // Animation timing from design system
            TRANSITION_DURATION: 'var(--transition-smooth)',
            
            // Scroll behavior
            SMOOTHING_FACTOR: 0.1,
            SCROLL_MULTIPLIER: 'var(--scroll-multiplier)'
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
        this.fireworksContainer.style.transition = this.config.TRANSITION_DURATION;
        
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
    
    // Update background color based on scroll progress
    updateBackgroundColor(easedProgress) {
        if (!this.fireworksContainer) return;
        
        // Background color transition effect - using design system colors
        // Get colors from CSS custom properties for dynamic access
        const getComputedColor = (property) => {
            const computedStyle = getComputedStyle(document.documentElement);
            const colorValue = computedStyle.getPropertyValue(property).trim();
            return colorValue;
        };
        
        // Use design system colors with fallbacks
        const initialColor = getComputedColor('--color-background-lighter') || '#FCE8FF';
        const finalColor = getComputedColor('--color-background') || '#FFF5F8';
        
        // Convert hex colors to RGB arrays for interpolation
        const hexToRgb = (hex) => {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? [
                parseInt(result[1], 16),
                parseInt(result[2], 16),
                parseInt(result[3], 16)
            ] : [252, 232, 255]; // Fallback to original lavender
        };
        
        const initialRgb = hexToRgb(initialColor);
        const finalRgb = hexToRgb(finalColor);
        
        const r = Math.round(initialRgb[0] + (finalRgb[0] - initialRgb[0]) * easedProgress);
        const g = Math.round(initialRgb[1] + (finalRgb[1] - initialRgb[1]) * easedProgress);
        const b = Math.round(initialRgb[2] + (finalRgb[2] - initialRgb[2]) * easedProgress);
        
        // Apply background color change through the AnimationCoordinator system
        if (window.animationCoordinator) {
            window.animationCoordinator.registerJSAnimation(
                this.fireworksContainer, 'background', 'fireworks-scroll', 'HIGH'
            );
        }
        
        // Update the fireworks container background
        this.fireworksContainer.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
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
            
            // Handle case where work section is smaller than viewport
            if (maxScroll <= window.innerHeight) {
                // For small sections, use a simpler scroll behavior
                const scrollProgress = Math.min(Math.max(scrollTop / window.innerHeight, 0), 1);
                const easedProgress = this.ultraSmoothEase(scrollProgress);
                
                // For small sections, ensure the bottom edge never goes above viewport bottom
                // Calculate the maximum allowed top position to keep bottom edge at viewport bottom
                const maxAllowedTop = window.innerHeight - maxScroll;
                
                // Position the section with strict bounds
                let newTop = window.innerHeight - (easedProgress * maxScroll);
                
                // Apply strict constraints: never above 0, never below maxAllowedTop
                newTop = Math.max(0, Math.min(maxAllowedTop, newTop));
                
                // Apply position smoothing
                newTop = this.lastTop + (this.smoothingFactor * (newTop - this.lastTop));
                this.lastTop = newTop;
                
                // Apply the new position
                this.workSection.style.top = Math.round(newTop) + 'px';
                
                // Debug logging for small section scroll
                if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                    console.log('Small Section Scroll Debug:', {
                        scrollTop,
                        maxScroll,
                        viewportHeight: window.innerHeight,
                        newTop,
                        maxAllowedTop,
                        bottomEdge: newTop + maxScroll,
                        scrollProgress,
                        easedProgress
                    });
                }
                
                // Handle background color transition for small sections
                this.updateBackgroundColor(easedProgress);
                this.isScrolling = false;
                return;
            }
            
            const scrollProgress = Math.min(Math.max(scrollTop / maxScroll, 0), 1);
            
            // Apply easing to the scroll progress
            const easedProgress = this.ultraSmoothEase(scrollProgress);
            
            // Calculate new top position
            // When scrollProgress = 0: top edge at bottom of viewport (fully collapsed)
            // When scrollProgress = 1: bottom edge at viewport bottom (fully expanded)
            let newTop = window.innerHeight - (easedProgress * maxScroll);
            
            // Add hard constraint to prevent the container from going beyond bounds
            const minTop = Math.max(0, window.innerHeight - maxScroll); // Bottom edge at viewport bottom, never above 0
            const maxTop = window.innerHeight; // Top edge at viewport bottom (CSS initial position)
            
            // Apply strict constraints with additional safety checks
            newTop = Math.max(minTop, Math.min(maxTop, newTop));
            
            // Additional safety: ensure the bottom edge never goes above viewport bottom
            const currentBottomEdge = newTop + maxScroll;
            if (currentBottomEdge > window.innerHeight) {
                newTop = window.innerHeight - maxScroll;
                newTop = Math.max(0, newTop); // Never go above 0
            }
            
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
            
            // Debug logging for scroll constraints
            if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                console.log('Scroll Debug:', {
                    scrollTop,
                    maxScroll,
                    viewportHeight: window.innerHeight,
                    newTop,
                    minTop,
                    maxTop,
                    bottomEdge: newTop + maxScroll,
                    scrollProgress,
                    easedProgress
                });
            }
            
            // Update background color
            this.updateBackgroundColor(easedProgress);
            
            this.isScrolling = false;
        });
    }
    
    // Public methods for external access
    getStatus() {
        return {
            isInitialized: this.workSection !== null && this.fireworksContainer !== null,
            workSectionFound: this.workSection !== null,
            fireworksContainerFound: this.fireworksContainer !== null,
            isScrolling: this.isScrolling,
            isFirstScroll: this.isFirstScroll,
            lastTop: this.lastTop,
            configuration: {
                fireworksBackground: this.config.FIREWORKS_BACKGROUND,
                workBackground: this.config.WORK_BACKGROUND,
                transitionDuration: this.config.TRANSITION_DURATION,
                smoothingFactor: this.config.SMOOTHING_FACTOR
            },
            designSystemIntegration: {
                colors: this.config.FIREWORKS_BACKGROUND.includes('var(--') && this.config.WORK_BACKGROUND.includes('var(--'),
                transitions: this.config.TRANSITION_DURATION.includes('var(--'),
                scrollMultiplier: this.config.SCROLL_MULTIPLIER.includes('var(--')
            }
        };
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
