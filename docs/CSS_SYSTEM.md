# CSS System Documentation

## Overview

The CSS System is a comprehensive, modular architecture built on design system principles. It provides consistent spacing, colors, typography, and component patterns while maintaining maintainability and scalability.

## Architecture

```
css/
├── variables.css      # Design system variables
├── utilities.css      # Utility classes
├── typography.css     # Font families and text styles
├── layout.css         # Grid systems and positioning
├── components.css     # Reusable component styles
├── main.css          # Main entry point
├── project-page.css  # Project page specific styles
└── styles.css        # Legacy styles (being phased out)
```

## Design System Foundation

### 1. **Color System**
```css
:root {
    /* Primary Colors */
    --color-primary: #EC4899;           /* Pink */
    --color-primary-light: #F472B6;     /* Light Pink */
    --color-primary-dark: #BE185D;      /* Dark Pink */
    
    /* Neutral Colors */
    --color-white: #FFFFFF;
    --color-black: #000000;
    --color-gray-50: #F9FAFB;
    --color-gray-100: #F3F4F6;
    --color-gray-200: #E5E7EB;
    --color-gray-300: #D1D5DB;
    --color-gray-400: #9CA3AF;
    --color-gray-500: #6B7280;
    --color-gray-600: #4B5563;
    --color-gray-700: #374151;
    --color-gray-800: #1F2937;
    --color-gray-900: #111827;
    
    /* Semantic Colors */
    --color-success: #10B981;
    --color-warning: #F59E0B;
    --color-error: #EF4444;
    --color-info: #3B82F6;
}
```

### 2. **Spacing System**
```css
:root {
    /* Base Spacing Units */
    --space-xs: 0.25rem;    /* 4px */
    --space-sm: 0.5rem;     /* 8px */
    --space-md: 1rem;       /* 16px */
    --space-lg: 1.5rem;     /* 24px */
    --space-xl: 2rem;       /* 32px */
    --space-2xl: 3rem;      /* 48px */
    --space-3xl: 4rem;      /* 64px */
    
    /* Container Spacing */
    --container-padding: var(--space-xl);    /* 2rem */
    --section-spacing: var(--space-2xl);     /* 3rem */
    --element-spacing: var(--space-lg);      /* 1.5rem */
    --component-spacing: var(--space-md);    /* 1rem */
}
```

### 3. **Typography System**
```css
:root {
    /* Font Families */
    --font-primary: 'Tumla', -apple-system, BlinkMacSystemFont, sans-serif;
    --font-secondary: 'Akke', Georgia, serif;
    --font-mono: 'SF Mono', Monaco, 'Cascadia Code', monospace;
    
    /* Font Sizes */
    --text-xs: 0.75rem;     /* 12px */
    --text-sm: 0.875rem;    /* 14px */
    --text-base: 1rem;      /* 16px */
    --text-lg: 1.125rem;    /* 18px */
    --text-xl: 1.25rem;     /* 20px */
    --text-2xl: 1.5rem;     /* 24px */
    --text-3xl: 1.875rem;   /* 30px */
    --text-4xl: 2.25rem;    /* 36px */
    --text-5xl: 3rem;       /* 48px */
    
    /* Line Heights */
    --leading-tight: 1.25;
    --leading-normal: 1.5;
    --leading-relaxed: 1.75;
    --leading-loose: 2;
}
```

### 4. **Shadow System**
```css
:root {
    /* Shadow Presets */
    --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
    
    /* Custom Shadows */
    --work-shadow: 0 4px 20px rgba(236, 72, 153, 0.15);  /* Pink shadow */
    --image-shadow: 0 8px 32px rgba(236, 72, 153, 0.2);  /* Pink shadow */
    --hover-shadow: 0 12px 40px rgba(236, 72, 153, 0.25); /* Pink shadow */
}
```

### 5. **Animation System**
```css
:root {
    /* Animation Timing */
    --animation-fast: 150ms;
    --animation-medium: 300ms;
    --animation-slow: 500ms;
    --animation-slower: 800ms;
    
    /* Easing Functions */
    --ease-out-cubic: cubic-bezier(0.33, 1, 0.68, 1);
    --ease-out-quart: cubic-bezier(0.25, 1, 0.5, 1);
    --ease-out-quint: cubic-bezier(0.23, 1, 0.32, 1);
    
    /* Transition Presets */
    --transition-fast: all var(--animation-fast) var(--ease-out-cubic);
    --transition-smooth: all var(--animation-medium) var(--ease-out-cubic);
    --transition-slow: all var(--animation-slow) var(--ease-out-cubic);
    
    /* Animation Factors */
    --scroll-multiplier: 0.25;
    --lerp-factor: 0.05;
    --velocity-damping: 0.95;
}
```

## Modular CSS Architecture

### 1. **Variables Layer** (`css/variables.css`)
**Purpose**: Central source of truth for all design tokens.

**Key Principles**:
- **Single Source**: All values defined once
- **Semantic Naming**: Clear, descriptive variable names
- **Scalable Units**: Use rem for responsive design
- **Logical Grouping**: Colors, spacing, typography grouped logically

