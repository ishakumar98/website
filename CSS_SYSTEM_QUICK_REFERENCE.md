# CSS System Quick Reference

## 🎨 **Color System**

### **Primary Colors**
```css
--color-primary: #EC4899;           /* Pink */
--color-primary-light: #F472B6;     /* Light Pink */
--color-primary-dark: #BE185D;      /* Dark Pink */
```

### **Neutral Colors**
```css
--color-white: #FFFFFF;
--color-black: #000000;
--color-gray-50: #F9FAFB;
--color-gray-100: #F3F4F6;
--color-gray-500: #6B7280;
--color-gray-900: #111827;
```

### **Semantic Colors**
```css
--color-success: #10B981;
--color-warning: #F59E0B;
--color-error: #EF4444;
--color-info: #3B82F6;
```

## 📏 **Spacing System**

### **Base Units**
```css
--space-xs: 0.25rem;    /* 4px */
--space-sm: 0.5rem;     /* 8px */
--space-md: 1rem;       /* 16px */
--space-lg: 1.5rem;     /* 24px */
--space-xl: 2rem;       /* 32px */
--space-2xl: 3rem;      /* 48px */
--space-3xl: 4rem;      /* 64px */
```

### **Container Spacing**
```css
--container-padding: var(--space-xl);    /* 2rem */
--section-spacing: var(--space-2xl);     /* 3rem */
--element-spacing: var(--space-lg);      /* 1.5rem */
--component-spacing: var(--space-md);    /* 1rem */
```

## 🔤 **Typography System**

### **Font Families**
```css
--font-primary: 'Tumla', -apple-system, BlinkMacSystemFont, sans-serif;
--font-secondary: 'Akke', Georgia, serif;
--font-mono: 'SF Mono', Monaco, 'Cascadia Code', monospace;
```

### **Font Sizes**
```css
--text-xs: 0.75rem;     /* 12px */
--text-sm: 0.875rem;    /* 14px */
--text-base: 1rem;      /* 16px */
--text-lg: 1.125rem;    /* 18px */
--text-xl: 1.25rem;     /* 20px */
--text-2xl: 1.5rem;     /* 24px */
--text-3xl: 1.875rem;   /* 30px */
--text-4xl: 2.25rem;    /* 36px */
--text-5xl: 3rem;       /* 48px */
```

### **Line Heights**
```css
--leading-tight: 1.25;
--leading-normal: 1.5;
--leading-relaxed: 1.75;
--leading-loose: 2;
```

## 🌟 **Shadow System**

### **Standard Shadows**
```css
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
```

### **Custom Pink Shadows**
```css
--work-shadow: 0 4px 20px rgba(236, 72, 153, 0.15);
--image-shadow: 0 8px 32px rgba(236, 72, 153, 0.2);
--hover-shadow: 0 12px 40px rgba(236, 72, 153, 0.25);
```

## ⚡ **Animation System**

### **Timing**
```css
--animation-fast: 150ms;
--animation-medium: 300ms;
--animation-slow: 500ms;
--animation-slower: 800ms;
```

### **Easing Functions**
```css
--ease-out-cubic: cubic-bezier(0.33, 1, 0.68, 1);
--ease-out-quart: cubic-bezier(0.25, 1, 0.5, 1);
--ease-out-quint: cubic-bezier(0.23, 1, 0.32, 1);
```

### **Transition Presets**
```css
--transition-fast: all var(--animation-fast) var(--ease-out-cubic);
--transition-smooth: all var(--animation-medium) var(--ease-out-cubic);
--transition-slow: all var(--animation-slow) var(--ease-out-cubic);
```

### **Animation Factors**
```css
--scroll-multiplier: 0.25;
--lerp-factor: 0.05;
--velocity-damping: 0.95;
```

## 🏗️ **Layout System**

### **Breakpoints**
```css
--breakpoint-sm: 640px;
--breakpoint-md: 768px;
--breakpoint-lg: 1024px;
--breakpoint-xl: 1280px;
--breakpoint-2xl: 1536px;
```

### **Z-Index Scale**
```css
--z-dropdown: 1000;
--z-sticky: 1020;
--z-fixed: 1030;
--z-modal-backdrop: 1040;
--z-modal: 1050;
--z-popover: 1060;
--z-tooltip: 1070;
--z-flower: 10;
--z-image-container: 5;
```

## 🔧 **Common Patterns**

### **Button Styles**
```css
.btn-primary {
    background-color: var(--color-primary);
    color: var(--color-white);
    padding: var(--space-md) var(--space-xl);
    border-radius: var(--space-sm);
    transition: var(--transition-smooth);
}

.btn-primary:hover {
    background-color: var(--color-primary-dark);
    box-shadow: var(--hover-shadow);
}
```

