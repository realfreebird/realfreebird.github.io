# Phase 3: Points System and Penalties

## Goal
Implement the points system, penalties for invalid selections, and points/lives UI.

## Steps
- [ ] Add a points system:
    - [ ] Each correct word found adds (number of letters in the word) × 10 points.
    - [ ] When the game ends, add (number of seconds left) × 5 points.
    - [ ] Use Playwright MCP server to verify and save a screenshot of the points system in action.
    - [ ] Perform a grand check to ensure points logic is correct before proceeding.
- [ ] For "קשה" and "קשה מאוד":
    - [ ] If the user starts a new selection (not adjacent to the previous selection), subtract 20 points, play a penalty sound, and animate the penalty.
    - [ ] Use Playwright MCP server to verify and save a screenshot of the penalty in action.
    - [ ] Perform a grand check to ensure penalty logic is correct before proceeding.
- [ ] For "קשה מאוד":
    - [ ] Add a lives system (start with 3 lives, each penalty removes 1 life).
    - [ ] Display remaining lives visually (e.g., hearts or icons) near the timer/points.
    - [ ] Use Playwright MCP server to verify and save a screenshot of the lives system.
    - [ ] Perform a grand check to ensure lives logic is correct before proceeding.
- [ ] Display the points counter near the timer and animate changes (increment/decrement shows all numbers in between).
    - [ ] Use Playwright MCP server to verify and save a screenshot of the animated points counter.
    - [ ] Perform a grand check to ensure animation is correct before proceeding.
- [ ] At the end of the phase, perform a final grand check and save a summary screenshot to confirm all features are working and error-free before moving to the next phase.
