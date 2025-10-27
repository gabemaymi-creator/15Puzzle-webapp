# 15 Puzzle Web App

A modern, accessible, and highly customizable browser-based take on the classic 15 Puzzle. Built with vanilla JavaScript, HTML, and CSS, it focuses on smooth interactions, responsive layout, and inclusive design.

## Features
- 4x4 sliding puzzle with numbers 1–15 and one empty space
- Animated tile movement with smooth transitions
- Click any tile in the same row or column as the empty space to slide the intervening tiles
- Keyboard controls:
  - Arrow keys: move adjacent tiles
  - Shift + Arrow keys: slide an entire row or column toward the blank
- Move counter and timer HUD
- Shuffle and Reset controls for quick restarts
- Theme switcher with multiple color schemes
- Custom CSS variables for board, tiles, and accents so every theme feels distinct
- Invisible empty tile that blends seamlessly with each theme
- Responsive layout that adapts to phones, tablets, and desktops
- Accessibility support with ARIA roles, focus management, and keyboard navigation

## Design Workflow
1. **HTML**: Semantic structure with landmarks and IDs for dynamic elements such as the board, move counter, timer, controls, status messages, and theme menu.
2. **CSS**: Theming via CSS variables, animated transitions, and a mix of grid and absolute positioning to keep the puzzle centered and responsive.
3. **JavaScript**:
   - Initializes game state and caches DOM references on load
   - Handles shuffling, solvability checks, move validation, and rendering
   - Supports both single-tile and multi-tile sliding (entire row/column)
   - Updates UI text, aria attributes, and theme toggles dynamically

## Getting Started
1. Open `index.html` in a modern browser.
2. Pick a theme (optional) to match your style.
3. Hit Shuffle to start a new puzzle.
4. Use the mouse or keyboard to solve it as fast as you can.

## Development Notes
- The project has no build step—just open the HTML file to play.
- Primary logic lives in `app.js`; presentation is handled by `style.css`.
- Assets such as SVGs and icons are stored under `Assets/`.
- Lightweight structure makes it easy to experiment with new controls or layouts.

---

**Author:** Gabriel Ortiz Maymi
