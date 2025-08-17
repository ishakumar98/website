// Popup Manager Module
// Handles both image and text popup display, navigation, and interactions
// Extracted from project-script.js for better organization

// Popup Configuration - Centralized settings
const POPUP_CONFIG = {
    // Dimensions
    minSize: 200,
    maxSizePercent: 0.95,
    
    // Animation timing
    closeAnimationDuration: 400,
    
    // Z-index values
    popupZIndex: 10000,
    resizeHandleZIndex: 10001,
    navigationZIndex: 9999,
    
    // Navigation area dimensions
    navigationAreaWidth: 60,
    navigationAreaTopOffset: 60
};

class PopupManager {
    constructor() {
        this.currentImageIndex = 0;
        this.projectImages = [];
        this.popupElements = {};
        this.isInitialized = false;
        
        // Popup type management
        this.popupType = 'image'; // Default to image popup
        this.currentContent = null; // Store current popup content
        
        // Drag and resize state variables
        this.dragState = {
            isDragging: false,
            startX: 0,
            startY: 0,
            popupStartX: 0,
            popupStartY: 0
        };
        
        this.resizeState = {
            isResizing: false,
            startX: 0,
            startY: 0,
            startWidth: 0,
            startHeight: 0,
            startLeft: 0,
            startTop: 0,
            resizeHandle: null
        };
        
        // Animation IDs for AnimationCoordinator integration
        this.dragAnimationId = null;
        this.resizeAnimationId = null;
        
        this.init();
    }
    
    // Utility functions for common popup operations
    popupUtils = {
        // Set popup position with bounds checking
        setPosition: (element, x, y) => {
            const rect = element.getBoundingClientRect();
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            
            // Constrain to viewport bounds
            const constrainedX = Math.max(0, Math.min(x, viewportWidth - rect.width));
            const constrainedY = Math.max(0, Math.min(y, viewportHeight - rect.height));
            
            element.style.left = constrainedX + 'px';
            element.style.top = constrainedY + 'px';
            element.style.transform = 'none';
        },
        
        // Add dragging state to popup
        addDraggingState: (element) => {
            element.classList.add('dragging');
        },
        
        // Remove dragging state from popup
        removeDraggingState: (element) => {
            element.classList.remove('dragging');
        },
        
        // Reset popup position for next open
        resetPosition: (element) => {
            element.style.left = '';
            element.style.top = '';
            element.style.transform = '';
        },
        
        // Check if element is within viewport bounds
        isWithinViewport: (element) => {
            const rect = element.getBoundingClientRect();
            return rect.top >= 0 && rect.left >= 0 && 
                   rect.bottom <= window.innerHeight && 
                   rect.right <= window.innerWidth;
        }
    };
    
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
            popup: document.querySelector('.image-center-popup'),
            popupImage: document.querySelector('#popup-image'),
            popupFilename: document.querySelector('#popup-filename'),
            popupClose: document.querySelector('#popup-close'),
            popupNavLeft: document.querySelector('#popup-nav-left'),
            popupNavRight: document.querySelector('#popup-nav-right'),
            // Drag and resize elements
            draggableArea: document.querySelector('.draggable-area'),
            resizeHandles: {
                nw: document.querySelector('#resize-nw'),
                ne: document.querySelector('#resize-ne'),
                sw: document.querySelector('#resize-sw'),
                se: document.querySelector('#resize-se')
            }
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
        
