// Centralized Scroll Manager
// Coordinates all scroll behaviors across the site while preserving existing effects

class ScrollManager {
    constructor() {
        this.listeners = new Map(); // Track all scroll listeners with priorities
        this.isScrolling = false;
        this.scrollTimeout = null;
        this.lastScrollY = 0;
        this.scrollDelta = 0;
        
        // Animation frame management
        this.animationFrameId = null;
        this.isAnimating = false;
        
        // Centralized scroll handler
        this.boundHandleScroll = this.handleScroll.bind(this);
        
        // Initialize
        this.init();
    }
    
    init() {
        // Add the main scroll listener
        window.addEventListener('scroll', this.boundHandleScroll, { passive: true });
    }
    
    // Register scroll listeners with priorities
    addScrollListener(id, callback, priority = 'normal', options = {}) {
        const listener = {
            id,
            callback,
            priority,
            options,
            active: true
        };
        
        this.listeners.set(id, listener);
        
        // Sort listeners by priority (high, normal, low)
        this.sortListeners();
        
        console.log(`ScrollManager: Added listener "${id}" with priority "${priority}"`);
    }
    
    // Remove specific listeners
    removeScrollListener(id) {
        if (this.listeners.has(id)) {
            this.listeners.delete(id);
            console.log(`ScrollManager: Removed listener "${id}"`);
        }
    }
    
    // Sort listeners by priority
    sortListeners() {
        const priorityOrder = { 'high': 3, 'normal': 2, 'low': 1 };
        
        // Convert to array, sort, and rebuild map
        const sortedListeners = Array.from(this.listeners.entries())
            .sort(([, a], [, b]) => priorityOrder[b.priority] - priorityOrder[a.priority]);
        
        this.listeners.clear();
        sortedListeners.forEach(([id, listener]) => {
            this.listeners.set(id, listener);
        });
    }
    
    // Centralized scroll handler
    handleScroll(event) {
        const scrollY = window.pageYOffset || window.scrollY || 
                       document.documentElement.scrollTop || document.body.scrollTop || 0;
        
        this.scrollDelta = scrollY - this.lastScrollY;
        this.lastScrollY = scrollY;
        
        // Detect if user is actively scrolling
        this.isScrolling = true;
        clearTimeout(this.scrollTimeout);
        this.scrollTimeout = setTimeout(() => {
            this.isScrolling = false;
        }, 100); // Consider scrolling stopped after 100ms
        
        // Execute all active listeners in priority order
        this.executeListeners(scrollY, this.scrollDelta, this.isScrolling);
        
        // Start animation loop if not already running
        if (!this.isAnimating) {
            this.startAnimationLoop();
        }
    }
    
    // Execute all scroll listeners
    executeListeners(scrollY, scrollDelta, isScrolling) {
        for (const [, listener] of this.listeners) {
            if (listener.active) {
                try {
                    listener.callback(scrollY, scrollDelta, isScrolling, event);
                } catch (error) {
                    console.error(`ScrollManager: Error in listener "${listener.id}":`, error);
                }
            }
        }
    }
    
    // Start the animation loop
    startAnimationLoop() {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        this.animationFrameId = requestAnimationFrame(() => {
            this.animationLoop();
        });
    }
    
    // Main animation loop
    animationLoop() {
        if (this.isAnimating) {
            this.animationFrameId = requestAnimationFrame(() => {
                this.animationLoop();
            });
        }
    }
    
    // Stop the animation loop
    stopAnimationLoop() {
        this.isAnimating = false;
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    }
    
    // Get current scroll state
    getScrollState() {
        return {
            scrollY: this.lastScrollY,
            scrollDelta: this.scrollDelta,
            isScrolling: this.isScrolling
        };
    }
    
    // Cleanup
    destroy() {
        this.stopAnimationLoop();
        window.removeEventListener('scroll', this.boundHandleScroll);
        this.listeners.clear();
        console.log('ScrollManager: Destroyed');
    }
}

// Create global instance
window.scrollManager = new ScrollManager();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ScrollManager;
}
