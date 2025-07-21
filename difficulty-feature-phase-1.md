# Phase 1: Difficulty Selection and Timer Foundation

## Goal
Add difficulty selection to the New Game dialog and implement the timer logic foundation (no UI yet).

## Steps
- [ ] Add Difficulty ("קושי") selection to the New Game dialog with the four levels: קלי קלות, קל, קשה, קשה מאוד.
    - [ ] Use Playwright MCP server to verify and save a screenshot of the dialog with all difficulty options.
    - [ ] Perform a grand check to ensure the dialog is correct before proceeding.
- [ ] Update the game state to store the selected difficulty for each session.
    - [ ] Use Playwright MCP server to verify and save a screenshot of the game state after selection.
    - [ ] Perform a grand check to ensure the state is correct before proceeding.
- [ ] Implement timer logic in the game state:
    - [ ] No timer for "קלי קלות".
    - [ ] For other levels, calculate timer duration using the formula:
        - Timer duration (in seconds) = (BaseTimePerWord × NumberOfWords) × DifficultyMultiplier
        - BaseTimePerWord = 20 seconds
        - DifficultyMultiplier: קל: 1.5, קשה: 1.0, קשה מאוד: 0.7
    - [ ] Use Playwright MCP server to verify and save a screenshot of the timer value for each difficulty.
    - [ ] Perform a grand check to ensure timer logic is correct before proceeding.
- [ ] At the end of the phase, perform a final grand check and save a summary screenshot to confirm all features are working and error-free before moving to the next phase.
