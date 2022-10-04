import { Component, Input, OnInit } from '@angular/core';

class Cell {

  get letter() { return this._letter; }
  set letter(v) {
    if (this._letter) {
      throw new Error(`cell ${this.r}.${this.c} alreay set to '${this._letter}'`)
    }
    this._letter = v;
  }

  constructor(private _letter: string, public r: number, public c: number, public _state_TODO?: any) { }
}

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}


@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {

  @Input() rows = 8;
  @Input() cols = 8;
  @Input() words = ['cat', 'dog', 'wolf', 'fox', 'fish', 'monkey', 'pig'];
  // @Input() words = ['cat'];
  // @Input() words = ['12345678901']; // todo - throw error -or- ignore  when word is larger than board 

  cells: Array<Array<Cell>> = []

  constructor() { }

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
        const l = String.fromCharCode(97+getRandomInt(26))
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

    const errors: string[] = [];
    for (const w of this.words) {
      let cell0 = findRandomEmptyCell(w.length);
      if (!cell0) {
        errors.push(w);
        continue;
      }

      let cell = cell0;

      for (const letter of w) {
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

}
