// HOME PAGE ONLY: Flower fireworks animation
// This script should only run on the home page

// Check if we're on the home page
const isHomePage = window.location.pathname === '/' || 
                  window.location.pathname.includes('index.html') ||
                  window.location.pathname.endsWith('/');

if (!isHomePage) {
  
  // Exit the entire script
  throw new Error('Fireworks script disabled for non-home pages');
}

// Fireworks animation system
// const palette = ['#537DBD','#CA683E','#D3B934','#AF9E7D','#D85959','#956750','#277325','#F3B524','#972723','#5B388B','#686B1C','#142D86','#A1A329','#BF1E16','#3853A5','#D7537E','#E99F22','#CE5310','#1C57A7','#613B31']
const palette = ['#537DBD','#CA683E','#D3B934','#AF9E7D','#D85959','#956750','#277325','#F3B524','#972723','#5B388B','#686B1C','#142D86','#A1A329','#BF1E16','#3853A5','#D7537E','#E99F22','#CE5310','#613B31']


class Firework {
    constructor(x, y, letter) {
      this.hu = random(255);
      this.firework = new Particle(x, y, this.hu, letter, true);
      this.exploded = false;
      this.particles = [];
      this.letter = letter;
    }
  
    done() {
      if (this.exploded && this.particles.length === 0) {
        return true;
      } else {
        return false;
      }
    }
  
    update() {
      if (!this.exploded) {
        this.firework.applyForce(gravity);
        this.firework.update();
  
        if (this.firework.vel.y >= 0) {
          this.exploded = true;
          this.explode();
        }
      }
  
      for (let i = this.particles.length - 1; i >= 0; i--) {
        
        
  
        if (!this.particles[i].done()) {
          // this.particles.splice(i, 1);
          this.particles[i].applyForce(gravity);
        this.particles[i].update();
          
        }
      }
    }
  
    explode() {
      for (let i = 0; i < 16; i++) {
        const p = new Particle(this.firework.pos.x, this.firework.pos.y, random(palette), this.letter, false);
        this.particles.push(p);
      }
    }
  
    show() {
      if (!this.exploded) {
        this.firework.show();
      }
  
      for (var i = 0; i < this.particles.length; i++) {
        this.particles[i].show();
      }
    }
  }

// Particle system for fireworks



