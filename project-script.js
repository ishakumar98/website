// Project Script - Shared functionality for all project pages
// Handles ISHA slant system, project data loading, and dynamic font sizing

// ============================================================================
// CONSTANTS - All magic numbers extracted for easy adjustment
// ============================================================================

        // ISHA Weight Effect System (for Akke Variable Font)
        const SLANT_CONFIG = {
            MOUSE_RADIUS: 125,           // Distance from mouse where weight effect activates (px)
            MAX_WEIGHT_VALUE: 900,       // Maximum weight value for Akke variable font
            MIN_WEIGHT_VALUE: 25,        // Minimum weight value for Akke variable font (ultra-thin)
            TRANSITION_DURATION: getComputedStyle(document.documentElement).getPropertyValue('--animation-smooth').replace('ms', '') || 300,    // Use CSS variable or fallback
            CONTENT_DELAY: getComputedStyle(document.documentElement).getPropertyValue('--animation-fast').replace('ms', '') || 100           // Use CSS variable or fallback
        };



// Animation & Scroll Behavior
const ANIMATION_CONFIG = {
    LERP_FACTOR: parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--lerp-factor')) || 0.05,           // Use CSS variable or fallback
    SCROLL_STOP_DELAY: getComputedStyle(document.documentElement).getPropertyValue('--animation-fast').replace('ms', '') || 100,      // Use CSS variable or fallback
    VELOCITY_MULTIPLIER: 0.01,   // Scroll velocity accumulation factor
    EASE_OUT_START: 0.65,        // Start of ease-out animation (0-1)
    EASE_OUT_POWER: 4.5,         // Ease-out curve power
    EASE_OUT_OFFSET: 0.892       // Ease-out animation offset
};

// ============================================================================
// GLOBAL VARIABLES
// ============================================================================

let projectData = null;
let currentProjectId = null;

// Initialize project page
async function initProjectPage() {
    // Get project ID from URL or data attribute
    currentProjectId = getProjectIdFromURL();
    
    // Load project data
    await loadProjectData();
    
    // Query all DOM elements upfront - single traversal
    const pageHeader = document.querySelector('.page-header');
    const projectImagesSection = document.querySelector('.project-images-section');
    const flowerElement = projectImagesSection?.querySelector('.flower-logo');
    
    // Initialize ISHA slant system
    initISHASlantSystem();
    
    // Initialize project images scroll behavior (pass elements as parameters)
    initProjectImagesScroll(projectImagesSection, flowerElement);
    

    
    // Initialize image popups
    initImagePopups();
}

// Get project ID from URL (e.g., calendar-project.html -> calendar)
function getProjectIdFromURL() {
    const path = window.location.pathname;
    const filename = path.split('/').pop();
    return filename.replace('-project.html', '');
}

