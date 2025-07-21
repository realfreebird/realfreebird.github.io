- [ ] Add a Difficulty ("קושי") selection to the New Game dialog, with the four levels: קלי קלות, קל, קשה, קשה מאוד.
- [ ] Update the game state to store the selected difficulty for each session.
- [ ] Implement timer logic:
    - [ ] No timer for "קלי קלות".
    - [ ] For other levels, show a timer above the board (between the words and the board).
    - [ ] Timer duration is calculated based on difficulty and number of words.
- [ ] Design and implement a classic 7-segment style timer display (MM:SS, always 2 digits each).
- [ ] For "קשה" and "קשה מאוד":
    - [ ] If the user clicks a letter not adjacent to a selected letter, add a 1-second penalty, play a sound, and make the timer blink.
- [ ] When less than 5 seconds remain, visually indicate urgency (e.g., color change, blinking, or animation).
- [ ] Ensure timer and penalty logic is robust and works with all game flows (pause, win, lose, new game).
- [ ] Add all new strings to the appropriate i18n/translation locations if needed.
- [ ] Test all new features and edge cases.

# Timer Formula
- [ ] Timer duration (in seconds) = (BaseTimePerWord × NumberOfWords) × DifficultyMultiplier
    - BaseTimePerWord = 20 seconds
    - DifficultyMultiplier:
        - קלי קלות: No timer
        - קל: 1.5
        - קשה: 1.0
        - קשה מאוד: 0.7
    - Example: For 5 words on "קשה" → (20 × 5) × 1.0 = 100 seconds

# Points & Penalties
- [ ] Add a points system:
    - [ ] Each correct word found adds (number of letters in the word) × 10 points.
    - [ ] When the game ends, add (number of seconds left) × 5 points.
- [ ] For "קשה" and "קשה מאוד":
    - [ ] If the user starts a new selection (not adjacent to the previous selection), subtract 20 points, play a penalty sound, and animate the penalty.
- [ ] For "קשה מאוד":
    - [ ] Add a lives system (start with 3 lives, each penalty removes 1 life).
    - [ ] Display remaining lives visually (e.g., hearts or icons) near the timer/points.
- [ ] Display the points counter near the timer.
- [ ] Animate the points counter on change (increment/decrement shows all numbers in between).
- [ ] Ensure all new logic is robust and works with all game flows (pause, win, lose, new game).
- [ ] Add all new strings to the appropriate i18n/translation locations if needed.
- [ ] Test all new features and edge cases.

# Game Over
- [ ] Implement game over logic:
    - [ ] For "קשה מאוד": game over when lives reach zero.
    - [ ] For other difficulties: game over when timer reaches zero.
- [ ] On game over:
    - [ ] Show a "GAME OVER" animation.
    - [ ] Play a failure sound.
    - [ ] Display a "נסה שנית" (Try Again) button to restart the game.

# Penalty Effects
- [ ] For "קשה מאוד" penalty:
    - [ ] When a penalty occurs, make the board disappear into darkness for 3 seconds.
    - [ ] While the board is dark, disable all user interaction with the game.
    - [ ] After 3 seconds, restore the board and resume interaction.

# English Words Toggle (Eye)
- [ ] For "קשה מאוד":
    - [ ] Disable the "show English words" toggle (eye); English words are never shown.
- [ ] For "קשה":
    - [ ] Start with English words hidden.
    - [ ] Each time the user clicks the eye, show the English words for 5 seconds, then fade them out.
    - [ ] Each click costs 10 points.

# Word Completion Bonus
- [ ] Each time the user completes a new word from the bank:
    - [ ] Add 5 seconds to the timer.
    - [ ] Show a positive animation and indication (e.g., visual effect, sound).

# Bonus & Points Animation
- [ ] Whenever the user receives a bonus (points or time), show a "+[points]" or "+[time]" animation over the board.
    - [ ] Example: "+5" for points, "+00:05" for time.
