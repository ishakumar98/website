// Centralized Event Manager
// Coordinates all event listeners, prevents duplication, and provides cleanup

class EventManager {
    constructor() {
        this.listeners = new Map(); // Track all event listeners by ID
        this.elementListeners = new WeakMap(); // Track listeners per element
        this.globalListeners = new Map(); // Track global listeners (window, document)
        this.callbackRegistry = new Map(); // Track callback references for deduplication (changed from WeakMap)
        
        // Performance optimization
        this.debounceTimers = new Map();
        this.throttleTimers = new Map();
    }
    
    // Add event listener with robust deduplication
    addListener(element, eventType, callback, options = {}) {
        // Check for existing listener with same element, event type, and callback
        const existingListener = this.findExistingListener(element, eventType, callback);
        
        if (existingListener) {
            // Return existing listener ID - no duplicate created
            return existingListener.id;
        }
        
        // Generate unique ID for new listener
        const listenerId = this.generateListenerId(element, eventType);
        
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
        
        // Register callback reference for future deduplication
        this.registerCallback(element, eventType, callback);
        
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
        
        // Unregister callback reference
        this.unregisterCallback(listener.element, listener.eventType, listener.callback);
        
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

    // Remove all listeners for a specific element and event type
    removeElementEventListeners(element, eventType) {
        const elementMap = this.elementListeners.get(element);
        if (!elementMap || !elementMap.has(eventType)) return 0;
        
        let removedCount = 0;
        const listenerIds = elementMap.get(eventType);
        
        for (const listenerId of listenerIds) {
            if (this.removeListener(listenerId)) {
                removedCount++;
            }
        }
        
        // Clean up event type tracking
        elementMap.delete(eventType);
        if (elementMap.size === 0) {
            this.elementListeners.delete(element);
        }
        
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
    
    // Generate unique listener ID (simplified - no callback dependency)
    generateListenerId(element, eventType) {
        const elementId = element.id || element.className || element.tagName || 'unknown';
        const timestamp = Date.now();
        return `${elementId}_${eventType}_${timestamp}`;
    }
    
    // Find existing listener with same element, event type, and callback
    findExistingListener(element, eventType, callback) {
        // Check if we have a callback registry for this element and event type
        const callbackKey = this.getCallbackKey(element, eventType);
        const registeredCallbacks = this.callbackRegistry.get(callbackKey);
        
        if (!registeredCallbacks) {
            return null;
        }
        
        // Check if this exact callback is already registered
        for (const [registeredCallback, listenerId] of registeredCallbacks) {
            if (registeredCallback === callback) {
                return this.listeners.get(listenerId);
            }
        }
        
        return null;
    }
    
    // Register callback reference for deduplication
    registerCallback(element, eventType, callback) {
        const callbackKey = this.getCallbackKey(element, eventType);
        
        if (!this.callbackRegistry.has(callbackKey)) {
            this.callbackRegistry.set(callbackKey, new Map());
        }
        
        const callbackMap = this.callbackRegistry.get(callbackKey);
        callbackMap.set(callback, Date.now()); // Store timestamp for cleanup
    }
    
    // Unregister callback reference
    unregisterCallback(element, eventType, callback) {
        const callbackKey = this.getCallbackKey(element, eventType);
        const callbackMap = this.callbackRegistry.get(callbackKey);
        
        if (callbackMap) {
            callbackMap.delete(callback);
            
            // Clean up empty callback maps
            if (callbackMap.size === 0) {
                this.callbackRegistry.delete(callbackKey);
            }
        }
    }
    
    // Generate callback registry key
    getCallbackKey(element, eventType) {
        return `${element === window ? 'window' : element === document ? 'document' : element.id || element.className || element.tagName || 'unknown'}_${eventType}`;
    }
    
    // Get statistics
    getStats() {
        return {
            totalListeners: this.listeners.size,
            elementListeners: this.elementListeners.size,
            globalListeners: this.globalListeners.size,
            callbackRegistrySize: this.getCallbackRegistrySize(),
            debounceTimers: this.debounceTimers.size,
            throttleTimers: this.throttleTimers.size
        };
    }
    
    // Get callback registry size for debugging
    getCallbackRegistrySize() {
        let size = 0;
        for (const callbackMap of this.callbackRegistry.values()) {
            size += callbackMap.size;
        }
        return size;
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
        this.callbackRegistry = new Map();
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
