document.addEventListener('DOMContentLoaded', function() {
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
  
  console.log('Initializing scroll behavior for work section');
  
  // Reset scroll position to top on page load/reload
  window.scrollTo(0, 0);
  
  // Set initial position - top edge at bottom of viewport (fully collapsed)
  workSection.style.position = 'absolute';
  workSection.style.top = viewportHeight + 'px';
  workSection.style.left = '0';
  workSection.style.width = '100%';
  workSection.style.zIndex = '10';
  
  // Get the work section's natural height
  const workSectionHeight = workSection.offsetHeight;
  
  // Remove the body height setting that's causing issues
  // document.body.style.height = (viewportHeight + workSectionHeight) + 'px';
  
  console.log('Work section height:', workSectionHeight);
  console.log('Viewport height:', viewportHeight);
  
  let isScrolling = false;
  
  // Easing function for smooth movement
  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }
  
  // Clean scroll handler
  function handleScroll() {
    if (isScrolling) return;
    
    isScrolling = true;
    requestAnimationFrame(function() {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      // Calculate scroll progress (0 = fully collapsed, 1 = fully expanded)
      const maxScroll = workSectionHeight;
      const scrollProgress = Math.min(Math.max(scrollTop / maxScroll, 0), 1);
      
      // Apply easing to the scroll progress
      const easedProgress = easeOutCubic(scrollProgress);
      
      // Calculate new top position
      // When scrollProgress = 0: top edge at bottom of viewport (fully collapsed)
      // When scrollProgress = 1: bottom edge at bottom of viewport (fully expanded)
      const newTop = viewportHeight - (easedProgress * workSectionHeight);
      
      // Apply the new position
      workSection.style.top = newTop + 'px';
      
      // Background color transition effect
      const initialColor = [255, 245, 248]; // #FFF5F8
      const finalColor = [254, 243, 249]; // rgba(254, 243, 249, 0.9)
      
      const r = Math.round(initialColor[0] + (finalColor[0] - initialColor[0]) * easedProgress);
      const g = Math.round(initialColor[1] + (finalColor[1] - initialColor[1]) * easedProgress);
      const b = Math.round(initialColor[2] + (finalColor[2] - initialColor[2]) * easedProgress);
      
      fireworksContainer.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
      
      isScrolling = false;
    });
  }
  
  // Add scroll event listener
  window.addEventListener('scroll', handleScroll, { passive: true });
  
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
    const easedProgress = easeOutCubic(scrollProgress);
    const newTop = newViewportHeight - (easedProgress * newWorkSectionHeight);
    
    workSection.style.top = newTop + 'px';
  }
  
  window.addEventListener('resize', handleResize);
  
  console.log('Scroll behavior initialized successfully');
});
