

// HOME PAGE ONLY: Fireworks animation
// This script should only run on the home page

// Check if we're on the home page
const isHomePage = window.location.pathname === '/' || 
                  window.location.pathname.includes('index.html') ||
                  window.location.pathname.endsWith('/');

if (!isHomePage) {
  console.log('Fireworks: Not on home page, script disabled');
  // Exit the entire script
  throw new Error('Fireworks script disabled for non-home pages');
}

// Adapted from Cotton Design stars effect
// Original by Daniel Shiffman

// Color combinations will now come from the theme system
let flowerColors = [
  ['#FF7DCB', '#FBE2FF'], // Pink petals, new center color
  ['#FFBAC2', '#FBE2FF'], // Light pink petals, new center color  
  ['#FECCF1', '#FBE2FF']  // Light pink petals, new center color
];

const stars = [];
const letters = ['I', 's', 'h', 'a'];
let lettersCounter = 0;
let gravity;
let canvas;
let clicked = false;
let startTime;
let firstStarTime;

class Star {
    constructor(x, y, letter) {
      this.hu = random(255);
      this.colorCombo = random(flowerColors); // Random color combination
      this.star = new Particle(x, y, this.hu, letter, true, this.colorCombo);
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
        this.star.applyForce(gravity);
        this.star.update();
  
        if (this.star.vel.y >= 0) {
          this.exploded = true;
          this.explode();
        }
      }
  
      for (let i = this.particles.length - 1; i >= 0; i--) {
        if (!this.particles[i].done()) {
          this.particles[i].applyForce(gravity);
          this.particles[i].update();
        }
      }
    }
  
    explode() {
      for (let i = 0; i < 16; i++) {
        const p = new Particle(this.star.pos.x, this.star.pos.y, this.colorCombo[0], this.letter, false, this.colorCombo);
        this.particles.push(p);
      }
    }
  
    show() {
      if (!this.exploded) {
        this.star.show();
      }
  
      for (var i = 0; i < this.particles.length; i++) {
        this.particles[i].show();
      }
    }
}

