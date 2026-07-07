# Modern Minesweeper

A browser-based Minesweeper built with React and Vite. Classic rules, retro Windows-style visuals, and a clean component architecture.

## Features

- **Three difficulty levels** — Beginner (9×9, 10 mines), Intermediate (16×16, 40 mines), Expert (30×16, 99 mines)
- **First-click safety** — Mines are placed after your first click, keeping a 3×3 area around it clear
- **Flood-fill reveal** — Empty cells expand automatically
- **Chord reveal** — Double-click a revealed number to open neighbors when surrounding flags match
- **Flag limits** — You can't place more flags than there are mines
- **Timer and flag counter** — Track elapsed time and remaining flags

## How to Play

| Action | Control |
|--------|---------|
| Reveal a cell | Left-click |
| Place / remove a flag | Right-click |
| Chord (open neighbors) | Double-click a revealed number |

Flag all mines around a number, then double-click that number to reveal the remaining hidden cells. Hit a mine and the game ends; reveal every safe cell to win.

## Getting Started

**Prerequisites:** Node.js 18+ and npm

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (typically `http://localhost:5173`).

### Other scripts

```bash
npm run build    # Production build to dist/
npm run preview  # Preview the production build
npm run lint     # Run Oxlint
```

## Tech Stack

- [React 19](https://react.dev/)
- [Vite 8](https://vite.dev/)
- [Oxlint](https://oxc.rs/docs/guide/usage/linter.html)

## Project Structure

```
src/
├── components/
│   ├── Board.jsx      # Grid layout
│   ├── Cell.jsx       # Individual cell rendering
│   └── Header.jsx     # Stats, difficulty, reset
├── hooks/
│   └── useMinesweeper.js  # Game state and logic
├── constants.js       # Shared cell state constants
├── App.jsx            # Root component
└── index.css          # Classic Minesweeper styling
```

Game logic lives in `useMinesweeper.js` as pure helper functions (`generateBoard`, `revealCell`, `flagCell`, `chordReveal`, etc.) wrapped in a React hook.

## Roadmap

- Smiley-face reset button
- Highlight incorrectly placed flags on loss
- Dark mode / themes
- Touch controls (long-press to flag)
- Best times saved to localStorage
- Unit tests for game logic