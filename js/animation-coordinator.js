// Animation Coordination System
// Manages all CSS and JavaScript animations to prevent conflicts and ensure smooth performance

class AnimationCoordinator {
    constructor() {
        this.activeAnimations = new Map(); // Track active animations by element
        this.animationQueue = new Map(); // Queue animations for smooth transitions
        this.conflictResolutions = new Map(); // Store conflict resolution strategies
        this.performanceMetrics = new Map(); // Track animation performance
        
        // Animation priorities (higher = more important)
        this.priorities = {
            CRITICAL: 100,    // User interactions, scroll effects
            HIGH: 80,         // Hover effects, transitions
            MEDIUM: 60,       // Page load animations
            LOW: 40,          // Background effects, decorative
            BACKGROUND: 20    // Non-essential animations
        };
        
        // Animation types for conflict detection
        this.animationTypes = {
            TRANSFORM: 'transform',
            OPACITY: 'opacity',
            COLOR: 'color',
            SCALE: 'scale',
            ROTATE: 'rotate',
            TRANSLATE: 'translate',
            BACKGROUND: 'background'
        };
        
        this.init();

    }
    
    init() {
        // Set up conflict resolution strategies
        this.setupConflictResolutions();
        
        // Monitor for animation conflicts
        this.startConflictMonitoring();
        
        // Performance monitoring
        this.startPerformanceMonitoring();
    }
    
    // Set up conflict resolution strategies for different animation types
    setupConflictResolutions() {
        // Transform conflicts: JS takes priority, pause CSS
        this.conflictResolutions.set('transform', {
            resolve: (element, jsAnimation, cssAnimation) => {
                this.pauseCSSAnimation(element, cssAnimation);
                return jsAnimation;
            },
            priority: this.priorities.CRITICAL
        });
        
        // Opacity conflicts: Blend both animations
        this.conflictResolutions.set('opacity', {
            resolve: (element, jsAnimation, cssAnimation) => {
                return this.blendOpacityAnimations(element, jsAnimation, cssAnimation);
            },
            priority: this.priorities.HIGH
        });
        
        // Color conflicts: CSS takes priority for smooth transitions
        this.conflictResolutions.set('color', {
            resolve: (element, jsAnimation, cssAnimation) => {
                this.pauseJSAnimation(element, jsAnimation);
                return cssAnimation;
            },
            priority: this.priorities.MEDIUM
        });
        
        // Scale conflicts: JS takes priority, pause CSS
        this.conflictResolutions.set('scale', {
            resolve: (element, jsAnimation, cssAnimation) => {
                this.pauseCSSAnimation(element, cssAnimation);
                return jsAnimation;
            },
            priority: this.priorities.CRITICAL
        });
        
        // Rotate conflicts: JS takes priority, pause CSS
        this.conflictResolutions.set('rotate', {
            resolve: (element, jsAnimation, cssAnimation) => {
                this.pauseCSSAnimation(element, cssAnimation);
                return jsAnimation;
            },
            priority: this.priorities.HIGH
        });
    }
    
    // Register a JavaScript animation
    registerJSAnimation(element, type, animationId, priority = this.priorities.MEDIUM) {
        const animation = {
            id: animationId,
            type: type,
            priority: priority,
            startTime: Date.now(),
            isActive: true,
            source: 'js'
        };
        
        // Check for conflicts with CSS animations
        const conflicts = this.detectConflicts(element, type);
        if (conflicts.length > 0) {
            this.resolveConflicts(element, animation, conflicts);
        }
        
        // Register the animation
        if (!this.activeAnimations.has(element)) {
            this.activeAnimations.set(element, new Map());
        }
        this.activeAnimations.get(element).set(animationId, animation);
        

        return animationId;
    }
    
