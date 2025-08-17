// HOME PAGE ONLY: Scroll behavior for work section
// This script should only run on the home page
document.addEventListener('DOMContentLoaded', function() {
  // Check if we're on the home page
  const isHomePage = window.location.pathname === '/' || 
                    window.location.pathname.includes('index.html') ||
                    window.location.pathname.endsWith('/');
  
  if (!isHomePage) {
    return;
  }
  
  const workSection = document.querySelector('.work-section');
  const fireworksContainer = document.querySelector('#fireworks-container');
  const viewportHeight = window.innerHeight;
  
  if (!workSection) {
    return;
  }
  
  if (!fireworksContainer) {
    return;
  }
  
  // Set initial background color to lavender using the system
  if (window.animationCoordinator) {
    window.animationCoordinator.registerJSAnimation(
      fireworksContainer, 'background', 'fireworks-bg', 'MEDIUM'
    );
  }
  fireworksContainer.style.backgroundColor = '#FCE8FF';
  fireworksContainer.style.transition = 'background-color var(--transition-smooth)';
  
  
  
  // Reset scroll position to top on page load/reload
  window.scrollTo(0, 0);
  
  // CSS now handles initial positioning - JavaScript only handles scroll behavior
  // Get the work section's natural height for scroll calculations
  const workSectionHeight = workSection.offsetHeight;
  window.workSectionHeight = workSectionHeight;
  
  // CSS handles initial positioning - no JavaScript override needed
  
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
  let lastTop = 100; // Start from CSS initial position (100vh = 100% of viewport)
  let smoothingFactor = 0.15; // Lower = smoother but less responsive
  
  // Initialize lastTop from CSS position on first scroll
  let isFirstScroll = true;
  
  // Clean scroll handler with improved throttling
  function handleScroll(scrollY, scrollDelta, isScrolling) {
    if (isScrolling) return;
    
    isScrolling = true;
    
    requestAnimationFrame(function() {
      const scrollTop = scrollY;
      
      // On first scroll, initialize lastTop from CSS position
      if (isFirstScroll) {
        const computedStyle = window.getComputedStyle(workSection);
        lastTop = parseFloat(computedStyle.top);
        isFirstScroll = false;

      }
      
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
      const maxTop = viewportHeight; // Top edge at viewport bottom (CSS initial position)
      
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
      
      // Apply the new position directly for smooth scrolling
      workSection.style.top = newTop + 'px';
      
      // Background color transition effect
      // Transition from #FCE8FF (lavender) to main page background color
      const initialColor = [252, 232, 255]; // #FCE8FF (lavender)
      const finalColor = [255, 245, 248]; // #FFF5F8 (main page background)
      
      const r = Math.round(initialColor[0] + (finalColor[0] - initialColor[0]) * easedProgress);
      const g = Math.round(initialColor[1] + (finalColor[1] - initialColor[1]) * easedProgress);
      const b = Math.round(initialColor[2] + (finalColor[2] - initialColor[2]) * easedProgress);
      

      
      // Apply background color change through the system
      if (window.animationCoordinator) {
        window.animationCoordinator.registerJSAnimation(
          fireworksContainer, 'background', 'fireworks-scroll', 'HIGH'
        );
      }
      fireworksContainer.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
      
      isScrolling = false;
    });
  }
  
  // Register with ScrollManager instead of direct event listener
  if (window.scrollManager) {
    window.scrollManager.addScrollListener('work-section-scroll', handleScroll, 'normal');
  }
  
  // Reset work section to initial CSS position
  function resetWorkSectionPosition() {
    // Force reset by removing inline styles first, then setting CSS position
    workSection.style.removeProperty('top');
    workSection.style.setProperty('top', '100vh', 'important');
    lastTop = viewportHeight;
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
    // Ensure position resets on page reload
    window.eventManager.addListener(window, 'load', resetWorkSectionPosition);
  }
  
  
  
  
});
