# Design System Quick Reference

## 🎨 Colors
```css
--color-primary: #FF7DCB;           /* Main brand */
--color-background: #FFF5F8;        /* Main bg */
--color-text: #000000;              /* Primary text */
--color-text-muted: #666666;        /* Secondary text */
--color-border: #e9ecef;            /* Borders */
```

## 📏 Spacing
```css
--space-xs: 0.25rem;    /* 4px - minimal */
--space-sm: 0.5rem;     /* 8px - small */
--space-md: 1rem;       /* 16px - standard */
--space-lg: 1.5rem;     /* 24px - large */
--space-xl: 2rem;       /* 32px - section */
--space-2xl: 3rem;      /* 48px - major section */
--space-3xl: 4rem;      /* 64px - page level */
```

## 🔤 Typography
```css
--font-size-xs: 0.75rem;    /* 12px */
--font-size-sm: 0.875rem;   /* 14px */
--font-size-base: 1rem;     /* 16px */
--font-size-lg: 1.125rem;   /* 18px */
--font-size-xl: 1.25rem;    /* 20px */
--font-size-2xl: 1.5rem;    /* 24px */
```

## 🌟 Shadows
```css
--shadow-subtle: 0 4px 12px rgba(0, 0, 0, 0.1);
--shadow-medium: 0 0 25px 35px rgba(255, 125, 203, 0.15);
--shadow-strong: 0 20px 60px rgba(0, 0, 0, 0.3);
```

## 📱 Breakpoints
```css
@media (max-width: 480px)   /* Mobile */
@media (max-width: 768px)   /* Tablet */
@media (max-width: 1024px)  /* Desktop */
```

## 🧩 Common Patterns

### Button
```css
.button {
    padding: var(--space-sm) var(--space-md);
    border-radius: var(--space-sm);
    font-size: var(--font-size-sm);
}
```

### Card
```css
.card {
    padding: var(--space-lg);
    border-radius: var(--space-sm);
    box-shadow: var(--shadow-subtle);
}
```

### Container
```css
.container {
    padding: var(--space-md) 0 0 0;
    margin: 0 auto;
}
```

## ⚡ Quick Tips

1. **Always use variables** - Never hardcode values
2. **Mobile first** - Start with mobile, then scale up
3. **Consistent spacing** - Use the spacing scale religiously
4. **Semantic colors** - Use color variables for meaning, not just appearance
5. **Test responsiveness** - Check all breakpoints

## 🚫 Common Mistakes

- ❌ `padding: 16px` → ✅ `padding: var(--space-md)`
- ❌ `color: #000` → ✅ `color: var(--color-text)`
- ❌ `font-size: 18px` → ✅ `font-size: var(--font-size-lg)`
- ❌ `margin: 24px` → ✅ `margin: var(--space-lg)`

---

*For full documentation, see `DESIGN_SYSTEM.md`*
