// Homepage Interaction Manager Module
// Handles hover effects, folder interactions, and other UI behaviors
// Extracted from script.js for better organization

class HomepageInteractionManager {
    constructor() {
        this.workItems = [];
        this.folderItems = [];
        this.isInitialized = false;
        
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
                return;
            }
            
            this.setupElements();
            this.setupEventListeners();
            
            this.isInitialized = true;
            
        } catch (error) {
            // Handle initialization error silently
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
        // Find all work items
        this.workItems = document.querySelectorAll('.work-item');
        
        // Find all folder items (if they exist)
        this.folderItems = document.querySelectorAll('.finder li');
    }
    
    setupEventListeners() {
        // Set up work item interactions
        this.setupWorkItemInteractions();
        
        // Set up folder item interactions
        this.setupFolderItemInteractions();
        
        // Register with EventManager for coordination
        if (window.EventManager) {
            window.EventManager.register('homepage-interactions', {
                refresh: () => this.refreshElements(),
                enable: () => this.enableInteractions(),
                disable: () => this.disableInteractions()
            });
        }
    }
    
    setupWorkItemInteractions() {
        this.workItems.forEach(workItem => {
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
            }
        });
    }
    
    setupFolderItemInteractions() {
        this.folderItems.forEach(folderItem => {
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
            }
        });
    }
    
    handleWorkItemHover(wrapperImage, titleSpan, isHovering) {
        if (!wrapperImage) return;
        
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
    }
    
    handleFolderItemHover(wrapperImage, titleSpan, isHovering) {
        if (!wrapperImage) return;
        
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
    }
    
    refreshElements() {
        // Re-find elements in case DOM has changed
        this.setupElements();
        this.setupEventListeners();
    }
    
    enableInteractions() {
        // Re-enable all interactions
        this.setupEventListeners();
    }
    
    disableInteractions() {
        // Remove all event listeners
        this.workItems.forEach(workItem => {
            const wrapperImage = workItem.querySelector('.wrapper-image');
            if (wrapperImage) {
                wrapperImage.replaceWith(wrapperImage.cloneNode(true));
            }
        });
        
        this.folderItems.forEach(folderItem => {
            const wrapperImage = folderItem.querySelector('.wrapper-image');
            if (wrapperImage) {
                wrapperImage.replaceWith(wrapperImage.cloneNode(true));
            }
        });
        

    }
    
    destroy() {
        // Remove all event listeners
        this.disableInteractions();
        
        // Unregister from coordination systems
        if (window.EventManager) {
            window.EventManager.unregister('homepage-interactions');
        }
        
        this.isInitialized = false;
    }
}

// Export for module system
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HomepageInteractionManager;
} else if (typeof window !== 'undefined') {
    window.HomepageInteractionManager = HomepageInteractionManager;
}