// Load project data from JSON file
async function loadProjectData() {
    try {
    
        const response = await fetch('project-data.json');

        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        projectData = data.projects[currentProjectId];
        
        if (!projectData) {
            console.error(`Project data not found for: ${currentProjectId}`);
            return;
        }
        
        // Populate page content
        populateProjectContent();
        
    } catch (error) {
        console.error('Error loading project data:', error);
        // Fallback to hardcoded content for testing
        projectData = {
            title: "Calendar",
            year: "2024 - 2025",
            description: [
                "This work was completed while staffed on Slack's Zero to One product team as a product design lead. From 2024 to 2025, our team worked to design a native Calendar experience in Slack.",
                "Calendar aims to integrate all your tools & data into a single, unified layer that allows you to manage all the things competing for your time, right in Slack. I contributed several elements of the visual design, and led design strategy to create an overall vision for the project.",
                "We wanted the experience to feel powerful, and playful — true to Slack's personality and product value. This work is currently in progress, and set to GA next year."
            ],
            credits: "Many thanks to Samuel Kang, Amanda Glanz, Timothy Wittig, Ford St. John, Elyse Vest, Parag Shah, Stewart Taylor, and Stuart Lovinggood for their talent and time.",
            images: [
                {
                    "src": "project-images/Detail View.png",
                    "alt": "Detail View",
                    "title": "Detail View.png"
                },
                {
                    "src": "project-images/Scheduling.png",
                    "alt": "Scheduling",
                    "title": "Scheduling.png"
                },
                {
                    "src": "project-images/Special Events.png",
                    "alt": "Special Events",
                    "title": "Special Events.png"
                },
                {
                    "src": "project-images/Focus Mode.png",
                    "alt": "Focus Mode",
                    "title": "Focus Mode.png"
                },
                {
                    "src": "project-images/Out of Office.png",
                    "alt": "Out of Office",
                    "title": "Out of Office.png"
                },
                {
                    "src": "project-images/Create Event.png",
                    "alt": "Create Event",
                    "title": "Create Event.png"
                },
                {
                    "src": "project-images/Project Timelines.png",
                    "alt": "Project Timelines",
                    "title": "Project Timelines.png"
                },
                {
                    "src": "project-images/Project Timelines (1).png",
                    "alt": "Project Timelines 1",
                    "title": "Project Timelines (1).png"
                },
                {
                    "src": "project-images/Project Timelines (2).png",
                    "alt": "Project Timelines 2",
                    "title": "Project Timelines (2).png"
                },
                {
                    "src": "project-images/To Dos (Hover).png",
                    "alt": "To Dos Hover",
                    "title": "To Dos (Hover).png"
                },
                {
                    "src": "project-images/Scheduling Detection.png",
                    "alt": "Scheduling Detection",
                    "title": "Scheduling Detection.png"
                },
                {
                    "src": "project-images/Notifications.png",
                    "alt": "Notifications",
                    "title": "Notifications.png"
                },
                {
                    "src": "project-images/Meeting Unfurl.png",
                    "alt": "Meeting Unfurl",
                    "title": "Meeting Unfurl.png"
                },
                {
                    "src": "project-images/Day View.png",
                    "alt": "Day View",
                    "title": "Day View.png"
                },
                {
                    "src": "project-images/AI Scheduling.png",
                    "alt": "AI Scheduling",
                    "title": "AI Scheduling.png"
                }
            ]
        };
        populateProjectContent();
    }
}

// Populate page with project data
function populateProjectContent() {
    if (!projectData) return;
    
    // Update page title
    document.title = `${projectData.title} - Project`;
    
    // Update header
    const projectHeader = document.querySelector('.name-link.active');
    if (projectHeader) {
        projectHeader.textContent = projectData.title;
        projectHeader.href = '#';
    }
    
    // Update project year
    const projectYear = document.querySelector('.project-year');
    if (projectYear) {
        projectYear.textContent = projectData.year;
    }
    
    // Update project description
    const projectTextBlock = document.querySelector('.project-text-block');
    if (projectTextBlock) {
        projectTextBlock.innerHTML = '';
        
        projectData.description.forEach(paragraph => {
            const p = document.createElement('p');
            p.className = 'project-description';
            p.textContent = paragraph;
            projectTextBlock.appendChild(p);
        });
    }
    
    // Update credits
    const creditsText = document.querySelector('.credits-text');
    if (creditsText) {
        creditsText.textContent = projectData.credits;
    }
    
    // Update project images
    const imageList = document.querySelector('.image-list');
    if (imageList) {
        imageList.innerHTML = '';
        
        projectData.images.forEach(image => {
            const li = document.createElement('li');
            li.className = 'image';
            
            li.innerHTML = `
                <div class="wrapper-image">
                    <img src="${image.src}" alt="${image.alt}">
                </div>
                <div class="title">
                    <span>${image.title}</span>
                </div>
            `;
            
            imageList.appendChild(li);
        });
    }
    
    // Now that all content is populated, wait for CSS to be fully applied
    // Use multiple requestAnimationFrame calls to ensure styles are computed
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            const pageHeader = document.querySelector('.page-header');
            adjustFontSize(pageHeader);
        });
    });
}

