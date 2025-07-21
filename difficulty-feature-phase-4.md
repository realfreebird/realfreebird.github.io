# Phase 4: Advanced Penalty Effects and English Words Toggle

## Goal
Implement advanced penalty effects and the English words toggle logic for "קשה" and "קשה מאוד".

## Steps
- [ ] For "קשה מאוד" penalty:
    - [ ] When a penalty occurs, make the board disappear into darkness for 3 seconds.
    - [ ] While the board is dark, disable all user interaction with the game.
    - [ ] After 3 seconds, restore the board and resume interaction.
    - [ ] Use Playwright MCP server to verify and save a screenshot of the board darkness and interaction lockout.
    - [ ] Perform a grand check to ensure penalty effect is correct before proceeding.
- [ ] For "קשה מאוד":
    - [ ] Disable the "show English words" toggle (eye); English words are never shown.
    - [ ] Use Playwright MCP server to verify and save a screenshot of the disabled toggle.
    - [ ] Perform a grand check to ensure toggle is disabled before proceeding.
- [ ] For "קשה":
    - [ ] Start with English words hidden.
    - [ ] Each time the user clicks the eye, show the English words for 5 seconds, then fade them out.
    - [ ] Each click costs 10 points.
    - [ ] Use Playwright MCP server to verify and save a screenshot of the eye toggle and fade-out.
    - [ ] Perform a grand check to ensure toggle and penalty are correct before proceeding.
- [ ] At the end of the phase, perform a final grand check and save a summary screenshot to confirm all features are working and error-free before moving to the next phase.