**Usage**:
```css
/* ✅ Correct - Use variables */
.button {
    background-color: var(--color-primary);
    padding: var(--space-md);
    font-size: var(--text-base);
}

/* ❌ Incorrect - Hardcoded values */
.button {
    background-color: #EC4899;
    padding: 16px;
    font-size: 16px;
}
```

### 2. **Utilities Layer** (`css/utilities.css`)
**Purpose**: Reusable utility classes for common patterns.

**Categories**:
- **Display**: `.block`, `.inline`, `.flex`, `.grid`
- **Spacing**: `.p-0`, `.px-4`, `.my-8`, `.gap-4`
- **Typography**: `.text-center`, `.font-bold`, `.leading-tight`
- **Layout**: `.container`, `.w-full`, `.h-screen`

**Usage**:
```css
/* ✅ Correct - Use utility classes */
.card {
    @apply p-6 bg-white rounded-lg shadow-md;
}

/* ❌ Incorrect - Custom CSS for common patterns */
.card {
    padding: 1.5rem;
    background-color: white;
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
```

### 3. **Typography Layer** (`css/typography.css`)
**Purpose**: Font declarations and text styling patterns.

**Key Features**:
- **Font Face Declarations**: Custom font loading
- **Base Typography**: Body, headings, paragraphs
- **Text Utilities**: Alignment, weight, decoration
- **Responsive Text**: Size adjustments for different screens

**Usage**:
```css
/* ✅ Correct - Use typography classes */
.heading {
    @apply text-3xl font-bold leading-tight;
}

/* ❌ Incorrect - Custom typography */
.heading {
    font-size: 1.875rem;
    font-weight: 700;
    line-height: 1.25;
}
```

### 4. **Layout Layer** (`css/layout.css`)
**Purpose**: Grid systems, containers, and positioning.

**Key Features**:
- **Grid System**: Responsive column layouts
- **Container Classes**: Consistent spacing and max-widths
- **Positioning**: Flexbox and grid utilities
- **Responsive Breakpoints**: Mobile-first approach

**Usage**:
```css
/* ✅ Correct - Use layout classes */
.content {
    @apply container mx-auto px-8;
}

/* ❌ Incorrect - Custom layout */
.content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
}
```

### 5. **Components Layer** (`css/components.css`)
**Purpose**: Reusable component styles and patterns.

**Key Features**:
- **Button Styles**: Primary, secondary, outline variants
- **Card Components**: Consistent card layouts
- **Form Elements**: Input, select, textarea styling
- **Navigation**: Nav, menu, dropdown styles

**Usage**:
```css
/* ✅ Correct - Use component classes */
.btn-primary {
    @apply bg-primary text-white px-6 py-3 rounded-lg;
}

/* ❌ Incorrect - Custom button styles */
.btn-primary {
    background-color: #EC4899;
    color: white;
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
}
```

## Specificity Management

### 1. **Specificity Hierarchy**
```css
/* 1. Variables (Lowest specificity) */
:root { --color-primary: #EC4899; }

/* 2. Base styles (Low specificity) */
body { font-family: var(--font-primary); }

/* 3. Component styles (Medium specificity) */
.button { background: var(--color-primary); }

/* 4. Utility classes (High specificity) */
.bg-primary { background: var(--color-primary) !important; }

/* 5. State modifiers (Highest specificity) */
.button:hover { background: var(--color-primary-dark); }
```

### 2. **Avoiding Specificity Conflicts**
```css
/* ✅ Correct - Use BEM methodology */
.card { /* Base styles */ }
.card__title { /* Element styles */ }
.card--featured { /* Modifier styles */ }

/* ❌ Incorrect - High specificity selectors */
body div.container .card .title { /* Too specific */ }
```

### 3. **CSS Custom Properties for Dynamic Values**
```css
/* ✅ Correct - Use CSS variables for dynamic values */
.project-content-area {
    height: calc(100vh - var(--image-container-top));
}

/* ❌ Incorrect - Hardcoded calculations */
.project-content-area {
    height: calc(100vh - 566px);
}
```

## Responsive Design System

### 1. **Breakpoint System**
```css
:root {
    --breakpoint-sm: 640px;
    --breakpoint-md: 768px;
    --breakpoint-lg: 1024px;
    --breakpoint-xl: 1280px;
    --breakpoint-2xl: 1536px;
}
```

### 2. **Mobile-First Approach**
```css
/* ✅ Correct - Mobile-first responsive design */
.container {
    padding: var(--space-md);
}

@media (min-width: 768px) {
    .container {
        padding: var(--space-xl);
    }
}

/* ❌ Incorrect - Desktop-first approach */
.container {
    padding: var(--space-xl);
}

@media (max-width: 767px) {
    .container {
        padding: var(--space-md);
    }
}
```

### 3. **Responsive Utilities**
```css
/* Responsive spacing */
.p-responsive {
    padding: var(--space-md);
}

@media (min-width: 768px) {
    .p-responsive {
        padding: var(--space-xl);
    }
}

@media (min-width: 1024px) {
    .p-responsive {
        padding: var(--space-2xl);
    }
}
```

