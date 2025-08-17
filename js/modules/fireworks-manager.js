// HOME PAGE ONLY: Flower fireworks animation
// This script should only run on the home page

// Firework class - exact same as original
class Firework {
    constructor(x, y, letter, p, palette, gravity) {
        this.hu = p.random(255);
        this.firework = new Particle(x, y, this.hu, letter, true, p);
        this.exploded = false;
        this.particles = [];
        this.letter = letter;
        this.p = p;
        this.palette = palette;
        this.gravity = gravity;
    }
    
    done() {
        if (this.exploded && this.particles.length === 0) {
            return true;
        } else {
            return false;
        }
    }
    
    update(p) {
        if (!this.exploded) {
            this.firework.applyForce(this.gravity);
            this.firework.update();
            
            // Debug: log velocity to see if gravity is working
            console.log('🎆 Firework velocity:', this.firework.vel.y.toFixed(2));
            
            if (this.firework.vel.y >= 0) {
                console.log('💥 Firework exploded!');
                this.exploded = true;
                this.explode();
            }
        }
        
        for (let i = this.particles.length - 1; i >= 0; i--) {
            if (!this.particles[i].done()) {
                this.particles[i].applyForce(this.gravity);
                this.particles[i].update();
            }
        }
    }
    
    explode() {
        for (let i = 0; i < 16; i++) {
            const particle = new Particle(this.firework.pos.x, this.firework.pos.y, this.p.random(this.palette), this.letter, false, this.p);
            this.particles.push(particle);
        }
    }
    
    show(p) {
        if (!this.exploded) {
            this.firework.show(p);
        }
        
        for (let i = 0; i < this.particles.length; i++) {
            this.particles[i].show(p);
        }
    }
}

// Particle class - exact same as original
class Particle {
    constructor(x, y, color, letter, firework, p) {
        this.pos = p.createVector(x, y);
        this.firework = firework;
        this.lifespan = 50;
        this.color = color;
        this.letter = letter;
        this.acc = p.createVector(0, 0);
        this.rotation = 0;
        this.rotationDiff = p.random(-1, 1);
        this.p = p;
        
        if (this.firework) {
            this.vel = p.createVector(0, p.random(-12, -8));
        } else {
            this.vel = p.createVector(p.random(-1, 1), p.random(-1, 1));
            this.vel.normalize();
            this.vel.mult(p.random(4, 15));
        }
    }
    
    applyForce(force) {
        this.acc.add(force);
    }
    
    update() {
        if (!this.firework) {
            this.vel.mult(0.92);
            this.lifespan -= 2.5;
            this.rotation += this.rotationDiff;
        } else {
            this.rotation += 0.05; // Increased from 0.02 to 0.05 for slightly more rotation
        }
        this.vel.add(this.acc);
        this.pos.add(this.vel);
        this.acc.mult(0);
    }
    
    done() {
        if (this.lifespan < 0) {
            return true;
        } else {
            return false;
        }
    }
    
