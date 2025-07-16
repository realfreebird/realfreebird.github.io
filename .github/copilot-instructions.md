# Copilot Instructions for EngWordPuzzleForZozi

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
