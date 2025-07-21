import { Component, EventEmitter, Input, OnInit, Output, OnDestroy } from '@angular/core';
import * as _ from 'lodash';
import { concatMap, delay, from, map, of, concat, interval, Subscription } from 'rxjs';
import { TtsService, Word, WordsBankService } from 'src/app/services/services';
import { BoardState, Cell, RowCellSelection } from './types';
import { SevenSegmentTimerComponent } from '../seven-segment-timer/seven-segment-timer.component';
import { CommonModule } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonModule } from '@angular/material/button';

async function sleep(ms: number) {
  await Promise.resolve((resolve: any) => { setTimeout(() => { resolve(); }, ms); });
}

// animal list : https://gist.github.com/borlaym/585e2e09dd6abd9b0d0a

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}


interface GameOptionsI {
  bank: string;
  isUpperCase: boolean;
  randomColors: boolean;
  gameOverSoundFile: string;
  gameOverImg: string;
  wildcard: string;
  wildcardMagic: boolean;
  difficulty: 'קליל' | 'קל' | 'קשה' | 'קשה מאוד';
}

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
  standalone: true,
  imports: [CommonModule, SevenSegmentTimerComponent, MatGridListModule, MatButtonModule]
})
export class BoardComponent implements OnInit, OnDestroy {

  @Input() state!: BoardState
  @Output() stateChange = new EventEmitter<BoardState>();

  @Input()
  public get showEngWords() {
    return this.state.showEngWords;
  }
  public set showEngWords(value) {
    // debugger;
    if (this.state) {
      this.state.showEngWords = value;
      this.stateChange.emit(this.state);
    }
  }

  get wordsPerGame() { return this.state?.wordsPerGame; };
  get rows() { return this.state?.rows; }
  get cols() { return this.state?.cols; }
  get bank() { return this.state?.bank; }
  get isUpperCase() { return this.state?.isUpperCase ?? false; }
  get words() { return this.state?.words; }
  get randomColors() { return this.state?.randomColors; }
  get cells() { return this.state?.cells; }
  get isGameOver() { return this.state?.isGameOver; }

  onMove = new EventEmitter<void>();
  onGameOver = new EventEmitter<void>();

  constructor(public wordsBankService: WordsBankService, public TTS: TtsService) { (window as any).board = this; }

  private timerInterval: any = null;

  displayedPoints: number = 0;
  private pointsAnimationInterval: any = null;

  ngOnInit(): void {
    // Fail-safe: guarantee all state properties are valid
    if (this.state) {
      if (typeof this.state.lives !== 'number') this.state.lives = Number(this.state.lives) || 0;
      if (!Array.isArray(this.state.words)) this.state.words = [];
      if (!Array.isArray(this.state.cells)) this.state.cells = [];
    }
    this.displayedPoints = this.state?.points ?? 0;
    this.startTimerIfNeeded();
  }

  ngOnDestroy(): void {
    this.clearTimer();
    if (this.pointsAnimationInterval) clearInterval(this.pointsAnimationInterval);
  }

  ngOnChanges(): void {
    this.animatePoints();
  }

  private animatePoints() {
    if (!this.state) return;
    if (this.pointsAnimationInterval) clearInterval(this.pointsAnimationInterval);
    const target = this.state.points;
    const step = target > this.displayedPoints ? 1 : -1;
    if (this.displayedPoints === target) return;
    this.pointsAnimationInterval = setInterval(() => {
      if (this.displayedPoints === target) {
        clearInterval(this.pointsAnimationInterval);
        return;
      }
      this.displayedPoints += step;
    }, 15);
  }

  private startTimerIfNeeded() {
    this.clearTimer();
    if (this.state && this.state.timerDurationSec !== null && !this.state.isGameOver) {
      this.timerInterval = setInterval(() => {
        if (this.state.isGameOver) { this.clearTimer(); return; }
        if (this.state.timerDurationSec && this.state.timerDurationSec > 0) {
          this.state.timerDurationSec--;
          this.stateChange.emit(this.state);
          if (this.state.timerDurationSec === 0) {
            this.handleTimerGameOver();
          }
        }
      }, 1000);
    }
  }

