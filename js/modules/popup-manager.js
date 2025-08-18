// Popup Manager Module
// Handles both image and text popup display, navigation, and interactions
// Extracted from project-script.js for better organization

// Popup Configuration - Centralized settings
const POPUP_CONFIG = {
    // Core popup settings
    minSize: 200,
    
    // Z-index values
    popupZIndex: 10000,
    resizeHandleZIndex: 10001,
    
    // Text popup specific settings
    textPopup: {
        minWidth: 400,
        minHeight: 300,
        maxWidth: 800,
        maxHeight: 600,
        padding: 40,
        lineHeight: 1.6,
        titleFontSize: '1.5rem',
        bodyFontSize: '1rem'
    }
};

// Text popup content templates
const TEXT_POPUP_TEMPLATES = {
    about: {
        title: "About",
        content: {
            text: "I'm a generalist designer with experience across growth, systems, and zero to one design. I thrive in spaces without playbooks—where creative thinking and fast learning matter most. I'm good at helping teams transform ambiguity into ambition, together. To imagine new solutions, ship things we're proud of, and most importantly—enjoy our time working together.\n\nI've been at Slack for the last four years, and currently lead design for huddles, Slack's most used, and most loved feature. Before that, I got my undergraduate and master's degree in Computer Science, from Stanford University.\n\n01. Email\nhello@isha.work\n\n02. LinkedIn\n<a href='https://www.linkedin.com/in/ishakumar' target='_blank' class='bio-link'><strong style='font-weight: 500;'>@ishakumar</strong></a>\n\n03. More\n<a href='assets/Resume.pdf' target='_blank' class='bio-link'><strong style='font-weight: 500;'>Resume</strong></a>"
        }
    }
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
        
        // Store bound event handlers for proper removal
        this.boundResize = this.resize.bind(this);
        this.boundStopResize = this.stopResize.bind(this);
        this.boundDrag = this.drag.bind(this);
        this.boundStopDrag = this.stopDrag.bind(this);
        
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
        // Check if we're on a project page or homepage
        const isProjectPage = window.location.pathname.includes('-project.html');
        
        if (isProjectPage) {
            // Wait for project content to be ready before initializing
            document.addEventListener('projectContentReady', () => {
                this.findPopupElements();
                this.findProjectImages();
                this.setupEventListeners();
                this.isInitialized = true;
            });
        } else {
            // Homepage: initialize immediately
            this.findPopupElements();
            this.setupEventListeners();
            this.isInitialized = true;
        }
    }
    
    findPopupElements() {
        this.popupElements = {
            popup: document.querySelector('.image-center-popup'),
            popupImage: document.querySelector('#popup-image'),
            popupFilename: document.querySelector('#popup-filename'),
            popupClose: document.querySelector('#popup-close'),
            popupNavLeft: document.querySelector('#popup-nav-left'),
            popupNavRight: document.querySelector('#popup-nav-right'),
            // Text popup elements
            popupTextContainer: document.querySelector('#popup-text-container'),
            popupTextContent: document.querySelector('#popup-text-content'),
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
        
        // Add click event listeners to all project images (only if they exist)
        if (this.projectImages && this.projectImages.length > 0) {
            this.projectImages.forEach((img, index) => {
                window.eventManager.addListener(img, 'click', () => {
                    this.openPopup(index);
                });
            });
        }
        
        // Close popup
        if (this.popupElements.popupClose) {
            window.eventManager.addListener(this.popupElements.popupClose, 'click', () => {
                this.closePopup();
            });
        }
        
        // Navigation (only if elements exist)
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
        // Input validation
        if (typeof imageIndex !== 'number' || imageIndex < 0) {
            console.warn('PopupManager: Invalid image index provided');
            return;
        }
        
        if (!this.isInitialized) {
            console.warn('PopupManager: Not initialized');
            return;
        }
        
        if (!this.projectImages || !this.projectImages[imageIndex]) {
            console.warn('PopupManager: Image not found at index', imageIndex);
            return;
        }
        
        try {
            // Set popup type
            this.popupType = 'image';
            
            this.currentImageIndex = imageIndex;
            
            // Set image source and filename
            this.popupElements.popupImage.src = this.projectImages[imageIndex].src;
            this.popupElements.popupImage.alt = this.projectImages[imageIndex].alt || '';
            
            // Get filename from title span
            const titleSpan = this.projectImages[imageIndex].closest('.image')?.querySelector('.title span');
            const filename = titleSpan ? titleSpan.textContent : 'image.png';
            this.popupElements.popupFilename.textContent = filename;
            
            // Reset popup type attribute for CSS styling
            this.popupElements.popup.removeAttribute('data-popup-type');
            
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
                
                // Validate optimal size
                if (optimalSize && optimalSize.width && optimalSize.height) {
                    // Set the calculated optimal size
                    this.popupElements.popup.style.width = optimalSize.width + 'px';
                    this.popupElements.popup.style.height = optimalSize.height + 'px';
                    
                    // Show popup
                    this.popupElements.popup.classList.add('active');
                } else {
                    console.warn('PopupManager: Invalid optimal size calculated');
                }
            };
            
            // If image is already loaded, size immediately
            if (this.popupElements.popupImage.complete) {
                this.popupElements.popupImage.onload();
            }
            
        } catch (error) {
            console.error('PopupManager: Error opening image popup:', error);
        }
    }
    
    closePopup() {
        this.popupElements.popup.classList.remove('active');
    }
    
    // Open text popup (for About section, etc.)
    openTextPopup(templateName) {
        // Input validation
        if (!templateName || typeof templateName !== 'string') {
            console.warn('PopupManager: Invalid template name provided');
            return;
        }
        
        if (!this.isInitialized) {
            console.warn('PopupManager: Not initialized');
            return;
        }
        
        try {
            // Set popup type
            this.popupType = 'text';
            
            // Get template content
            const template = TEXT_POPUP_TEMPLATES[templateName];
            if (!template) {
                console.warn(`PopupManager: Template '${templateName}' not found`);
                return;
            }
            
            // Validate template structure
            if (!template.title || !template.content || !template.content.text) {
                console.warn('PopupManager: Invalid template structure');
                return;
            }
            
            // Store current content
            this.currentContent = template;
            
            // Update popup title
            if (this.popupElements.popupFilename) {
                this.popupElements.popupFilename.textContent = template.title;
            }
            
            // Populate text content
            if (this.popupElements.popupTextContent) {
                this.popupElements.popupTextContent.innerHTML = `
                    <p>${template.content.text}</p>
                `;
            }
            
            // Set popup type attribute for CSS styling
            if (this.popupElements.popup) {
                this.popupElements.popup.setAttribute('data-popup-type', 'text');
                
                // Calculate text popup dimensions
                const textDimensions = this.calculateTextPopupSize();
                
                // Validate dimensions
                if (textDimensions && textDimensions.width && textDimensions.height) {
                    // Set dimensions
                    this.popupElements.popup.style.width = textDimensions.width + 'px';
                    this.popupElements.popup.style.height = textDimensions.height + 'px';
                    
                    // Show popup
                    this.popupElements.popup.classList.add('active');
                } else {
                    console.warn('PopupManager: Invalid dimensions calculated');
                }
            } else {
                console.warn('PopupManager: Popup element not found');
            }
            
        } catch (error) {
            console.error('PopupManager: Error opening text popup:', error);
        }
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
        // Input validation
        if (!e || !this.popupElements.popup) {
            return;
        }
        
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
        
        // Add event listeners for dragging - use capture phase to ensure we get the events
        document.addEventListener('mousemove', this.boundDrag, true);
        document.addEventListener('mouseup', this.boundStopDrag, true);
        
        // Add safety timeout to force cleanup if mouseup doesn't fire
        this.dragState.safetyTimeout = setTimeout(() => {
            if (this.dragState.isDragging) {
                this.stopDrag({ preventDefault: () => {} });
            }
        }, 10000); // 10 second timeout
        
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
        if (!this.dragState.isDragging) {
            return;
        }
        
        e.preventDefault();
        
        // Remove event listeners - use capture phase to match the addEventListener calls
        document.removeEventListener('mousemove', this.boundDrag, true);
        document.removeEventListener('mouseup', this.boundStopDrag, true);
        
        // Clear safety timeout
        if (this.dragState.safetyTimeout) {
            clearTimeout(this.dragState.safetyTimeout);
            this.dragState.safetyTimeout = null;
        }
        
        // Clean up drag animation with AnimationCoordinator
        if (window.animationCoordinator && this.dragAnimationId) {
            window.animationCoordinator.unregisterAnimation(
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
        // Input validation
        if (!e || !this.popupElements.popup) {
            return;
        }
        
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
        
        // Add event listeners for resizing - use capture phase to ensure we get the events
        document.addEventListener('mousemove', this.boundResize, true);
        document.addEventListener('mouseup', this.boundStopResize, true);
        
        // Add safety timeout to force cleanup if mouseup doesn't fire
        this.resizeState.safetyTimeout = setTimeout(() => {
            if (this.resizeState.isResizing) {
                this.stopResize({ preventDefault: () => {} });
            }
        }, 10000); // 10 second timeout
        
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
        if (!this.resizeState.isResizing) {
            return;
        }
        
        e.preventDefault();
        
        // Remove event listeners - use capture phase to match the addEventListener calls
        document.removeEventListener('mousemove', this.boundResize, true);
        document.removeEventListener('mouseup', this.boundStopResize, true);
        
        // Clear safety timeout
        if (this.resizeState.safetyTimeout) {
            clearTimeout(this.resizeState.safetyTimeout);
            this.resizeState.safetyTimeout = null;
        }
        
        // Clean up resize animation with AnimationCoordinator
        if (window.animationCoordinator && this.resizeAnimationId) {
            window.animationCoordinator.unregisterAnimation(
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
        // Input validation
        if (!this.validateDimensions(imageWidth, imageHeight, imageMinSize, viewportWidth, viewportHeight)) {
            return null;
        }
        
        // Calculate available space with margins
        const availableSpace = this.calculateAvailableSpace(viewportWidth, viewportHeight);
        
        // Calculate initial size based on image dimensions
        let popupSize = this.calculateInitialSize(imageWidth, imageHeight, availableSpace);
        
        // Apply minimum size constraints
        popupSize = this.applyMinimumSizeConstraints(popupSize, imageMinSize);
        
        // Scale down if needed to fit viewport
        popupSize = this.scaleToFitViewport(popupSize, availableSpace);
        
        // Final bounds check
        popupSize = this.applyFinalBoundsCheck(popupSize, availableSpace);
        
        return {
            width: Math.round(popupSize.width),
            height: Math.round(popupSize.height)
        };
    }
    
    // Validate input dimensions
    validateDimensions(imageWidth, imageHeight, imageMinSize, viewportWidth, viewportHeight) {
        return imageWidth > 0 && imageHeight > 0 && 
               imageMinSize && imageMinSize.width > 0 && imageMinSize.height > 0 &&
               viewportWidth > 0 && viewportHeight > 0;
    }
    
    // Calculate available space with margins
    calculateAvailableSpace(viewportWidth, viewportHeight) {
        const margin = 80; // 40px on each side for comfortable breathing room
        return {
            maxWidth: viewportWidth - margin,
            maxHeight: viewportHeight - margin
        };
    }
    
    // Calculate initial size based on image dimensions
    calculateInitialSize(imageWidth, imageHeight, availableSpace) {
        const imageAspectRatio = imageWidth / imageHeight;
        
        if (imageAspectRatio > 1) {
            // Wide image - fit to available width
            let popupWidth = Math.min(imageWidth, availableSpace.maxWidth);
            let popupHeight = popupWidth / imageAspectRatio;
            
            // If height exceeds available height, scale down proportionally
            if (popupHeight > availableSpace.maxHeight) {
                popupHeight = availableSpace.maxHeight;
                popupWidth = popupHeight * imageAspectRatio;
            }
            
            return { width: popupWidth, height: popupHeight };
        } else {
            // Tall image - fit to available height
            let popupHeight = Math.min(imageHeight, availableSpace.maxHeight);
            let popupWidth = popupHeight * imageAspectRatio;
            
            // If width exceeds available width, scale down proportionally
            if (popupWidth > availableSpace.maxWidth) {
                popupWidth = availableSpace.maxWidth;
                popupHeight = popupWidth / imageAspectRatio;
            }
            
            return { width: popupWidth, height: popupHeight };
        }
    }
    
    // Apply minimum size constraints
    applyMinimumSizeConstraints(popupSize, imageMinSize) {
        return {
            width: Math.max(popupSize.width, imageMinSize.width),
            height: Math.max(popupSize.height, imageMinSize.height)
        };
    }
    
    // Scale down if needed to fit viewport
    scaleToFitViewport(popupSize, availableSpace) {
        if (popupSize.width > availableSpace.maxWidth || popupSize.height > availableSpace.maxHeight) {
            // Calculate scale factor to fit within viewport
            const scaleX = availableSpace.maxWidth / popupSize.width;
            const scaleY = availableSpace.maxHeight / popupSize.height;
            const scale = Math.min(scaleX, scaleY);
            
            // Apply scale while maintaining aspect ratio
            return {
                width: popupSize.width * scale,
                height: popupSize.height * scale
            };
        }
        
        return popupSize;
    }
    
    // Apply final bounds check
    applyFinalBoundsCheck(popupSize, availableSpace) {
        return {
            width: Math.min(popupSize.width, availableSpace.maxWidth),
            height: Math.min(popupSize.height, availableSpace.maxHeight)
        };
    }
    
    // Calculate text popup size based on content and viewport
    calculateTextPopupSize() {
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        // Get text popup config
        const config = POPUP_CONFIG.textPopup;
        
        // Start with minimum dimensions
        let width = config.minWidth;
        let height = config.minHeight;
        
        // Calculate optimal width (comfortable reading width)
        const maxReadableWidth = Math.min(viewportWidth * 0.8, config.maxWidth);
        width = Math.max(config.minWidth, Math.min(width, maxReadableWidth));
        
        // Calculate height based on content (placeholder for now)
        // In the future, this could calculate based on actual text length
        const contentHeight = 200; // Placeholder height
        height = Math.max(config.minHeight, contentHeight + (config.padding * 2));
        
        // Ensure we don't exceed viewport
        if (height > viewportHeight * 0.8) {
            height = viewportHeight * 0.8;
        }
        
        return {
            width: Math.round(width),
            height: Math.round(height)
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
