// Project Main Script
// Coordinates all project page modules and manages initialization
// Replaces the monolithic project-script.js with organized architecture

class ProjectMain {
    constructor() {
        this.modules = {};
        this.isInitialized = false;
        
        this.init();
    }
    
    async init() {
        try {
            // Wait for DOM to be ready
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.initializeModules());
            } else {
                this.initializeModules();
            }
        } catch (error) {
            // Handle initialization error silently
        }
    }
    
    async initializeModules() {
        try {
            // Initialize all modules
            await this.initializeFontSizingManager();
            await this.initializeTextSlantManager();
            await this.initializeImagePopupManager();
            await this.initializeFlowerManager();
            await this.initializeProjectScrollManager();
            
            // Set up coordination between modules
            this.setupModuleCoordination();
            
            // Start the scroll animation loop
            this.startScrollAnimation();
            
            this.isInitialized = true;
    
            
        } catch (error) {
            // Handle module initialization error silently
        }
    }
    
    async initializeFontSizingManager() {
        if (window.FontSizingManager) {
            this.modules.fontSizing = new window.FontSizingManager();
            
            // Wait for content to be populated
            await this.waitForContent();
            
            // Initial font size adjustment
            const pageHeader = document.querySelector('.page-header');
            this.modules.fontSizing.adjustFontSize(pageHeader);
        }
    }
    
    async initializeTextSlantManager() {
        if (window.TextSlantManager) {
            this.modules.textSlant = new window.TextSlantManager();
            
            // Wait for content to be populated
            await this.waitForContent();
            
            // Activate text slant effects
            this.modules.textSlant.activate();
        }
    }
    
        async initializeImagePopupManager() {
        if (window.ImagePopupManager) {
            this.modules.imagePopup = new window.ImagePopupManager();
        }
    }
    
    async initializeFlowerManager() {
        if (window.FlowerManager) {
            this.modules.flower = new window.FlowerManager();
        }
    }
    
    async initializeProjectScrollManager() {
        if (window.ProjectScrollManager) {
            this.modules.scroll = new window.ProjectScrollManager();
        }
    }
    
    async waitForContent() {
        // Wait for project description content to be populated
        return new Promise((resolve) => {
            const checkContent = () => {
                const description = document.querySelector('.project-description');
                if (description && description.textContent.trim().length > 0) {
                    resolve();
                } else {
                    setTimeout(checkContent, 100);
                }
            };
            checkContent();
        });
    }
    
    setupModuleCoordination() {
        // Set up coordination between flower manager and scroll manager
        if (this.modules.flower && this.modules.scroll) {
            // The scroll manager will call flower manager's updateFlowerSize method
            // This is handled through the main scroll animation loop
        }
    }
    
    startScrollAnimation() {
        if (this.modules.scroll) {
            this.modules.scroll.startAnimationLoop();
        }
    }
    
    // Main scroll animation loop that coordinates all modules
    updateScrollAnimation() {
        if (!this.isInitialized) return;
        
        try {
            // Get scroll progress from scroll manager
            if (this.modules.scroll) {
                const scrollProgress = this.modules.scroll.getScrollProgress();
                
                // Update flower size based on scroll progress
                if (this.modules.flower) {
                    this.modules.flower.updateFlowerSize(scrollProgress);
                }
            }
        } catch (error) {
            // Handle scroll animation error silently
        }
    }
    
    // Public methods for external access
    getModule(name) {
        return this.modules[name];
    }
    
    isReady() {
        return this.isInitialized && Object.keys(this.modules).length > 0;
    }
    
    destroy() {
        // Destroy all modules
        Object.values(this.modules).forEach(module => {
            if (module && typeof module.destroy === 'function') {
                module.destroy();
            }
        });
        
        this.modules = {};
        this.isInitialized = false;

    }
}

// Initialize the project main when the script loads
let projectMain = null;

function initProjectPage() {
    if (projectMain) {
        projectMain.destroy();
    }
    
    projectMain = new ProjectMain();
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProjectMain;
}

// Create global instance if not in module system
if (typeof window !== 'undefined') {
    window.ProjectMain = ProjectMain;
    window.initProjectPage = initProjectPage;
}