  private clearTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  private handleTimerGameOver() {
    if (this.state.difficulty !== 'קליל' && !this.state.isGameOver) {
      this.state.isGameOver = true;
      this.stateChange.emit(this.state);
      this.playSound('gameOver');
      // Optionally trigger animation here
    }
    this.clearTimer();
  }

  /** get n random words based on this.bank & this.wordsPerGame */
  async getWords() {
    if (!this.bank) { return; }
    const words = await this.wordsBankService.get(this.bank, this.wordsPerGame, this.isUpperCase);
    this.state.words = words.map(w => ({ ...w, found: false }));
  }

  /** fill this.board with this.rows & this.cols empty cells */
  createEmptyBoard() {
    const a = [];
    // let i = 0;
    for (let r = 0; r < this.rows; r++) {
      const row = [];
      for (let c = 0; c < this.cols; c++) {

        // const cssClass = this.randomColors ? 'cellColor' + ((i++)%5) : '';
        const cssClass = this.randomColors ? 'cellColor' + Math.floor(Math.random() * 5) : '';
        row.push(new Cell('', r, c, cssClass))
      }
      a.push(row)
    }
    this.state.cells = a;
  }

  addWords2Board() {

    const findRandomEmptyCell = (len: number) => {
      for (let i = 0; i < 100; i++) {

        if (this.cols - len < 0) {
          throw `word is too long.  ${len}/${this.cols}`;
        }


        const r = getRandomInt(this.rows);
        const c = getRandomInt(this.cols - len);
        // todo. 
        // if (c < 0) {
        //   console.warn(`word is too long: ${c}/${len}`);
        //   continue;
        // }
        const cell = this.cells[r][c];
        if (!cell.letter) {
          let j = 1
          for (; j < len; j++) {
            const cell2 = this.cells[r][c + j];
            if (cell2.letter) { break; }
          }
          if (j === len) return cell;
        }
      }
      return null;
    }

    const errors: Word[] = [];
    for (const w of this.words) {
      let cell0 = findRandomEmptyCell(w.eng.length);
      if (!cell0) {
        errors.push(w);
        continue;
      }

      let cell = cell0;

      for (const letter of w.eng) {
        cell.letter = cell.displayLetter = letter;
        const nextCell = this.cells[cell.r][cell.c + 1];
        cell = nextCell;
      }
    }

    // TODO FIXME
    if (errors.length) {
      console.warn('could not fit all words: ' + JSON.stringify(errors))
    }
  }

  /** fill alll empty cells with random letters */
  fillTheBlanks() {
    for (let r = 0; r < this.rows; r++) {
      const row = this.cells[r];
      const firstChartCode = this.isUpperCase ? 65 : 97;
      for (let c = 0; c < this.cols; c++) {
        const cell = row[c];
        if (cell.letter) { continue; }
        const l = String.fromCharCode(firstChartCode + getRandomInt(26))
        cell.letter = cell.displayLetter = l;
      }
    }
  }

  _OLD_addWildCards(wildcard: string) {
    for (let r = 0; r < this.rows; r++) {
      const row = this.cells[r];
      for (let c = 0; c < this.cols; c++) {
        const cell = row[c];
        const rand = Math.floor(Math.random() * 5);
        if (rand == 0) {
          cell.displayLetter = wildcard
        }
      }
    }
  }

  placeWildcard() {
    if (!this.state.wildcard) return; // No wildcard defined, do nothing
    const maxAttempts = this.rows * this.cols * 2; // Watchdog to prevent infinite loops
    const wildcard = this.state.wildcard;
    let attempts = 0;
    while (attempts < maxAttempts) {
      const r = Math.floor(Math.random() * this.rows);
      const c = Math.floor(Math.random() * this.cols);
      const positionKey = `${r},${c}`;

      if (!this.wildCardPositions.has(positionKey)) {
        this.cells[r][c].displayLetter = wildcard;
        this.wildCardPositions.add(positionKey);
        return;
      }
      attempts++;
    }
  }

  wildCardPositions = new Set<string>();