## Animation and Transition System

### 1. **CSS Animations**
```css
/* ✅ Correct - Use animation system variables */
.flower-logo {
    transition: transform var(--transition-smooth);
}

/* ❌ Incorrect - Hardcoded timing */
.flower-logo {
    transition: transform 0.3s ease-out;
}
```

### 2. **Keyframe Animations**
```css
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(var(--space-lg));
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.fade-in {
    animation: fadeIn var(--animation-medium) var(--ease-out-cubic);
}
```

### 3. **Performance Optimizations**
```css
/* ✅ Correct - Use will-change for performance */
.animated-element {
    will-change: transform, opacity;
    transform: translateZ(0); /* Force hardware acceleration */
}

/* ❌ Incorrect - No performance considerations */
.animated-element {
    /* No performance optimizations */
}
```

## Project Page Specific Styles

### 1. **Layout Structure**
```css
.project-page-container {
    height: 100vh;
    overflow: hidden;
}

.project-content-area {
    height: calc(100vh - var(--image-container-top));
    padding: var(--container-padding);
}
```

### 2. **Image Container**
```css
.project-images-section {
    position: fixed;
    top: var(--initial-top);
    left: 0;
    right: 0;
    z-index: var(--z-image-container);
}
```

### 3. **Flower Logo**
```css
.flower-logo {
    position: absolute;
    top: var(--space-lg);
    left: 50%;
    transform: translateX(-50%);
    z-index: var(--z-flower);
}
```

## Best Practices

### 1. **Variable Usage**
```css
/* ✅ Always use variables for values */
.element {
    margin: var(--space-md);
    color: var(--color-primary);
    font-size: var(--text-base);
}

/* ❌ Never hardcode values */
.element {
    margin: 16px;
    color: #EC4899;
    font-size: 16px;
}
```

### 2. **Class Naming**
```css
/* ✅ Use semantic, descriptive names */
.project-description { }
.credits-text { }
.image-popup { }

/* ❌ Avoid generic names */
.text { }
.content { }
.box { }
```

### 3. **Responsive Design**
```css
/* ✅ Use mobile-first approach */
.component {
    /* Mobile styles */
}

@media (min-width: 768px) {
    .component {
        /* Tablet and up styles */
    }
}

/* ❌ Avoid desktop-first */
.component {
    /* Desktop styles */
}

@media (max-width: 767px) {
    .component {
        /* Mobile styles */
    }
}
```

### 4. **Performance**
```css
/* ✅ Use efficient selectors */
.card { }
.card__title { }

/* ❌ Avoid inefficient selectors */
body div.container .card .title { }
```

## Migration Guide

### 1. **From Hardcoded to Variables**
```css
/* Before */
.element {
    color: #EC4899;
    padding: 16px;
    font-size: 18px;
}

/* After */
.element {
    color: var(--color-primary);
    padding: var(--space-md);
    font-size: var(--text-lg);
}
```

### 2. **From Custom CSS to Utilities**
```css
/* Before */
.custom-button {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 12px 24px;
    background: #EC4899;
    color: white;
    border-radius: 8px;
}

/* After */
.custom-button {
    @apply flex items-center justify-center px-6 py-3 bg-primary text-white rounded-lg;
}
```

### 3. **From Monolithic to Modular**
```css
/* Before - All styles in one file */
/* styles.css - 1000+ lines */

/* After - Organized modules */
/* variables.css, utilities.css, components.css, etc. */
```

## Troubleshooting

### 1. **Common Issues**

**Variables Not Working**:
```css
/* Check if variables.css is imported */
@import 'variables.css';

/* Verify variable names */
:root {
    --color-primary: #EC4899;
}
```

**Specificity Conflicts**:
```css
/* Use more specific selectors */
.card.card--featured { }

/* Or use !important sparingly */
.utility-class { color: var(--color-primary) !important; }
```

**Responsive Issues**:
```css
/* Ensure mobile-first approach */
.component { /* Mobile styles */ }

@media (min-width: 768px) {
    .component { /* Desktop styles */ }
}
```

### 2. **Debugging Tools**
```css
/* Add debug borders */
.debug * {
    outline: 1px solid red;
}

/* Check CSS variable values */
.element::before {
    content: var(--color-primary);
}
```

## Future Enhancements

### 1. **Planned Improvements**
- **CSS-in-JS Integration**: Dynamic styling based on state
- **Design Token System**: External design token management
- **Component Library**: Reusable component documentation
- **Performance Monitoring**: CSS performance metrics

### 2. **Scalability Features**
- **Theme System**: Multiple theme support
- **Dark Mode**: Automatic dark/light mode switching
- **Internationalization**: RTL language support
- **Accessibility**: High contrast and focus management

## Conclusion

The CSS System provides a solid foundation for scalable, maintainable styling. By following the established patterns and best practices, developers can easily extend and modify the system while maintaining code quality and performance.

For questions or contributions, refer to the main project documentation or create issues in the project repository.
