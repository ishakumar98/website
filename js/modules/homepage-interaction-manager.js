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
        this.eventListenerIds = {
            workItems: [],
            folderItems: []
        };
        
        // Interaction configuration
        this.config = {
            // Colors from design system
            HOVER_BACKGROUND: 'var(--color-background-light)', // Light background for hover states
            HOVER_OPACITY: 0.06, // Opacity for hover overlay
            
            // Transitions from design system
            HOVER_TRANSITION: 'var(--transition-smooth)',
            
            // Spacing from design system
            HOVER_PADDING: 'var(--space-sm)',
            HOVER_MARGIN: 'var(--space-sm)'
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
                // Store listener IDs for proper cleanup
                this.eventListenerIds = {
                    workItems: [],
                    folderItems: []
                };
                
                console.log('HomepageInteractionManager: EventManager available, using centralized event management');
                
            } catch (error) {
                console.warn('HomepageInteractionManager: Failed to initialize EventManager integration:', error);
            }
        } else {
            console.warn('HomepageInteractionManager: EventManager not available, using direct event listeners');
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
                    if (window.eventManager) {
                        // Use EventManager for centralized event handling
                        const mouseenterId = window.eventManager.addListener(workItem, 'mouseenter', () => {
                            this.handleWorkItemHover(wrapperImage, titleSpan, true);
                        });
                        
                        const mouseleaveId = window.eventManager.addListener(workItem, 'mouseleave', () => {
                            this.handleWorkItemHover(wrapperImage, titleSpan, false);
                        });
                        
                        // Store listener IDs for cleanup
                        this.eventListenerIds.workItems.push({
                            element: workItem,
                            mouseenterId,
                            mouseleaveId
                        });
                        
                    } else {
                        // Fallback to direct event listeners
                        workItem.addEventListener('mouseenter', () => {
                            this.handleWorkItemHover(wrapperImage, titleSpan, true);
                        });
                        
                        workItem.addEventListener('mouseleave', () => {
                            this.handleWorkItemHover(wrapperImage, titleSpan, false);
                        });
                    }
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
                    if (window.eventManager) {
                        // Use EventManager for centralized event handling
                        const mouseenterId = window.eventManager.addListener(folderItem, 'mouseenter', () => {
                            this.handleFolderItemHover(wrapperImage, titleSpan, true);
                        });
                        
                        const mouseleaveId = window.eventManager.addListener(folderItem, 'mouseleave', () => {
                            this.handleFolderItemHover(wrapperImage, titleSpan, false);
                        });
                        
                        // Store listener IDs for cleanup
                        this.eventListenerIds.folderItems.push({
                            element: folderItem,
                            mouseenterId,
                            mouseleaveId
                        });
                        
                    } else {
                        // Fallback to direct event listeners
                        folderItem.addEventListener('mouseenter', () => {
                            this.handleFolderItemHover(wrapperImage, titleSpan, true);
                        });
                        
                        folderItem.addEventListener('mouseleave', () => {
                            this.handleFolderItemHover(wrapperImage, titleSpan, false);
                        });
                    }
                } else {
                    console.warn(`HomepageInteractionManager: Folder item ${index} missing wrapper-image element`);
                }
            } catch (error) {
                console.error(`HomepageInteractionManager: Error setting up folder item ${index} interactions:`, error);
            }
        });
    }
    
    handleWorkItemHover(wrapperImage, titleSpan, isHovering) {
        try {
            if (isHovering) {
                // Apply hover effect using configuration values
                wrapperImage.style.transition = this.config.HOVER_TRANSITION;
                wrapperImage.style.backgroundColor = this.config.HOVER_BACKGROUND;
                wrapperImage.style.opacity = this.config.HOVER_OPACITY;
                
                // Animate title span
                if (titleSpan) {
                    titleSpan.style.transition = this.config.HOVER_TRANSITION;
                    titleSpan.style.transform = 'translateY(-2px)';
                }
            } else {
                // Reset to default state
                wrapperImage.style.backgroundColor = 'transparent';
                wrapperImage.style.opacity = '1';
                
                if (titleSpan) {
                    titleSpan.style.transform = 'translateY(0)';
                }
            }
        } catch (error) {
            console.error('HomepageInteractionManager: Error handling work item hover:', error);
        }
    }
    
    handleFolderItemHover(wrapperImage, titleSpan, isHovering) {
        try {
            if (isHovering) {
                // Apply hover effect using configuration values
                wrapperImage.style.transition = this.config.HOVER_TRANSITION;
                wrapperImage.style.backgroundColor = this.config.HOVER_BACKGROUND;
                wrapperImage.style.opacity = this.config.HOVER_OPACITY;
                
                // Animate title span
                if (titleSpan) {
                    titleSpan.style.transition = this.config.HOVER_TRANSITION;
                    titleSpan.style.transform = 'translateY(-2px)';
                }
            } else {
                // Reset to default state
                wrapperImage.style.backgroundColor = 'transparent';
                wrapperImage.style.opacity = '1';
                
                if (titleSpan) {
                    titleSpan.style.transform = 'translateY(0)';
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
            
            if (window.eventManager && this.eventListenerIds) {
                // Clean up EventManager listeners
                this.eventListenerIds.workItems.forEach(({ mouseenterId, mouseleaveId }) => {
                    try {
                        if (mouseenterId) window.eventManager.removeListener(mouseenterId);
                        if (mouseleaveId) window.eventManager.removeListener(mouseleaveId);
                    } catch (error) {
                        console.warn('HomepageInteractionManager: Error removing EventManager listener:', error);
                    }
                });
                
                this.eventListenerIds.folderItems.forEach(({ mouseenterId, mouseleaveId }) => {
                    try {
                        if (mouseenterId) window.eventManager.removeListener(mouseenterId);
                        if (mouseleaveId) window.eventManager.removeListener(mouseleaveId);
                    } catch (error) {
                        console.warn('HomepageInteractionManager: Error removing EventManager listener:', error);
                    }
                });
                
                // Clear stored listener IDs
                this.eventListenerIds.workItems = [];
                this.eventListenerIds.folderItems = [];
                
                console.log('HomepageInteractionManager: EventManager listeners removed successfully');
                
            } else {
                // Fallback: Remove all event listeners by cloning elements
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
                
                console.log('HomepageInteractionManager: Direct event listeners removed via element cloning');
            }
            
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
            
            // Clean up stored references
            this.workItems = [];
            this.folderItems = [];
            this.eventListenerIds = {
                workItems: [],
                folderItems: []
            };
            
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
            initializationAttempts: this.initializationAttempts,
            eventManagerAvailable: !!window.eventManager,
            eventListenersCount: {
                workItems: this.eventListenerIds.workItems.length,
                folderItems: this.eventListenerIds.folderItems.length
            },
            usingEventManager: window.eventManager && this.eventListenerIds.workItems.length > 0,
            configuration: {
                hoverBackground: this.config.HOVER_BACKGROUND,
                hoverTransition: this.config.HOVER_TRANSITION,
                hoverOpacity: this.config.HOVER_OPACITY
            },
            designSystemIntegration: {
                colors: this.config.HOVER_BACKGROUND.includes('var(--'),
                transitions: this.config.HOVER_TRANSITION.includes('var(--'),
                spacing: this.config.HOVER_PADDING.includes('var(--')
            }
        };
    }
}

// Export for module system
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HomepageInteractionManager;
} else if (typeof window !== 'undefined') {
    window.HomepageInteractionManager = HomepageInteractionManager;
}
