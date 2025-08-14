# GO:OD Website Replica

This is a clean, minimalist design with portfolio-style folder navigation.

## Features

- **Exact Visual Match**: Replicates the original GO:OD website design
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Interactive Elements**: Hover effects and smooth animations
- **Modern Typography**: Uses Inter font family for clean, professional look
- **SVG Icons**: Uses the original folder SVG icons with proper styling

## File Structure

```
website-project/
├── index.html          # Main HTML file
├── styles.css          # CSS styling
├── script.js           # JavaScript interactions
├── header.svg          # Original GO:OD logo SVG
├── folder.svg          # Original folder icon SVG
└── README.md           # This file
```

## How to Run

1. **Open the website**: Simply open `index.html` in your web browser
2. **Local server** (recommended): Use a local server for best experience
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js (if you have http-server installed)
   npx http-server
   
   # Using PHP
   php -S localhost:8000
   ```

## Design Elements

- **Logo**: "GO:OD" with colon represented as two dots
- **Description**: About Good Times design practice
- **Action Links**: "View" and "Get Info" buttons
- **Folder Grid**: 5 folders (4 active yellow, 1 inactive gray)
- **Footer**: URL display at bottom

## Customization

You can easily customize:
- Colors in `styles.css`
- Content in `index.html`
- Interactions in `script.js`
- Folder icons by replacing `folder.svg`

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Credits

Original design inspiration from various portfolio websites 