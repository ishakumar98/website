# Project Page Template

This template provides a standardized structure for all project pages, ensuring consistency across your portfolio website.

## 🚀 Quick Start

1. **Copy the template**: `cp project-template.html your-project-name.html`
2. **Customize the content**: Follow the customization guide below
3. **Add your images**: Place images in the `project-images/` folder
4. **Test the page**: Open in your browser to verify everything works

## ✏️ Customization Guide

### 1. Page Title
```html
<title>YOUR_PROJECT_NAME - Project</title>
```

### 2. Project Header
```html
<a href="#" class="name-link active">
    <span>Y</span><span>O</span><span>U</span><span>R</span><span>_</span><span>P</span><span>R</span><span>O</span><span>J</span><span>E</span><span>C</span><span>T</span>
</a>
<span class="project-year">2024 - 2025</span>
```

### 3. Project Description
```html
<div class="project-text-block">
    <p class="project-description">
        Your first paragraph describing the project, your role, and goals.
    </p>
    <p class="project-description">
        Your second paragraph with more details, outcomes, and learnings.
    </p>
    <!-- Add more paragraphs as needed -->
</div>
```

### 4. Project Credits
```html
<div class="project-credits">
    <p class="credits-text">
        Many thanks to [Name 1], [Name 2], [Name 3] for their talent and time.
    </p>
</div>
```

### 5. Project Images
```html
<li class="image">
    <div class="wrapper-image">
        <img src="project-images/YOUR_IMAGE_FILENAME.png" alt="Descriptive alt text">
    </div>
    <div class="title">
        <span>YOUR_IMAGE_FILENAME.png</span>
    </div>
</li>
```

## 🖼️ Image Requirements

- **Format**: PNG, JPG, or GIF
- **Location**: Place in `project-images/` folder
- **Naming**: Use descriptive filenames (e.g., `user-interface-design.png`)
- **Alt Text**: Provide meaningful descriptions for accessibility

## 🎯 What's Included

### ✅ **Image Popup System**
- macOS-style popup with traffic light buttons
- Draggable navigation bar
- Resizable from all four corners
- Left/right arrow navigation between images
- Keyboard navigation (arrow keys)
- Dimension preservation when switching images

### ✅ **Responsive Layout**
- Clean, minimalist design
- Consistent typography and spacing
- Mobile-friendly structure
- Smooth animations and transitions

### ✅ **Navigation**
- Breadcrumb-style header with your name
- Link back to homepage
- Project year display
- Consistent with main site design

## 🔧 Technical Details

### **Files Used**
- `project-template.html` - Your starting point
- `styles.css` - Main site styles
- `project-page.css` - Project-specific styles
- `flower.gif` - Decorative element (bottom left)

### **CSS Classes**
- `.project-page-container` - Main wrapper
- `.project-content-area` - Text content section
- `.project-images-section` - Image gallery
- `.image-list` - Image grid container
- `.image` - Individual image item
- `.wrapper-image` - Image container
- `.title` - Image filename display

## 📝 Example Customization

Here's how the Calendar project was customized:

```html
<!-- Title -->
<title>Calendar - Project</title>

<!-- Header -->
<span>C</span><span>A</span><span>L</span><span>E</span><span>N</span><span>D</span><span>A</span><span>R</span>
<span class="project-year">2024 - 2025</span>

<!-- Description -->
<p class="project-description">
    I currently design for Slack's Productivity Team. Our goal is to expand the value of Slack beyond messaging...
</p>

<!-- Images -->
<img src="project-images/Detail View.png" alt="Detail View">
```

## 🚨 Important Notes

1. **Don't modify the JavaScript** - The image popup system is fully functional
2. **Keep the HTML structure** - Only change the content, not the structure
3. **Test image paths** - Ensure all image files exist in the correct folder
4. **Validate HTML** - Check that your customizations don't break the structure

## 🎉 Result

You'll have a professional project page that:
- Matches your portfolio's design language
- Provides an excellent user experience
- Showcases your work effectively
- Maintains consistency across all projects

## 📞 Need Help?

If you run into issues:
1. Check the browser console for errors
2. Verify all image paths are correct
3. Ensure HTML structure remains intact
4. Compare with the working Calendar project page

## Video Components

The template now supports MP4 video files alongside images. Videos will:

- **Autoplay and Loop**: Videos automatically play and loop in the container (muted)
- **Responsive Design**: Maintain 16:9 aspect ratio and fit the container properly
- **Click to Enlarge**: Clicking opens the video in a fullscreen popup
- **Vimeo Integration**: Optimized for Vimeo embeds with proper autoplay parameters
- **Seamless Integration**: Videos appear alongside images in the same container

### Adding a Video Component

1. Uncomment the sample video component in the template
2. Replace `YOUR_VIDEO_URL_HERE` with your Vimeo embed URL
3. Update the title and filename as needed
4. The video will automatically integrate with the existing popup system

### Video URL Format

For Vimeo videos, use the embed URL format:
```
https://player.vimeo.com/video/VIDEO_ID?h=HASH&autoplay=1&loop=1&autopause=0&muted=1&background=1
```
