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
    // displayLetter =  null; // null = same as this.letter

    // constructor(private _letter: string, public r: number, public c: number, public _state_TODO?: any) { }
    constructor(public letter: string, public r: number, public c: number, public xtraClass: string, public displayLetter?: string) { }
}

export interface RowCellSelection {
    row: number;
    startCol: number;
    endCol: number;
}


export class BoardState {
    words: WordZ[] = [];
    cells: Array<Array<Cell>> = [];
    isGameOver = false;
    gameOverSoundFile!: string;
    gameOverImg!: string;
    difficulty: 'קליל' | 'קל' | 'קשה' | 'קשה מאוד' = 'קליל';
    timerDurationSec: number | null = null;
    points: number = 0; // Points system
    lives: number = 3; // Lives system for 'קשה מאוד'
    constructor(
        public rows = 8,
        public cols = 8,
        public wordsPerGame: number = 5,
        public bank: string | null = null,
        public isUpperCase = false,
        public showEngWords = true,
        public randomColors = false,
        public wildcard: string | null = null,
        public wildcardMagic = true
    ) {
        // Guarantee all properties are valid
        this.lives = typeof this.lives === 'number' ? this.lives : Number(this.lives) || 0;
        this.words = Array.isArray(this.words) ? this.words : [];
        this.cells = Array.isArray(this.cells) ? this.cells : [];
        this.setTimerDuration();
    }
    setTimerDuration() {
        if (this.difficulty === 'קליל') {
            this.timerDurationSec = null;
        } else {
            const baseTimePerWord = 20;
            const multipliers: Record<string, number> = {
                'קל': 1.5,
                'קשה': 1.0,
                'קשה מאוד': 0.7
            };
            const multiplier = multipliers[this.difficulty] ?? 1.0;
            this.timerDurationSec = Math.round((baseTimePerWord * this.wordsPerGame) * multiplier);
        }
        // Set lives for 'קשה מאוד'
        if (this.difficulty === 'קשה מאוד') {
            this.lives = 3;
        } else {
            this.lives = 0;
        }
        this.lives = typeof this.lives === 'number' ? this.lives : Number(this.lives) || 0;
    }
}