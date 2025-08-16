# CSS Design System Documentation

## Overview
This document outlines the comprehensive CSS design system implemented across the website. The system uses CSS Custom Properties (variables) to ensure consistency, maintainability, and scalability.

## Table of Contents
1. [Color System](#color-system)
2. [Spacing System](#spacing-system)
3. [Typography System](#typography-system)
4. [Shadow System](#shadow-system)
5. [Z-Index Scale](#z-index-scale)
6. [Component Patterns](#component-patterns)
7. [Usage Guidelines](#usage-guidelines)
8. [File Organization](#file-organization)

## Color System

### Primary Colors
```css
--color-primary: #FF7DCB;           /* Main brand color */
--color-primary-light: #FFBBC1;     /* Lighter variant */
--color-primary-lighter: #FFCCF1;   /* Lightest variant */
--color-primary-dark: #EA2CFF;      /* Darker variant */
```

### Background Colors
```css
--color-background: #FFF5F8;        /* Main background */
--color-background-light: #FCDFE3;  /* Light background */
--color-background-lighter: #FCE8FF; /* Lightest background */
```

### Text Colors
```css
--color-text: #000000;              /* Primary text */
--color-text-muted: #666666;        /* Secondary text */
--color-text-light: #9e9e9e;        /* Tertiary text */
--color-text-white: #ffffff;        /* White text */
```

### Border Colors
```css
--color-border: #e9ecef;            /* Primary borders */
--color-border-light: #d1d1d1;      /* Light borders */
```

### Accent Colors
```css
--color-accent: #3b4eff;            /* Accent color */
--color-accent-light: #f8f9fa;      /* Light accent */
--color-accent-muted: #6c757d;      /* Muted accent */
```

## Spacing System

### Base Spacing Units
```css
--space-xs: 0.25rem;    /* 4px */
--space-sm: 0.5rem;     /* 8px */
--space-md: 1rem;       /* 16px */
--space-lg: 1.5rem;     /* 24px */
--space-xl: 2rem;       /* 32px */
--space-2xl: 3rem;      /* 48px */
--space-3xl: 4rem;      /* 64px */
```

### Component-Specific Spacing
```css
--container-padding: var(--space-md);
--section-padding: var(--space-xl);
--item-gap: var(--space-md);
--work-item-gap: var(--space-md);
--header-padding: var(--space-3xl);
```

### Project Page Specific
```css
--flower-height: 6em;
--flower-margin-top: 2rem;
--flower-margin-bottom: 1.5rem;
--container-padding-top: 16px;
--container-padding-bottom: 16px;
--image-container-height: 168px;
```

## Typography System

### Font Sizes
```css
--font-size-xs: 0.75rem;    /* 12px */
--font-size-sm: 0.875rem;   /* 14px */
--font-size-base: 1rem;     /* 16px */
--font-size-lg: 1.125rem;   /* 18px */
--font-size-xl: 1.25rem;    /* 20px */
--font-size-2xl: 1.5rem;    /* 24px */
```

### Font Families
- **Primary**: 'Tumla' (custom font family)
- **Fallback**: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif

### Line Heights
- **Default**: 1.6
- **Compact**: 1.2
- **Tight**: 1.1

## Shadow System

### Shadow Variants
```css
--shadow-subtle: 0 4px 12px rgba(0, 0, 0, 0.1);
--shadow-medium: 0 0 25px 35px rgba(255, 125, 203, 0.15);
--shadow-strong: 0 20px 60px rgba(0, 0, 0, 0.3);
--shadow-lightbox: 0 20px 40px rgba(0, 0, 0, 0.3);
```

### Special Shadows
```css
--popup-shadow: 0 0 0.5rem rgba(0,0,0,0.2);
```

## Z-Index Scale

### Layered System
```css
--z-dropdown: 1000;
--z-sticky: 1020;
--z-fixed: 1030;
--z-modal-backdrop: 1040;
--z-modal: 1050;
--z-popover: 1060;
--z-tooltip: 1070;
```

### Special Z-Indices
```css
--popup-z-index: 10000;
--lightbox-z-index: 10000;
```

## Component Patterns

### Container Pattern
```css
.container,
.header .container {
    max-width: none;
    margin: 0 auto;
}

.container {
    padding: var(--space-md) 0 0 0;
}

.header .container {
    padding: 0;
}
```

### Responsive Breakpoints
```css
/* Mobile First Approach */
@media (max-width: 480px) {
    /* Small mobile devices */
}

@media (max-width: 768px) {
    /* Tablets and small laptops */
}

@media (max-width: 1024px) {
    /* Laptops and desktops */
}
```

### Button Pattern
```css
.button {
    padding: var(--space-sm) var(--space-md);
    border-radius: var(--space-sm);
    font-size: var(--font-size-sm);
    transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
```

### Card Pattern
```css
.card {
    padding: var(--space-lg);
    border-radius: var(--space-sm);
    box-shadow: var(--shadow-subtle);
    background-color: var(--color-background);
}
```

## Usage Guidelines

### 1. Always Use Design System Variables
❌ **Don't do this:**
```css
.button {
    padding: 16px;
    margin: 24px;
    color: #000000;
}
```

✅ **Do this instead:**
```css
.button {
    padding: var(--space-md);
    margin: var(--space-lg);
    color: var(--color-text);
}
```

### 2. Maintain Consistent Spacing
- Use `--space-xs` for minimal spacing (4px)
- Use `--space-sm` for small spacing (8px)
- Use `--space-md` for standard spacing (16px)
- Use `--space-lg` for larger spacing (24px)
- Use `--space-xl` for section spacing (32px)
- Use `--space-2xl` for major section spacing (48px)
- Use `--space-3xl` for page-level spacing (64px)

### 3. Color Usage
- **Primary text**: `var(--color-text)`
- **Secondary text**: `var(--color-text-muted)`
- **Backgrounds**: `var(--color-background)` variants
- **Borders**: `var(--color-border)` variants
- **Accents**: `var(--color-accent)` variants

### 4. Typography Scale
- **Small text**: `var(--font-size-xs)` or `var(--font-size-sm)`
- **Body text**: `var(--font-size-base)`
- **Large text**: `var(--font-size-lg)` or `var(--font-size-xl)`
- **Headings**: `var(--font-size-2xl)` or larger

### 5. Shadow Usage
- **Subtle depth**: `var(--shadow-subtle)`
- **Medium depth**: `var(--shadow-medium)`
- **Strong depth**: `var(--shadow-strong)`
- **Special effects**: `var(--shadow-lightbox)`

## File Organization

### Main CSS Files
- **`styles.css`** - Global styles, layout, and home page specific styles
- **`project-page.css`** - Project page specific styles and components

### JavaScript Files
- **`script.js`** - Home page functionality
- **`project-script.js`** - Project page functionality
- **`fireworks.js`** - Fireworks animation
- **`scroll-behavior.js`** - Scroll behavior management

### HTML Files
- **`index.html`** - Home page
- **`calendar-project.html`** - Calendar project page
- **`project-template.html`** - Template for new project pages

## Best Practices

### 1. Maintainability
- Always use design system variables instead of hardcoded values
- Group related CSS rules together
- Use consistent naming conventions
- Add comments for complex rules

### 2. Performance
- Minimize CSS specificity conflicts
- Use efficient selectors
- Avoid unnecessary nesting
- Leverage CSS custom properties for dynamic values

### 3. Accessibility
- Maintain sufficient color contrast
- Use semantic HTML elements
- Ensure keyboard navigation support
- Provide focus indicators

### 4. Responsiveness
- Use mobile-first approach
- Test across different screen sizes
- Use relative units (rem, em) when possible
- Leverage CSS Grid and Flexbox for layouts

## Migration Guide

### Converting Existing Code
1. **Replace hardcoded colors** with `var(--color-*)` variables
2. **Replace hardcoded spacing** with `var(--space-*)` variables
3. **Replace hardcoded font sizes** with `var(--font-size-*)` variables
4. **Replace hardcoded shadows** with `var(--shadow-*)` variables
5. **Update z-index values** to use the defined scale

### Example Migration
```css
/* Before */
.old-component {
    padding: 20px;
    margin: 16px;
    color: #333;
    font-size: 14px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

/* After */
.old-component {
    padding: var(--space-xl);
    margin: var(--space-md);
    color: var(--color-text-muted);
    font-size: var(--font-size-sm);
    box-shadow: var(--shadow-subtle);
}
```

## Future Enhancements

### Potential Additions
- **Animation system** with predefined keyframes
- **Layout system** with CSS Grid templates
- **Component library** with reusable patterns
- **Theme system** for dark/light modes
- **Icon system** with consistent sizing

### Maintenance
- Regular review of variable usage
- Performance monitoring
- Accessibility audits
- Cross-browser testing
- Documentation updates

---

*This design system is designed to evolve with the project. Always consider the impact of changes on existing components and maintain consistency across the codebase.*