    // Register a CSS animation
    registerCSSAnimation(element, type, animationName, priority = this.priorities.MEDIUM) {
        const animation = {
            id: animationName,
            type: type,
            priority: priority,
            startTime: Date.now(),
            isActive: true,
            source: 'css'
        };
        
        // Check for conflicts with JS animations
        const conflicts = this.detectConflicts(element, type);
        if (conflicts.length > 0) {
            this.resolveConflicts(element, animation, conflicts);
        }
        
        // Register the animation
        if (!this.activeAnimations.has(element)) {
            this.activeAnimations.set(element, new Map());
        }
        this.activeAnimations.get(element).set(animationName, animation);
        

        return animationName;
    }
    
    // Detect conflicts between animations
    detectConflicts(element, type) {
        if (!this.activeAnimations.has(element)) return [];
        
        const conflicts = [];
        const elementAnimations = this.activeAnimations.get(element);
        
        for (const [id, animation] of elementAnimations) {
            if (animation.isActive && animation.type === type && animation.source !== 'js') {
                conflicts.push(animation);
            }
        }
        
        return conflicts;
    }
    
    // Resolve animation conflicts based on priority and type
    resolveConflicts(element, newAnimation, conflicts) {
        for (const conflict of conflicts) {
            const resolution = this.conflictResolutions.get(conflict.type);
            if (resolution) {
                const winner = resolution.resolve(element, newAnimation, conflict);
                if (winner === newAnimation) {
                    this.pauseAnimation(element, conflict.id);
                } else {
                    this.pauseAnimation(element, newAnimation.id);
                }
            }
        }
    }
    
    // Pause a specific animation
    pauseAnimation(element, animationId) {
        if (!this.activeAnimations.has(element)) return;
        
        const elementAnimations = this.activeAnimations.get(element);
        const animation = elementAnimations.get(animationId);
        
        if (animation) {
            animation.isActive = false;
            
            if (animation.source === 'css') {
                this.pauseCSSAnimation(element, animation);
            } else {
                this.pauseJSAnimation(element, animation);
            }
            
    
        }
    }
    
    // Pause CSS animation by adding paused class
    pauseCSSAnimation(element, animation) {
        element.classList.add('animation-paused');
        element.style.animationPlayState = 'paused';
    }
    
    // Pause JavaScript animation
    pauseJSAnimation(element, animation) {
        // Store current state for resuming
        animation.pausedState = {
            transform: element.style.transform,
            opacity: element.style.opacity,
            // Add other properties as needed
        };
        
        // Clear the animation
        element.style.transform = '';
        element.style.opacity = '';
    }
    
    // Resume a paused animation
    resumeAnimation(element, animationId) {
        if (!this.activeAnimations.has(element)) return;
        
        const elementAnimations = this.activeAnimations.get(element);
        const animation = elementAnimations.get(animationId);
        
        if (animation && !animation.isActive) {
            animation.isActive = true;
            
            if (animation.source === 'css') {
                this.resumeCSSAnimation(element, animation);
            } else {
                this.resumeJSAnimation(element, animation);
            }
            
    
        }
    }
    
    // Resume CSS animation
    resumeCSSAnimation(element, animation) {
        element.classList.remove('animation-paused');
        element.style.animationPlayState = 'running';
    }
    
    // Resume JavaScript animation
    resumeJSAnimation(element, animation) {
        if (animation.pausedState) {
            element.style.transform = animation.pausedState.transform;
            element.style.opacity = animation.pausedState.opacity;
            delete animation.pausedState;
        }
    }
    
    // Blend opacity animations for smooth transitions
    blendOpacityAnimations(element, jsAnimation, cssAnimation) {
        const jsOpacity = parseFloat(element.style.opacity) || 1;
        const cssOpacity = parseFloat(getComputedStyle(element).opacity) || 1;
        
        // Use the higher opacity value
        const finalOpacity = Math.max(jsOpacity, cssOpacity);
        element.style.opacity = finalOpacity;
        
        return jsAnimation; // JS takes priority for opacity
    }
    
    // Queue an animation for smooth execution
    queueAnimation(element, animation, delay = 0) {
        if (!this.animationQueue.has(element)) {
            this.animationQueue.set(element, []);
        }
        
        const queueItem = {
            animation: animation,
            delay: delay,
            timestamp: Date.now()
        };
        
        this.animationQueue.get(element).push(queueItem);
        
        // Process queue after delay
        setTimeout(() => {
            this.processAnimationQueue(element);
        }, delay);
    }
    
