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
                this.adjustFontSize();
            }
        });
        
        // Add a fallback retry mechanism for smaller viewports
        // Sometimes the CSS variable isn't set immediately on page load
        setTimeout(() => {
            if (this.isInitialized) {
                const contentAreaHeight = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--content-area-height')) || 0;
                if (contentAreaHeight === 0) {
                    // Retry font sizing with fallback calculation
                    this.adjustFontSize();
                }
            }
        }, 100); // Small delay to allow ProjectScrollManager to set the variable
    }
    
    findElements() {
        this.textElements = document.querySelectorAll('.project-description');
        this.creditsElements = document.querySelectorAll('.credits-text');
        this.contentArea = document.querySelector('.project-content-area');
        this.projectImagesSection = document.querySelector('.project-images-section');
        

    }
    
    adjustFontSize() {
        if (this.textElements.length === 0 || !this.contentArea) {
            return;
        }
        
        // Get the content area height from our new CSS variable
        let contentAreaHeight = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--content-area-height')) || 0;
        
        // If CSS variable isn't set yet, use a smart fallback calculation
        if (contentAreaHeight === 0) {
            // Estimate the content area height based on current viewport and flower dimensions
            const viewportHeight = window.innerHeight;
            
            // Try to get actual flower dimensions from CSS variables first
            const flowerHeightRaw = getComputedStyle(document.documentElement).getPropertyValue('--flower-height');
            const flowerTopMarginRaw = getComputedStyle(document.documentElement).getPropertyValue('--flower-margin-top');
            const flowerBottomMarginRaw = getComputedStyle(document.documentElement).getPropertyValue('--flower-margin-bottom');
            
            let flowerTotalHeight = 0;
            if (flowerHeightRaw && flowerTopMarginRaw && flowerBottomMarginRaw) {
                // Convert CSS units to pixels for accurate calculation
                const flowerHeight = parseFloat(flowerHeightRaw) * 16; // Convert rem to px
                const flowerTopMargin = parseFloat(flowerTopMarginRaw) * 16;
                const flowerBottomMargin = parseFloat(flowerBottomMarginRaw) * 16;
                flowerTotalHeight = flowerHeight + flowerTopMargin + flowerBottomMargin;
            } else {
                // Fallback to estimated values
                flowerTotalHeight = 96 + 32 + 24; // height + top margin + bottom margin
            }
            
            // Get actual container padding if available
            const containerPadding = this.projectImagesSection ? 
                parseFloat(getComputedStyle(this.projectImagesSection).paddingTop) : 16;
            
            contentAreaHeight = viewportHeight - flowerTotalHeight - containerPadding;
        }
        
        const contentAreaTop = this.contentArea.getBoundingClientRect().top;
        
        // Calculate total available height for the content area
        // The container should stop at the top of the image container
        const totalAvailableHeight = contentAreaHeight;
        

        
        // Get the CSS padding from computed styles (2rem = 32px on all sides)
        const computedStyles = getComputedStyle(this.contentArea);
        const topPadding = parseFloat(computedStyles.paddingTop);
        const bottomPadding = parseFloat(computedStyles.paddingBottom);
        const totalPadding = topPadding + bottomPadding;
        
        // Available height for content (description + credits) within the padded container
        const contentAvailableHeight = totalAvailableHeight - totalPadding;
        

        
        // First, apply test font size to measure description content
        const testFontSize = 16;
        this.textElements.forEach(element => {
            element.style.fontSize = testFontSize + 'px';
        });
        
        // Calculate available height for description (subtract credits height + gap)
        // Credits text is fixed at 1rem, but may wrap on smaller viewports
        const creditsFontSize = 16; // 1rem = 16px
        const creditsLineHeight = creditsFontSize * 1.5; // line-height: 1.5
        
        // Estimate credits height but be conservative - assume it might wrap
        const estimatedCreditsHeight = this.creditsElements.length * creditsLineHeight;
        // Add extra buffer for potential wrapping on smaller viewports
        const creditsHeightBuffer = Math.max(estimatedCreditsHeight * 0.5, 16); // 50% buffer or 16px minimum
        const creditsHeight = estimatedCreditsHeight + creditsHeightBuffer;
        
        // Account for the gap between description and credits (from CSS variable)
        const gapBetweenElements = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--space-lg')) * 16 || 24; // Convert rem to px
        
        const descriptionAvailableHeight = contentAvailableHeight - creditsHeight - gapBetweenElements;
        

        
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
        

        
        // Safety check: if content is still too tall, reduce font size until it fits
        let safetyAttempts = 0;
        let currentFontSize = finalFontSize;
        
        while (safetyAttempts < 10) {
            // Measure current content height
            let currentDescriptionHeight = 0;
            
            this.textElements.forEach(element => {
                currentDescriptionHeight += element.offsetHeight;
            });
            
            // Re-measure actual credits height (it might have wrapped to multiple lines)
            let actualCreditsHeight = 0;
            this.creditsElements.forEach(element => {
                actualCreditsHeight += element.offsetHeight;
            });
            
            const totalCurrentHeight = currentDescriptionHeight + actualCreditsHeight + gapBetweenElements;
            
            // Check if content fits within the padded container
            if (totalCurrentHeight <= contentAvailableHeight) {
                break;
            }
            
            // Reduce font size and try again
            currentFontSize = Math.max(8, currentFontSize - 2);
            this.textElements.forEach(element => {
                element.style.fontSize = currentFontSize + 'px';
            });
            
            safetyAttempts++;
        }
        
        // Final validation: ensure content actually fits within container
        let finalDescriptionHeight = 0;
        this.textElements.forEach(element => {
            finalDescriptionHeight += element.offsetHeight;
        });
        
        let finalCreditsHeight = 0;
        this.creditsElements.forEach(element => {
            finalCreditsHeight += element.offsetHeight;
        });
        
        const finalTotalHeight = finalDescriptionHeight + finalCreditsHeight + gapBetweenElements;
        
        // If still too tall, force a smaller font size
        if (finalTotalHeight > contentAvailableHeight) {
            const overflowRatio = contentAvailableHeight / finalTotalHeight;
            const emergencyFontSize = Math.max(8, Math.floor(currentFontSize * overflowRatio));
            
            this.textElements.forEach(element => {
                element.style.fontSize = emergencyFontSize + 'px';
            });
        }

    }
    

    
    refreshElements() {
        this.findElements();
        this.adjustFontSize();
    }
    
    // Handle window resize
    handleResize() {
        if (this.isInitialized) {
            // Always recalculate font size on resize - use smart fallback if needed
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