        // Setup drag and resize functionality
        this.setupDragAndResize();
    }
    
    setupDragAndResize() {
        if (!window.eventManager) return;
        
        // Start dragging when mouse is pressed on navigation bar (like old working code)
        if (this.popupElements.popup) {
            const popupNav = this.popupElements.popup.querySelector('.popup-nav');
            if (popupNav) {
                window.eventManager.addListener(popupNav, 'mousedown', (e) => {
                    this.startDrag(e);
                });
            }
        }
        
        // Start resizing when clicking on corner handles
        if (this.popupElements.resizeHandles) {
            Object.values(this.popupElements.resizeHandles).forEach(handle => {
                if (handle) {
                    window.eventManager.addListener(handle, 'mousedown', (e) => {
                        this.startResize(e);
                    });
                }
            });
        }
        
        // Prevent dragging when clicking on filename text
        if (this.popupElements.popupFilename) {
            window.eventManager.addListener(this.popupElements.popupFilename, 'mousedown', (e) => {
                e.stopPropagation(); // Prevent drag from starting
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
            
            // Wait for image to load, then calculate and set optimal size
            this.popupElements.popupImage.onload = () => {
                // Calculate minimum size needed for this image
                const imageMinSize = this.calculateMinimumPopupSize();
                
                // Get viewport dimensions
                const viewportWidth = window.innerWidth;
                const viewportHeight = window.innerHeight;
                
                // Smart sizing: Calculate optimal dimensions based on image and viewport
                const optimalSize = this.calculateOptimalPopupSize(
                    this.popupElements.popupImage.naturalWidth,
                    this.popupElements.popupImage.naturalHeight,
                    imageMinSize,
                    viewportWidth,
                    viewportHeight
                );
                
                // Set the calculated optimal size
                this.popupElements.popup.style.width = optimalSize.width + 'px';
                this.popupElements.popup.style.height = optimalSize.height + 'px';
                
                // Show popup
                this.popupElements.popup.classList.add('active');
            };
            
            // If image is already loaded, size immediately
            if (this.popupElements.popupImage.complete) {
                this.popupElements.popupImage.onload();
            }
            
        } catch (error) {
            // Handle popup error silently
        }
    }
    
    closePopup() {
        this.popupElements.popup.classList.remove('active');
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
        return this.popupElements.popup?.classList.contains('active') || false;
    }
    
    isReady() {
        return this.isInitialized && this.popupElements.popup !== null;
    }
    
    // Drag functionality
    startDrag(e) {
        // Don't start drag if clicking on buttons, filename, OR resize handles
        if (e.target.closest('.popup-actions') || 
            e.target.closest('#popup-filename') ||
            e.target.closest('.resize-handle')) {
            return;
        }
        
        // Only allow dragging from the navigation bar background area
        if (!e.target.closest('.popup-nav') || e.target.closest('.wrapper-actions')) {
            return;
        }
        
        e.preventDefault();
        
        // Get popup current position
        const popupRect = this.popupElements.popup.getBoundingClientRect();
        this.dragState.popupStartX = popupRect.left;
        this.dragState.popupStartY = popupRect.top;
        
        // Get mouse start position
        this.dragState.startX = e.clientX;
        this.dragState.startY = e.clientY;
        
        // Register drag animation with AnimationCoordinator (CRITICAL priority)
        if (window.animationCoordinator) {
            this.dragAnimationId = window.animationCoordinator.registerJSAnimation(
                this.popupElements.popup,
                'transform',
                `popup-drag-${Date.now()}`,
                window.animationCoordinator.priorities.CRITICAL
            );
        }
        
        // Use utility to add dragging state
        this.popupUtils.addDraggingState(this.popupElements.popup);
        
        // Add event listeners for dragging
        if (window.eventManager) {
            window.eventManager.addListener(document, 'mousemove', (e) => this.drag(e));
            window.eventManager.addListener(document, 'mouseup', (e) => this.stopDrag(e));
        } else {
            document.addEventListener('mousemove', (e) => this.drag(e));
            document.addEventListener('mouseup', (e) => this.stopDrag(e));
        }
        
        this.dragState.isDragging = true;
    }
    
    drag(e) {
        if (!this.dragState.isDragging) return;
        
        e.preventDefault();
        
        const deltaX = e.clientX - this.dragState.startX;
        const deltaY = e.clientY - this.dragState.startY;
        
        const newX = this.dragState.popupStartX + deltaX;
        const newY = this.dragState.popupStartY + deltaY;
        
        // Use utility to set position with bounds checking
        this.popupUtils.setPosition(this.popupElements.popup, newX, newY);
    }
    
    stopDrag(e) {
        if (!this.dragState.isDragging) return;
        
        e.preventDefault();
        
        // Remove event listeners
        if (window.eventManager) {
            window.eventManager.removeListener(document, 'mousemove', (e) => this.drag(e));
            window.eventManager.removeListener(document, 'mouseup', (e) => this.stopDrag(e));
        } else {
            document.removeEventListener('mousemove', (e) => this.drag(e));
            document.removeEventListener('mouseup', (e) => this.stopDrag(e));
        }
        
        // Clean up drag animation with AnimationCoordinator
        if (window.animationCoordinator && this.dragAnimationId) {
            window.animationCoordinator.cleanupAnimation(
                this.popupElements.popup,
                this.dragAnimationId
            );
            this.dragAnimationId = null;
        }
        
        // Use utility to remove dragging state
        this.popupUtils.removeDraggingState(this.popupElements.popup);
        
        this.dragState.isDragging = false;
    }
    
    // Resize functionality
    startResize(e) {
        e.preventDefault();
        
        // Get resize handle that was clicked
        this.resizeState.resizeHandle = e.target;
        
        // Get popup current dimensions and position
        const popupRect = this.popupElements.popup.getBoundingClientRect();
        this.resizeState.startWidth = popupRect.width;
        this.resizeState.startHeight = popupRect.height;
        this.resizeState.startLeft = popupRect.left;
        this.resizeState.startTop = popupRect.top;
        
        // Get mouse start position
        this.resizeState.startX = e.clientX;
        this.resizeState.startY = e.clientY;
        
        // Register resize animation with AnimationCoordinator (CRITICAL priority)
        if (window.animationCoordinator) {
            this.resizeAnimationId = window.animationCoordinator.registerJSAnimation(
                this.popupElements.popup,
                'scale',
                `popup-resize-${Date.now()}`,
                window.animationCoordinator.priorities.CRITICAL
            );
        }
        
        // Add resizing state
        this.popupElements.popup.classList.add('resizing');
        
        // Add event listeners for resizing
        if (window.eventManager) {
            window.eventManager.addListener(document, 'mousemove', (e) => this.resize(e));
            window.eventManager.addListener(document, 'mouseup', (e) => this.stopResize(e));
        } else {
            document.addEventListener('mousemove', (e) => this.resize(e));
            document.addEventListener('mouseup', (e) => this.stopResize(e));
        }
        
        this.resizeState.isResizing = true;
    }
    
    resize(e) {
        if (!this.resizeState.isResizing) return;
        
        e.preventDefault();
        
        const deltaX = e.clientX - this.resizeState.startX;
        const deltaY = e.clientY - this.resizeState.startY;
        
        let newWidth = this.resizeState.startWidth;
        let newHeight = this.resizeState.startHeight;
        let newLeft = this.resizeState.startLeft;
        let newTop = this.resizeState.startTop;
        
        // Determine resize direction based on handle
        const handleId = this.resizeState.resizeHandle.id;
        
        switch (handleId) {
            case 'resize-nw': // Northwest - top-left
                newWidth = this.resizeState.startWidth - deltaX;
                newHeight = this.resizeState.startHeight - deltaY;
                newLeft = this.resizeState.startLeft + deltaX;
                newTop = this.resizeState.startTop + deltaY;
                break;
            case 'resize-ne': // Northeast - top-right
                newWidth = this.resizeState.startWidth + deltaX;
                newHeight = this.resizeState.startHeight - deltaY;
                newTop = this.resizeState.startTop + deltaY;
                break;
            case 'resize-sw': // Southwest - bottom-left
                newWidth = this.resizeState.startWidth - deltaX;
                newHeight = this.resizeState.startHeight + deltaY;
                newLeft = this.resizeState.startLeft + deltaX;
                break;
            case 'resize-se': // Southeast - bottom-right
                newWidth = this.resizeState.startWidth + deltaX;
                newHeight = this.resizeState.startHeight + deltaY;
                break;
        }
        
        // macOS Preview-style constraints: Content-aware and smooth
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        // Basic minimum size to prevent popup from being too small
        const minWidth = 300; // Minimum width for comfortable viewing
        const minHeight = 300; // Minimum height for comfortable viewing
        
        // Apply basic minimum size constraints
        newWidth = Math.max(minWidth, newWidth);
        newHeight = Math.max(minHeight, newHeight);
        
        // macOS Preview approach: Keep popup within viewport bounds
        // Ensure the popup never goes outside the viewport
        if (newLeft + newWidth > viewportWidth) {
            newWidth = viewportWidth - newLeft;
        }
        
        if (newTop + newHeight > viewportHeight) {
            newHeight = viewportHeight - newTop;
        }
        
        // Handle negative positions (simple clamping like macOS Preview)
        if (newLeft < 0) {
            newLeft = 0;
        }
        
        if (newTop < 0) {
            newTop = 0;
        }
        
        // Apply new dimensions and position (macOS Preview smooth)
        this.popupElements.popup.style.width = newWidth + 'px';
        this.popupElements.popup.style.height = newHeight + 'px';
        this.popupElements.popup.style.left = newLeft + 'px';
        this.popupElements.popup.style.top = newTop + 'px';
        this.popupElements.popup.style.transform = 'none';
    }
    
    stopResize(e) {
        if (!this.resizeState.isResizing) return;
        
        e.preventDefault();
        
        // Remove event listeners
        if (window.eventManager) {
            window.eventManager.removeListener(document, 'mousemove', (e) => this.resize(e));
            window.eventManager.removeListener(document, 'mouseup', (e) => this.stopResize(e));
        } else {
            document.removeEventListener('mousemove', (e) => this.resize(e));
            document.removeEventListener('mouseup', (e) => this.stopResize(e));
        }
        
        // Clean up resize animation with AnimationCoordinator
        if (window.animationCoordinator && this.resizeAnimationId) {
            window.animationCoordinator.cleanupAnimation(
                this.popupElements.popup,
                this.resizeAnimationId
            );
            this.resizeAnimationId = null;
        }
        
        // Remove resizing state
        this.popupElements.popup.classList.remove('resizing');
        
        this.resizeState.isResizing = false;
    }
    
    // Calculate minimum popup size needed to display full image with padding
    calculateMinimumPopupSize() {
        const img = this.popupElements.popupImage;
        if (!img || !img.complete) return { width: POPUP_CONFIG.minSize, height: POPUP_CONFIG.minSize };
        
        const basePadding = 40; // 20px on each side (20px * 2) - minimum padding
        const navigationBarHeight = 60; // Navigation bar height
        
        // macOS Preview approach: Image + padding must ALWAYS be visible
        // Calculate the minimum size needed to show the full image with base padding
        let minWidth = img.naturalWidth + basePadding;
        let minHeight = img.naturalHeight + basePadding + navigationBarHeight;
        
        // Ensure minimum size is respected
        minWidth = Math.max(minWidth, POPUP_CONFIG.minSize);
        minHeight = Math.max(minHeight, POPUP_CONFIG.minSize);
        
        return { width: minWidth, height: minHeight };
    }
    
    // Calculate optimal popup size based on image dimensions and viewport
    calculateOptimalPopupSize(imageWidth, imageHeight, imageMinSize, viewportWidth, viewportHeight) {
        // macOS Preview approach: Simple, comfortable sizing with proper margins
        const margin = 80; // 40px on each side for comfortable breathing room
        const maxWidth = viewportWidth - margin;
        const maxHeight = viewportHeight - margin;
        
        // Calculate image aspect ratio
        const imageAspectRatio = imageWidth / imageHeight;
        
        // Simple approach: fit the image within the available space while maintaining aspect ratio
        let popupWidth, popupHeight;
        
        if (imageAspectRatio > 1) {
            // Wide image - fit to available width
            popupWidth = Math.min(imageWidth, maxWidth);
            popupHeight = popupWidth / imageAspectRatio;
            
            // If height exceeds available height, scale down proportionally
            if (popupHeight > maxHeight) {
                popupHeight = maxHeight;
                popupWidth = popupHeight * imageAspectRatio;
            }
        } else {
            // Tall image - fit to available height
            popupHeight = Math.min(imageHeight, maxHeight);
            popupWidth = popupHeight * imageAspectRatio;
            
            // If width exceeds available width, scale down proportionally
            if (popupWidth > maxWidth) {
                popupWidth = maxWidth;
                popupHeight = popupWidth / imageAspectRatio;
            }
        }
        
        // Ensure we meet minimum size requirements, but don't exceed viewport
        popupWidth = Math.max(popupWidth, imageMinSize.width);
        popupHeight = Math.max(popupHeight, imageMinSize.height);
        
        // Critical: If minimum size exceeds viewport, scale down proportionally
        // This ensures the popup never goes beyond viewport bounds
        if (popupWidth > maxWidth || popupHeight > maxHeight) {
            // Calculate scale factor to fit within viewport
            const scaleX = maxWidth / popupWidth;
            const scaleY = maxHeight / popupHeight;
            const scale = Math.min(scaleX, scaleY);
            
            // Apply scale while maintaining aspect ratio
            popupWidth = popupWidth * scale;
            popupHeight = popupHeight * scale;
        }
        
        // Final bounds check - ensure we don't exceed viewport (safety check)
        popupWidth = Math.min(popupWidth, maxWidth);
        popupHeight = Math.min(popupHeight, maxHeight);
        
        return {
            width: Math.round(popupWidth),
            height: Math.round(popupHeight)
        };
    }
    
    destroy() {
        // Clean up any active animations
        if (window.animationCoordinator) {
            if (this.dragAnimationId) {
                window.animationCoordinator.cleanupAnimation(
                    this.popupElements.popup,
                    this.dragAnimationId
                );
            }
            if (this.resizeAnimationId) {
                window.animationCoordinator.cleanupAnimation(
                    this.popupElements.popup,
                    this.resizeAnimationId
                );
            }
        }
        
        // Clean up event listeners if needed
        this.projectImages = [];
        this.popupElements = {};
        this.isInitialized = false;
        
        // Reset animation IDs
        this.dragAnimationId = null;
        this.resizeAnimationId = null;
    }
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PopupManager;
}

// Create global instance if not in module system
if (typeof window !== 'undefined') {
    window.PopupManager = PopupManager;
}
