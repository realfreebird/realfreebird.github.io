import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TtsService } from 'src/app/services/tts.service';
import { Word, WordsBankService } from 'src/app/services/words-bank.service';
import { BoardState, Cell, RowCellSelection } from './types';

async function sleep(ms: number) {
  await Promise.resolve((resolve: any) => { setTimeout(() => { resolve(); }, ms); });
}

// animal list : https://gist.github.com/borlaym/585e2e09dd6abd9b0d0a

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}


@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {

  @Input() state!: BoardState
  @Output() stateChange = new EventEmitter<BoardState>();

  get wordsPerGame() { return this.state?.wordsPerGame; };
  get rows() { return this.state?.rows; }
  get cols() { return this.state?.cols; }
  get bank() { return this.state?.bank; }
  get words() { return this.state?.words; }
  get cells() { return this.state?.cells; }
  get isGameOver() { return this.state?.isGameOver; }

  onMove = new EventEmitter<void>();
  onGameOver = new EventEmitter<void>();

  constructor(public wordsBankService: WordsBankService, public TTS: TtsService) { (window as any).board = this; }

  ngOnInit(): void { /* this.init() */ }


  /** get n random words based on this.bank & this.wordsPerGame */
  getWords() {
    if (!this.bank) { return; }
    this.state.words = this.wordsBankService.get(this.bank, this.wordsPerGame).map(w => ({ ...w, found: false }));
  }

  /** fill this.board with this.rows & this.cols empty cells */
  createEmptyBoard() {
    const a = [];
    for (let r = 0; r < this.rows; r++) {
      const row = [];
      for (let c = 0; c < this.cols; c++) { row.push(new Cell('', r, c)) }
      a.push(row)
    }
    this.state.cells = a;
  }

  addWords2Board() {

    const findRandomEmptyCell = (len: number) => {
      for (let i = 0; i < 100; i++) {
        const r = getRandomInt(this.rows);
        const c = getRandomInt(this.cols - len);
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
        cell.letter = letter;
        const nextCell = this.cells[cell.r][cell.c + 1];
        cell = nextCell;
      }
    }

    // TODO FIXME
    if (errors.length) {
      alert('could not fit all words: ' + JSON.stringify(errors))
    }
  }

  /** fill alll empty cells with random letters */
  fillTheBlanks() {
    for (let r = 0; r < this.rows; r++) {
      const row = this.cells[r];
      for (let c = 0; c < this.cols; c++) {
        if (row[c].letter) { continue; }
        const l = String.fromCharCode(97 + getRandomInt(26))
        row[c].letter = l
      }
    }
  }

  resetFoundWords() {
    this.words.forEach(w => w.found = false);
  }

  init(bank: string) {
    this.state = new BoardState();
    this.state.bank = bank ?? 'animals'; // FIXME !!!

    this.getWords();
    this.createEmptyBoard();
    this.addWords2Board();
    this.fillTheBlanks();
    this.resetFoundWords();

    this.stateChange.emit(this.state);
  }

  restartGame(bank: string) {
    this.init(bank);
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

    c.isSelected = !c.isSelected;

    if (this.state) this.state = { ... this.state };
    this.stateChange.emit(this.state);
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
      this.stateChange.emit(this.state);

      this.playSound('wordFound');
      await sleep(500);

      this.speak(word.eng);
      // fimxe - make spear return promise
      await sleep(500);
    }

    this.state.isGameOver = this.words.every(w => w.found);
    if (this.isGameOver) {
      this.stateChange.emit(this.state);
      setTimeout(() => {
        this.playSound('gameOver');
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

  playSound(soundName: 'gameOver' | 'wordFound') {
    let audio = document.querySelector('audio');
    if (!audio) audio = document.createElement('audio');

    let file = null;
    if (audio.canPlayType('audio/mpeg')) {
      switch (soundName) {
        case "gameOver": file = getRandomGameOverSound(); break;
        case "wordFound": file = 'success-1-6297.mp3'; break;
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