  addWildCards() {
    if (!this.state.wildcard) return; // No wildcard defined, do nothing
    const n = Math.floor((this.rows * this.cols) / 5);
    console.log('addWildCards', this.state.wildcard, n)
    for (let i = 0; i < n; i++) {
      this.placeWildcard();
    }
  }

  removewildCard() {
    if (!this.wildCardPositions.size) { return; }
    let pos2Remove: string = ''
    this.wildCardPositions.forEach(p => {
      if (pos2Remove) { return; }
      pos2Remove = p;
      const [r, c] = p.split(',').map(s => parseInt(s));
      console.log(`removewildCards: r/c ${r}/${c})`);
      this.cells[r][c].displayLetter = this.cells[r][c].letter;
    })
    if (pos2Remove) {
      this.wildCardPositions.delete(pos2Remove);
    }
  }



  resetFoundWords() {
    this.words.forEach(w => w.found = false);
  }

  async init(options: GameOptionsI) {
    this.state = new BoardState();
    this.state.bank = options.bank ?? 'animals'; // FIXME !!!
    this.state.isUpperCase = options.isUpperCase;
    this.state.randomColors = options.randomColors;
    this.state.gameOverSoundFile = options.gameOverSoundFile;
    this.state.gameOverImg = options.gameOverImg;
    this.state.wildcard = options.wildcard;
    this.state.wildcardMagic = options.wildcardMagic;
    this.state.difficulty = options.difficulty ?? 'קליל';
    this.state.setTimerDuration();

    await this.getWords();
    this.createEmptyBoard();
    this.addWords2Board();
    this.fillTheBlanks();
    if (this.state.wildcard/*  && !this.state.wildcardMagic */) {
      this.addWildCards();
    }
    this.resetFoundWords();

    this.stateChange.emit(this.state);
  }

  timer = interval(2000);
  subTimer!: Subscription;

  restartTimers() {
    if (this.subTimer) {
      this.subTimer.unsubscribe();
    }

    // debugger;
    // if (!this.state.wildcardMagic) { return; }

    this.subTimer = this.timer.pipe(
      delay(getRandomInt(5) * 200))
      .subscribe(v => {
        this.removewildCard();
        setTimeout(() => {
          this.placeWildcard();
        }, 200);
      })

  }

  async restartGame(options: GameOptionsI) {
    // debugger;
    await this.init(options);
    this.wildCardPositions.clear();
    this.restartTimers();
    this.startTimerIfNeeded();
    await this.animateRestartGame();
  }

  restartGameFromButton() {
    // Reuse the last used options or prompt for new game
    if (this.state) {
      const options = {
        bank: this.state.bank ?? 'animals',
        isUpperCase: this.state.isUpperCase,
        randomColors: this.state.randomColors,
        gameOverSoundFile: this.state.gameOverSoundFile,
        gameOverImg: this.state.gameOverImg,
        wildcard: this.state.wildcard ?? '',
        wildcardMagic: this.state.wildcardMagic,
        difficulty: this.state.difficulty
      };
      this.restartGame(options);
    }
  }

  getSelectionRange(cell: Cell): RowCellSelection {

    const row = this.cells[cell.r];
    const col = cell.c;

    let from = col, to = col;
    for (; to < row.length - 1; to++) {
      if (!row[to + 1].isSelected) { break; }
    }
    for (; from > 0; from--) {
      if (!row[from - 1].isSelected) { break; }
    }

    return {
      row: cell.r,
      startCol: from,
      endCol: to
    }
  }

  getWordFromselection(cells: RowCellSelection) {
    const row = this.cells[cells.row];
    let word = ''
    for (let i = cells.startCol; i <= cells.endCol; i++) {
      word += row[i].letter;
    }
    return word;
  }

  markSolved(cells: RowCellSelection) {
    const row = this.cells[cells.row];
    for (let i = cells.startCol; i <= cells.endCol; i++) {
      const c = row[i];
      c.isSelected = false;
      c.isSolved = true;
    }
  }

