# Project Template System - README

## Overview
This template system makes it easy to create new project pages without duplicating code. All project-specific content is stored in `project-data.json`, and the page structure is generated dynamically.

## How It Works

### 1. Project Data Structure (`project-data.json`)
Each project is defined with:
- **title**: Project name (e.g., "Calendar")
- **year**: Project timeline (e.g., "2024 - 2025")
- **description**: Array of paragraphs describing the project
- **credits**: Acknowledgments text
- **images**: Array of image objects with src, alt, and title

### 2. Shared Scripts (`project-script.js`)
- **ISHA slant effect**: Individual letter slanting based on mouse position
- **Dynamic font sizing**: Automatically adjusts text to fit viewport
- **Project data loading**: Populates page content from JSON
- **Word wrapping**: Prevents words from breaking across lines

### 3. Template Structure (`project-template.html`)
- Clean HTML structure with placeholder text
- All functionality handled by shared scripts
- Easy to customize for new projects

## Creating a New Project

### Step 1: Add Project Data
Add a new project to `project-data.json`:

```json
{
  "projects": {
    "your-project": {
      "title": "Your Project Name",
      "year": "2024 - 2025",
      "description": [
        "First paragraph describing your project...",
        "Second paragraph with more details..."
      ],
      "credits": "Thanks to team members...",
      "images": [
        {
          "src": "project-images/your-image.png",
          "alt": "Description of image",
          "title": "your-image.png"
        }
      ]
    }
  }
}
```

### Step 2: Create Project Page
Copy `project-template.html` and rename it to `your-project-project.html`

### Step 3: Update Links
Update the link in `index.html` to point to your new project page.

## Benefits of This System

✅ **No Code Duplication**: All functionality is shared  
✅ **Easy to Maintain**: Update one file affects all projects  
✅ **Consistent Design**: All projects use the same styling  
✅ **Quick Setup**: New projects in minutes, not hours  
✅ **Scalable**: Add unlimited projects without complexity  

## File Structure
```
website-project/
├── project-data.json          # All project content
├── project-script.js          # Shared functionality
├── project-template.html      # Base template
├── project-page.css           # Project page styles
├── calendar-project.html      # Example implementation
└── PROJECT_TEMPLATE_README.md # This file
```

## Customization

### Adding New Features
- Modify `project-script.js` to add new functionality
- All projects automatically get the new features

### Styling Changes
- Update `project-page.css` for design changes
- Changes apply to all project pages

### Content Updates
- Edit `project-data.json` to update project content
- No HTML changes needed

## Troubleshooting

### Page Not Loading
- Check that `project-script.js` is included
- Verify project ID in `project-data.json` matches filename

### ISHA Effect Not Working
- Ensure `TT Norms Pro` font is loaded
- Check browser console for JavaScript errors

### Images Not Showing
- Verify image paths in `project-data.json`
- Check that images exist in `project-images/` folder

## Example: Calendar Project
The calendar project demonstrates the full system:
- **ID**: `calendar`
- **Filename**: `calendar-project.html`
- **Data**: Defined in `project-data.json` under `projects.calendar`

## Next Steps
1. Test the new template system with `calendar-project.html`
2. Create your next project using the template
3. Customize the system as needed for your workflow