// ISHA-Style Mouse-Position Slant System
function initISHASlantSystem() {

    
    // Wait for content to be populated
    setTimeout(() => {
        const descriptions = document.querySelectorAll(".project-description");
        
        
        descriptions.forEach((desc, index) => {

            
            // Create a document fragment to build the new content (like ISHA does)
            const fragment = document.createDocumentFragment();
            const characters = Array.from(desc.textContent);
            
            // Group letters by words to prevent word breaking while maintaining individual letter slant
            let currentWord = '';
            let currentText = '';
            
            characters.forEach((char, charIndex) => {
                if (char === ' ' || char === '\n' || char === '\t') {
                    // If we have a word built up, wrap it in a word container
                    if (currentWord.length > 0) {
                        const wordSpan = document.createElement('span');
                        wordSpan.classList.add('word');
                        wordSpan.style.display = 'inline-block';
                        wordSpan.style.whiteSpace = 'nowrap';
                        
                        // Add each letter of the word as a separate span
                        Array.from(currentWord).forEach(letterChar => {
                            const letterSpan = document.createElement('span');
                            letterSpan.classList.add('letter');
                            letterSpan.textContent = letterChar;
                            wordSpan.appendChild(letterSpan);
                        });
                        
                        fragment.appendChild(wordSpan);
                        currentWord = '';
                    }
                    
                    // Handle line breaks by creating empty line divs
                    if (char === '\n') {
                        // Create an empty line div that won't participate in slanting
                        const emptyLine = document.createElement('div');
                        emptyLine.classList.add('empty-line-break');
                        fragment.appendChild(emptyLine);
                    } else {
                        // Add other whitespace (spaces, tabs)
                        currentText += char;
                    }
                } else {
                    // If we have accumulated whitespace, add it first
                    if (currentText.length > 0) {
                        fragment.appendChild(document.createTextNode(currentText));
                        currentText = '';
                    }
                    
                    // Add character to current word
                    currentWord += char;
                }
            });
            
            // Handle the last word if there is one
            if (currentWord.length > 0) {
                const wordSpan = document.createElement('span');
                wordSpan.classList.add('word');
                wordSpan.style.display = 'inline-block';
                wordSpan.style.whiteSpace = 'nowrap';
                
                Array.from(currentWord).forEach(letterChar => {
                    const letterSpan = document.createElement('span');
                    letterSpan.classList.add('letter');
                    letterSpan.textContent = letterChar;
                    wordSpan.appendChild(letterSpan);
                });
                
                fragment.appendChild(wordSpan);
            }
            
            // Add any remaining whitespace at the end
            if (currentText.length > 0) {
                fragment.appendChild(document.createTextNode(currentText));
            }
            
            // Replace the content with the new structure
            desc.innerHTML = '';
            desc.appendChild(fragment);
            

        });
        
        // Add mousemove listener for individual letter slant (ISHA-style)
        if (!window.matchMedia("(pointer: coarse)").matches) {

            
            if (window.eventManager) {
                window.eventManager.addListener(document, "mousemove", function(e) {
                    const letters = document.querySelectorAll(".project-description .letter");
                    
                    if (letters.length === 0) {
                        return;
                    }
                    
                    letters.forEach((span, index) => {
                        const rect = span.getBoundingClientRect();
                        const centerX = rect.left + rect.width / 2;
                        const centerY = rect.top + rect.height / 2;
                        
                        // Calculate distance from mouse to letter center (like ISHA does)
                        const distance = Math.sqrt(Math.pow(e.clientX - centerX, 2) + Math.pow(e.clientY - centerY, 2));
                        
                        if (distance < SLANT_CONFIG.MOUSE_RADIUS) {
                            // Map distance to weight using constants - higher weight when closer to mouse
                            const weightValue = map(distance, 0, SLANT_CONFIG.MOUSE_RADIUS, SLANT_CONFIG.MAX_WEIGHT_VALUE, SLANT_CONFIG.MIN_WEIGHT_VALUE);
                            span.style.transition = '0ms';
                            span.style.fontVariationSettings = `"wght" ${weightValue}`;
                            

                        } else {
                            // Smooth transition back to normal weight when far from mouse
                            span.style.transition = `font-variation-settings ${SLANT_CONFIG.TRANSITION_DURATION}ms ease-out`;
                            span.style.fontVariationSettings = '"wght" 25';
                        }
                    });
                });
            }
        }
    }, SLANT_CONFIG.CONTENT_DELAY); // Small delay to ensure content is populated
}

// Utility function for mapping values
function map(value, x1, y1, x2, y2) {
    return (value - x1) * (y2 - x2) / (y1 - x1) + x2;
}

