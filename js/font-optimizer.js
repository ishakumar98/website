// Font Optimization Module
// Handles font loading, display optimization, and performance
// Extracted for better organization and performance

class FontOptimizer {
    constructor() {
        this.fonts = new Map();
        this.loadedFonts = new Set();
        this.fontDisplay = 'swap'; // Optimize for performance
        this.init();
    }

    init() {
        this.setupFontPreloading();
        this.optimizeFontLoading();
        this.setupFontFallbacks();
    }

    setupFontPreloading() {
        // Preload critical fonts for better performance
        const criticalFonts = [
            { family: 'Tumla', src: 'fonts/Tumla-trial/variable/Tumla-TRIALVariableVF.ttf', weight: '400 900' },
            { family: 'Akke', src: 'fonts/akke-trial/variable/AkkeVariable[XHGT,opsz,wdth,wght].ttf', weight: '400 900' }
        ];

        criticalFonts.forEach(font => {
            this.preloadFont(font);
        });
    }

    preloadFont(font) {
        // Create preload link for critical fonts
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'font';
        link.type = 'font/woff2';
        link.href = font.src;
        link.crossOrigin = 'anonymous';
        
        // Add to head for early loading
        document.head.appendChild(link);
        
        // Track font loading
        this.fonts.set(font.family, {
            ...font,
            status: 'preloading',
            link: link
        });
    }

    optimizeFontLoading() {
        // Use Font Loading API for better control
        if ('fonts' in document) {
            this.loadFontsWithAPI();
        } else {
            this.loadFontsWithCSS();
        }
    }

    async loadFontsWithAPI() {
        try {
            // Load Tumla font
            const tumlaFont = new FontFace('Tumla', `url(fonts/Tumla-trial/variable/Tumla-TRIALVariableVF.ttf)`, {
                weight: '400 900',
                display: this.fontDisplay
            });
            
            // Load Akke font
            const akkeFont = new FontFace('Akke', `url(fonts/akke-trial/variable/AkkeVariable[XHGT,opsz,wdth,wght].ttf)`, {
                weight: '400 900',
                display: this.fontDisplay
            });

            // Load fonts and track performance
            const startTime = performance.now();
            
            const [tumlaLoaded, akkeLoaded] = await Promise.all([
                tumlaFont.load(),
                akkeFont.load()
            ]);

            // Add to document fonts
            document.fonts.add(tumlaLoaded);
            document.fonts.add(akkeLoaded);

            // Track performance
            const loadTime = performance.now() - startTime;
            this.trackFontLoad('Tumla', loadTime);
            this.trackFontLoad('Akke', loadTime);

            // Update font status
            this.fonts.get('Tumla').status = 'loaded';
            this.fonts.get('Akke').status = 'loaded';

        } catch (error) {
            console.warn('Font Loading API failed, falling back to CSS:', error);
            this.loadFontsWithCSS();
        }
    }

    loadFontsWithCSS() {
        // Fallback to CSS font loading with optimization
        const style = document.createElement('style');
        style.textContent = `
            @font-face {
                font-family: 'Tumla';
                src: url('./fonts/Tumla-trial/variable/Tumla-TRIALVariableVF.ttf') format('truetype-variations');
                font-weight: 100 900;
                font-display: ${this.fontDisplay};
                font-feature-settings: 'liga' 1, 'kern' 1;
            }
            
            @font-face {
                font-family: 'Akke';
                src: url('./fonts/akke-trial/variable/AkkeVariable[XHGT,opsz,wdth,wght].ttf') format('truetype-variations');
                font-weight: 100 900;
                font-display: ${this.fontDisplay};
                font-feature-settings: 'liga' 1, 'kern' 1;
            }
        `;
        
        document.head.appendChild(style);
        
        // Track CSS font loading
        this.trackFontLoad('Tumla (CSS)', 0);
        this.trackFontLoad('Akke (CSS)', 0);
    }

    setupFontFallbacks() {
        // Set up system font fallbacks for better performance
        const fontFallbacks = {
            'Tumla': '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            'Akke': 'Georgia, "Times New Roman", serif'
        };

        // Apply fallbacks to CSS variables
        const root = document.documentElement;
        Object.entries(fontFallbacks).forEach(([font, fallback]) => {
            root.style.setProperty(`--font-${font.toLowerCase()}-fallback`, fallback);
        });
    }

    trackFontLoad(fontName, loadTime) {
        this.loadedFonts.add(fontName);
        
        console.log(`🔤 Font Loaded: ${fontName} (${loadTime.toFixed(2)}ms)`);
        
        // Track Core Web Vitals
        if (loadTime > 0) {
            this.trackFontPerformance(fontName, loadTime);
        }
    }

    trackFontPerformance(fontName, loadTime) {
        // Send to analytics if available
        if (window.gtag) {
            window.gtag('event', 'font_load', {
                font_name: fontName,
                load_time: Math.round(loadTime),
                event_category: 'Performance'
            });
        }
    }

    // Public API for font status
    isFontLoaded(fontFamily) {
        return this.loadedFonts.has(fontFamily);
    }

    getFontStatus(fontFamily) {
        const font = this.fonts.get(fontFamily);
        return font ? font.status : 'unknown';
    }

    // Performance monitoring
    getFontMetrics() {
        return {
            totalFonts: this.fonts.size,
            loadedFonts: this.loadedFonts.size,
            fontStatus: Object.fromEntries(
                Array.from(this.fonts.entries()).map(([family, font]) => [family, font.status])
            )
        };
    }

    // Cleanup method
    destroy() {
        // Remove preload links
        this.fonts.forEach(font => {
            if (font.link && font.link.parentNode) {
                font.link.parentNode.removeChild(font.link);
            }
        });
        
        this.fonts.clear();
        this.loadedFonts.clear();
    }
}

// Export for use in other modules
if (typeof window !== 'undefined') {
    window.FontOptimizer = FontOptimizer;
}
