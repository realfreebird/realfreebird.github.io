# Phase 2: Timer UI and Basic Game Over

## Goal
Display the timer in a classic 7-segment style above the board and implement basic game over logic.

## Steps
- [ ] Design and implement a classic 7-segment style timer display (MM:SS, always 2 digits each) above the board.
    - [ ] Use Playwright MCP server to verify and save a screenshot of the timer display.
    - [ ] Perform a grand check to ensure the timer UI is correct before proceeding.
- [ ] When less than 5 seconds remain, visually indicate urgency (e.g., color change, blinking, or animation).
    - [ ] Use Playwright MCP server to verify and save a screenshot of the urgency indication.
    - [ ] Perform a grand check to ensure urgency indication is correct before proceeding.
- [ ] Implement basic game over logic:
    - [ ] For all difficulties except "קלי קלות": game over when timer reaches zero.
    - [ ] Show a "GAME OVER" animation and play a failure sound.
    - [ ] Display a "נסה שנית" (Try Again) button to restart the game.
    - [ ] Use Playwright MCP server to verify and save a screenshot of the game over state.
    - [ ] Perform a grand check to ensure game over logic is correct before proceeding.
- [ ] At the end of the phase, perform a final grand check and save a summary screenshot to confirm all features are working and error-free before moving to the next phase.
