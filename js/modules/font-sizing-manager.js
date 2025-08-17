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
            // Calculate font size immediately - don't wait for events
            this.adjustFontSize();
            this.isInitialized = true;
        });
        
        // Also listen for image container position updates to recalculate if needed
        document.addEventListener('imageContainerPositionReady', () => {
            if (this.isInitialized) {
                console.log('FontSizingManager: Recalculating font size with updated image container position');
                this.adjustFontSize();
            }
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
        
        // Get the image container top position from the CSS variable
        let imageContainerTop = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--image-container-top')) || 0;
        
        // If CSS variable isn't set yet, use a smart fallback calculation
        if (imageContainerTop === 0) {
            // Estimate the image container position based on viewport height and typical flower positioning
            const viewportHeight = window.innerHeight;
            const estimatedFlowerHeight = 96; // 6rem = 96px (from CSS --flower-height)
            const estimatedContainerPadding = 32; // 2rem = 32px (from CSS padding)
            imageContainerTop = viewportHeight - estimatedFlowerHeight - estimatedContainerPadding;
            
            console.log('FontSizingManager: Using estimated image container position:', imageContainerTop + 'px');
        }
        
        const contentAreaTop = this.contentArea.getBoundingClientRect().top;
        
        // Calculate total available height for the content area
        // The container should stop at the top of the image container
        const totalAvailableHeight = imageContainerTop;
        
        console.log('FontSizingManager: Container height calculation:', {
            imageContainerTop: imageContainerTop,
            contentAreaTop: contentAreaTop,
            totalAvailableHeight: totalAvailableHeight,
            viewportHeight: window.innerHeight,
            isEstimated: imageContainerTop === 0
        });
        
        // Get the CSS padding from computed styles (2rem = 32px on all sides)
        const computedStyles = getComputedStyle(this.contentArea);
        const topPadding = parseFloat(computedStyles.paddingTop);
        const bottomPadding = parseFloat(computedStyles.paddingBottom);
        const totalPadding = topPadding + bottomPadding;
        
        // Available height for content (description + credits) within the padded container
        const contentAvailableHeight = totalAvailableHeight - totalPadding;
        
        console.log('FontSizingManager: Height calculations:', {
            topPadding: topPadding,
            bottomPadding: bottomPadding,
            totalPadding: totalPadding,
            contentAvailableHeight: contentAvailableHeight
        });
        
        // First, apply test font size to measure description content
        const testFontSize = 16;
        this.textElements.forEach(element => {
            element.style.fontSize = testFontSize + 'px';
        });
        
        // Calculate available height for description (subtract credits height)
        // Credits text is fixed at 1rem, so calculate its height
        const creditsFontSize = 16; // 1rem = 16px
        const creditsLineHeight = creditsFontSize * 1.5; // line-height: 1.5
        const creditsHeight = this.creditsElements.length * creditsLineHeight;
        
        const descriptionAvailableHeight = contentAvailableHeight - creditsHeight;
        
        console.log('FontSizingManager: Credits and description height:', {
            creditsCount: this.creditsElements.length,
            creditsHeight: creditsHeight,
            descriptionAvailableHeight: descriptionAvailableHeight,
            contentAvailableHeight: contentAvailableHeight
        });
        
        // Instead of counting lines, let's calculate font size based on available height
        // We want the description to fill the exact available height
        // Measure the current description height with test font size
        let currentDescriptionHeight = 0;
        this.textElements.forEach(element => {
            currentDescriptionHeight += element.offsetHeight;
        });
        
        // Calculate the scale factor needed to make description fill available height
        const scaleFactor = descriptionAvailableHeight / currentDescriptionHeight;
        const optimalFontSize = Math.floor(testFontSize * scaleFactor);
        
        // Apply the calculated font size to description only
        const finalFontSize = Math.max(8, Math.min(48, optimalFontSize));
        
        this.textElements.forEach(element => {
            element.style.fontSize = finalFontSize + 'px';
        });
        
        console.log('FontSizingManager: Font size calculation:', {
            testFontSize: testFontSize,
            currentDescriptionHeight: currentDescriptionHeight,
            scaleFactor: scaleFactor,
            optimalFontSize: optimalFontSize,
            finalFontSize: finalFontSize
        });
        
        // Safety check: if content is still too tall, reduce font size until it fits
        let safetyAttempts = 0;
        let currentFontSize = finalFontSize;
        
        while (safetyAttempts < 10) {
            // Measure current content height
            let currentDescriptionHeight = 0;
            
            this.textElements.forEach(element => {
                currentDescriptionHeight += element.offsetHeight;
            });
            
            const totalCurrentHeight = currentDescriptionHeight + creditsHeight;
            
            // Check if content fits within the padded container
            if (totalCurrentHeight <= contentAvailableHeight) {
                console.log('FontSizingManager: Content fits after safety adjustments');
                break;
            }
            
            // Reduce font size and try again
            currentFontSize = Math.max(8, currentFontSize - 2);
            this.textElements.forEach(element => {
                element.style.fontSize = currentFontSize + 'px';
            });
            
            safetyAttempts++;
        }
        
        // Measure final result for logging
        let finalDescriptionHeight = 0;
        
        this.textElements.forEach(element => {
            finalDescriptionHeight += element.offsetHeight;
        });
        
        console.log('FontSizingManager: Final result:', {
            finalFontSize: currentFontSize,
            finalDescriptionHeight: finalDescriptionHeight,
            totalHeight: finalDescriptionHeight + creditsHeight,
            targetHeight: contentAvailableHeight,
            safetyAttempts: safetyAttempts,
            creditsHeight: creditsHeight
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
            // Always recalculate font size on resize - use smart fallback if needed
            console.log('FontSizingManager: Resize detected - recalculating font size');
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
