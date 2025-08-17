// CSS Optimization Module
// Handles critical CSS, unused rule removal, and CSS performance
// Extracted for better organization and performance

class CSSOptimizer {
    constructor() {
        this.criticalCSS = new Set();
        this.unusedRules = new Set();
        this.performanceMetrics = {
            totalRules: 0,
            criticalRules: 0,
            unusedRules: 0,
            optimizationTime: 0
        };
        this.init();
    }

    init() {
        this.analyzeCSS();
        this.extractCriticalCSS();
        this.identifyUnusedRules();
        this.optimizeCSSDelivery();
    }

    analyzeCSS() {
        const startTime = performance.now();
        
        // Analyze all stylesheets
        const stylesheets = Array.from(document.styleSheets);
        
        stylesheets.forEach(sheet => {
            try {
                const rules = Array.from(sheet.cssRules || []);
                this.performanceMetrics.totalRules += rules.length;
                
                rules.forEach(rule => {
                    this.analyzeRule(rule);
                });
            } catch (e) {
                // Cross-origin stylesheets can't be accessed
            }
        });
        
        this.performanceMetrics.optimizationTime = performance.now() - startTime;
    }

    analyzeRule(rule) {
        // Analyze CSS rule for optimization opportunities
        if (rule instanceof CSSStyleRule) {
            this.analyzeSelector(rule.selectorText);
            this.analyzeProperties(rule.style);
        }
    }

    analyzeSelector(selector) {
        // Check if selector is critical (above the fold)
        if (this.isCriticalSelector(selector)) {
            this.criticalCSS.add(selector);
        }
    }

    isCriticalSelector(selector) {
        // Define critical selectors that are above the fold
        const criticalSelectors = [
            'body', 'html', '.header-section', '.main-content',
            '.work-section', '.work-container', '.name', '.bio',
            '.project-page-container', '.project-content-area',
            '.flower', '.project-text-block'
        ];
        
        return criticalSelectors.some(critical => selector.includes(critical));
    }

    analyzeProperties(style) {
        // Analyze CSS properties for optimization
        const properties = Array.from(style);
        
        properties.forEach(prop => {
            const value = style.getPropertyValue(prop);
            
            // Check for expensive properties
            if (this.isExpensiveProperty(prop, value)) {
                this.optimizeProperty(style, prop, value);
            }
        });
    }

    isExpensiveProperty(property, value) {
        // Identify properties that can impact performance
        const expensiveProperties = [
            'filter', 'backdrop-filter', 'transform', 'box-shadow',
            'border-radius', 'opacity', 'transition', 'animation'
        ];
        
        return expensiveProperties.includes(property);
    }

    optimizeProperty(style, property, value) {
        // Optimize expensive properties for better performance
        switch (property) {
            case 'filter':
                this.optimizeFilter(style, value);
                break;
            case 'backdrop-filter':
                this.optimizeBackdropFilter(style, value);
                break;
            case 'transform':
                this.optimizeTransform(style, value);
                break;
            case 'box-shadow':
                this.optimizeBoxShadow(style, value);
                break;
        }
    }

    optimizeFilter(style, value) {
        // Optimize filter properties for better performance
        if (value.includes('blur') || value.includes('drop-shadow')) {
            // Add will-change for better performance
            style.setProperty('will-change', 'filter', 'important');
        }
    }

    optimizeBackdropFilter(style, value) {
        // Optimize backdrop-filter for better performance
        style.setProperty('will-change', 'backdrop-filter', 'important');
        
        // Add fallback for older browsers
        if (!CSS.supports('backdrop-filter', value)) {
            style.setProperty('background-color', 'rgba(255, 255, 255, 0.9)', 'important');
        }
    }

    optimizeTransform(style, value) {
        // Optimize transform properties for better performance
        if (value.includes('translate') || value.includes('scale')) {
            style.setProperty('will-change', 'transform', 'important');
        }
    }

    optimizeBoxShadow(style, value) {
        // Optimize box-shadow for better performance
        if (value.includes('0 0') && value.includes('blur')) {
            // Replace complex shadows with simpler alternatives
            const optimizedShadow = this.simplifyBoxShadow(value);
            style.setProperty('box-shadow', optimizedShadow, 'important');
        }
    }

    simplifyBoxShadow(value) {
        // Simplify complex box-shadows for better performance
        const parts = value.split(' ');
        
        if (parts.length >= 4) {
            const [offsetX, offsetY, blur, spread, color] = parts;
            
            // If blur is 0, use border instead
            if (blur === '0px' || blur === '0') {
                return `0 0 0 ${spread} ${color}`;
            }
        }
        
        return value;
    }

    extractCriticalCSS() {
        // Extract critical CSS for inline loading
        const criticalRules = Array.from(this.criticalCSS);
        this.performanceMetrics.criticalRules = criticalRules.length;
        
        // Create critical CSS style tag
        this.createCriticalCSS(criticalRules);
    }

