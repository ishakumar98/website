// Font Sizing Manager Module
// Handles dynamic font sizing for description text to fill available container height
// Extracted from project-script.js for better organization

class FontSizingManager {
    constructor() {
        this.textElements = [];
        this.creditsElements = [];
        this.contentArea = null;
        this.projectImagesSection = null;
        this.isInitialized = false;
        
        this.init();
    }
    
    init() {
        this.findElements();
        this.isInitialized = true;
        console.log('FontSizingManager: Initialized');
    }
    
    findElements() {
        this.textElements = document.querySelectorAll('.project-description');
        this.creditsElements = document.querySelectorAll('.credits-text');
        this.contentArea = document.querySelector('.project-content-area');
        this.projectImagesSection = document.querySelector('.project-images-section');
    }
    
    adjustFontSize(pageHeader) {
        if (this.textElements.length === 0 || !this.contentArea) {
            return;
        }
        
        // Get the image container to calculate available space
        if (!this.projectImagesSection) {
            return;
        }
        
        // Calculate image container top position and set CSS custom property
        const imageContainerTop = this.projectImagesSection.getBoundingClientRect().top;
        const contentAreaTop = this.contentArea.getBoundingClientRect().top;
        
        // Set the CSS custom property for content container height
        document.documentElement.style.setProperty('--image-container-top', imageContainerTop + 'px');
        
        // Calculate total available height for both description and credits
        const totalAvailableHeight = imageContainerTop - contentAreaTop;
        
        // Subtract gap between description and credits and bottom padding
        const gap = 24; // 1.5rem = 24px
        const bottomPadding = 32; // 2rem = 32px (from CSS padding: 2rem)
        const contentAvailableHeight = totalAvailableHeight - gap - bottomPadding;
        
        // First, apply test font size to measure description content
        const testFontSize = 16;
        this.textElements.forEach(element => {
            element.style.fontSize = testFontSize + 'px';
        });
        
        // Count lines for description text only
        let descriptionLines = 0;
        
        this.textElements.forEach(element => {
            const lineHeight = parseFloat(getComputedStyle(element).lineHeight);
            const elementHeight = element.offsetHeight;
            descriptionLines += Math.ceil(elementHeight / lineHeight);
        });
        
        // Calculate available height for description (subtract credits height)
        // Credits text is fixed at 1rem, so calculate its height
        const creditsFontSize = 16; // 1rem = 16px
        const creditsLineHeight = creditsFontSize * 1.5; // line-height: 1.5
        const creditsHeight = this.creditsElements.length * creditsLineHeight;
        
        const descriptionAvailableHeight = contentAvailableHeight - creditsHeight;
        
        // Calculate optimal font size for description
        const optimalFontSize = this.calculateOptimalFontSize(descriptionAvailableHeight, descriptionLines);
        
        // Apply the optimal font size
        this.textElements.forEach(element => {
            element.style.fontSize = optimalFontSize + 'px';
        });
        
        console.log(`FontSizingManager: Adjusted font size to ${optimalFontSize}px for ${descriptionLines} lines`);
    }
    
    calculateOptimalFontSize(availableHeight, lineCount) {
        if (lineCount === 0) return 16;
        
        // Calculate font size based on available height and line count
        const lineHeight = 1.5; // CSS line-height
        const optimalFontSize = availableHeight / (lineCount * lineHeight);
        
        // Clamp font size to reasonable bounds
        const minFontSize = 12;
        const maxFontSize = 24;
        
        return Math.max(minFontSize, Math.min(maxFontSize, optimalFontSize));
    }
    
    refreshElements() {
        this.findElements();
    }
    
    getTextElements() {
        return this.textElements;
    }
    
    getCreditsElements() {
        return this.creditsElements;
    }
    
    getContentArea() {
        return this.contentArea;
    }
    
    getProjectImagesSection() {
        return this.projectImagesSection;
    }
    
    isReady() {
        return this.isInitialized && this.textElements.length > 0;
    }
    
    destroy() {
        this.textElements = [];
        this.creditsElements = [];
        this.contentArea = null;
        this.projectImagesSection = null;
        this.isInitialized = false;
        console.log('FontSizingManager: Destroyed');
    }
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FontSizingManager;
}

// Create global instance if not in module system
if (typeof window !== 'undefined') {
    window.FontSizingManager = FontSizingManager;
}
