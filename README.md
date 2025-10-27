# 15 Puzzle

A modern, accessible, and highly customizable implementation of the classic 15 Puzzle game using vanilla JavaScript, HTML, and CSS.

## Features
- 4x4 sliding puzzle with numbers 1–15 and one empty space
- Animated tile movement with smooth transitions
- Click any tile in the same row or column as the empty space to slide all tiles between toward the blank
- Keyboard controls:
  - Arrow keys: move adjacent tiles
  - Shift + Arrow keys: slide entire row or column toward the blank
- Move counter and timer
- Shuffle and Reset controls
- Theme switcher with multiple color schemes:
  - Modern Blue, Classic Plastic, Wood, Pastel, High Contrast, Dark, and more
- Custom color variables for gamespace, board, tiles, and accents—each theme is visually distinct
- Invisible empty tile: the empty space always blends perfectly with the board background
- Responsive, modern UI with improved layout and color contrast
- Accessible: ARIA roles, keyboard navigation, and focus management

## Design Workflow
1. **HTML**: Semantic structure with IDs for dynamic elements (board, moves, time, controls, status, theme menu)
2. **CSS**: Theming with CSS variables, animated transitions, modern grid/absolute layout, and accessible color contrast
3. **JavaScript**:
   - Initializes game state and DOM references on load
   - Handles shuffling, move logic, win detection, and rendering
   - Supports both single-tile and multi-tile sliding (row/column)
   - Updates UI, accessibility attributes, and theme switching dynamically

## Getting Started
1. Open `index.html` in your browser.
2. Select a theme from the menu (optional).
3. Click Shuffle to start playing.
4. Use mouse or keyboard to solve the puzzle!

### Project Structure
- `FifteenPuzzleApp.swift` – App entry point.
- `ContentView.swift` – SwiftUI layout, controls, and theming.
- `PuzzleViewModel.swift` – MVVM state management, timer, and victory handling.
- `PuzzleBoard.swift` – Core puzzle logic (shuffle, solvability, move validation).
- `PuzzleTheme.swift` / `PuzzleTile.swift` – Visual styling and presentation models.

### Running on iPhone
1. In Xcode, create a new **App** project named `FifteenPuzzle` targeting iOS 17 or later.
2. Add the files under `ios/Sources` into the project (keep their folder structure).
3. Ensure the deployment target is iOS 16+ and that "Use SwiftUI" is enabled.
4. Build and run on the simulator or a connected device.
5. The code locks iPhone orientation to portrait while allowing rotation on iPad; no additional Info.plist changes are required.
6. Add your title artwork to the asset catalog as `PuzzleTitle` (or update `TitleImageView` in `ContentView.swift` to match your filename).

The SwiftUI app has no package dependencies and can reuse the existing assets if you import them into the asset catalog. The puzzle logic was ported from the JavaScript original and preserves solvable shuffling, row/column sliding, and win detection.

---

**Author:** Gabriel Ortiz Maymi
