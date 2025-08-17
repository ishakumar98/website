// Image Popup Manager Module
// Handles image popup display, navigation, and interactions
// Extracted from project-script.js for better organization

class ImagePopupManager {
    constructor() {
        this.currentImageIndex = 0;
        this.projectImages = [];
        this.popupElements = {};
        this.isInitialized = false;
        
        this.init();
    }
    
    init() {
        // Wait for project content to be ready before initializing
        document.addEventListener('projectContentReady', () => {
                    this.findPopupElements();
        this.findProjectImages();
        this.setupEventListeners();
        this.isInitialized = true;
    });
    }
    
    findPopupElements() {
        this.popupElements = {
            imagePopup: document.querySelector('.image-popup'),
            popupImage: document.querySelector('.popup-image'),
            popupFilename: document.querySelector('.popup-filename'),
            popupClose: document.querySelector('.popup-close'),
            popupNavLeft: document.querySelector('.popup-nav-left'),
            popupNavRight: document.querySelector('.popup-nav-right')
        };
    }
    
    findProjectImages() {
        this.projectImages = document.querySelectorAll('.project-images-section .image img');
    }
    
    setupEventListeners() {
        if (!window.eventManager) return;
        
        // Add click event listeners to all project images
        this.projectImages.forEach((img, index) => {
            window.eventManager.addListener(img, 'click', () => {
                this.openPopup(index);
            });
        });
        
        // Close popup
        if (this.popupElements.popupClose) {
            window.eventManager.addListener(this.popupElements.popupClose, 'click', () => {
                this.closePopup();
            });
        }
        
        // Navigation
        if (this.popupElements.popupNavLeft) {
            window.eventManager.addListener(this.popupElements.popupNavLeft, 'click', () => {
                this.navigateLeft();
            });
        }
        
        if (this.popupElements.popupNavRight) {
            window.eventManager.addListener(this.popupElements.popupNavRight, 'click', () => {
                this.navigateRight();
            });
        }
    }
    
    openPopup(imageIndex) {
        try {
            this.currentImageIndex = imageIndex;
            
            // Set image source and filename
            this.popupElements.popupImage.src = this.projectImages[imageIndex].src;
            this.popupElements.popupImage.alt = this.projectImages[imageIndex].alt || '';
            
            // Get filename from title span
            const titleSpan = this.projectImages[imageIndex].closest('.image')?.querySelector('.title span');
            const filename = titleSpan ? titleSpan.textContent : 'image.png';
            this.popupElements.popupFilename.textContent = filename;
            
            // Show popup
            this.popupElements.imagePopup.classList.add('active');
            
        } catch (error) {
            // Handle popup error silently
        }
    }
    
    closePopup() {
        this.popupElements.imagePopup.classList.remove('active');
    }
    
    navigateLeft() {
        this.currentImageIndex = (this.currentImageIndex - 1 + this.projectImages.length) % this.projectImages.length;
        this.updatePopupImage();
    }
    
    navigateRight() {
        this.currentImageIndex = (this.currentImageIndex + 1) % this.projectImages.length;
        this.updatePopupImage();
    }
    
    updatePopupImage() {
        const img = this.projectImages[this.currentImageIndex];
        this.popupElements.popupImage.src = img.src;
        this.popupElements.popupImage.alt = img.alt || '';
        
        const titleSpan = img.closest('.image')?.querySelector('.title span');
        const filename = titleSpan ? titleSpan.textContent : 'image.png';
        this.popupElements.popupFilename.textContent = filename;
    }
    
    getCurrentImageIndex() {
        return this.currentImageIndex;
    }
    
    getTotalImages() {
        return this.projectImages.length;
    }
    
    isPopupOpen() {
        return this.popupElements.imagePopup?.classList.contains('active') || false;
    }
    
    isReady() {
        return this.isInitialized && this.popupElements.imagePopup !== null;
    }
    
    destroy() {
        // Clean up event listeners if needed
        this.projectImages = [];
        this.popupElements = {};
        this.isInitialized = false;
    }
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ImagePopupManager;
}

// Create global instance if not in module system
if (typeof window !== 'undefined') {
    window.ImagePopupManager = ImagePopupManager;
}
