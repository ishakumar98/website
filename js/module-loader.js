// Module Loader
// Handles loading and initializing all JavaScript modules in the correct order
// Provides a clean entry point for the modular JavaScript system

class ModuleLoader {
    constructor() {
        this.loadedModules = new Map();
        this.loadingPromises = new Map();
        this.isInitialized = false;
        
        this.init();
    }
    
    init() {
        this.isInitialized = true;

    }
    
    // Load a module by name
    async loadModule(moduleName) {
        if (this.loadedModules.has(moduleName)) {
            return this.loadedModules.get(moduleName);
        }
        
        if (this.loadingPromises.has(moduleName)) {
            return this.loadingPromises.get(moduleName);
        }
        
        const loadPromise = this.loadModuleScript(moduleName);
        this.loadingPromises.set(moduleName, loadPromise);
        
        try {
            const module = await loadPromise;
            this.loadedModules.set(moduleName, module);
            this.loadingPromises.delete(moduleName);
            return module;
        } catch (error) {
            this.loadingPromises.delete(moduleName);
            throw error;
        }
    }
    
    // Load module script dynamically
    async loadModuleScript(moduleName) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = `js/modules/${moduleName}.js`;
            script.async = true;
            
            script.onload = () => {
                // Wait a bit for the module to register itself
                setTimeout(() => {
                    const moduleClass = this.getModuleClass(moduleName);
                    if (moduleClass) {
                        resolve(moduleClass);
                    } else {
                        reject(new Error(`Module ${moduleName} failed to load properly`));
                    }
                }, 100);
            };
            
            script.onerror = () => {
                reject(new Error(`Failed to load module script: ${moduleName}`));
            };
            
            document.head.appendChild(script);
        });
    }
    
    // Get module class by name
    getModuleClass(moduleName) {
        const classMap = {
            'flower-manager': 'FlowerManager',
            'image-popup-manager': 'ImagePopupManager',
            'scroll-manager': 'ProjectScrollManager',
            'text-slant-manager': 'TextSlantManager',
            'font-sizing-manager': 'FontSizingManager'
        };
        
        const className = classMap[moduleName];
        if (className && window[className]) {
            return window[className];
        }
        
        return null;
    }
    
    // Load all required modules
    async loadAllModules() {
        const requiredModules = [
            'flower-manager',
            'image-popup-manager',
            'scroll-manager',
            'text-slant-manager',
            'font-sizing-manager'
        ];
        
        try {
            const modules = await Promise.all(
                requiredModules.map(moduleName => this.loadModule(moduleName))
            );
            
    
            return modules;
            
        } catch (error) {
            console.error('ModuleLoader: Failed to load modules:', error);
            throw error;
        }
    }
    
    // Check if all modules are loaded
    areAllModulesLoaded() {
        const requiredModules = [
            'flower-manager',
            'image-popup-manager',
            'scroll-manager',
            'text-slant-manager',
            'font-sizing-manager'
        ];
        
        return requiredModules.every(moduleName => this.loadedModules.has(moduleName));
    }
    
    // Get loaded module
    getLoadedModule(moduleName) {
        return this.loadedModules.get(moduleName);
    }
    
    // Get all loaded modules
    getAllLoadedModules() {
        return Array.from(this.loadedModules.values());
    }
    
    // Unload a module
    unloadModule(moduleName) {
        if (this.loadedModules.has(moduleName)) {
            const module = this.loadedModules.get(moduleName);
            if (module && typeof module.destroy === 'function') {
                module.destroy();
            }
            this.loadedModules.delete(moduleName);
        }
    }
    
    // Unload all modules
    unloadAllModules() {
        for (const [moduleName, module] of this.loadedModules) {
            this.unloadModule(moduleName);
        }
    }
    
    // Get loading status
    getLoadingStatus() {
        return {
            loaded: Array.from(this.loadedModules.keys()),
            loading: Array.from(this.loadingPromises.keys()),
            totalLoaded: this.loadedModules.size,
            totalLoading: this.loadingPromises.size
        };
    }
    
    isReady() {
        return this.isInitialized && this.areAllModulesLoaded();
    }
    
    destroy() {
        this.unloadAllModules();
        this.loadedModules.clear();
        this.loadingPromises.clear();
        this.isInitialized = false;

    }
}

// Create global instance
window.moduleLoader = new ModuleLoader();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ModuleLoader;
}
