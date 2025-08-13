document.addEventListener('DOMContentLoaded', function() {
  const workSection = document.querySelector('.work-section');
  const viewportHeight = window.innerHeight;
  
  // Set initial position - top edge at bottom of viewport
  workSection.style.position = 'absolute';
  workSection.style.top = viewportHeight + 'px';
  workSection.style.left = '0';
  
  let lastScrollTop = 0;
  let isScrolling = false;
  
  window.addEventListener('scroll', function() {
    if (isScrolling) return;
    
    isScrolling = true;
    requestAnimationFrame(function() {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollDirection = scrollTop > lastScrollTop ? 'down' : 'up';
      
      if (scrollDirection === 'down') {
        // Scrolling down - work section moves up
        const newTop = Math.max(0, viewportHeight - scrollTop);
        workSection.style.top = newTop + 'px';
      } else {
        // Scrolling up - work section moves down, but stops at original position
        const newTop = Math.min(viewportHeight, viewportHeight - scrollTop);
        workSection.style.top = newTop + 'px';
      }
      
      lastScrollTop = scrollTop;
      isScrolling = false;
    });
  });
  
  // Handle window resize
  window.addEventListener('resize', function() {
    const newViewportHeight = window.innerHeight;
    workSection.style.top = newViewportHeight + 'px';
  });
});