    show(p) {
        p.textSize(30);
        p.angleMode(p.DEGREES);
        
        if (!this.firework) {
            // Exploded particles - draw flower (exact same as original)
            p.push();
            p.translate(this.pos.x, this.pos.y);
            p.rotate(this.rotation);
            
            p.noStroke();
            
            // Draw 4 petals at corners - match CSS exactly
            p.fill(this.color);
            const petalSize = 17.5; // 35/2 = 17.5 (50% of 35)
            const petalOffset = 8.75; // 35/4 = 8.75 (25% of 35)
            
            // 4 petals at corners - match CSS positioning exactly
            p.ellipse(-petalOffset, -petalOffset, petalSize, petalSize); // top-left
            p.ellipse(petalOffset, -petalOffset, petalSize, petalSize);  // top-right  
            p.ellipse(-petalOffset, petalOffset, petalSize, petalSize);  // bottom-left
            p.ellipse(petalOffset, petalOffset, petalSize, petalSize);   // bottom-right
            
            // Center: 50% of size, positioned at center like CSS
            p.fill('#FBE2FF'); // Light blue center
            const centerSize = 17.5; // 35/2 = 17.5 (50% of 35)
            p.ellipse(0, 0, centerSize, centerSize);
            
            p.pop();
        } else {
            // Main firework - draw flower (exact same as original)
            p.angleMode(p.RADIANS);
            p.push();
            p.translate(this.pos.x, this.pos.y);
            p.rotate(this.rotation);
            
            p.noStroke();
            
            // Draw 4 petals at corners - match CSS exactly
            p.fill('#FF7DCB'); // Pink petals
            const petalSize = 17.5; // 35/2 = 17.5 (50% of 35)
            const petalOffset = 8.75; // 35/4 = 8.75 (25% of 35)
            
            // 4 petals at corners - match CSS positioning exactly
            p.ellipse(-petalOffset, -petalOffset, petalSize, petalSize); // top-left
            p.ellipse(petalOffset, -petalOffset, petalSize, petalSize);  // top-right  
            p.ellipse(-petalOffset, petalOffset, petalSize, petalSize);  // bottom-left
            p.ellipse(petalOffset, petalOffset, petalSize, petalSize);   // bottom-right
            
            // Center: 50% of size, positioned at center like CSS
            p.fill('#FBE2FF'); // Light blue center
            const centerSize = 17.5; // 35/2 = 17.5 (50% of 35)
            p.ellipse(0, 0, centerSize, centerSize);
            
            p.pop();
        }
    }
}

class FireworksManager {
    constructor() {
        this.fireworks = [];
        this.letters = ['C', 'O', 'T', 'T', 'O', 'N'];
        this.lettersCounter = 0;
        this.gravity = null;
        this.clicked = false;
        this.canvas = null;
        this.p5Instance = null;
        this.isInitialized = false;
        this.isActive = true;
        
        // Color palette - exact same as original
        this.palette = ['#537DBD','#CA683E','#D3B934','#AF9E7D','#D85959','#956750','#277325','#F3B524','#972723','#5B388B','#686B1C','#142D86','#A1A329','#BF1E16','#3853A5','#D7537E','#E99F22','#CE5310','#613B31'];
        
        // Animation configuration - exact same as original implementation
        this.config = {
            SPAWN_PROBABILITY: 0.01,           // New firework every frame (same as original)
            MAX_FIREWORKS: 50,                 // Maximum concurrent fireworks
            PARTICLE_LIFETIME: 50,             // Frames particles live (same as original)
            GRAVITY: 0.13,                    // Gravity effect (same as original)
            PARTICLE_SPEED_MIN: 4,            // Min particle velocity (same as original)
            PARTICLE_SPEED_MAX: 15,           // Max particle velocity (same as original)
            FIREWORK_VELOCITY_MIN: -12,       // Min firework velocity (same as original)
            FIREWORK_VELOCITY_MAX: -8,        // Max firework velocity (same as original)
            BACKGROUND_COLOR: '#FCE8FF',      // Lavender background
            MAIN_BACKGROUND: '#FFF5F8'        // Main page background
        };
        
        this.init();
    }
    
    isHomepage() {
        return window.location.pathname === '/' || 
               window.location.pathname === '/index.html' ||
               window.location.pathname.endsWith('/') ||
               window.location.pathname.includes('/index.html') ||
               window.location.pathname.includes('/website-project/index.html');
    }
    
    init() {
        // Check if we're on homepage
        if (!this.isHomepage()) {
            return;
        }
        
        this.setupCanvas();
        this.setupCoordination();
        this.isInitialized = true;
    }
    
