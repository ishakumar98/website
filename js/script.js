// HOME PAGE ONLY: General home page functionality
// This script should only run on the home page
// Homepage-specific functionality using coordination systems
document.addEventListener('DOMContentLoaded', function() {
  // Check if we're on the home page
  const isHomePage = window.location.pathname === '/' || 
                    window.location.pathname.includes('/') ||
                    window.location.pathname.endsWith('/');
  
  if (!isHomePage) {

    return;
  }
    // Add hover effects to folder items
    const folderItems = document.querySelectorAll('.folder-item');
    
    folderItems.forEach(item => {
        if (window.eventManager) {
                    window.eventManager.addListener(item, 'mouseenter', function() {
            if (window.animationCoordinator) {
                window.animationCoordinator.registerJSAnimation(
                    this, 'translate', 'folder-hover', 'HIGH'
                );
            }
            this.style.setProperty('transform', 'translateY(-4px)', 'important');
        });
        
        window.eventManager.addListener(item, 'mouseleave', function() {
            if (window.animationCoordinator) {
                window.animationCoordinator.unregisterAnimation(this, 'folder-hover');
            }
            this.style.setProperty('transform', 'translateY(0)', 'important');
        });
            
            // Add click functionality
            window.eventManager.addListener(item, 'click', function() {
                const label = this.querySelector('.folder-label').textContent;
        
                // You can add navigation or modal functionality here
            });
        }
    });

    // Add blur effect to other folders when one is hovered
    const finderItems = document.querySelectorAll('.finder li');
    
    finderItems.forEach(item => {
        if (window.eventManager) {
            window.eventManager.addListener(item, 'mouseenter', function() {
                // Add blur class to all other items
                finderItems.forEach(otherItem => {
                    if (otherItem !== this) {
                        otherItem.classList.add('blurred');
                    }
                });
            });
            
            window.eventManager.addListener(item, 'mouseleave', function() {
                // Remove blur class from all items
                finderItems.forEach(otherItem => {
                    otherItem.classList.remove('blurred');
                });
            });
        }
    });
    
    // Add click functionality to action links
    const actionLinks = document.querySelectorAll('.action-link');
    
    actionLinks.forEach(link => {
        if (window.eventManager) {
            window.eventManager.addListener(link, 'click', function(e) {
                e.preventDefault();
                const text = this.textContent.trim();
        
                // You can add specific functionality for each action
            });
        }
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
        
        if (letters.length === 0) {
            return;
        }
        
        // Generate random transform values for each letter
        function generateRandomTransform() {
            const rotation = (Math.random() - 0.5) * 12; // -6 to +6 degrees
            const translateY = (Math.random() - 0.5) * 6; // -3 to +3 pixels
            const translateX = (Math.random() - 0.5) * 4; // -2 to +2 pixels
            return `rotate(${rotation}deg) translateY(${translateY}px) translateX(${translateX}px)`;
        }
        
        // Apply random transforms on hover
        const nameDisplay = document.querySelector('.name-display');
        
        if (nameDisplay && window.eventManager) {
            window.eventManager.addListener(nameDisplay, 'mouseenter', function() {
                letters.forEach((letter, index) => {
                    // Skip space characters
                    if (letter.textContent.trim() === '') return;
                    
                    const randomTransform = generateRandomTransform();
                    
                    // Register with animation coordinator to prevent conflicts
                    if (window.animationCoordinator) {
                        window.animationCoordinator.registerJSAnimation(
                            letter, 
                            'transform', 
                            `letter-hover-${index}`, 
                            window.animationCoordinator.priorities.HIGH
                        );
                    }
                    
                    letter.style.setProperty('transform', randomTransform, 'important');
                });
            });
            
            window.eventManager.addListener(nameDisplay, 'mouseleave', function() {
                letters.forEach((letter, index) => {
                    // Unregister animations to prevent conflicts
                    if (window.animationCoordinator) {
                        window.animationCoordinator.unregisterAnimation(letter, `letter-hover-${index}`);
                    }
                    letter.style.setProperty('transform', 'rotate(0deg) translateY(0px) translateX(0px)', 'important');
                });
            });
        }
    }
    
    // Initialize random letter animations
    initRandomLetterAnimations();
    
    // Register CSS letter animations with animation coordinator
    function registerCSSLetterAnimations() {
        const letters = document.querySelectorAll('.name-display .letter');
        
        if (letters.length === 0 || !window.animationCoordinator) {
            return;
        }
        
        letters.forEach((letter, index) => {
            // Register the CSS transition with animation coordinator
            window.animationCoordinator.registerCSSAnimation(
                letter,
                'transform',
                `letter-css-${index}`,
                window.animationCoordinator.priorities.MEDIUM
            );
        });
    }
    
    // Register CSS animations after DOM is ready
    registerCSSLetterAnimations();
    
    // Interactive name effect cycling
    let currentEffect = 1;
    const nameText = document.querySelector('.name-text');

    if (nameText && window.eventManager) {
        window.eventManager.addListener(nameText, 'mouseenter', function() {
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

    // Observe the work section
    const workSection = document.querySelector('.work-section');
    if (workSection) {
        observer.observe(workSection);
        
        // Add item indices for staggered animation
        const workItems = workSection.querySelectorAll('.work-item');
        workItems.forEach((item, index) => {
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
                    // Register with animation coordinator to prevent conflicts
                    if (window.animationCoordinator) {
                        window.animationCoordinator.registerJSAnimation(
                            finderSection, 
                            'translate', 
                            'finder-scroll-overlay', 
                            window.animationCoordinator.priorities.HIGH
                        );
                    }
                    
                    if (window.animationCoordinator) {
                        window.animationCoordinator.registerJSAnimation(
                            finderSection, 'translate', 'finder-scroll', 'HIGH'
                        );
                    }
                    finderSection.style.setProperty('transform', `translateY(${progress * 60}px)`, 'important');
                    finderSection.style.setProperty('opacity', progress, 'important');
                }
            }
        }, 'normal');
    }



    // Initialize ScrollManager if not already done
    if (!window.scrollManager) {
        window.scrollManager = new ScrollManager();
    }

    // Navigation stack functionality
    const workLinks = document.querySelectorAll('.work-link');
    
    workLinks.forEach(link => {
        if (window.eventManager) {
            window.eventManager.addListener(link, 'click', function(e) {
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
        }
    });

}); 