    createCriticalCSS(rules) {
        const style = document.createElement('style');
        style.id = 'critical-css';
        style.textContent = this.generateCriticalCSS(rules);
        
        // Insert at the beginning of head for priority
        document.head.insertBefore(style, document.head.firstChild);
    }

    generateCriticalCSS(rules) {
        // Generate critical CSS from identified rules
        let criticalCSS = '';
        
        rules.forEach(selector => {
            const rule = this.findCSSRule(selector);
            if (rule) {
                criticalCSS += rule.cssText + '\n';
            }
        });
        
        return criticalCSS;
    }

    findCSSRule(selector) {
        // Find CSS rule by selector
        const stylesheets = Array.from(document.styleSheets);
        
        for (const sheet of stylesheets) {
            try {
                const rules = Array.from(sheet.cssRules || []);
                
                for (const rule of rules) {
                    if (rule instanceof CSSStyleRule && rule.selectorText === selector) {
                        return rule;
                    }
                }
            } catch (e) {
                // Skip cross-origin stylesheets
                continue;
            }
        }
        
        return null;
    }

    identifyUnusedRules() {
        // Identify potentially unused CSS rules
        const allSelectors = this.getAllSelectors();
        const usedSelectors = this.getUsedSelectors();
        
        this.unusedRules = new Set(
            allSelectors.filter(selector => !usedSelectors.has(selector))
        );
        
        this.performanceMetrics.unusedRules = this.unusedRules.size;
    }

    getAllSelectors() {
        // Get all CSS selectors from stylesheets
        const selectors = new Set();
        const stylesheets = Array.from(document.styleSheets);
        
        stylesheets.forEach(sheet => {
            try {
                const rules = Array.from(sheet.cssRules || []);
                
                rules.forEach(rule => {
                    if (rule instanceof CSSStyleRule) {
                        selectors.add(rule.selectorText);
                    }
                });
            } catch (e) {
                // Skip cross-origin stylesheets
            }
        });
        
        return selectors;
    }

    getUsedSelectors() {
        // Get selectors that are actually used in the DOM
        const usedSelectors = new Set();
        const elements = document.querySelectorAll('*');
        
        elements.forEach(element => {
            const computedStyle = window.getComputedStyle(element);
            
            // Check if element has any computed styles
            if (computedStyle) {
                usedSelectors.add(element.tagName.toLowerCase());
                
                // Add class selectors
                element.classList.forEach(className => {
                    usedSelectors.add(`.${className}`);
                });
                
                // Add ID selectors
                if (element.id) {
                    usedSelectors.add(`#${element.id}`);
                }
            }
        });
        
        return usedSelectors;
    }

    optimizeCSSDelivery() {
        // Optimize CSS delivery for better performance
        
        // Preload non-critical CSS
        this.preloadNonCriticalCSS();
        
        // Defer non-critical CSS loading
        this.deferNonCriticalCSS();
    }

    preloadNonCriticalCSS() {
        // Preload non-critical CSS files
        const nonCriticalCSS = [
            'js/css/main.css',
            'project-page.css'
        ];
        
        nonCriticalCSS.forEach(href => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'style';
            link.href = href;
            link.onload = () => {
                link.rel = 'stylesheet';
            };
            document.head.appendChild(link);
        });
    }

    deferNonCriticalCSS() {
        // Defer loading of non-critical CSS
        const nonCriticalLinks = document.querySelectorAll('link[rel="stylesheet"]:not([href*="critical"])');
        
        nonCriticalLinks.forEach(link => {
            link.media = 'print';
            link.onload = () => {
                link.media = 'all';
            };
        });
    }

    // Performance monitoring
    getOptimizationMetrics() {
        return {
            ...this.performanceMetrics,
            optimizationPercentage: this.calculateOptimizationPercentage(),
            criticalCSSSize: this.calculateCriticalCSSSize()
        };
    }

    calculateOptimizationPercentage() {
        if (this.performanceMetrics.totalRules === 0) return 0;
        
        const optimizedRules = this.performanceMetrics.criticalRules;
        return Math.round((optimizedRules / this.performanceMetrics.totalRules) * 100);
    }

    calculateCriticalCSSSize() {
        const criticalStyle = document.getElementById('critical-css');
        return criticalStyle ? criticalStyle.textContent.length : 0;
    }

    // Public API for manual optimization
    optimizeStylesheet(stylesheet) {
        try {
            const rules = Array.from(stylesheet.cssRules || []);
            rules.forEach(rule => this.analyzeRule(rule));
        } catch (e) {
            // Handle stylesheet optimization error silently
        }
    }

    // Cleanup method
    destroy() {
        const criticalStyle = document.getElementById('critical-css');
        if (criticalStyle) {
            criticalStyle.remove();
        }
        
        this.criticalCSS.clear();
        this.unusedRules.clear();
    }
}

// Export for use in other modules
if (typeof window !== 'undefined') {
    window.CSSOptimizer = CSSOptimizer;
}
