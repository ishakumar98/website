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
        // Wait for project content to be ready before initializing
        document.addEventListener('projectContentReady', () => {
                    this.findElements();
        this.adjustFontSize();
        this.isInitialized = true;
    });
    }
    
    findElements() {
        this.textElements = document.querySelectorAll('.project-description');
        this.creditsElements = document.querySelectorAll('.credits-text');
        this.contentArea = document.querySelector('.project-content-area');
        this.projectImagesSection = document.querySelector('.project-images-section');
        
        console.log('FontSizingManager: Found elements:', {
            textElements: this.textElements.length,
            creditsElements: this.creditsElements.length,
            contentArea: !!this.contentArea,
            projectImagesSection: !!this.projectImagesSection
        });
    }
    
    adjustFontSize() {
        if (this.textElements.length === 0 || !this.contentArea) {
            console.log('FontSizingManager: Missing elements - textElements:', this.textElements.length, 'contentArea:', !!this.contentArea);
            return;
        }
        
        // Get the actual container dimensions
        const containerRect = this.contentArea.getBoundingClientRect();
        const containerHeight = containerRect.height;
        
        console.log('FontSizingManager: Container dimensions:', {
            containerHeight: containerHeight,
            containerTop: containerRect.top,
            containerBottom: containerRect.bottom
        });
        
        // Get container padding and gap from CSS variables
        const containerPadding = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--space-xl')) * 2; // 2rem top + 2rem bottom
        const contentGap = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--space-lg')); // Gap between text and credits
        
        // Available height for text content (description + credits)
        const textAvailableHeight = containerHeight - containerPadding - contentGap;
        
        console.log('FontSizingManager: Height calculations:', {
            containerPadding: containerPadding,
            contentGap: contentGap,
            textAvailableHeight: textAvailableHeight
        });
        
        // Calculate available height for description (subtract credits height)
        const creditsHeight = this.creditsElements.length * 24; // 1rem = 16px, line-height: 1.5 = 24px
        const descriptionAvailableHeight = textAvailableHeight - creditsHeight;
        
        console.log('FontSizingManager: Credits and description height:', {
            creditsCount: this.creditsElements.length,
            creditsHeight: creditsHeight,
            descriptionAvailableHeight: descriptionAvailableHeight
        });
        
        // Simple font size calculation: fill the available height
        const lineHeight = 1.5; // CSS line-height
        const optimalFontSize = Math.floor(descriptionAvailableHeight / lineHeight);
        
        // Clamp font size to reasonable bounds
        const finalFontSize = Math.max(12, Math.min(48, optimalFontSize));
        
        console.log('FontSizingManager: Font size calculation:', {
            lineHeight: lineHeight,
            optimalFontSize: optimalFontSize,
            finalFontSize: finalFontSize
        });
        
        // Apply the font size to description text
        this.textElements.forEach(element => {
            element.style.fontSize = finalFontSize + 'px';
        });
        
        console.log('FontSizingManager: Applied font size to', this.textElements.length, 'description elements');
    }
    

    
    refreshElements() {
        this.findElements();
        this.adjustFontSize();
    }
    
    // Handle window resize
    handleResize() {
        if (this.isInitialized) {
            this.adjustFontSize();
        }
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