class Particle {
    constructor(x, y, color, letter, firework) {
      this.pos = createVector(x, y);
      this.firework = firework;
      this.lifespan = 50;
      this.color = color;
      this.letter = letter;
      this.acc = createVector(0, 0);
      this.rotation = 0;
      this.rotationDiff = random(-1, 1);
      if (this.firework) {
        this.vel = createVector(0, random(-12, -8));
      } else {
        this.vel = p5.Vector.random2D();
        this.vel.mult(random(4, 15));
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
      // this.rotation += this.rotationDiff;
    }
  
    done() {
      if (this.lifespan < 0) {
        return true;
        // return false;
      } else {
        return false;
      }
    }
  
    show() {
      // colorMode(HSB);
      textSize(30);
      angleMode(DEGREES);
  
      if (!this.firework) {
        // Exploded particles - draw flower
        push();
        translate(this.pos.x, this.pos.y)
        rotate(this.rotation);

        noStroke();
        
        // Draw 4 petals at corners - match CSS exactly
        fill(this.color);
        const petalSize = 17.5; // 35/2 = 17.5 (50% of 35)
        const petalOffset = 8.75; // 35/4 = 8.75 (25% of 35)
        
        // 4 petals at corners - match CSS positioning exactly
        ellipse(-petalOffset, -petalOffset, petalSize, petalSize); // top-left
        ellipse(petalOffset, -petalOffset, petalSize, petalSize);  // top-right  
        ellipse(-petalOffset, petalOffset, petalSize, petalSize);  // bottom-left
        ellipse(petalOffset, petalOffset, petalSize, petalSize);   // bottom-right
        
        // Center: 50% of size, positioned at center like CSS
        fill('#FBE2FF'); // Light blue center
        const centerSize = 17.5; // 35/2 = 17.5 (50% of 35)
        ellipse(0, 0, centerSize, centerSize);
        
        pop();

      } else {
        // Main firework - draw flower
        angleMode(RADIANS);
        push();
        translate(this.pos.x, this.pos.y)
        rotate(this.rotation);

        noStroke();
        
        // Draw 4 petals at corners - match CSS exactly
        fill('#FF7DCB'); // Pink petals
        const petalSize = 17.5; // 35/2 = 17.5 (50% of 35)
        const petalOffset = 8.75; // 35/4 = 8.75 (25% of 35)
        
        // 4 petals at corners - match CSS positioning exactly
        ellipse(-petalOffset, -petalOffset, petalSize, petalSize); // top-left
        ellipse(petalOffset, -petalOffset, petalSize, petalSize);  // top-right  
        ellipse(-petalOffset, petalOffset, petalSize, petalSize);  // bottom-left
        ellipse(petalOffset, petalOffset, petalSize, petalSize);   // bottom-right
        
        // Center: 50% of size, positioned at center like CSS
        fill('#FBE2FF'); // Light blue center
        const centerSize = 17.5; // 35/2 = 17.5 (50% of 35)
        ellipse(0, 0, centerSize, centerSize);
        
        pop();
      }
    }
  }

// Daniel Shiffman
// Fireworks system initialization

const fireworks = [];
const letters = ['C', 'O', 'T', 'T', 'O', 'N'];
let lettersCounter = 0;
let gravity;
let clicked = false;
let canvas;

function setup() {
  
  const container = document.getElementById('fireworks-container');
  
  if (!container) {
    return;
  }
  
  canvas = createCanvas(container.offsetWidth, container.offsetHeight);
  canvas.parent('fireworks-container');
  
  colorMode(HSB);
  gravity = createVector(0, 0.13);
  stroke(255);
  strokeWeight(4);
  background(0);
}

function draw() {
  colorMode(RGB);
  // background(0, 0, 0, 25);
  clear();
  
  // Only create new fireworks if not clicked or scrolled
  if (!clicked && random(1) < 0.01) { // Reduced to 0.01 for even fewer flowers
    fireworks.push(new Firework(random(width), height, letters[lettersCounter]));
    updateCounter();
  }
  
  // Always update and show existing fireworks
  for (let i=0;i<fireworks.length;i++) {
    fireworks[i].update();
    fireworks[i].show();
    
    if (fireworks[i].done()) {
      fireworks.splice(i, 1);
    }
  }

}

function mousePressed(){
  clicked = true;
  fireworks.push(new Firework(mouseX, mouseY, letters[lettersCounter]));
  updateCounter()
}

function updateCounter(){
  lettersCounter++;
  if (lettersCounter>=letters.length){
    lettersCounter = 0;
  }
}

function mouseMoved(){
  for (let i=0;i<fireworks.length;i++) {
    for (let p=0;p<fireworks[i].particles.length;p++){
      
      let ptcl = fireworks[i].particles[p];
      if (mouseX > ptcl.pos.x - 40 && 
          mouseX < ptcl.pos.x + 60 &&
          mouseY > ptcl.pos.y - 40 &&
          mouseY < ptcl.pos.y + 60){
        fireworks[i].particles.splice(p, 1)
      }
    }
  }
}

function keyPressed(){
  
  if (key == 'r'){
            if (window.animationCoordinator) {
            window.animationCoordinator.registerJSAnimation(
                document.body, 'cursor', 'fireworks-cursor', 'LOW'
            );
        }
        document.body.style.setProperty('cursor', 'url(cursor.png), auto', 'important');
      } else if (key == 't'){
      if (window.animationCoordinator) {
        window.animationCoordinator.unregisterAnimation(document.body, 'fireworks-cursor');
      }
      document.body.style.setProperty('cursor', 'pointer', 'important');
  }
}

// Handle window resize
function windowResized() {
  const container = document.getElementById('fireworks-container');
  if (container && canvas) {
    resizeCanvas(container.offsetWidth, container.offsetHeight);
  }
}

// Stop new fireworks when scrolling - register with ScrollManager
if (window.scrollManager) {
  window.scrollManager.addScrollListener('fireworks-stop', function() {
    clicked = true;
  }, 'low');
} 