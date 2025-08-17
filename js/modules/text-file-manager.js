// Text File Manager Module
// Handles text file popup display, navigation, and interactions
// Creates a modal overlay similar to go-od.co text popup functionality

class TextFileManager {
    constructor() {
        this.currentTextFile = null;
        this.textFileItems = [];
        this.popupElements = {};
        this.isInitialized = false;
        this.isDragging = false;
        this.dragOffset = { x: 0, y: 0 };
        
        this.init();
    }
    
    init() {
        // Wait for EventManager to be available before initializing
        this.waitForEventManager();
    }
    
    waitForEventManager() {
        if (window.eventManager) {
            this.initializeAfterEventManager();
        } else {
            // Wait a bit and try again
            setTimeout(() => this.waitForEventManager(), 100);
        }
    }
    
    initializeAfterEventManager() {
        this.findTextFileItems();
        this.createPopupElements();
        this.setupEventListeners();
        this.isInitialized = true;
        
        console.log('TextFileManager: Initialized successfully');
    }
    
    findTextFileItems() {
        // Find all text file items with data-textfile attribute
        this.textFileItems = document.querySelectorAll('[data-textfile]');
        console.log(`TextFileManager: Found ${this.textFileItems.length} text file items`);
    }
    
    createPopupElements() {
        // Create the popup overlay if it doesn't exist
        if (!document.querySelector('.text-file-popup')) {
            this.createPopupHTML();
        }
        
        this.findPopupElements();
    }
    
