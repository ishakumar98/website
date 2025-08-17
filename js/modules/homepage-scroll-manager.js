// Homepage Scroll Manager Module
// Handles LSVP-style smooth scrolling for work section
// Extracted from scroll-behavior.js for better organization

class HomepageScrollManager {
    constructor() {
        this.workSection = null;
        this.isInitialized = false;
        this.isScrolling = false;
        this.scrollTarget = 0;
        this.currentScroll = 0;
        this.scrollEasing = 0.08;
        
        // Scroll configuration - exact same as current implementation
        this.config = {
            SCROLL_EASING: 0.08,           // Smoothness factor
            SCROLL_THRESHOLD: 50,          // Minimum scroll distance
            WORK_SECTION_SELECTOR: '.work-section',
            SCROLL_CONTAINER: 'body',
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
            this.startScrollLoop();
            
            this.isInitialized = true;
            
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
            return;
        }
        
        // Find or create background transition element
        this.setupBackgroundTransition();
        
        // Reset scroll position to top on page load/reload (same as original)
        window.scrollTo(0, 0);
        
        // Set initial work section position to show full shadow (same as original CSS)
        this.setInitialWorkSectionPosition();
        
        // Get current scroll position
        this.currentScroll = window.pageYOffset || document.documentElement.scrollTop;
        this.scrollTarget = this.currentScroll;
    }
    
    setInitialWorkSectionPosition() {
        if (!this.workSection) return;
        
        // Simple and flexible: position top edge exactly at bottom of viewport
        // The shadow will be visible by default since it extends above the element
        const initialTop = window.innerHeight;
        this.workSection.style.top = initialTop + 'px';
    }
    
    setupBackgroundTransition() {
        // Find the existing fireworks container
        this.fireworksContainer = document.getElementById('fireworks-container');
        
        if (this.fireworksContainer) {
            // Set initial background color to lavender
            this.fireworksContainer.style.backgroundColor = this.config.FIREWORKS_BACKGROUND;
            
            // Add smooth CSS transition for the background color
            this.fireworksContainer.style.transition = 'background-color var(--transition-smooth)';
            
            // Ensure the background color can be changed by JavaScript
            this.fireworksContainer.style.setProperty('background-color', this.config.FIREWORKS_BACKGROUND, 'important');
        }
    }
    
    setupEventListeners() {
        // Listen for scroll events
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            this.isScrolling = true;
            clearTimeout(scrollTimeout);
            
            // Notify ScrollManager that scrolling is happening (this will stop fireworks)
            if (window.ScrollManager) {
                window.ScrollManager.notifyScroll('homepage', true);
            }
            
            scrollTimeout = setTimeout(() => {
                this.isScrolling = false;
                
                // Notify ScrollManager that scrolling has stopped
                if (window.ScrollManager) {
                    window.ScrollManager.notifyScroll('homepage', false);
                }
            }, 150);
        });
        

        
        // Register with ScrollManager for coordination
        if (window.ScrollManager) {
            window.ScrollManager.registerScrollHandler('homepage', (isScrolling) => {
                this.isScrolling = isScrolling;
            });
        }
        
        // Register with EventManager for coordination
        if (window.EventManager) {
            window.EventManager.register('homepage-scroll', {
                // No scroll control needed - just let natural scrolling happen
            });
        }
        
        // Handle window resize to maintain correct positioning
        window.addEventListener('resize', () => {
            this.handleResize();
        });
    }
    
    handleResize() {
        // Don't reposition the work container on resize
        // Let it maintain its current scroll position and resize naturally
        // The CSS and existing positioning will handle the resize behavior
        
        console.log('HomepageScrollManager: Resize handled, position maintained');
    }
    
    isInWorkSection() {
        if (!this.workSection) return false;
        
        const rect = this.workSection.getBoundingClientRect();
        return rect.top <= window.innerHeight && rect.bottom >= 0;
    }
    

    

    
    updateBackgroundColor() {
        if (!this.fireworksContainer || !this.workSection) return;
        
        // Calculate scroll progress through the work section
        const scrollProgress = this.getScrollProgress();
        
        // Interpolate between fireworks background and work background
        const currentColor = this.interpolateColors(
            this.config.FIREWORKS_BACKGROUND,
            this.config.WORK_BACKGROUND,
            scrollProgress
        );
        
        // Update the fireworks container background using the same method as the original
        this.fireworksContainer.style.setProperty('background-color', currentColor, 'important');
    }
    
    interpolateColors(color1, color2, factor) {
        // Use the exact same method as the original implementation
        // Convert hex to RGB arrays for interpolation
        const initialColor = [252, 232, 255]; // #FCE8FF (lavender)
        const finalColor = [255, 245, 248];  // #FFF5F8 (light pink)
        
        // Interpolate each component using the same formula as the original
        const r = Math.round(initialColor[0] + (finalColor[0] - initialColor[0]) * factor);
        const g = Math.round(initialColor[1] + (finalColor[1] - initialColor[1]) * factor);
        const b = Math.round(initialColor[2] + (finalColor[2] - initialColor[2]) * factor);
        
        // Return RGB format to match the original implementation
        return `rgb(${r}, ${g}, ${b})`;
    }
    
    getScrollProgress() {
        if (!this.workSection) return 0;
        
        // Calculate scroll progress based on work section position relative to viewport
        const rect = this.workSection.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const sectionHeight = this.workSection.offsetHeight;
        
        // When top edge is at viewport bottom: progress = 0
        // When bottom edge is at viewport bottom: progress = 1
        if (rect.top >= viewportHeight) return 0;
        if (rect.bottom <= 0) return 1;
        
        // Calculate progress based on how much of the section has moved into view
        const progress = (viewportHeight - rect.top) / sectionHeight;
        return Math.max(0, Math.min(1, progress));
    }
    
    destroy() {
        this.stopScrollLoop();
        
        // Remove event listeners
        if (this.workSection) {
            this.workSection.removeEventListener('wheel', this.handleWheelScroll);
        }
        
        // Clean up background elements
        if (this.fireworksContainer) {
            // Reset fireworks container background to default
            this.fireworksContainer.style.removeProperty('background-color');
            this.fireworksContainer.style.removeProperty('transition');
            this.fireworksContainer = null;
        }
        
        // Unregister from coordination systems
        if (window.ScrollManager) {
            window.ScrollManager.unregisterScrollHandler('homepage');
        }
        
        if (window.EventManager) {
            window.EventManager.unregister('homepage-scroll');
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