// Dynamic font sizing for description text to fill available container height
// Credits text now has fixed 0.5rem size
function adjustFontSize(pageHeader) {
    const textElements = document.querySelectorAll('.project-description');
    const creditsElements = document.querySelectorAll('.credits-text');
    const contentArea = document.querySelector('.project-content-area');
    
    if (textElements.length === 0 || !contentArea) {
        return;
    }
    
    // Get the image container to calculate available space
    const projectImagesSection = document.querySelector('.project-images-section');
    if (!projectImagesSection) {
        return;
    }
    
    // Calculate image container top position and set CSS custom property
    const imageContainerTop = projectImagesSection.getBoundingClientRect().top;
    const contentAreaTop = contentArea.getBoundingClientRect().top;
    
    // Set the CSS custom property for content container height
    document.documentElement.style.setProperty('--image-container-top', imageContainerTop + 'px');
    

    
    // Calculate total available height for both description and credits
    const totalAvailableHeight = imageContainerTop - contentAreaTop;
    
    // Subtract gap between description and credits and bottom padding
    const gap = 24; // 1.5rem = 24px
    const bottomPadding = 32; // 2rem = 32px (from CSS padding: 2rem)
    const contentAvailableHeight = totalAvailableHeight - gap - bottomPadding;
    
    // First, apply test font size to measure description content
    const testFontSize = 16;
    textElements.forEach(element => {
        element.style.fontSize = testFontSize + 'px';
    });
    
    // Count lines for description text only
    let descriptionLines = 0;
    
    textElements.forEach(element => {
        const lineHeight = parseFloat(getComputedStyle(element).lineHeight);
        const elementHeight = element.offsetHeight;
        descriptionLines += Math.ceil(elementHeight / lineHeight);
    });
    
    // Calculate available height for description (subtract credits height)
    // Credits text is fixed at 1rem, so calculate its height
    const creditsFontSize = 16; // 1rem = 16px
    const creditsLineHeight = creditsFontSize * 1.5; // line-height: 1.5
    const creditsHeight = creditsElements.length * creditsLineHeight;
    
    const descriptionAvailableHeight = contentAvailableHeight - creditsHeight;
    
    // Calculate optimal font size for description to fill available height
    const lineHeightRatio = 1.5; // From CSS line-height: 1.5
    const optimalFontSize = Math.floor(descriptionAvailableHeight / (descriptionLines * lineHeightRatio));
    
    // Apply the calculated font size to description only
    const finalFontSize = Math.max(8, Math.min(48, optimalFontSize));
    
    textElements.forEach(element => {
        element.style.fontSize = finalFontSize + 'px';
    });
    
    // Safety check: if content is still too tall, reduce font size until it fits
    let safetyAttempts = 0;
    let currentFontSize = finalFontSize;
    
    while (safetyAttempts < 10) {
        // Measure current content height
        let currentDescriptionHeight = 0;
        
        textElements.forEach(element => {
            currentDescriptionHeight += element.offsetHeight;
        });
        
        const totalCurrentHeight = currentDescriptionHeight + creditsHeight + gap;
        
        // Check if content fits
        if (totalCurrentHeight <= contentAvailableHeight) {
    
            break;
        }
        
        // Reduce font size and try again
        currentFontSize = Math.max(8, currentFontSize - 2);
        textElements.forEach(element => {
            element.style.fontSize = currentFontSize + 'px';
        });
        
        safetyAttempts++;
    }
    
    // Measure final result for logging
    let finalDescriptionHeight = 0;
    
    textElements.forEach(element => {
        finalDescriptionHeight += element.offsetHeight;
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initProjectPage);

// Project Images Container Scroll Behavior
function initProjectImagesScroll(projectImagesSection, flowerElement) {
    const viewportHeight = window.innerHeight;
    const projectImagesHeight = projectImagesSection.offsetHeight;
    
    // Calculate initial positioning for flower visibility
    let initialTop;
    
    if (flowerElement) {
        // Get the flower's actual rendered dimensions
        const flowerRect = flowerElement.getBoundingClientRect();
        const flowerHeight = flowerRect.height;
        
        // Get computed styles for margins
        const flowerStyles = getComputedStyle(flowerElement);
        const flowerTopMargin = parseFloat(flowerStyles.marginTop);
        const flowerBottomMargin = parseFloat(flowerStyles.marginBottom);
        
        // Get container padding (project-images-section has 16px top and bottom padding)
        const containerStyles = getComputedStyle(projectImagesSection);
        const containerTopPadding = parseFloat(containerStyles.paddingTop);
        const containerBottomPadding = parseFloat(containerStyles.paddingBottom);
        
        // Calculate total space the flower takes up including container padding
        const flowerTotalHeight = flowerHeight + flowerTopMargin + flowerBottomMargin;
        const containerPadding = containerTopPadding + containerBottomPadding;
        
        // Position container so flower appears at bottom center of viewport
        // This means: viewport bottom = flower bottom + flower bottom margin + container bottom padding
        initialTop = viewportHeight - flowerTotalHeight - containerBottomPadding;
    } else {
        // Fallback: position container so top edge is at bottom of viewport
        initialTop = viewportHeight;
    }
    
    // LERP variables for smooth movement
    let currentTop = initialTop;
    let targetTop = initialTop;
    const lerpFactor = ANIMATION_CONFIG.LERP_FACTOR; // More inertia - lower = gooier
    
    // Momentum variables for LSVP-style gooey feel
    let velocity = 0;
    let isScrolling = false;
    let lastScrollY = 0;
    let scrollTimeout;
    
    // Set initial position for flower visibility
    projectImagesSection.style.top = initialTop + 'px';
    
    // Viewport-based flower resizing function (more reliable than scroll-based)
    function updateFlowerSize() {
        if (!flowerElement) return;
        
        // Get the container's position relative to viewport
        const containerRect = projectImagesSection.getBoundingClientRect();
        const containerTop = containerRect.top;
        const viewportHeight = window.innerHeight;
        
        // Calculate how much of the container has moved past the top of viewport
        // When container is at bottom: containerTop = viewportHeight (flower = normal size)
        // When container is at top: containerTop = 0 (flower = minimum size)
        const progress = Math.max(0, Math.min(1, (viewportHeight - containerTop) / viewportHeight));
        
        // Calculate flower scale: 1 (normal) to 0.52 (minimum)
        const minScale = 0.52;
        const maxScale = 1;
        const currentScale = maxScale - (progress * (maxScale - minScale));
        
        // Calculate margins proportionally
        const minTopMargin = 0.5; // 0.5rem
        const maxTopMargin = 2; // 2rem
        const currentTopMargin = maxTopMargin - (progress * (maxTopMargin - minTopMargin));
        
        const minBottomMargin = 0.25; // 0.25rem
        const maxBottomMargin = 1.5; // 1.5rem
        const currentBottomMargin = maxBottomMargin - (progress * (maxBottomMargin - minBottomMargin));
        
        // Apply the transform and margins directly
        flowerElement.style.transform = `scale(${currentScale}) rotate(0deg)`;
        flowerElement.style.marginTop = `${currentTopMargin}rem`;
        flowerElement.style.marginBottom = `${currentBottomMargin}rem`;
        

    }
    
    // Initialize alternating spin direction for flower hover
    if (flowerElement && window.eventManager) {
        let spinDirection = 'clockwise'; // Start with clockwise
        
        window.eventManager.addListener(flowerElement, 'mouseenter', () => {
            // Toggle spin direction on each hover
            if (spinDirection === 'clockwise') {
                flowerElement.setAttribute('data-spin-direction', 'counter');
                spinDirection = 'counter';
            } else {
                flowerElement.removeAttribute('data-spin-direction');
                spinDirection = 'clockwise';
            }
        });
    }
    
    function updateProjectImagesPosition() {
        // Use multiple scroll detection methods for better compatibility
        const scrollY = window.pageYOffset || window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
        const scrollDelta = scrollY - lastScrollY;
        lastScrollY = scrollY;
        
        // Detect if user is actively scrolling
        isScrolling = true;
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            isScrolling = false;
        }, ANIMATION_CONFIG.SCROLL_STOP_DELAY); // Consider scrolling stopped after delay
        
        // Apply scroll multiplier to slow down overall movement (LSVP technique)
        const scrollMultiplier = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--scroll-multiplier')) || 0.25; // Use CSS variable or fallback
        const adjustedScrollY = scrollY * scrollMultiplier;
        
        // Calculate scroll progress based on images container height
        const maxScroll = projectImagesHeight;
        const scrollProgress = Math.min(adjustedScrollY / maxScroll, 1);
        
        // Update flower size based on scroll progress (bloomtype-style)
        updateFlowerSize();
        
        // Enhanced easing for more dramatic momentum building and deceleration
        let easedProgress;
        if (scrollProgress < 0.25) {
            // Start even slower (0-25% of scroll) - more dramatic slow start
            easedProgress = scrollProgress * scrollProgress * scrollProgress * 0.3;
        } else if (scrollProgress < ANIMATION_CONFIG.EASE_OUT_START) {
            // Build momentum (25-65% of scroll) - more aggressive acceleration
            easedProgress = 0.012 + (scrollProgress - 0.25) * 2.2;
        } else {
            // Ease out with very dramatic deceleration (65-100% of scroll)
            const finalProgress = (scrollProgress - ANIMATION_CONFIG.EASE_OUT_START) / 0.35;
            easedProgress = ANIMATION_CONFIG.EASE_OUT_OFFSET + (1 - Math.pow(1 - finalProgress, ANIMATION_CONFIG.EASE_OUT_POWER));
        }
        
        // Calculate new top position
        const startTop = initialTop; // Use calculated initial position for flower visibility
        const endTop = 0;
        targetTop = startTop + (endTop - startTop) * easedProgress;
        
        // Apply LERP for smooth movement
        currentTop += (targetTop - currentTop) * lerpFactor;
        
        // Apply momentum when scrolling
        if (isScrolling) {
            velocity += scrollDelta * ANIMATION_CONFIG.VELOCITY_MULTIPLIER; // Accumulate velocity from scroll
            currentTop += velocity; // Apply velocity to position
        }
        
        // Apply damping to velocity
        velocity *= parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--velocity-damping')) || 0.95;
        
        // Clamp position to prevent overshooting
        currentTop = Math.max(endTop, Math.min(startTop, currentTop));
        
        // Apply the calculated position
        projectImagesSection.style.top = currentTop + 'px';
        
        // Continue animation loop
        requestAnimationFrame(updateProjectImagesPosition);
    }
    
    // Start the animation loop
    updateProjectImagesPosition();
    
    // Register with ScrollManager instead of direct event listener
    if (window.scrollManager) {
        window.scrollManager.addScrollListener('project-images-scroll', updateProjectImagesPosition, 'high');
    }
}

