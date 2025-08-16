# JavaScript Modules Quick Reference

## 🚀 **Quick Start**

```javascript
// Initialize project page
const projectMain = new ProjectMain();

// Get specific module
const flowerModule = projectMain.getModule('flower');
const popupModule = projectMain.getModule('imagePopup');
```

## 📁 **Module Structure**

```
js/modules/
├── flower-manager.js      # Flower animations & scaling
├── image-popup-manager.js # Image popup functionality  
├── scroll-manager.js      # Scroll positioning
├── text-slant-manager.js  # Text slant effects
└── font-sizing-manager.js # Dynamic font sizing
```

## 🔧 **Common Patterns**

### **Module Initialization**
```javascript
class MyModule {
    constructor() {
        this.isInitialized = false;
        this.init();
    }
    
    init() {
        this.findElements();
        this.setupEventListeners();
        this.isInitialized = true;
    }
    
    destroy() {
        // Cleanup code
        this.isInitialized = false;
    }
}
```

### **Event Management**
```javascript
// Always use EventManager
window.eventManager.addListener(element, 'click', handler);

// Clean up in destroy()
destroy() {
    if (this.element && window.eventManager) {
        // EventManager handles cleanup automatically
    }
}
```

### **Animation Coordination**
```javascript
// Register JS animations
window.animationCoordinator.registerJSAnimation(
    element, 
    'transform', 
    'my-animation', 
    window.animationCoordinator.priorities.HIGH
);
```

## 📋 **Module APIs**

### **FlowerManager**
```javascript
const flower = new FlowerManager();

// Update flower size (0-1 progress)
flower.updateFlowerSize(0.5);

// Check if ready
if (flower.isReady()) { /* ... */ }

// Get flower element
const flowerEl = flower.getFlowerElement();
```

### **ImagePopupManager**
```javascript
const popup = new ImagePopupManager();

// Open popup for image index
popup.openPopup(2);

// Navigate
popup.navigateLeft();
popup.navigateRight();

// Check state
if (popup.isPopupOpen()) { /* ... */ }
```

### **ProjectScrollManager**
```javascript
const scroll = new ProjectScrollManager();

// Start/stop animation loop
scroll.startAnimationLoop();
scroll.stopAnimationLoop();

// Get scroll progress (0-1)
const progress = scroll.getScrollProgress();

// Get current position
const position = scroll.getCurrentPosition();
```

### **TextSlantManager**
```javascript
const slant = new TextSlantManager();

// Activate/deactivate effects
slant.activate();
slant.deactivate();

// Get letter elements
const letters = slant.getLetters();
const count = slant.getLetterCount();
```

### **FontSizingManager**
```javascript
const font = new FontSizingManager();

// Adjust font size
const header = document.querySelector('.page-header');
font.adjustFontSize(header);

// Refresh elements
font.refreshElements();
```

## 🔗 **Integration Examples**

### **Scroll + Flower Coordination**
```javascript
// In ProjectMain
setupModuleCoordination() {
    if (this.modules.flower && this.modules.scroll) {
        // Scroll manager calls flower manager
        const scrollProgress = this.modules.scroll.getScrollProgress();
        this.modules.flower.updateFlowerSize(scrollProgress);
    }
}
```

### **Event + Animation Integration**
```javascript
// Click event triggers animation
window.eventManager.addListener(button, 'click', () => {
    window.animationCoordinator.registerJSAnimation(
        element, 
        'scale', 
        'button-click', 
        'HIGH'
    );
    element.style.transform = 'scale(1.1)';
});
```

## ⚡ **Performance Tips**

### **Animation Loops**
```javascript
// Use requestAnimationFrame for smooth animations
updateAnimation() {
    // Update logic here
    
    this.animationFrameId = requestAnimationFrame(() => {
        this.updateAnimation();
    });
}

// Clean up properly
destroy() {
    if (this.animationFrameId) {
        cancelAnimationFrame(this.animationFrameId);
    }
}
```

### **Event Cleanup**
```javascript
// EventManager handles cleanup automatically
// Just implement destroy() method
destroy() {
    this.elements = [];
    this.isInitialized = false;
}
```

## 🐛 **Debugging**

### **Check Module Status**
```javascript
// Check if module is ready
console.log('Flower ready:', flowerManager.isReady());

// Check loading status
console.log('Loading status:', window.moduleLoader.getLoadingStatus());

// Check if main is ready
console.log('Project ready:', projectMain.isReady());
```

### **Common Issues**
```javascript
// Module not found
if (!window.FlowerManager) {
    console.error('FlowerManager not loaded');
}

// Elements not found
if (!this.element) {
    console.error('Element not found:', selector);
}

// Event manager not available
if (!window.eventManager) {
    console.error('EventManager not available');
}
```

## 📚 **File Organization**

### **New Module Creation**
1. Create `js/modules/my-module.js`
2. Follow class pattern with `init()` and `destroy()`
3. Add to `ModuleLoader` class map
4. Update `ProjectMain` initialization
5. Add to documentation

### **Module Dependencies**
```javascript
// In ProjectMain
async initializeModules() {
    // Load in dependency order
    await this.initializeFontSizingManager();    // First
    await this.initializeTextSlantManager();     // Second
    await this.initializeImagePopupManager();    // Third
    // ... etc
}
```

## 🎯 **Best Practices Checklist**

- [ ] **Single Responsibility**: Module does one thing well
- [ ] **Error Handling**: Try-catch in critical sections
- [ ] **Event Management**: Use EventManager for all listeners
- [ ] **Animation Coordination**: Register with AnimationCoordinator
- [ ] **Cleanup**: Implement destroy() method
- [ ] **Documentation**: Clear public API and usage examples
- [ ] **Testing**: Test module independently
- [ ] **Performance**: Use requestAnimationFrame for animations

## 🔄 **Migration Checklist**

- [ ] **Replace old script**: Update HTML to use new modules
- [ ] **Test functionality**: Verify all features work
- [ ] **Update dependencies**: Ensure EventManager, AnimationCoordinator available
- [ ] **Clean up old code**: Remove unused functions
- [ ] **Update documentation**: Reflect new architecture
- [ ] **Performance test**: Verify no performance regressions

---

**Need Help?** Check the full documentation in `JAVASCRIPT_MODULES.md` or the main project documentation.