    // Process queued animations
    processAnimationQueue(element) {
        if (!this.animationQueue.has(element)) return;
        
        const queue = this.animationQueue.get(element);
        const now = Date.now();
        
        // Remove expired queue items
        const validItems = queue.filter(item => (now - item.timestamp) >= item.delay);
        
        // Execute valid animations
        for (const item of validItems) {
            this.executeAnimation(element, item.animation);
        }
        
        // Update queue
        this.animationQueue.set(element, queue.filter(item => (now - item.timestamp) < item.delay));
    }
    
    // Execute an animation
    executeAnimation(element, animation) {
        if (animation.source === 'js') {
            this.registerJSAnimation(element, animation.type, animation.id, animation.priority);
        } else {
            this.registerCSSAnimation(element, animation.type, animation.id, animation.priority);
        }
    }
    
    // Unregister an animation
    unregisterAnimation(element, animationId) {
        if (!this.activeAnimations.has(element)) return;
        
        const elementAnimations = this.activeAnimations.get(element);
        elementAnimations.delete(animationId);
        
        // Clean up element if no more animations
        if (elementAnimations.size === 0) {
            this.activeAnimations.delete(element);
        }
        

    }
    
    // Get all active animations for an element
    getElementAnimations(element) {
        if (!this.activeAnimations.has(element)) return [];
        
        const elementAnimations = this.activeAnimations.get(element);
        return Array.from(elementAnimations.values()).filter(anim => anim.isActive);
    }
    
    // Get animation statistics
    getStats() {
        let totalAnimations = 0;
        let jsAnimations = 0;
        let cssAnimations = 0;
        
        for (const elementAnimations of this.activeAnimations.values()) {
            for (const animation of elementAnimations.values()) {
                if (animation.isActive) {
                    totalAnimations++;
                    if (animation.source === 'js') {
                        jsAnimations++;
                    } else {
                        cssAnimations++;
                    }
                }
            }
        }
        
        return {
            totalActive: totalAnimations,
            jsAnimations: jsAnimations,
            cssAnimations: cssAnimations,
            queuedAnimations: Array.from(this.animationQueue.values()).flat().length,
            performanceMetrics: Object.fromEntries(this.performanceMetrics)
        };
    }
    

    
    // Start conflict monitoring
    startConflictMonitoring() {
        // Monitor for new CSS animations being added
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                    this.checkForNewConflicts(mutation.target);
                }
            });
        });
        
        observer.observe(document.body, {
            attributes: true,
            attributeFilter: ['style'],
            subtree: true
        });
    }
    
    // Check for new conflicts when styles change
    checkForNewConflicts(element) {
        const computedStyle = getComputedStyle(element);
        
        // Check for transform conflicts
        if (computedStyle.transform !== 'none') {
            const conflicts = this.detectConflicts(element, 'transform');
            if (conflicts.length > 0) {
                console.warn('AnimationCoordinator: New transform conflict detected on', element);
            }
        }
    }
    
    // Start performance monitoring
    startPerformanceMonitoring() {
        // Monitor animation frame rates
        let frameCount = 0;
        let lastTime = performance.now();
        
        const measurePerformance = () => {
            frameCount++;
            const currentTime = performance.now();
            
            if (currentTime - lastTime >= 1000) {
                const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
                this.performanceMetrics.set('fps', fps);
                
                frameCount = 0;
                lastTime = currentTime;
            }
            
            requestAnimationFrame(measurePerformance);
        };
        
        requestAnimationFrame(measurePerformance);
    }
    
    // Cleanup all animations
    cleanup() {

        
        // Clear all active animations
        this.activeAnimations.clear();
        this.animationQueue.clear();
        this.performanceMetrics.clear();
        

    }
    
    // Destroy the coordinator
    destroy() {
        this.cleanup();

    }
}

// Create global instance
window.animationCoordinator = new AnimationCoordinator();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AnimationCoordinator;
}
