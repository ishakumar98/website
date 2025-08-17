// HOME PAGE ONLY: Scroll behavior for work section
// This script should only run on the home page
document.addEventListener('DOMContentLoaded', function() {
  // Check if we're on the home page
  const isHomePage = window.location.pathname === '/' || 
                    window.location.pathname.includes('index.html') ||
                    window.location.pathname.endsWith('/');
  
  console.log('Scroll behavior script loaded, isHomePage:', isHomePage);
  
  if (!isHomePage) {
    console.log('Not home page, returning');
    return;
  }
  
  const workSection = document.querySelector('.work-section');
  const fireworksContainer = document.querySelector('#fireworks-container');
  const viewportHeight = window.innerHeight;
  
  if (!workSection) {
    console.error('Work section not found');
    return;
  }
  
  if (!fireworksContainer) {
    console.error('Fireworks container not found');
    return;
  }
  
  // Set initial background color to lavender
  fireworksContainer.style.backgroundColor = '#FCE8FF';
  
  // Add smooth CSS transition for the background color
  fireworksContainer.style.transition = 'background-color var(--transition-smooth)';
  
  
  
  // Reset scroll position to top on page load/reload
  window.scrollTo(0, 0);
  
  // Set initial position - top edge at bottom of viewport (fully collapsed)
  workSection.style.position = 'absolute';
  workSection.style.left = 'auto';
  workSection.style.width = '100%';
  workSection.style.zIndex = '10';
  
  // Use requestAnimationFrame to ensure proper positioning after render
  requestAnimationFrame(() => {
    // Get the work section's natural height after render
    const workSectionHeight = workSection.offsetHeight;
    
    console.log('Positioning work section:', {
      viewportHeight,
      workSectionHeight,
      calculatedTop: viewportHeight - 60
    });
    
    // Position so top edge with full box shadow is visible at viewport bottom
    // Shadow is 0 0 25px 35px = 60px total, so show that much
    workSection.style.top = (viewportHeight - 60) + 'px';
    
    console.log('Work section positioned, current top:', workSection.style.top);
    
    // Store height for scroll calculations
    window.workSectionHeight = workSectionHeight;
  });
  
  // Remove the body height setting that's causing issues
  // document.body.style.height = (viewportHeight + workSectionHeight) + 'px';
  
  
  
  let isScrolling = false;
  
  // Easing function for smooth movement
  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }
  
  // Smoother easing function for less jittery movement
  function smoothEase(t) {
    // Use a more gradual curve that's less reactive to rapid changes
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  }
  
  // Ultra-smooth easing function for buttery smooth movement
  function ultraSmoothEase(t) {
    // Use a very gradual curve that's extremely smooth
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }
  
  // Add position smoothing to reduce jitter
  let lastTop = viewportHeight;
  let smoothingFactor = 0.15; // Lower = smoother but less responsive
  
  // Initialize lastTop after render to ensure proper starting position
  requestAnimationFrame(() => {
    lastTop = viewportHeight - 60;
  });
  
  // Clean scroll handler with improved throttling
  function handleScroll(scrollY, scrollDelta, isScrolling) {
    if (isScrolling) return;
    
    isScrolling = true;
    
    requestAnimationFrame(function() {
      const scrollTop = scrollY;
      
      // Calculate scroll progress (0 = fully collapsed, 1 = fully expanded)
      const maxScroll = window.workSectionHeight || workSection.offsetHeight;
      const scrollProgress = Math.min(Math.max(scrollTop / maxScroll, 0), 1);
      
      // Apply easing to the scroll progress
      const easedProgress = ultraSmoothEase(scrollProgress);
      
      // Calculate new top position
      // When scrollProgress = 0: top edge at bottom of viewport (fully collapsed)
      // When scrollProgress = 1: bottom edge at viewport bottom (fully expanded)
      let newTop = viewportHeight - (easedProgress * maxScroll);
      
      // Add hard constraint to prevent the container from going beyond bounds
      // This prevents the bouncy behavior when scrolling fast
      const minTop = viewportHeight - maxScroll; // Bottom edge at viewport bottom
      const maxTop = viewportHeight - 60; // Top edge with full shadow visible at viewport bottom
      
      newTop = Math.max(minTop, Math.min(maxTop, newTop));
      
      // Apply position smoothing for ultra-smooth movement, but ensure we reach exact bounds
      if (scrollProgress === 0 || scrollProgress === 1) {
        // At the extremes, use exact positioning to ensure proper collapse/expand
        newTop = newTop;
      } else {
        // During mid-scroll, apply smoothing for smooth movement
        newTop = lastTop + (smoothingFactor * (newTop - lastTop));
      }
      lastTop = newTop;
      
      // Round the position to reduce jitter (sub-pixel positioning can cause jitter)
      newTop = Math.round(newTop);
      
      // Apply the new position
      workSection.style.top = newTop + 'px';
      
      // Background color transition effect
      // Transition from #FCE8FF (lavender) to main page background color
      const initialColor = [252, 232, 255]; // #FCE8FF (lavender)
      const finalColor = [255, 245, 248]; // #FFF5F8 (main page background)
      
      const r = Math.round(initialColor[0] + (finalColor[0] - initialColor[0]) * easedProgress);
      const g = Math.round(initialColor[1] + (finalColor[1] - initialColor[1]) * easedProgress);
      const b = Math.round(initialColor[2] + (finalColor[2] - initialColor[2]) * easedProgress);
      
      fireworksContainer.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
      
      isScrolling = false;
    });
  }
  
  // Register with ScrollManager instead of direct event listener
  if (window.scrollManager) {
    window.scrollManager.addScrollListener('work-section-scroll', handleScroll, 'normal');
  }
  
  // Handle window resize
  function handleResize() {
    const newViewportHeight = window.innerHeight;
    const newWorkSectionHeight = workSection.offsetHeight;
    
    // Update body height
    document.body.style.height = (newViewportHeight + newWorkSectionHeight) + 'px';
    
    // Adjust work section position if needed
    const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const maxScroll = newWorkSectionHeight;
    const scrollProgress = Math.min(Math.max(currentScrollTop / maxScroll, 0), 1);
    const easedProgress = ultraSmoothEase(scrollProgress);
    const newTop = newViewportHeight - (easedProgress * newWorkSectionHeight);
    
    workSection.style.top = newTop + 'px';
  }
  
  if (window.eventManager) {
    window.eventManager.addListener(window, 'resize', handleResize);
  }
  
  
  
  
});
