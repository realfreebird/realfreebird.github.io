import { Word } from 'src/app/services/words-bank.service';


export interface WordZ extends Word {
    eng: string,
    heb: string,
    found: boolean,
}

export class Cell {

    // get letter() { return this._letter; }
    // set letter(v) {
    //     if (this._letter) { throw new Error(`cell ${this.r}.${this.c} alreay set to '${this._letter}'`); }
    //     this._letter = v;
    // }

    isSelected = false;
    isSolved = false;
    isFlashed = false;

    // constructor(private _letter: string, public r: number, public c: number, public _state_TODO?: any) { }
    constructor(public letter: string, public r: number, public c: number, public _state_TODO?: any) { }
}

export interface RowCellSelection {
    row: number;
    startCol: number;
    endCol: number;
}


export class BoardState {
    words: WordZ[] = [];
    cells: Array<Array<Cell>> = []
    isGameOver = false;
    constructor(
        public rows = 8,
        public cols = 8,
        public wordsPerGame: number = 5,
        public bank: string | null = null,
        public isUpperCase = false,
        public showEngWords = true) {
    }
}