// Image Popup Functionality
function initImagePopups() {

    
    const projectImages = document.querySelectorAll('.project-images-section .image img');

    
    const imagePopup = document.getElementById('image-popup');
    const popupImage = document.getElementById('popup-image');
    const popupFilename = document.getElementById('popup-filename');
    const popupClose = document.getElementById('popup-close');
    const popupNavLeft = document.getElementById('popup-nav-left');
    const popupNavRight = document.getElementById('popup-nav-right');
    

    
    if (!imagePopup || !popupImage) {
        console.error('Missing required popup elements');
        return;
    }
    
    let currentImageIndex = 0;
    
    // Add click event listeners to all project images
    projectImages.forEach((img, index) => {
        if (window.eventManager) {
            window.eventManager.addListener(img, 'click', () => {
                try {
                    currentImageIndex = index;
                    
                    // Set image source and filename
                    popupImage.src = img.src;
                    popupImage.alt = img.alt || '';
                    
                    // Get filename from title span
                    const titleSpan = img.closest('.image')?.querySelector('.title span');
                    const filename = titleSpan ? titleSpan.textContent : 'image.png';
                    popupFilename.textContent = filename;
                    
                    // Show popup
                    imagePopup.classList.add('active');
                    
                } catch (error) {
                    console.error('Error opening popup:', error);
                }
            });
        }
    });
    
    // Close popup
    if (popupClose && window.eventManager) {
        window.eventManager.addListener(popupClose, 'click', () => {
            imagePopup.classList.remove('active');
        });
    }
    
    // Navigation
    if (popupNavLeft && window.eventManager) {
        window.eventManager.addListener(popupNavLeft, 'click', () => {
            currentImageIndex = (currentImageIndex - 1 + projectImages.length) % projectImages.length;
            const img = projectImages[currentImageIndex];
            popupImage.src = img.src;
            popupImage.alt = img.alt || '';
            
            const titleSpan = img.closest('.image')?.querySelector('.title span');
            const filename = titleSpan ? titleSpan.textContent : 'image.png';
            popupFilename.textContent = filename;
        });
    }
    
    if (popupNavRight && window.eventManager) {
        window.eventManager.addListener(popupNavRight, 'click', () => {
            currentImageIndex = (currentImageIndex + 1) % projectImages.length;
            const img = projectImages[currentImageIndex];
            popupImage.src = img.src;
            popupImage.alt = img.alt || '';
            
            const titleSpan = img.closest('.image')?.querySelector('.title span');
            const filename = titleSpan ? titleSpan.textContent : 'image.png';
            popupFilename.textContent = filename;
        });
    }
    

}

// Handle window resize
if (window.eventManager) {
    window.eventManager.addListener(window, 'resize', () => {
        // Re-query DOM elements for resize
        const pageHeader = document.querySelector('.page-header');
        const projectImagesSection = document.querySelector('.project-images-section');
        const flowerElement = projectImagesSection?.querySelector('.flower-logo');
        
        adjustFontSize(pageHeader);
        initProjectImagesScroll(projectImagesSection, flowerElement);
    });
}
