// Project Content Manager Module
// Handles loading and populating project data from project-data.json
// Extracted from project-script.js for better organization

class ProjectContentManager {
    constructor() {
        this.projectData = null;
        this.currentProjectId = null;
        this.isInitialized = false;
        
        this.init();
    }
    
    init() {
        this.getProjectIdFromURL();
        this.loadProjectData();
    }
    
    // Get project ID from URL (e.g., calendar-project.html -> calendar)
    getProjectIdFromURL() {
        const path = window.location.pathname;
        const filename = path.split('/').pop();
        this.currentProjectId = filename.replace('-project.html', '');
    }
    
    // Load project data from JSON file
    async loadProjectData() {
        try {
            const response = await fetch('project-data.json');
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            this.projectData = data.projects[this.currentProjectId];
            
            if (!this.projectData) {
                // Fallback to hardcoded content for testing
                this.setFallbackData();
            }
            
            // Populate page content
            this.populateProjectContent();
            
        } catch (error) {
            // Fallback to hardcoded content for testing
            this.setFallbackData();
            this.populateProjectContent();
        }
    }
    
    // Set fallback data for testing when JSON fails
    setFallbackData() {
        this.projectData = {
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
                    "src": "images/calendar/Detail View.png",
                    "alt": "Detail View",
                    "title": "Detail View.png"
                },
                {
                    "src": "images/calendar/Scheduling.png",
                    "alt": "Scheduling",
                    "title": "Scheduling.png"
                },
                {
                    "src": "images/calendar/Special Events.png",
                    "alt": "Special Events",
                    "title": "Special Events.png"
                },
                {
                    "src": "images/calendar/Focus Mode.png",
                    "alt": "Focus Mode",
                    "title": "Focus Mode.png"
                },
                {
                    "src": "images/calendar/Out of Office.png",
                    "alt": "Out of Office",
                    "title": "Out of Office.png"
                },
                {
                    "src": "images/calendar/Create Event.png",
                    "alt": "Create Event",
                    "title": "Create Event.png"
                },
                {
                    "src": "images/calendar/Project Timelines.png",
                    "alt": "Project Timelines",
                    "title": "Project Timelines.png"
                },
                {
                    "src": "images/calendar/Project Timelines (1).png",
                    "alt": "Project Timelines 1",
                    "title": "Project Timelines (1).png"
                },
                {
                    "src": "images/calendar/Project Timelines (2).png",
                    "alt": "Project Timelines 2",
                    "title": "Project Timelines (2).png"
                },
                {
                    "src": "images/calendar/To Dos (Hover).png",
                    "alt": "To Dos Hover",
                    "title": "To Dos (Hover).png"
                },
                {
                    "src": "images/calendar/Scheduling Detection.png",
                    "alt": "Scheduling Detection",
                    "title": "Scheduling Detection.png"
                },
                {
                    "src": "images/calendar/Notifications.png",
                    "alt": "Notifications",
                    "title": "Notifications.png"
                },
                {
                    "src": "images/calendar/Meeting Unfurl.png",
                    "alt": "Meeting Unfurl",
                    "title": "Meeting Unfurl.png"
                },
                {
                    "src": "images/calendar/Day View.png",
                    "alt": "Day View",
                    "title": "Day View.png"
                },
                {
                    "src": "images/calendar/AI Scheduling.png",
                    "alt": "AI Scheduling",
                    "title": "AI Scheduling.png"
                }
            ]
        };
    }
    
    // Populate page with project data
    populateProjectContent() {
        if (!this.projectData) return;
        
        // Update page title
        document.title = `${this.projectData.title} - Project`;
        

        
        // Update project description
        this.populateProjectDescription();
        
        // Update credits
        this.populateProjectCredits();
        
        // Update project images
        this.populateProjectImages();
        
        // Mark as initialized
        this.isInitialized = true;
        
        // Notify other modules that content is ready
        this.notifyContentReady();
    }
    
    // Populate project description with ISHA slant system structure
    populateProjectDescription() {
        const projectTextBlock = document.querySelector('.project-text-block');
        if (!projectTextBlock) return;
        
        projectTextBlock.innerHTML = '';
        
        // Create just one paragraph element for the entire description
        const p = document.createElement('p');
        p.className = 'project-description';
        
        // Join all description items into one continuous text (in case there are multiple)
        const fullDescription = this.projectData.description.join(' ');
        p.textContent = fullDescription;
        
        projectTextBlock.appendChild(p);
        
        // Apply ISHA slant system structure after content is populated
        this.applyISHASlantStructure();
    }
    
    // Apply ISHA slant system structure to description text
    applyISHASlantStructure() {
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
    }
    
    // Populate project credits
    populateProjectCredits() {
        const creditsText = document.querySelector('.credits-text');
        if (creditsText) {
            creditsText.textContent = this.projectData.credits;
        }
    }
    
    // Populate project images
    populateProjectImages() {
        const imageList = document.querySelector('.image-list');
        if (!imageList) return;
        
        imageList.innerHTML = '';
        
        this.projectData.images.forEach(image => {
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
    
    // Notify other modules that content is ready
    notifyContentReady() {
        // Dispatch custom event for other modules to listen to
        const event = new CustomEvent('projectContentReady', {
            detail: {
                projectData: this.projectData,
                projectId: this.currentProjectId
            }
        });
        document.dispatchEvent(event);
    }
    
    // Get project data
    getProjectData() {
        return this.projectData;
    }
    
    // Get current project ID
    getCurrentProjectId() {
        return this.currentProjectId;
    }
    
    // Check if initialized
    isReady() {
        return this.isInitialized;
    }
    
    // Refresh content (useful for resize events)
    refresh() {
        if (this.isInitialized) {
            this.populateProjectContent();
        }
    }
}

// Export for module system
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProjectContentManager;
} else if (typeof window !== 'undefined') {
    window.ProjectContentManager = ProjectContentManager;
}
