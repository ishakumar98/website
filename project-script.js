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
            TRANSITION_DURATION: 400,    // Smooth transition back to normal (ms)
            CONTENT_DELAY: 100           // Delay for content population (ms)
        };

// Dynamic Font Sizing
const FONT_CONFIG = {
    INITIAL_SIZE: 100,           // Starting font size (px)
    MIN_SIZE: 8,                 // Minimum font size (px)
    TOTAL_MARGINS: 80,           // Combined top + bottom margins (px)
    LINE_HEIGHT_MIN: 0.3,        // Minimum line height multiplier
    LINE_HEIGHT_RATIO: 0.01      // Font size to line height ratio
};

// Animation & Scroll Behavior
const ANIMATION_CONFIG = {
    LERP_FACTOR: 0.05,           // Smooth movement factor (lower = gooier)
    SCROLL_STOP_DELAY: 100,      // Consider scrolling stopped after (ms)
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
    
    // Initialize ISHA slant system
    initISHASlantSystem();
    
    // Initialize dynamic font sizing
    adjustFontSize();
    
    // Initialize project images scroll behavior
    initProjectImagesScroll();
    
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

            
            document.addEventListener("mousemove", function(e) {
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
    }, SLANT_CONFIG.CONTENT_DELAY); // Small delay to ensure content is populated
}

// Utility function for mapping values
function map(value, x1, y1, x2, y2) {
    return (value - x1) * (y2 - x2) / (y1 - x1) + x2;
}

// Dynamic font sizing function
function adjustFontSize() {
    const textElements = document.querySelectorAll('.project-description');
    if (textElements.length === 0) {
        return;
    }
    
    const viewportHeight = window.innerHeight;
    const headerHeight = document.querySelector('.page-header')?.offsetHeight || 0;
    const creditsSection = document.querySelector('.project-credits')?.offsetHeight || 0;
    const margins = FONT_CONFIG.TOTAL_MARGINS; // Combined top + bottom margins
    
    // Calculate available height for text content only
    const availableHeight = viewportHeight - headerHeight - creditsSection - margins - 100; // Extra buffer for spacing
    
    // Start with a large font size and reduce until it fits
    let fontSize = FONT_CONFIG.INITIAL_SIZE;
    
    // Apply font size to all paragraphs
    textElements.forEach(element => {
        element.style.fontSize = fontSize + 'px';
    });
    
    // Check if the entire text block fits
    const textBlock = document.querySelector('.project-text-block');
    if (textBlock) {
        // Reduce font size until content fits
        while (textBlock.scrollHeight > availableHeight && fontSize > FONT_CONFIG.MIN_SIZE) {
            fontSize -= 1;
            textElements.forEach(element => {
                element.style.fontSize = fontSize + 'px';
            });
        }
        
        // Final check to ensure content fits
        if (textBlock.scrollHeight > availableHeight) {
            fontSize = Math.floor(availableHeight / textBlock.scrollHeight * fontSize);
            textElements.forEach(element => {
                element.style.fontSize = fontSize + 'px';
            });
        }
    }
    
    // Also adjust empty line height proportionally to font size
    const emptyLines = document.querySelectorAll('.empty-line-break');
    const lineHeight = Math.max(FONT_CONFIG.LINE_HEIGHT_MIN, fontSize * FONT_CONFIG.LINE_HEIGHT_RATIO);
    emptyLines.forEach(line => {
        line.style.height = lineHeight + 'em';
    });
    
    console.log('Font size adjusted to:', fontSize, 'px');
    console.log('Available height:', availableHeight, 'px');
    console.log('Text block height:', textBlock?.scrollHeight, 'px');
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initProjectPage);

// Project Images Container Scroll Behavior
function initProjectImagesScroll() {
    const projectImagesSection = document.querySelector('.project-images-section');
    const viewportHeight = window.innerHeight;
    const projectImagesHeight = projectImagesSection.offsetHeight;
    
    // Calculate initial positioning for flower visibility
    const flowerElement = projectImagesSection.querySelector('.flower-logo');
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
    
    function updateProjectImagesPosition() {
        const scrollY = window.pageYOffset;
        const scrollDelta = scrollY - lastScrollY;
        lastScrollY = scrollY;
        
        // Detect if user is actively scrolling
        isScrolling = true;
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            isScrolling = false;
        }, ANIMATION_CONFIG.SCROLL_STOP_DELAY); // Consider scrolling stopped after delay
        
        // Apply scroll multiplier to slow down overall movement (LSVP technique)
        const scrollMultiplier = 0.25; // Even slower for more gooey feel (was 0.4)
        const adjustedScrollY = scrollY * scrollMultiplier;
        
        // Calculate scroll progress based on images container height
        const maxScroll = projectImagesHeight;
        const scrollProgress = Math.min(adjustedScrollY / maxScroll, 1);
        
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
        velocity *= 0.95;
        
        // Clamp position to prevent overshooting
        currentTop = Math.max(endTop, Math.min(startTop, currentTop));
        
        // Apply the calculated position
        projectImagesSection.style.top = currentTop + 'px';
        
        // Continue animation loop
        requestAnimationFrame(updateProjectImagesPosition);
    }
    
    // Start the animation loop
    updateProjectImagesPosition();
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

        
        img.addEventListener('click', () => {

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
    });
    
    // Close popup
    if (popupClose) {
        popupClose.addEventListener('click', () => {

            imagePopup.classList.remove('active');
        });
    }
    
    // Navigation
    if (popupNavLeft) {
        popupNavLeft.addEventListener('click', () => {
            currentImageIndex = (currentImageIndex - 1 + projectImages.length) % projectImages.length;
            const img = projectImages[currentImageIndex];
            popupImage.src = img.src;
            popupImage.alt = img.alt || '';
            
            const titleSpan = img.closest('.image')?.querySelector('.title span');
            const filename = titleSpan ? titleSpan.textContent : 'image.png';
            popupFilename.textContent = filename;
        });
    }
    
    if (popupNavRight) {
        popupNavRight.addEventListener('click', () => {
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
window.addEventListener('resize', () => {
    adjustFontSize();
    initProjectImagesScroll();
});
