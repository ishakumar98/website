// HOME PAGE ONLY: General home page functionality
// This script should only run on the home page
document.addEventListener('DOMContentLoaded', function() {
  // Check if we're on the home page
  const isHomePage = window.location.pathname === '/' || 
                    window.location.pathname.includes('index.html') ||
                    window.location.pathname.endsWith('/');
  
  if (!isHomePage) {

    return;
  }
    // Add hover effects to folder items
    const folderItems = document.querySelectorAll('.folder-item');
    
    folderItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
        
        // Add click functionality
        item.addEventListener('click', function() {
            const label = this.querySelector('.folder-label').textContent;
    
            // You can add navigation or modal functionality here
        });
    });

    // Add blur effect to other folders when one is hovered
    const finderItems = document.querySelectorAll('.finder li');
    
    finderItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            // Add blur class to all other items
            finderItems.forEach(otherItem => {
                if (otherItem !== this) {
                    otherItem.classList.add('blurred');
                }
            });
        });
        
        item.addEventListener('mouseleave', function() {
            // Remove blur class from all items
            finderItems.forEach(otherItem => {
                otherItem.classList.remove('blurred');
            });
        });
    });
    
    // Add click functionality to action links
    const actionLinks = document.querySelectorAll('.action-link');
    
    actionLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const text = this.textContent.trim();
    
            // You can add specific functionality for each action
        });
    });
    
    // Add smooth page load animation
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity var(--transition-slow)';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, getComputedStyle(document.documentElement).getPropertyValue('--animation-fast').replace('ms', '') || 100);

    // Trigger letter animations after page load
    setTimeout(() => {
        const letters = document.querySelectorAll('.name .letter');
        letters.forEach((letter, index) => {
            letter.style.animationDelay = `${0.1 + (index * 0.1)}s`;
        });
    }, getComputedStyle(document.documentElement).getPropertyValue('--animation-smooth').replace('ms', '') || 200);

            // Random letter animation system (ISHA-style)
    function initRandomLetterAnimations() {
        const letters = document.querySelectorAll('.name-display .letter');
        
        if (letters.length === 0) return;
        
        // Generate random transform values for each letter
        function generateRandomTransform() {
            const rotation = (Math.random() - 0.5) * 12; // -6 to +6 degrees
            const translateY = (Math.random() - 0.5) * 6; // -3 to +3 pixels
            const translateX = (Math.random() - 0.5) * 4; // -2 to +2 pixels
            return `rotate(${rotation}deg) translateY(${translateY}px) translateX(${translateX}px)`;
        }
        
        // Apply random transforms on hover
        const nameDisplay = document.querySelector('.name-display');
        if (nameDisplay) {
            nameDisplay.addEventListener('mouseenter', function() {
                letters.forEach(letter => {
                    // Skip space characters
                    if (letter.textContent.trim() === '') return;
                    
                    const randomTransform = generateRandomTransform();
                    letter.style.transform = randomTransform;
                });
            });
            
            nameDisplay.addEventListener('mouseleave', function() {
                letters.forEach(letter => {
                    letter.style.transform = 'rotate(0deg) translateY(0px) translateX(0px)';
                });
            });
        }
    }
    
    // Initialize random letter animations
    initRandomLetterAnimations();
    
    // Interactive name effect cycling
    let currentEffect = 1;
    const nameText = document.querySelector('.name-text');

    if (nameText) {
        nameText.addEventListener('mouseenter', function() {
            // Remove all effect classes
            this.classList.remove('effect-1', 'effect-2', 'effect-3', 'effect-4', 'effect-5');
            // Add current effect class
            this.classList.add(`effect-${currentEffect}`);
            
            // Cycle to next effect
            currentEffect = currentEffect >= 5 ? 1 : currentEffect + 1;
        });
    }
    

    
    // Scroll reveal functionality
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, observerOptions);

    // Observe the finder section
    const finderSection = document.querySelector('.finder');
    if (finderSection) {
        observer.observe(finderSection);
        
        // Add item indices for staggered animation
        const finderItems = finderSection.querySelectorAll('li');
        finderItems.forEach((item, index) => {
            item.style.setProperty('--item-index', index);
        });
    }



    // Scroll overlay effect (keep existing functionality exactly the same)
    if (window.scrollManager) {
        window.scrollManager.addScrollListener('finder-overlay', (scrollY) => {
            const finderSection = document.querySelector('.finder');
            const introSection = document.querySelector('.row-filters');
            
            if (finderSection && introSection) {
                const introBottom = introSection.offsetTop + introSection.offsetHeight;
                const finderTop = introSection.offsetTop;
                
                if (scrollY > introBottom - window.innerHeight) {
                    const progress = Math.min((scrollY - (introBottom - window.innerHeight)) / 200, 1);
                    finderSection.style.transform = `translateY(${progress * 60}px)`;
                    finderSection.style.opacity = progress;
                }
            }
        }, 'normal');
    }

    // Weighted Movement Effect for Work Container ONLY (LSVP-style)
    // IMPORTANT: This ONLY affects the work container movement, NOT the page scroll speed
    let currentWorkTransformY = 0;
    let targetWorkTransformY = 0;
    const lerpFactor = 0.08;
    
    // This makes the work container move slower, but doesn't change page scroll speed at all
    const containerMovementMultiplier = 0.15; // Work container moves 85% slower than normal
    
    window.addEventListener('scroll', () => {
        const workContainer = document.querySelector('.work-container');
        if (workContainer) {
            // scrollY is now passed as parameter from ScrollManager
            
            // Apply multiplier ONLY to the container movement, not to scroll
            const adjustedMovement = scrollY * containerMovementMultiplier;
            const viewportHeight = window.innerHeight;
            const scrollProgress = Math.min(adjustedMovement / viewportHeight, 1);
            
            // Apply easing for smooth movement with momentum building
            let easedProgress;
            if (scrollProgress < 0.3) {
                easedProgress = scrollProgress * scrollProgress * 0.5;
            } else if (scrollProgress < 0.6) {
                easedProgress = 0.045 + (scrollProgress - 0.3) * 1.5;
            } else {
                // Gentle landing effect for final 40% of scroll (60-100%)
                const landingProgress = (scrollProgress - 0.6) / 0.4;
                easedProgress = 0.495 + (landingProgress * landingProgress * 0.505); // Very gentle final approach
            }
            
            const maxTransformY = 100;
            targetWorkTransformY = easedProgress * maxTransformY;
            
            // Start LERP animation
            updateWorkContainerLERP();
        }
    });
    
    // LERP update function for work container
    function updateWorkContainerLERP() {
        const workContainer = document.querySelector('.work-container');
        if (!workContainer) return;
        
        // Smoothly interpolate between current and target position
        currentWorkTransformY += (targetWorkTransformY - currentWorkTransformY) * lerpFactor;
        
        // Apply the smoothed transform
        workContainer.style.transform = `translateY(${currentWorkTransformY}px)`;
        
        // Continue animation if we're still moving
        if (Math.abs(targetWorkTransformY - currentWorkTransformY) > 0.1) {
            requestAnimationFrame(updateWorkContainerLERP);
        }
    }

    // Navigation stack functionality
    const workLinks = document.querySelectorAll('.work-link');
    
    workLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const projectTitle = this.querySelector('.title span').textContent;
            
            // Store the project title in sessionStorage for the project page
            sessionStorage.setItem('projectTitle', projectTitle);
            
            // If it's a link to a project page, let it navigate
            if (this.getAttribute('href') && this.getAttribute('href') !== '#') {
                return; // Allow normal navigation
            }
            
            // For placeholder links, prevent default and show message
            e.preventDefault();
    
            alert(`Project "${projectTitle}" - Coming soon!`);
        });
    });

}); 