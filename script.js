// Add smooth scrolling for anchor links
document.addEventListener('DOMContentLoaded', function() {
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
            console.log('Clicked folder:', label);
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
            console.log('Clicked action:', text);
            // You can add specific functionality for each action
        });
    });
    
    // Add smooth page load animation
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease-in-out';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);

    // Trigger letter animations after page load
    setTimeout(() => {
        const letters = document.querySelectorAll('.name .letter');
        letters.forEach((letter, index) => {
            letter.style.animationDelay = `${0.1 + (index * 0.1)}s`;
        });
    }, 200);

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

    // Real-time scroll animation for work section
    const workSection = document.querySelector('.work-section');
    const headerSection = document.querySelector('.header-section');
    
    if (workSection && headerSection) {
        // Add smooth transition to work section
        workSection.style.transition = 'transform 0.1s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        headerSection.style.transition = 'opacity 0.1s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        
        let ticking = false;
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const scrollY = window.scrollY;
                    const headerHeight = headerSection.offsetHeight;
                    const windowHeight = window.innerHeight;
                    const documentHeight = document.documentElement.scrollHeight;
                    
                    // Calculate how much the work section should move up
                    const maxScroll = headerHeight;
                    const progress = Math.min(Math.max(scrollY / maxScroll, 0), 1);
                    
                    // Use easing function for smoother animation
                    const easedProgress = 1 - Math.pow(1 - progress, 3); // Ease out cubic
                    
                    // Move work section up based on scroll progress
                    const translateY = Math.max(0, 100 - (easedProgress * 100));
                    workSection.style.transform = `translateY(${translateY}vh)`;
                    
                    // Keep header visible but with reduced opacity as work section covers it
                    if (progress > 0.3) {
                        const opacityProgress = Math.min((progress - 0.3) / 0.7, 1);
                        const easedOpacity = Math.max(0.2, 1 - (opacityProgress * 0.8));
                        headerSection.style.opacity = easedOpacity;
                    } else {
                        headerSection.style.opacity = 1;
                    }
                    
                    // Prevent jitter at the bottom by checking if we're near the end
                    const scrollBottom = scrollY + windowHeight;
                    const isNearBottom = scrollBottom >= documentHeight - 10;
                    
                    if (isNearBottom) {
                        // Lock the work section in final position
                        workSection.style.transform = 'translateY(0vh)';
                        headerSection.style.opacity = 0.2;
                    }
                    
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    // Scroll overlay effect
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const finderSection = document.querySelector('.finder');
        const introSection = document.querySelector('.row-filters');
        
        if (finderSection && introSection) {
            const introBottom = introSection.offsetTop + introSection.offsetHeight;
            const finderTop = finderSection.offsetTop;
            
            if (scrollY > introBottom - window.innerHeight) {
                const progress = Math.min((scrollY - (introBottom - window.innerHeight)) / 200, 1);
                finderSection.style.transform = `translateY(${progress * 60}px)`;
                finderSection.style.opacity = progress;
            }
        }
    });


}); 