# Copilot Instructions for EngWordPuzzleForZozi

## Game Overview
- EngWordPuzzleForZozi is an English-Hebrew word search puzzle game for children, themed for special occasions (e.g., birthdays, holidays).
- The player’s goal is to find all the target words (in English or Hebrew) hidden in a letter grid.
- The game is played on a board (default: 8x8 grid), with words placed horizontally (left-to-right) in random rows. Words are not placed vertically or diagonally.
- Each game session uses a specific word bank (category), selectable at game start.

## Gameplay Rules & Mechanics
- **Word Source:**
  - Words are loaded from `src/app/services/words.json` via `words-bank.service.ts`.
  - Each bank/category contains a list of English-Hebrew word pairs, and may define wildcards, images, or sounds.
- **Board Setup:**
  - Board size defaults to 8x8 (`BoardState`), but can be configured.
  - A fixed number of words (default: 5) are randomly selected and placed horizontally on the board.
  - Remaining cells are filled with random letters.
  - Wildcards (e.g., emoji) may be placed according to the selected bank.
- **Finding Words:**
  - Players select contiguous cells in a row to form words; only horizontal selections are valid. Correct selections are marked as solved.
  - Found words are visually marked and can trigger sound or TTS feedback.
  - The game ends when all words are found, triggering a game-over image and sound.
- **Options & Limitations:**
  - Players can toggle between uppercase/lowercase letters.
  - Some banks enable random cell colors or special effects.
  - The number of words per game and board size can be adjusted in code.
  - No user word entry or admin word editing in the UI (see TODOs).

## Project Overview
- This is an Angular 20 app for an English word puzzle game, generated with Angular CLI.
- Main app code is in `src/app/` with subfolders for components, dialogs, services, navigation, and pages.
- Static assets (images, sounds) are in `src/assets/` and `docs/assets/`.
- The `docs/` folder contains the production build for GitHub Pages deployment.

## Key Architecture & Patterns
- **Component Structure:**
  - UI is organized into feature folders under `src/app/components/`, `src/app/dialogs/`, and `src/app/pages/`.
  - Shared Angular Material modules are imported via `src/app/material/material.module.ts`.
- **Services:**
  - Business logic and data access are in `src/app/services/` (e.g., `words-bank.service.ts`, `storage.service.ts`, `tts.service.ts`).
  - Services are provided at the root and injected where needed.
- **Routing:**
  - App routes are defined in `src/app/app-routing.module.ts`.
- **Environments:**
  - Use `src/environments/environment.ts` for dev and `environment.prod.ts` for production.

## Developer Workflows
- **Start Dev Server:**
  - `npm start` or `ng serve` (runs on http://localhost:4200/)
- **Build:**
  - `npm run build` or `ng build` (output in `dist/`)
- **Unit Tests:**
  - `npm test` or `ng test` (Karma)
- **Production Deploy:**
  - Build with `ng build --prod`, then copy output to `docs/` for GitHub Pages.

## Project-Specific Conventions
- **Assets:**
  - Game sounds and images are organized by feature in `assets/` subfolders.
- **TypeScript Config:**
  - Uses `tsconfig.app.json` for app, `tsconfig.spec.json` for tests.
- **No e2e by default:**
  - End-to-end tests are not set up by default; see Angular docs if needed.

## Integration & External Dependencies
- **Angular Material:**
  - UI components are imported via `material.module.ts`.
- **Text-to-Speech:**
  - TTS logic is in `tts.service.ts`.
- **Word Bank:**
  - Word lists are in `words-bank.service.ts` and `words.json`.

## Examples
- To add a new dialog: create a folder in `src/app/dialogs/`, add component, and register in `app.module.ts`.
- To add a new sound: place file in `assets/`, reference in service/component.

---
For more, see `README.md` and Angular CLI docs.
