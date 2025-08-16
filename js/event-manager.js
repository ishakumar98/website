// Centralized Event Manager
// Coordinates all event listeners, prevents duplication, and provides cleanup

class EventManager {
    constructor() {
        this.listeners = new Map(); // Track all event listeners
        this.elementListeners = new WeakMap(); // Track listeners per element
        this.globalListeners = new Map(); // Track global listeners (window, document)
        
        // Performance optimization
        this.debounceTimers = new Map();
        this.throttleTimers = new Map();
        

    }
    
    // Add event listener with deduplication
    addListener(element, eventType, callback, options = {}) {
        const listenerId = this.generateListenerId(element, eventType, callback);
        
        // Check if listener already exists
        if (this.listeners.has(listenerId)) {
            console.warn(`EventManager: Listener already exists for ${eventType} on element`, element);
            return listenerId;
        }
        
        // Create listener object
        const listener = {
            id: listenerId,
            element,
            eventType,
            callback,
            options,
            active: true,
            timestamp: Date.now()
        };
        
        // Store listener
        this.listeners.set(listenerId, listener);
        
        // Track by element
        if (element === window || element === document) {
            if (!this.globalListeners.has(element)) {
                this.globalListeners.set(element, new Map());
            }
            if (!this.globalListeners.get(element).has(eventType)) {
                this.globalListeners.get(element).set(eventType, new Set());
            }
            this.globalListeners.get(element).get(eventType).add(listenerId);
        } else {
            if (!this.elementListeners.has(element)) {
                this.elementListeners.set(element, new Map());
            }
            if (!this.elementListeners.get(element).has(eventType)) {
                this.elementListeners.get(element).set(eventType, new Set());
            }
            this.elementListeners.get(element).get(eventType).add(listenerId);
        }
        
        // Add actual event listener
        element.addEventListener(eventType, callback, options);
        

        return listenerId;
    }
    
    // Remove specific event listener
    removeListener(listenerId) {
        const listener = this.listeners.get(listenerId);
        if (!listener) {
            console.warn(`EventManager: Listener "${listenerId}" not found`);
            return false;
        }
        
        // Remove from element tracking
        if (listener.element === window || listener.element === document) {
            const elementMap = this.globalListeners.get(listener.element);
            if (elementMap && elementMap.has(listener.eventType)) {
                elementMap.get(listener.eventType).delete(listenerId);
            }
        } else {
            const elementMap = this.elementListeners.get(listener.element);
            if (elementMap && elementMap.has(listener.eventType)) {
                elementMap.get(listener.eventType).delete(listenerId);
            }
        }
        
        // Remove actual event listener
        listener.element.removeEventListener(listener.eventType, listener.callback, listener.options);
        
        // Remove from main tracking
        this.listeners.delete(listenerId);
        

        return true;
    }
    
    // Remove all listeners for a specific element
    removeElementListeners(element) {
        const elementMap = this.elementListeners.get(element);
        if (!elementMap) return 0;
        
        let removedCount = 0;
        
        for (const [eventType, listenerIds] of elementMap) {
            for (const listenerId of listenerIds) {
                if (this.removeListener(listenerId)) {
                    removedCount++;
                }
            }
        }
        
        // Clean up element tracking
        this.elementListeners.delete(element);
        

        return removedCount;
    }
    
    // Remove all listeners for a specific event type
    removeEventTypeListeners(eventType) {
        let removedCount = 0;
        
        for (const [listenerId, listener] of this.listeners) {
            if (listener.eventType === eventType) {
                if (this.removeListener(listenerId)) {
                    removedCount++;
                }
            }
        }
        

        return removedCount;
    }
    
    // Get all listeners for an element
    getElementListeners(element) {
        const elementMap = this.elementListeners.get(element);
        if (!elementMap) return [];
        
        const listeners = [];
        for (const [eventType, listenerIds] of elementMap) {
            for (const listenerId of listenerIds) {
                const listener = this.listeners.get(listenerId);
                if (listener) {
                    listeners.push(listener);
                }
            }
        }
        
        return listeners;
    }
    
    // Get all listeners for an event type
    getEventTypeListeners(eventType) {
        const listeners = [];
        for (const [listenerId, listener] of this.listeners) {
            if (listener.eventType === eventType) {
                listeners.push(listener);
            }
        }
        return listeners;
    }
    
    // Add debounced event listener
    addDebouncedListener(element, eventType, callback, delay = 300) {
        const debouncedCallback = this.debounce(callback, delay);
        return this.addListener(element, eventType, debouncedCallback);
    }
    
    // Add throttled event listener
    addThrottledListener(element, eventType, callback, limit = 100) {
        const throttledCallback = this.throttle(callback, limit);
        return this.addListener(element, eventType, throttledCallback);
    }
    
    // Debounce utility
    debounce(func, delay) {
        return (...args) => {
            const key = `${func.name || 'anonymous'}_${delay}`;
            clearTimeout(this.debounceTimers.get(key));
            const timer = setTimeout(() => func.apply(this, args), delay);
            this.debounceTimers.set(key, timer);
        };
    }
    
    // Throttle utility
    throttle(func, limit) {
        return (...args) => {
            const key = `${func.name || 'anonymous'}_${limit}`;
            if (!this.throttleTimers.has(key)) {
                func.apply(this, args);
                this.throttleTimers.set(key, Date.now());
                setTimeout(() => this.throttleTimers.delete(key), limit);
            }
        };
    }
    
    // Generate unique listener ID
    generateListenerId(element, eventType, callback) {
        const elementId = element.id || element.className || element.tagName || 'unknown';
        const callbackName = callback.name || 'anonymous';
        return `${elementId}_${eventType}_${callbackName}_${Date.now()}`;
    }
    
    // Get statistics
    getStats() {
        return {
            totalListeners: this.listeners.size,
            elementListeners: this.elementListeners.size,
            globalListeners: this.globalListeners.size,
            debounceTimers: this.debounceTimers.size,
            throttleTimers: this.throttleTimers.size
        };
    }
    
    // Cleanup all listeners
    cleanup() {

        
        // Remove all listeners
        for (const [listenerId, listener] of this.listeners) {
            listener.element.removeEventListener(listener.eventType, listener.callback, listener.options);
        }
        
        // Clear all tracking
        this.listeners.clear();
        this.elementListeners = new WeakMap();
        this.globalListeners.clear();
        this.debounceTimers.clear();
        this.throttleTimers.clear();
        

    }
    
    // Destroy the manager
    destroy() {
        this.cleanup();

    }
}

// Create global instance
window.eventManager = new EventManager();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EventManager;
}