### **Card Styles**
```css
.card {
    background-color: var(--color-white);
    padding: var(--space-lg);
    border-radius: var(--space-sm);
    box-shadow: var(--shadow-md);
    transition: var(--transition-smooth);
}

.card:hover {
    box-shadow: var(--shadow-lg);
    transform: translateY(-2px);
}
```

### **Container Styles**
```css
.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 var(--container-padding);
}

.section {
    padding: var(--section-spacing) 0;
}
```

## 📱 **Responsive Patterns**

### **Mobile-First Media Queries**
```css
.component {
    /* Mobile styles */
    padding: var(--space-md);
}

@media (min-width: 768px) {
    .component {
        /* Tablet and up */
        padding: var(--space-lg);
    }
}

@media (min-width: 1024px) {
    .component {
        /* Desktop and up */
        padding: var(--space-xl);
    }
}
```

### **Responsive Typography**
```css
.heading {
    font-size: var(--text-2xl);
    line-height: var(--leading-tight);
}

@media (min-width: 768px) {
    .heading {
        font-size: var(--text-3xl);
    }
}

@media (min-width: 1024px) {
    .heading {
        font-size: var(--text-4xl);
    }
}
```

## 🎭 **Animation Patterns**

### **Fade In**
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

### **Scale In**
```css
@keyframes scaleIn {
    from {
        opacity: 0;
        transform: scale(0.9);
    }
    to {
        opacity: 1;
        transform: scale(1);
    }
}

.scale-in {
    animation: scaleIn var(--animation-medium) var(--ease-out-cubic);
}
```

### **Slide In**
```css
@keyframes slideInLeft {
    from {
        opacity: 0;
        transform: translateX(-100%);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

.slide-in-left {
    animation: slideInLeft var(--animation-medium) var(--ease-out-cubic);
}
```

## 🚀 **Performance Tips**

### **Hardware Acceleration**
```css
.animated-element {
    will-change: transform, opacity;
    transform: translateZ(0);
}
```

### **Efficient Selectors**
```css
/* ✅ Good */
.card { }
.card__title { }
.card--featured { }

/* ❌ Avoid */
body div.container .card .title { }
```

### **Optimized Transitions**
```css
.element {
    transition: transform var(--transition-smooth), 
                opacity var(--transition-fast);
}
```

## 🐛 **Debugging Tools**

### **Debug Borders**
```css
.debug * {
    outline: 1px solid red;
}

.debug-layout * {
    outline: 1px solid blue;
}
```

### **Variable Inspection**
```css
.element::before {
    content: var(--color-primary);
}
```

### **Responsive Testing**
```css
/* Add to any element to see current breakpoint */
.breakpoint-indicator::after {
    content: 'Mobile';
}

@media (min-width: 768px) {
    .breakpoint-indicator::after {
        content: 'Tablet';
    }
}

@media (min-width: 1024px) {
    .breakpoint-indicator::after {
        content: 'Desktop';
    }
}
```

## 📋 **Best Practices Checklist**

- [ ] **Use Variables**: Always use CSS custom properties
- [ ] **Mobile First**: Start with mobile, enhance for larger screens
- [ ] **Semantic Names**: Use descriptive class names
- [ ] **Efficient Selectors**: Avoid overly specific selectors
- [ ] **Performance**: Use will-change and hardware acceleration
- [ ] **Consistency**: Follow established patterns
- [ ] **Documentation**: Comment complex CSS logic

## 🔄 **Migration Checklist**

- [ ] **Replace Hardcoded Values**: Use variables instead of pixels/colors
- [ ] **Update Media Queries**: Convert to mobile-first approach
- [ ] **Consolidate Styles**: Use utility classes where possible
- [ ] **Test Responsiveness**: Verify all breakpoints work
- [ ] **Performance Check**: Ensure no performance regressions
- [ ] **Documentation**: Update any style guides

## 📚 **File Organization**

### **Import Order**
```css
/* main.css */
@import 'variables.css';    /* First - Define all variables */
@import 'utilities.css';    /* Second - Utility classes */
@import 'typography.css';   /* Third - Font and text styles */
@import 'layout.css';       /* Fourth - Grid and positioning */
@import 'components.css';   /* Fifth - Reusable components */
/* Additional global styles */
```

### **Module Responsibilities**
- **`variables.css`**: All design tokens and custom properties
- **`utilities.css`**: Reusable utility classes
- **`typography.css`**: Font families and text styling
- **`layout.css`**: Grid systems and positioning
- **`components.css`**: Reusable component styles
- **`main.css`**: Main entry point and global styles

---

**Need Help?** Check the full documentation in `CSS_SYSTEM.md` or the main project documentation.