    createPopupHTML() {
        const popupHTML = `
            <div class="text-file-popup" style="display: none;">
                <div class="popup-overlay"></div>
                <div class="popup-container">
                    <div class="popup-nav">
                        <div class="nav-buttons">
                            <button class="nav-button close-btn" aria-label="Close"></button>
                            <button class="nav-button minimize-btn" aria-label="Minimize"></button>
                        </div>
                        <div class="popup-title"></div>
                        <div class="nav-buttons">
                            <button class="nav-button fullscreen-btn" aria-label="Fullscreen"></button>
                        </div>
                    </div>
                    <div class="popup-content">
                        <div class="text-content"></div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', popupHTML);
    }
    
    findPopupElements() {
        this.popupElements = {
            popup: document.querySelector('.text-file-popup'),
            overlay: document.querySelector('.text-file-popup .popup-overlay'),
            container: document.querySelector('.text-file-popup .popup-container'),
            nav: document.querySelector('.text-file-popup .popup-nav'),
            title: document.querySelector('.text-file-popup .popup-title'),
            content: document.querySelector('.text-file-popup .text-content'),
            closeBtn: document.querySelector('.text-file-popup .close-btn'),
            minimizeBtn: document.querySelector('.text-file-popup .minimize-btn'),
            fullscreenBtn: document.querySelector('.text-file-popup .fullscreen-btn')
        };
    }
    
    setupEventListeners() {
        if (!window.eventManager) {
            console.warn('TextFileManager: EventManager not available');
            return;
        }
        
        console.log('TextFileManager: Setting up event listeners for', this.textFileItems.length, 'items');
        
        // Add click event listeners to all text file items
        this.textFileItems.forEach((item, index) => {
            console.log(`TextFileManager: Adding click listener to item ${index}:`, item);
            window.eventManager.addListener(item, 'click', (e) => {
                console.log('TextFileManager: Click event triggered!');
                e.preventDefault();
                const textFileId = item.getAttribute('data-textfile');
                this.openTextFile(textFileId, item);
            });
        });
        
        // Close popup events
        if (this.popupElements.closeBtn) {
            window.eventManager.addListener(this.popupElements.closeBtn, 'click', () => {
                this.closePopup();
            });
        }
        
        if (this.popupElements.overlay) {
            window.eventManager.addListener(this.popupElements.overlay, 'click', () => {
                this.closePopup();
            });
        }
        
        // Minimize and fullscreen (placeholder functionality)
        if (this.popupElements.minimizeBtn) {
            window.eventManager.addListener(this.popupElements.minimizeBtn, 'click', () => {
                this.minimizePopup();
            });
        }
        
        if (this.popupElements.fullscreenBtn) {
            window.eventManager.addListener(this.popupElements.fullscreenBtn, 'click', () => {
                this.toggleFullscreen();
            });
        }
        
        // Dragging functionality
        this.setupDragging();
        
        // Keyboard shortcuts
        this.setupKeyboardShortcuts();
    }
    
    setupDragging() {
        if (!this.popupElements.nav) return;
        
        window.eventManager.addListener(this.popupElements.nav, 'mousedown', (e) => {
            this.startDragging(e);
        });
        
        window.eventManager.addListener(document, 'mousemove', (e) => {
            if (this.isDragging) {
                this.drag(e);
            }
        });
        
        window.eventManager.addListener(document, 'mouseup', () => {
            this.stopDragging();
        });
    }
    
    setupKeyboardShortcuts() {
        window.eventManager.addListener(document, 'keydown', (e) => {
            if (e.key === 'Escape' && this.isPopupOpen()) {
                this.closePopup();
            }
        });
    }
    
    startDragging(e) {
        this.isDragging = true;
        const rect = this.popupElements.container.getBoundingClientRect();
        this.dragOffset = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
        this.popupElements.container.style.cursor = 'grabbing';
    }
    
    drag(e) {
        if (!this.isDragging) return;
        
        const x = e.clientX - this.dragOffset.x;
        const y = e.clientY - this.dragOffset.y;
        
        this.popupElements.container.style.transform = `translate(${x}px, ${y}px)`;
    }
    
    stopDragging() {
        this.isDragging = false;
        if (this.popupElements.container) {
            this.popupElements.container.style.cursor = 'grab';
        }
    }
    
    openTextFile(textFileId, item) {
        try {
            this.currentTextFile = textFileId;
            
            // Get title from the clicked item
            const titleSpan = item.querySelector('.title span');
            const title = titleSpan ? titleSpan.textContent : textFileId;
            
            // Set popup title
            this.popupElements.title.textContent = title;
            
            // Load content (placeholder for now)
            this.loadTextContent(textFileId);
            
            // Show popup with animation
            this.showPopup();
            
            console.log(`TextFileManager: Opened text file: ${textFileId}`);
            
        } catch (error) {
            console.error('TextFileManager: Error opening text file:', error);
        }
    }
    
    loadTextContent(textFileId) {
        // Placeholder content - this will be replaced with actual content loading
        const content = this.getTextContent(textFileId);
        this.popupElements.content.innerHTML = content;
    }
    
    getTextContent(textFileId) {
        // Placeholder content for different text files
        const contentMap = {
            'about': `
                <h1>About</h1>
                <p>This is a placeholder for the About content. Replace this with your actual content.</p>
                <p>You can include multiple paragraphs, headings, and other HTML elements.</p>
            `,
            'people': `
                <h1>People</h1>
                <p>This is a placeholder for the People content. Replace this with your actual content.</p>
                <p>You can include multiple paragraphs, headings, and other HTML elements.</p>
            `,
            'default': `
                <h1>${textFileId.charAt(0).toUpperCase() + textFileId.slice(1)}</h1>
                <p>This is a placeholder for the ${textFileId} content. Replace this with your actual content.</p>
            `
        };
        
        return contentMap[textFileId] || contentMap.default;
    }
    
    showPopup() {
        if (!this.popupElements.popup) return;
        
        // Reset transform for fresh positioning
        if (this.popupElements.container) {
            this.popupElements.container.style.transform = 'translate(0, 0)';
        }
        
        this.popupElements.popup.style.display = 'block';
        
        // Use CSS animation system - add active class to trigger animations
        setTimeout(() => {
            this.popupElements.popup.classList.add('active');
        }, 10);
    }
    
    closePopup() {
        if (!this.popupElements.popup) return;
        
        // Use CSS animation system - remove active class to trigger exit animations
        this.popupElements.popup.classList.remove('active');
        
        // Wait for CSS animation to complete before hiding
        setTimeout(() => {
            this.hidePopup();
        }, 300);
    }
    
    hidePopup() {
        if (this.popupElements.popup) {
            this.popupElements.popup.style.display = 'none';
        }
        this.currentTextFile = null;
    }
    
    minimizePopup() {
        // Placeholder for minimize functionality
        console.log('TextFileManager: Minimize functionality not yet implemented');
    }
    
    toggleFullscreen() {
        // Placeholder for fullscreen functionality
        console.log('TextFileManager: Fullscreen functionality not yet implemented');
    }
    
    isPopupOpen() {
        return this.popupElements.popup?.style.display !== 'none';
    }
    
    getCurrentTextFile() {
        return this.currentTextFile;
    }
    
    getTextFileItems() {
        return this.textFileItems;
    }
    
    isReady() {
        return this.isInitialized && this.popupElements.popup !== null;
    }
    
    destroy() {
        // Clean up event listeners if needed
        this.textFileItems = [];
        this.popupElements = {};
        this.isInitialized = false;
        this.isDragging = false;
    }
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TextFileManager;
}

// Create global instance if not in module system
if (typeof window !== 'undefined') {
    window.TextFileManager = TextFileManager;
}