class Particle {
    constructor(x, y, color, letter, firework, colorCombo) {
      this.pos = createVector(x, y);
      this.firework = firework;
      this.lifespan = 50;
      this.color = color;
      this.letter = letter;
      this.colorCombo = colorCombo || [['#FECCF1', '#FCE8FF']]; // Default colors if none provided
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
        this.rotation += 0.05; // Slow down the flower spinning
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
  
    show() {
      textSize(16); // Smaller text size to fit in center
      textFont('Tumla'); // Changed to Tumla font
      angleMode(DEGREES);
  
      if (!this.firework) {
        push();
        translate(this.pos.x, this.pos.y)
        rotate(this.rotation);

        noStroke();
        
        // Draw flower shape for exploded particles
        drawFlower(0, 0, 30, this.colorCombo);
        
        // Draw centered text in the circular center
        noStroke();
        fill('#000000');
        textAlign(CENTER, CENTER);
        textSize(16); // Same size as initial flowers
        text(this.letter, 0, 0); // Center of the flower
        pop();

      } else {
        angleMode(RADIANS);
        push();
        translate(this.pos.x, this.pos.y)
        rotate(this.rotation);

        noStroke();
        
        // Draw flower shape for the main particle
        drawFlower(0, 0, 30, this.colorCombo);
        
        // Draw centered text in the circular center
        fill('#000');
        textAlign(CENTER, CENTER);
        textSize(16); // Slightly larger for main particle
        text(this.letter, 0, 0); // Center of the flower
        pop();
      }
    }
}

// Helper function to draw a flower using the actual SVG path
function drawFlower(x, y, size, colorCombo) {
  push();
  translate(x, y);
  scale(size / 186); // Scale based on the SVG's viewBox size
  
  // Center the flower by offsetting the coordinates
  translate(-186, -186);
  
  // Draw the main flower petals using the SVG path
  fill(colorCombo[0]); // Petal color from color combination
  noStroke();
  beginShape();
  
  // Convert SVG path to p5.js commands
  // M240.812 90.6439 - Move to start
  vertex(240.812, 90.6439);
  
  // C240.215 106.055 237.065 122.287 233.399 136.481 - Cubic bezier
  bezierVertex(240.215, 106.055, 237.065, 122.287, 233.399, 136.481);
  
  // C245.993 129.661 260.536 122.706 274.784 117.963
  bezierVertex(245.993, 129.661, 260.536, 122.706, 274.784, 117.963);
  
  // C288.618 113.359 304.37 110.058 318.486 112.762
  bezierVertex(288.618, 113.359, 304.37, 110.058, 318.486, 112.762);
  
  // C325.864 114.177 333.196 117.308 339.326 123.074
  bezierVertex(325.864, 114.177, 333.196, 117.308, 339.326, 123.074);
  
  // C345.483 128.867 349.486 136.435 351.594 145.146
  bezierVertex(345.483, 128.867, 349.486, 136.435, 351.594, 145.146);
  
  // C356.023 163.436 350.393 178.8 339.33 190.107
  bezierVertex(356.023, 163.436, 350.393, 178.8, 339.33, 190.107);
  
  // C329.123 200.543 314.747 207.188 300.991 211.637
  bezierVertex(329.123, 200.543, 314.747, 207.188, 300.991, 211.637);
  
  // C287.052 216.147 271.901 218.961 258.385 220.724
  bezierVertex(287.052, 216.147, 271.901, 218.961, 258.385, 220.724);
  
  // C269.561 230.597 281.697 242.563 291.299 255.184
  bezierVertex(269.561, 230.597, 281.697, 242.563, 291.299, 255.184);
  
  // C300.328 267.057 308.694 281.503 310.132 296.693
  bezierVertex(300.328, 267.057, 308.694, 281.503, 310.132, 296.693);
  
  // C310.883 304.645 309.736 312.898 305.745 320.73
  bezierVertex(310.883, 304.645, 309.736, 312.898, 305.745, 320.73);
  
  // C301.781 328.499 295.523 334.87 287.564 339.95
  bezierVertex(301.781, 328.499, 295.523, 334.87, 287.564, 339.95);
  
  // C271.192 350.412 254.526 351.129 239.564 344.305
  bezierVertex(271.192, 350.412, 254.526, 351.129, 239.564, 344.305);
  
  // C225.789 338.02 214.911 326.035 206.596 313.964
  bezierVertex(225.789, 338.02, 214.911, 326.035, 206.596, 313.964);
  
  // C198.179 301.742 191.212 287.672 185.779 274.827
  bezierVertex(198.179, 301.742, 191.212, 287.672, 185.779, 274.827);
  
  // C179.943 287.42 172.62 301.211 164.079 313.228
  bezierVertex(179.943, 287.42, 172.62, 301.211, 164.079, 313.228);
  
  // C155.659 325.081 144.913 336.873 131.8 343.267
  bezierVertex(155.659, 325.081, 144.913, 336.873, 131.8, 343.267);
  
  // C117.455 350.257 101.176 350.265 85.5174 339.76
  bezierVertex(117.455, 350.257, 101.176, 350.265, 85.5174, 339.76);
  
  // C78.058 334.753 72.3191 328.391 68.8626 320.656
  bezierVertex(78.058, 334.753, 72.3191, 328.391, 68.8626, 320.656);
  
  // C65.4139 312.941 64.7086 304.924 65.6464 297.34
  bezierVertex(65.4139, 312.941, 64.7086, 304.924, 65.6464, 297.34);
  
  // C67.4444 282.79 75.4114 268.677 84.0604 256.847
  bezierVertex(67.4444, 282.79, 75.4114, 268.677, 84.0604, 256.847);
  
  // C92.9496 244.679 104.013 233.011 114.351 223.181
  bezierVertex(92.9496, 244.679, 104.013, 233.011, 114.351, 223.181);
  
  // C100.014 222.111 83.9325 219.926 69.3586 215.655
  bezierVertex(100.014, 222.111, 83.9325, 219.926, 69.3586, 215.655);
  
  // C55.1761 211.497 40.114 204.728 30.0661 192.952
  bezierVertex(55.1761, 211.497, 40.114, 204.728, 30.0661, 192.952);
  
  // C18.972 179.959 15.7868 163.025 22.0953 143.894
  bezierVertex(18.972, 179.959, 15.7868, 163.025, 22.0953, 143.894);
  
  // C28.2565 125.221 40.424 113.611 56.5363 109.507
  bezierVertex(28.2565, 125.221, 40.424, 113.611, 56.5363, 109.507);
  
  // C71.2496 105.76 87.0441 108.86 100.707 113.627
  bezierVertex(71.2496, 105.76, 87.0441, 108.86, 100.707, 113.627);
  
  // C113.863 118.215 127.042 125.081 138.659 132.095
  bezierVertex(113.863, 118.215, 127.042, 125.081, 138.659, 132.095);
  
  // C135.416 118.773 132.816 103.97 132.459 89.8573
  bezierVertex(135.416, 118.773, 132.816, 103.97, 132.459, 89.8573);
  
  // C132.091 75.1982 134.056 58.9542 142.43 45.8605
  bezierVertex(132.091, 75.1982, 134.056, 58.9542, 142.43, 45.8605);
  
  // C151.536 31.6238 166.559 23.618 186.388 23.2615
  bezierVertex(151.536, 31.6238, 166.559, 23.618, 186.388, 23.2615);
  
  // C206.716 22.8973 222.181 30.8139 231.365 45.5505
  bezierVertex(206.716, 22.8973, 222.181, 30.8139, 231.365, 45.5505);
  
  // C239.696 58.9232 241.393 75.6593 240.812 90.6439
  bezierVertex(239.696, 58.9232, 241.393, 75.6593, 240.812, 90.6439);
  
  endShape(CLOSE);
  
  // Draw the circular center
  fill(colorCombo[1]); // Center color from color combination
  ellipse(186, 186, 94, 94); // Center at (186, 186) with radius 47 for 2px breathing room
  
  pop();
}

function setup() {
  console.log('Setup function called');
  const container = document.getElementById('fireworks-container');
  console.log('Container found:', container);
  
  if (!container) {
    console.error('Fireworks container not found!');
    return;
  }
  
  // Set container dimensions if they're not set
  if (container.offsetWidth === 0 || container.offsetHeight === 0) {
    container.style.width = '100%';
    container.style.height = '100vh';
  }
  
  canvas = createCanvas(container.offsetWidth, container.offsetHeight);
  canvas.parent('fireworks-container');
  
  // Test if canvas is working
  console.log('Canvas created:', canvas);
  console.log('Canvas size:', canvas.width, 'x', canvas.height);
  console.log('Container size:', container.offsetWidth, 'x', container.offsetHeight);
  
  colorMode(HSB);
  gravity = createVector(0, 0.13);
  stroke(255);
  strokeWeight(4);
  // background(252, 232, 255); // FCE8FF background - removed to allow CSS gradient
  startTime = millis();
  firstStarTime = null;
  
  // Add scroll detection to stop fireworks when project section comes into view
window.addEventListener('scroll', checkScrollPosition);
}

function draw() {
  colorMode(RGB);
  clear();
  // background(252, 232, 255); // FCE8FF background - removed to allow CSS gradient
  
  // Debug: show current state
  if (frameCount % 60 === 0) { // Log every second
    console.log('Frame:', frameCount, 'Stars:', stars.length, 'Clicked:', clicked);
  }
  
  // Auto-trigger stars occasionally (only if not clicked)
  if (!clicked && random(1) < 0.02) {
    console.log('Creating new star at:', random(width), height);
    stars.push(new Star(random(width), height, letters[lettersCounter]));
    updateCounter();
  }
  
  for (let i = stars.length - 1; i >= 0; i--) {
    stars[i].update();
    stars[i].show();
    
    if (stars[i].done()) {
      stars.splice(i, 1);
    }
  }
}

function updateCounter(){
  lettersCounter++;
  if (lettersCounter >= letters.length){
    lettersCounter = 0;
  }
}

function mousePressed(){
  if (!clicked) {
    // First click: stop auto-triggering
    console.log('First click: stopping auto-trigger');
    clicked = true;
  } else {
    // Second click and onwards: cycle through particles at mouse location
    console.log('Click: cycling through particles');
    stars.push(new Star(mouseX, mouseY, letters[lettersCounter]));
    updateCounter();
  }
}

function mouseMoved(){
  for (let i=0;i<stars.length;i++) {
    for (let p=0;p<stars[i].particles.length;p++){
      
      let ptcl = stars[i].particles[p];
      if (mouseX > ptcl.pos.x - 40 && 
          mouseX < ptcl.pos.x + 60 &&
          mouseY > ptcl.pos.y - 40 &&
          mouseY < ptcl.pos.y + 60){
        stars[i].particles.splice(p, 1)
      }
    }
  }
}

function checkScrollPosition() {
  const projectSection = document.querySelector('.work-section');
  if (projectSection) {
    const rect = projectSection.getBoundingClientRect();
    // If the project section is visible in the viewport, stop fireworks
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      if (!clicked) {
        console.log('Project section in view: stopping fireworks');
        clicked = true;
      }
    }
  }
}

function windowResized() {
  const container = document.getElementById('fireworks-container');
  resizeCanvas(container.offsetWidth, container.offsetHeight);
} 