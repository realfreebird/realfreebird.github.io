import { Component, Input, OnInit } from '@angular/core';
import { TtsService } from 'src/app/services/tts.service';

interface Word {
  eng: string,
  heb: string,
  found: boolean,
}

class Cell {

  get letter() { return this._letter; }
  set letter(v) {
    if (this._letter) { throw new Error(`cell ${this.r}.${this.c} alreay set to '${this._letter}'`); }
    this._letter = v;
  }

  isSelected = false;
  isSolved = false;

  constructor(private _letter: string, public r: number, public c: number, public _state_TODO?: any) { }
}

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}


interface RowCellSelection {
  row: number;
  startCol: number;
  endCol: number;
}

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {

  @Input() rows = 8;
  @Input() cols = 8;
  @Input() words: Word[] = [
    { eng: 'cat', heb: 'חתול' },
    { eng: 'dog', heb: 'כלב' },
    { eng: 'wolf', heb: 'זאב' },
    { eng: 'fox', heb: 'שועל' },
    { eng: 'fish', heb: 'דג' },
    { eng: 'monkey', heb: 'קוף' },
    { eng: 'pig', heb: 'חזיר' }
  ].map(x => ({ ...x, found: false }));
  // @Input() words = ['cat'];
  // @Input() words = ['12345678901']; // todo - throw error -or- ignore  when word is larger than board 

  cells: Array<Array<Cell>> = []

  constructor(public TTS: TtsService) { (window as any).board = this; }

  ngOnInit(): void {
    this.init()
  }

  init() {
    this.createEmptyBoard();
    this.addWords2Board();
    this.fillTheBlanks();
  }

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

  createEmptyBoard() {
    const a = [];
    for (let r = 0; r < this.rows; r++) {
      const row = [];
      for (let c = 0; c < this.cols; c++) {
        row.push(new Cell('', r, c))
      }
      a.push(row)
    }
    this.cells = a;
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

  // selCount = 0;

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

  toggleCellSelection(c: Cell) {
    if (c.isSolved) { return; /* nothing todo */ }

    c.isSelected = !c.isSelected;
    if (!c.isSelected) { return; }

    // debugger;
    const selCell = this.getSelectionRange(c);
    if (!selCell) { return; }
    const selWord = this.getWordFromselection(selCell);
    if (selWord?.length <= 1) { return; }

    setTimeout(() => {

      const word = this.words.find(w => w.eng === selWord);
      if (word) {
        this.markSolved(selCell);
        word.found = true;
      }

      const gameOver = this.words.every(w => w.found);
      if (gameOver) {
        alert('yey!!! all found !!!')
      }

    }, 0);
  }

  speak(what: string) {
    this.TTS.speak(what);
  }

}
