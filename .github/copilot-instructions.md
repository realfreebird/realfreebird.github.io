# Copilot Instructions for EngWordPuzzleForZozi

## Game Overview
- EngWordPuzzleForZozi is an English-Hebrew word search puzzle game for children, themed for special occasions (e.g., birthdays, holidays).
- The player’s goal is to find all the target words (in English or Hebrew) hidden in a letter grid.
- The game is played on a board (default: 8x8 grid), with words placed horizontally (left-to-right) in random rows. Words are not placed vertically or diagonally.
- Each game session uses a specific word bank (category), selectable at game start via a dialog.

## UI Overview (as of v0.9.0)
- **Header:** Displays the game title ("פאזל מילים לזוהר") and a button to toggle word visibility (eye icon).
- **Main Action:** "משחק חדש" (New Game) button opens a dialog to start a new game.
- **New Game Dialog:**
  - Title: "משחק חדש"
  - Letter case selection: radio buttons for "abc | אותיות קטנות" (lowercase, default) and "ABC | אותיות גדולות" (uppercase)
  - Word bank/category selection: multiple buttons (e.g., "המממ", "🍎", "🌠", "ים", "טבע", "crazy cat", "🎂", "חיות", "צבעים", "מספרים", "שונות")
  - Cancel button: "ביטול"

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
  - Players can toggle between uppercase/lowercase letters (via the new game dialog).
  - Some banks enable random cell colors or special effects.
  - The number of words per game and board size can be adjusted in code.
  - No user word entry or admin word editing in the UI (see TODOs).

## Detailed Gameplay Flow (UI v0.9.0)
- When a new game starts, a list of target words (in both Hebrew and English) appears at the top of the board.
- The main board is an 8x8 grid of letters (and sometimes wildcards/emoji).
- Each target word is hidden horizontally in a random row, but the letters may be separated by wildcards or random letters.
- To find a word, the player must select the correct sequence of contiguous cells in a single row that matches the English word (ignoring wildcards and extra letters).
- Each cell acts as a toggle: clicking a cell selects or deselects it. This allows the player to correct mistakes by toggling off incorrect selections.
- When the correct sequence for a word is selected, it is marked as found, and the word is visually updated in the list.
- The process is repeated for all target words. The game is won when all words are found, triggering a game-over image and sound.
- The "משחק חדש" (New Game) button is disabled during an active game and re-enabled after the game is won.
- The UI provides immediate feedback for each selection, and the board updates dynamically as words are found.

## Tips for Playing
- Use the word list at the top to guide your search; match the English word to the correct row.
- Only horizontal, contiguous selections are valid. Wildcards (e.g., emoji) may appear between letters but do not break the word.
- If you make a mistake, simply click the cell again to deselect it.
- Some rows may contain random letters or wildcards that are not part of any word—focus on the correct sequence for each target word.

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

## UI Feedback & Cues
- Clicking a letter cell toggles its selection state with a visual highlight, helping the player track their current selection.
- Clicking a target word in the list highlights it, indicating the current word focus.
- When a correct word is found:
  - The word in the target list is visually marked as solved (e.g., color change, strikethrough, or highlight).
  - The corresponding cells on the board are visually updated to indicate the word was found.
  - Audio feedback (sound or TTS) may play to reinforce success.
  - TTS (Text-to-Speech) is used to sound out the selected letter and the found word.
- When all words are found:
  - A game-over image and sound are triggered.
  - The "משחק חדש" (New Game) button is re-enabled for another round.

## Examples
- To add a new dialog: create a folder in `src/app/dialogs/`, add component, and register in `app.module.ts`.
- To add a new sound: place file in `assets/`, reference in service/component.

---
For more, see `README.md` and Angular CLI docs.