  async toggleCellSelection(c: Cell) {
    if (c.isSolved) { return; /* nothing todo */ }

    // Unselect all selected cells in other rows if selecting a cell in a new row
    let penaltyTriggered = false;
    if (!c.isSelected) {
      for (let r = 0; r < this.rows; r++) {
        if (r == c.r) { continue };
        for (let cell of this.cells[r]) {
          if (cell.isSelected) {
            cell.isSelected = false;
          }
        }
      }
    }

    // Enforce contiguous selection in the same row
    if (!c.isSelected) {
      const row = this.cells[c.r];
      // Find all selected indices in this row
      const selectedIndices = row.map((cell, idx) => cell.isSelected ? idx : -1).filter(idx => idx !== -1);
      if (selectedIndices.length > 0) {
        // If there is a gap between the new selection and any selected cell, unselect all in this row
        let hasGap = true;
        for (const idx of selectedIndices) {
          if (Math.abs(idx - c.c) === 1) {
            hasGap = false;
            break;
          }
        }
        if (hasGap) {
          for (let cell of row) {
            if (cell.isSelected) cell.isSelected = false;
          }
          // Penalty for non-adjacent selection in 'קשה' and 'קשה מאוד'
          if (this.state && (this.state.difficulty === 'קשה' || this.state.difficulty === 'קשה מאוד')) {
            this.state.points = Math.max(0, this.state.points - 20);
            penaltyTriggered = true;
            console.log('Penalty applied: -20 points');
            this.animatePoints();
            // Decrement lives for 'קשה מאוד'
            if (this.state.difficulty === 'קשה מאוד') {
              this.state.lives = Math.max(0, this.state.lives - 1);
              if (this.state.lives === 0) {
                this.state.isGameOver = true;
                this.stateChange.emit(this.state);
                this.playSound('gameOver');
                this.clearTimer();
                return;
              }
            }
            this.stateChange.emit(this.state);
            this.playSound('surprised-child-voice-sound-113127.mp3'); // Penalty sound
            // Animate penalty (flash board or points)
            this.animatePenalty();
          }
        }
      }
    }

    c.isSelected = !c.isSelected;

    if (this.state) this.triggerStateChange();
    this.onMove.emit();

    if (!c.isSelected) { return; }

    this.speak(c.letter);

    // debugger;
    const selCell = this.getSelectionRange(c);
    if (!selCell) { return; }
    const selWord = this.getWordFromselection(selCell);
    if (selWord?.length <= 1) {
      return;
    }

    const word = this.words.find(w => w.eng === selWord);
    if (word) {
      this.markSolved(selCell);
      word.found = true;
      // Add points for correct word found
      if (this.state) {
        this.state.points += word.eng.length * 10;
        this.stateChange.emit(this.state);
        this.animatePoints();
      }
      this.playSound('wordFound');
      await sleep(500);

      this.speak(word.eng);
      // fimxe - make spear return promise
      await sleep(500);
    }

    this.state.isGameOver = this.words.every(w => w.found);
    if (this.isGameOver) {
      // Add bonus points for remaining seconds
      if (this.state && this.state.timerDurationSec && this.state.timerDurationSec > 0) {
        this.state.points += this.state.timerDurationSec * 5;
        this.stateChange.emit(this.state);
        this.animatePoints();
      }
      this.stateChange.emit(this.state);
      setTimeout(() => {
        const sound = this.state.gameOverSoundFile ?? 'gameOver'
        this.playSound(sound);
        setTimeout(() => {
          this.alertRandomGameOverMessage();
        }, 1200);
      }, 500);
    }
  }

  alertRandomGameOverMessage() {
    const a = [
      'כל הכבוד !',
      'הצלחת !'
    ]
    const emojis = ['😀', '😃', '😺', '😻']
    const ia = getRandomInt(a.length - 1);
    const ie = getRandomInt(emojis.length - 1);
    alert(emojis[ie] + ' ' + a[ia] + emojis[ie])
  }

  playSound(soundName: 'gameStart' | 'gameOver' | 'wordFound' | string) {
    let audio = document.querySelector('audio');
    if (!audio) audio = document.createElement('audio');

    let file = null;
    if (audio.canPlayType('audio/mpeg')) {
      switch (soundName) {
        case "gameOver": file = getRandomGameOverSound(); break;
        case "wordFound": file = 'success-1-6297.mp3'; break;
        case 'gameStart': file = 'new-game/567250__iwanplays__dropping-rocks.wav'; break;
        default: file = soundName
      }
      if (!file) {
        console.error(`failed to play sound: ${file}`);
        return;
      }
      audio.setAttribute('src', 'assets/' + file);
      // audio.setAttribute('src','assets/mixkit-ending-show-audience-clapping-478.wav');
      audio.play();
    }
  }

