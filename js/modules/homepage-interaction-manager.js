// Homepage Interaction Manager Module
// Handles hover effects, folder interactions, and other UI behaviors
// Extracted from script.js for better organization

class HomepageInteractionManager {
    constructor() {
        this.workItems = [];
        this.folderItems = [];
        this.isInitialized = false;
        this.initializationAttempts = 0;
        this.maxInitializationAttempts = 3;
        
        // Interaction configuration
        this.config = {
            HOVER_TRANSITION: 'var(--transition-smooth)',
            HOVER_BACKGROUND: 'rgba(29, 28, 29, 0.06)'
        };
        
        this.init();
    }
    
    async init() {
        try {
            // Check if we're on homepage
            if (!this.isHomepage()) {
                console.log('HomepageInteractionManager: Not on homepage, skipping initialization');
                return;
            }
            
            this.setupElements();
            this.setupEventListeners();
            
            this.isInitialized = true;
            console.log('HomepageInteractionManager: Initialized successfully');
            
        } catch (error) {
            this.handleInitializationError(error);
        }
    }
    
    handleInitializationError(error) {
        this.initializationAttempts++;
        
        console.error('HomepageInteractionManager: Initialization error:', {
            error: error.message,
            stack: error.stack,
            attempt: this.initializationAttempts,
            maxAttempts: this.maxInitializationAttempts
        });
        
        // Attempt to recover if we haven't exceeded max attempts
        if (this.initializationAttempts < this.maxInitializationAttempts) {
            console.log(`HomepageInteractionManager: Retrying initialization (attempt ${this.initializationAttempts + 1}/${this.maxInitializationAttempts})`);
            setTimeout(() => this.init(), 1000 * this.initializationAttempts); // Exponential backoff
        } else {
            console.error('HomepageInteractionManager: Max initialization attempts reached, giving up');
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
    
    setupElements() {
        try {
            // Find all work items
            this.workItems = document.querySelectorAll('.work-item');
            console.log(`HomepageInteractionManager: Found ${this.workItems.length} work items`);
            
            // Find all folder items (if they exist)
            this.folderItems = document.querySelectorAll('.finder li');
            console.log(`HomepageInteractionManager: Found ${this.folderItems.length} folder items`);
            
        } catch (error) {
            console.error('HomepageInteractionManager: Error setting up elements:', error);
            throw error; // Re-throw to be caught by init()
        }
    }
    
    setupEventListeners() {
        try {
            // Set up work item interactions
            this.setupWorkItemInteractions();
            
            // Set up folder item interactions
            this.setupFolderItemInteractions();
            
            // Register with EventManager for coordination
            this.registerWithEventManager();
            
        } catch (error) {
            console.error('HomepageInteractionManager: Error setting up event listeners:', error);
            throw error; // Re-throw to be caught by init()
        }
    }
    
    registerWithEventManager() {
        if (window.eventManager) {
            try {
                window.eventManager.register('homepage-interactions', {
                    refresh: () => this.refreshElements(),
                    enable: () => this.enableInteractions(),
                    disable: () => this.disableInteractions()
                });
                console.log('HomepageInteractionManager: Registered with EventManager successfully');
            } catch (error) {
                console.warn('HomepageInteractionManager: Failed to register with EventManager:', error);
                // Non-critical error, continue without registration
            }
        } else {
            console.warn('HomepageInteractionManager: EventManager not available, skipping registration');
        }
    }
    
    setupWorkItemInteractions() {
        if (!this.workItems || this.workItems.length === 0) {
            console.warn('HomepageInteractionManager: No work items found for interaction setup');
            return;
        }
        
        this.workItems.forEach((workItem, index) => {
            try {
                const wrapperImage = workItem.querySelector('.wrapper-image');
                const titleSpan = workItem.querySelector('.title span');
                
                if (wrapperImage) {
                    // Wrapper image hover effects
                    workItem.addEventListener('mouseenter', () => {
                        this.handleWorkItemHover(wrapperImage, titleSpan, true);
                    });
                    
                    workItem.addEventListener('mouseleave', () => {
                        this.handleWorkItemHover(wrapperImage, titleSpan, false);
                    });
                } else {
                    console.warn(`HomepageInteractionManager: Work item ${index} missing wrapper-image element`);
                }
            } catch (error) {
                console.error(`HomepageInteractionManager: Error setting up work item ${index} interactions:`, error);
            }
        });
    }
    
    setupFolderItemInteractions() {
        if (!this.folderItems || this.folderItems.length === 0) {
            console.log('HomepageInteractionManager: No folder items found, skipping folder interactions');
            return;
        }
        
        this.folderItems.forEach((folderItem, index) => {
            try {
                const wrapperImage = folderItem.querySelector('.wrapper-image');
                const titleSpan = folderItem.querySelector('.title span');
                
                if (wrapperImage) {
                    // Folder item hover effects
                    folderItem.addEventListener('mouseenter', () => {
                        this.handleFolderItemHover(wrapperImage, titleSpan, true);
                    });
                    
                    folderItem.addEventListener('mouseleave', () => {
                        this.handleFolderItemHover(wrapperImage, titleSpan, false);
                    });
                } else {
                    console.warn(`HomepageInteractionManager: Folder item ${index} missing wrapper-image element`);
                }
            } catch (error) {
                console.error(`HomepageInteractionManager: Error setting up folder item ${index} interactions:`, error);
            }
        });
    }
    
    handleWorkItemHover(wrapperImage, titleSpan, isHovering) {
        if (!wrapperImage) {
            console.warn('HomepageInteractionManager: handleWorkItemHover called with null wrapperImage');
            return;
        }
        
        try {
            if (isHovering) {
                // Apply hover effects - just the grey background with smooth transition
                wrapperImage.style.backgroundColor = this.config.HOVER_BACKGROUND;
                wrapperImage.style.transition = this.config.HOVER_TRANSITION;
                
                // Apply title hover effects if available
                if (titleSpan) {
                    titleSpan.style.backgroundColor = this.config.HOVER_BACKGROUND;
                    titleSpan.style.padding = '0 var(--space-sm)';
                    titleSpan.style.borderRadius = 'var(--space-xs)';
                    titleSpan.style.transition = this.config.HOVER_TRANSITION;
                }
            } else {
                // Remove hover effects - just remove the background
                wrapperImage.style.backgroundColor = 'transparent';
                
                // Remove title hover effects if available
                if (titleSpan) {
                    titleSpan.style.backgroundColor = 'transparent';
                    titleSpan.style.padding = '';
                    titleSpan.style.borderRadius = '';
                }
            }
        } catch (error) {
            console.error('HomepageInteractionManager: Error handling work item hover:', error);
        }
    }
    
    handleFolderItemHover(wrapperImage, titleSpan, isHovering) {
        if (!wrapperImage) {
            console.warn('HomepageInteractionManager: handleFolderItemHover called with null wrapperImage');
            return;
        }
        
        try {
            if (isHovering) {
                // Apply folder hover effects - just the grey background with smooth transition
                wrapperImage.style.backgroundColor = this.config.HOVER_BACKGROUND;
                wrapperImage.style.transition = this.config.HOVER_TRANSITION;
                
                // Apply title hover effects if available
                if (titleSpan) {
                    titleSpan.style.backgroundColor = this.config.HOVER_BACKGROUND;
                    titleSpan.style.padding = '0 var(--space-sm)';
                    titleSpan.style.borderRadius = 'var(--space-xs)';
                    titleSpan.style.transition = this.config.HOVER_TRANSITION;
                }
            } else {
                // Remove hover effects - just remove the background
                wrapperImage.style.backgroundColor = 'transparent';
                
                // Remove title hover effects if available
                if (titleSpan) {
                    titleSpan.style.backgroundColor = 'transparent';
                    titleSpan.style.padding = '';
                    titleSpan.style.borderRadius = '';
                }
            }
        } catch (error) {
            console.error('HomepageInteractionManager: Error handling folder item hover:', error);
        }
    }
    
    refreshElements() {
        try {
            console.log('HomepageInteractionManager: Refreshing elements');
            // Re-find elements in case DOM has changed
            this.setupElements();
            this.setupEventListeners();
            console.log('HomepageInteractionManager: Elements refreshed successfully');
        } catch (error) {
            console.error('HomepageInteractionManager: Error refreshing elements:', error);
        }
    }
    
    enableInteractions() {
        try {
            console.log('HomepageInteractionManager: Enabling interactions');
            // Re-enable all interactions
            this.setupEventListeners();
            console.log('HomepageInteractionManager: Interactions enabled successfully');
        } catch (error) {
            console.error('HomepageInteractionManager: Error enabling interactions:', error);
        }
    }
    
    disableInteractions() {
        try {
            console.log('HomepageInteractionManager: Disabling interactions');
            // Remove all event listeners
            this.workItems.forEach((workItem, index) => {
                try {
                    const wrapperImage = workItem.querySelector('.wrapper-image');
                    if (wrapperImage) {
                        wrapperImage.replaceWith(wrapperImage.cloneNode(true));
                    }
                } catch (error) {
                    console.error(`HomepageInteractionManager: Error disabling work item ${index} interactions:`, error);
                }
            });
            
            this.folderItems.forEach((folderItem, index) => {
                try {
                    const wrapperImage = folderItem.querySelector('.wrapper-image');
                    if (wrapperImage) {
                        wrapperImage.replaceWith(wrapperImage.cloneNode(true));
                    }
                } catch (error) {
                    console.error(`HomepageInteractionManager: Error disabling folder item ${index} interactions:`, error);
                }
            });
            
            console.log('HomepageInteractionManager: Interactions disabled successfully');
        } catch (error) {
            console.error('HomepageInteractionManager: Error disabling interactions:', error);
        }
    }
    
    destroy() {
        try {
            console.log('HomepageInteractionManager: Destroying module');
            // Remove all event listeners
            this.disableInteractions();
            
            // Unregister from coordination systems
            if (window.eventManager) {
                try {
                    window.eventManager.unregister('homepage-interactions');
                    console.log('HomepageInteractionManager: Unregistered from EventManager');
                } catch (error) {
                    console.warn('HomepageInteractionManager: Error unregistering from EventManager:', error);
                }
            }
            
            this.isInitialized = false;
            console.log('HomepageInteractionManager: Module destroyed successfully');
        } catch (error) {
            console.error('HomepageInteractionManager: Error during destruction:', error);
        }
    }
    
    // Public methods for external access
    getStatus() {
        return {
            isInitialized: this.isInitialized,
            workItemsCount: this.workItems.length,
            folderItemsCount: this.folderItems.length,
            initializationAttempts: this.initializationAttempts
        };
    }
}

// Export for module system
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HomepageInteractionManager;
} else if (typeof window !== 'undefined') {
    window.HomepageInteractionManager = HomepageInteractionManager;
}