    setupCanvas() {
        // Use the existing fireworks-container from HTML
        const container = document.getElementById('fireworks-container');
        if (!container) {
            console.error('FireworksManager: Fireworks container not found!');
            return;
        }
        
        // Initialize p5.js sketch
        this.p5Instance = new p5((p) => {
            p.setup = () => {
                this.canvas = p.createCanvas(container.offsetWidth, container.offsetHeight);
                this.canvas.parent('fireworks-container');
                p.colorMode(p.HSB);
                this.gravity = p.createVector(0, this.config.GRAVITY);
                p.stroke(255);
                p.strokeWeight(4);
                p.background(0);
                
                                             // Set the fireworks container background to lavender
                             container.style.backgroundColor = this.config.BACKGROUND_COLOR;
            };
            
            p.draw = () => {
                this.updateFireworks(p);
                this.drawFireworks(p);
            };
            
            p.mousePressed = () => {
                this.clicked = true;
                this.fireworks.push(new Firework(p.mouseX, p.mouseY, this.letters[this.lettersCounter], p, this.palette, this.gravity));
                this.updateCounter();
            };
            
            p.mouseMoved = () => {
                for (let i = 0; i < this.fireworks.length; i++) {
                    for (let p_idx = 0; p_idx < this.fireworks[i].particles.length; p_idx++) {
                        let ptcl = this.fireworks[i].particles[p_idx];
                        if (p.mouseX > ptcl.pos.x - 40 && 
                            p.mouseX < ptcl.pos.x + 60 &&
                            p.mouseY > ptcl.pos.y - 40 &&
                            p.mouseY < ptcl.pos.y + 60) {
                            this.fireworks[i].particles.splice(p_idx, 1);
                        }
                    }
                }
            };
            
            p.keyPressed = () => {
                if (p.key == 'r') {
                    document.body.style.cursor = 'url(cursor.png), auto';
                } else if (p.key == 't') {
                    document.body.style.cursor = 'pointer';
                }
            };
            
            p.windowResized = () => {
                const container = document.getElementById('fireworks-container');
                if (container && this.canvas) {
                    p.resizeCanvas(container.offsetWidth, container.offsetHeight);
                }
            };
        });
    }
    
    setupCoordination() {
        // Listen for scroll events to stop fireworks (like original)
        window.addEventListener('scroll', () => {
            this.clicked = true; // Stop new fireworks on scroll
        });
        
        // Register with EventManager for coordination
        if (window.EventManager) { // (if available)
            window.EventManager.register('fireworks', {
                start: () => this.startAnimation(),
                stop: () => this.stopAnimation(),
                pause: () => this.pauseAnimation(),
                resume: () => this.resumeAnimation()
            });
        }
    }
    
                     updateFireworks(p) {
                     // Only create new fireworks if not clicked or scrolled (same as original)
                     if (!this.clicked && p.random(1) < this.config.SPAWN_PROBABILITY) {
                         this.fireworks.push(new Firework(p.random(p.width), p.height, this.letters[this.lettersCounter], p, this.palette, this.gravity));
                         this.updateCounter();
                     }
        
        // Always update existing fireworks
        for (let i = this.fireworks.length - 1; i >= 0; i--) {
            this.fireworks[i].update(p);
            
            if (this.fireworks[i].done()) {
                this.fireworks.splice(i, 1);
            }
        }
    }
    
    drawFireworks(p) {
        p.colorMode(p.RGB);
        p.clear(); // Same as original clear() behavior
        
        // Show all fireworks
        for (let i = 0; i < this.fireworks.length; i++) {
            this.fireworks[i].show(p);
        }
    }
    
    updateCounter() {
        this.lettersCounter++;
        if (this.lettersCounter >= this.letters.length) {
            this.lettersCounter = 0;
        }
    }
    
    startAnimation() {
        this.isActive = true;
        this.clicked = false;
    }
    
    stopAnimation() {
        this.isActive = false;
        this.clicked = true;
    }
    
    pauseAnimation() {
        this.isActive = false;
    }
    
    resumeAnimation() {
        this.isActive = true;
    }
    
    clearFireworks() {
        this.fireworks = [];
    }
    
                     destroy() {
                     this.stopAnimation();
                     this.clearFireworks();
                     
                     // Unregister from coordination systems
                     if (window.ScrollManager) {
                         window.ScrollManager.unregisterScrollHandler('fireworks');
                     }
                     
                     if (window.EventManager) {
                         window.EventManager.unregister('fireworks');
                     }
                     
                     // Note: We don't remove the fireworks-container as it's part of the HTML
                     // Just clean up our canvas
                     if (this.canvas) {
                         this.canvas.remove();
                         this.canvas = null;
                     }
                     
                     this.isInitialized = false;
                 }
}

// Export for module system
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FireworksManager;
} else if (typeof window !== 'undefined') {
    window.FireworksManager = FireworksManager;
}