  speak(what: string) {
    this.TTS.speak(what);
  }

  /** Utility to trigger stateChange without breaking BoardState methods */
  triggerStateChange() {
    // This will emit the current state and trigger Angular change detection
    this.stateChange.emit(this.state);
  }

  async animateRestartGame() {
    this.playSound('gameStart')
    await sleep(500);
    return new Promise(async resolve => {
      const f = [
        this.animateRestartGame1,
        this.animateRestartGame2,
        this.animateRestartGame3,
      ].map(f => f.bind(this))
      const i = Math.floor(Math.random() * f.length);
      await f[i]();

      setTimeout(() => {
        this.resetIsFlashed();
        resolve(null);
      }, 2000);
    })
  }

  resetIsFlashed() {
    const cells = this.state.cells.flatMap(x => x);
    cells.forEach(c => c.isFlashed = false)

  }

  async animateRestartGame1() {
    return new Promise(resolve => {
      const cells = [];
      for (let a of this.state.cells) {
        for (let c of a) { cells.push(c) }
      }
      from(cells).pipe(
        concatMap(item => of(item).pipe(delay(30))),
      ).subscribe({ next: x => x.isFlashed = true, complete: () => resolve(null) })
    })
  }

  async animateRestartGame2() {
    return new Promise(resolve => {
      const cells = this.state.cells.flatMap(x => x).filter(c => !(c.isSolved || c.isSelected));
      const byLetter = _.chain(cells).groupBy(c => c.letter).value();
      const keys = Object.keys(byLetter).sort()
      const animate = from(keys).pipe(
        map(k => byLetter[k]),
        concatMap(item => of(item).pipe(delay(50))),
      );
      animate.subscribe({
        next: cells => { cells?.forEach(c => c.isFlashed = true) },
        complete: () => resolve(null)
      })
    })
  }

  async animateRestartGame3() {
    return new Promise(resolve => {
      const cells = [];
      for (let c = 0; c < this.state.cols; c++) {
        for (let r = 0; r < this.state.rows; r++) {
          if (this.state.cells[r] && this.state.cells[r][c]) {
            cells.push(this.state.cells[r][c]);
          }
        }
      }
      from(cells).pipe(
        concatMap(item => of(item).pipe(delay(30))),
      ).subscribe({ next: x => x.isFlashed = true, complete: () => resolve(null) })
    })
  }

  animatePenalty() {
    // Simple animation: flash the points counter or board
    const boardDiv = document.querySelector('.center');
    if (boardDiv) {
      boardDiv.classList.add('penalty-flash');
      setTimeout(() => boardDiv.classList.remove('penalty-flash'), 400);
    }
  }

  get livesArray(): number[] {
    const n = Number(this.state?.lives ?? 0);
    console.log('livesArray getter:', this.state?.lives, '->', n);
    return Array.from({ length: n }, (_, i) => i);
  }

  get showLives(): boolean {
    return this.state?.difficulty === 'קשה מאוד' && typeof this.state?.lives === 'number' && this.state.lives > 0;
  }
}

function getRandomGameOverSound(): any {
  const a = [
    // '323436__alivvie__wow1.mp3',
    '428156__higgs01__yay.wav',
    '448274__henryrichard__sfx-success.wav',
    '456966__funwithsound__success-fanfare-trumpets.mp3',
    '456968__funwithsound__success-resolution-video-game-fanfare-sound-effect.mp3',
    '588391__funwithsound__music-dramatic-orchestral-ending-3.mp3',
    '607207__fupicat__congrats.wav',
    'cheering-and-clapping-crowd-1-5995.mp3',
    // 'cheering-and-clapping-crowd-2-6029.mp3',
  ]
  const i = Math.floor(Math.random() * a.length);

  return 'game-over/' + a[i];
}
