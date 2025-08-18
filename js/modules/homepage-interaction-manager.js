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
        
        // Interaction configuration - minimal since CSS handles hover effects
        this.config = {
            // Transitions from design system (for potential future use)
            HOVER_TRANSITION: 'var(--transition-smooth)'
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
    
    setupElements() {
        try {
            // Find all work items
            this.workItems = document.querySelectorAll('.work-item');

            
            // Find all folder items (if they exist)
            this.folderItems = document.querySelectorAll('.finder li');

            
        } catch (error) {

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
                

                
            } catch (error) {
                // Failed to initialize EventManager integration
            }
        }
    }
    
    setupWorkItemInteractions() {
        if (!this.workItems || this.workItems.length === 0) {
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
                }
            } catch (error) {
                // Error setting up work item interactions
            }
        });
    }
    
    setupFolderItemInteractions() {
        if (!this.folderItems || this.folderItems.length === 0) {
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
                }
            } catch (error) {
                // Error setting up folder item interactions
            }
        });
    }
    
    handleWorkItemHover(wrapperImage, titleSpan, isHovering) {
        // CSS handles all hover effects - no JavaScript needed
        // This method is kept for potential future use but currently does nothing
        // to avoid conflicts with CSS hover effects
    }
    
    handleFolderItemHover(wrapperImage, titleSpan, isHovering) {
        // CSS handles all hover effects - no JavaScript needed
        // This method is kept for potential future use but currently does nothing
        // to avoid conflicts with CSS hover effects
    }
    
    refreshElements() {
        try {
            // Re-find elements in case DOM has changed
            this.setupElements();
            this.setupEventListeners();
        } catch (error) {
            // Error refreshing elements
        }
    }
    
    enableInteractions() {
        try {
            // Re-enable all interactions
            this.setupEventListeners();
        } catch (error) {
            // Error enabling interactions
        }
    }
    
    disableInteractions() {
        try {
            
            if (window.eventManager && this.eventListenerIds) {
                // Clean up EventManager listeners
                this.eventListenerIds.workItems.forEach(({ mouseenterId, mouseleaveId }) => {
                    try {
                        if (mouseenterId) window.eventManager.removeListener(mouseenterId);
                        if (mouseleaveId) window.eventManager.removeListener(mouseleaveId);
                    } catch (error) {
                        // Error removing EventManager listener
                    }
                });
                
                this.eventListenerIds.folderItems.forEach(({ mouseenterId, mouseleaveId }) => {
                    try {
                        if (mouseenterId) window.eventManager.removeListener(mouseenterId);
                        if (mouseleaveId) window.eventManager.removeListener(mouseleaveId);
                    } catch (error) {
                        // Error removing EventManager listener
                    }
                });
                
                // Clear stored listener IDs
                this.eventListenerIds.workItems = [];
                this.eventListenerIds.folderItems = [];
                

                
            } else {
                // Fallback: Remove all event listeners by cloning elements
                this.workItems.forEach((workItem, index) => {
                    try {
                        const wrapperImage = workItem.querySelector('.wrapper-image');
                        if (wrapperImage) {
                            wrapperImage.replaceWith(wrapperImage.cloneNode(true));
                        }
                    } catch (error) {
                        // Error disabling work item interactions
                    }
                });
                
                this.folderItems.forEach((folderItem, index) => {
                    try {
                        const wrapperImage = folderItem.querySelector('.wrapper-image');
                        if (wrapperImage) {
                            wrapperImage.replaceWith(wrapperImage.cloneNode(true));
                        }
                    } catch (error) {
                        // Error disabling folder item interactions
                    }
                });
                

            }
            

        } catch (error) {
            // Error disabling interactions
        }
    }
    
    destroy() {
        try {
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

        } catch (error) {
            // Error during destruction
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
                hoverTransition: this.config.HOVER_TRANSITION
            },
            designSystemIntegration: {
                transitions: this.config.HOVER_TRANSITION.includes('var(--')
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
