# Phase 5: Word Completion Bonus and Bonus Animation

## Goal
Implement the word completion bonus, bonus/points animation, and final polish.

## Steps
- [ ] Each time the user completes a new word from the bank:
    - [ ] Add 5 seconds to the timer.
    - [ ] Show a positive animation and indication (e.g., visual effect, sound).
    - [ ] Use Playwright MCP server to verify and save a screenshot of the bonus and animation.
    - [ ] Perform a grand check to ensure bonus logic is correct before proceeding.
- [ ] Whenever the user receives a bonus (points or time), show a "+[points]" or "+[time]" animation over the board (e.g., "+5" for points, "+00:05" for time).
    - [ ] Use Playwright MCP server to verify and save a screenshot of the animation.
    - [ ] Perform a grand check to ensure animation is correct before proceeding.
- [ ] Ensure all new logic is robust and works with all game flows (pause, win, lose, new game).
    - [ ] Use Playwright MCP server to verify and save a screenshot of all flows.
    - [ ] Perform a grand check to ensure all flows are correct before proceeding.
- [ ] Add all new strings to the appropriate i18n/translation locations if needed.
    - [ ] Use Playwright MCP server to verify and save a screenshot of i18n strings in the UI.
    - [ ] Perform a grand check to ensure i18n is correct before proceeding.
- [ ] Test all new features and edge cases.
    - [ ] Use Playwright MCP server to verify and save a screenshot of edge case handling.
    - [ ] Perform a grand check to ensure all tests pass before considering the phase complete.
- [ ] At the end of the phase, perform a final grand check and save a summary screenshot to confirm all features are working and error-free before finishing the implementation.
