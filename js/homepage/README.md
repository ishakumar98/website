# Homepage-Specific Modules

This directory contains JavaScript modules that are **ONLY** used on the homepage (`index.html`).

## Modules

- **`fireworks.js`** - P5.js-based fireworks animation with flower particles
- **`fireworks-manager.js`** - Module wrapper for fireworks functionality

## Usage

These modules are automatically loaded by the ModuleLoader system when on the homepage.
They should NOT be loaded on project pages or other non-homepage content.

## Dependencies

- Requires P5.js library
- Depends on core coordination systems (EventManager, AnimationCoordinator, etc.)
- Only works with `#fireworks-container` element present in DOM
