import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { BoardState } from 'src/app/components/board/types';
import { BoardComponent } from 'src/app/components/board/board.component';
import { NewGameDialog } from 'src/app/dialogs/dialogs';
import { NavigationComponent } from 'src/app/navigation/navigation.component';
import { StorageService } from 'src/app/services/storage.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    standalone: true,
    imports: [CommonModule, BoardComponent, MatButtonModule]
})
export class HomeComponent implements OnInit, AfterViewInit {

  @ViewChild(BoardComponent) board!: BoardComponent;
  bank = 'animals'; // fixme add WordsBankService.DefaultBank

  @Input()
  private _state!: BoardState;
  public get state(): BoardState {
    return this._state;
  }
  public set state(value: BoardState) {
    this._state = value;
    this.saveState();
  }

  constructor(public route: ActivatedRoute, private dialogs: MatDialog, public navCompo: NavigationComponent, public storageService: StorageService) {
    // TODO: Storage temporarily disabled for debugging
    // const state: BoardState | null = this.storageService.get('state')
    // if (state) {
    //   // Ensure lives is always a number
    //   if (typeof state.lives !== 'number') {
    //     state.lives = Number(state.lives) || 0;
    //   }
    //   if (isNaN(state.lives)) {
    //     // Remove corrupted state and force new game
    //     localStorage.removeItem('state');
    //     this._state = new BoardState();
    //     return;
    //   }
    //   this.state = state;
    // }
    // else this.state = new BoardState()
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      // debugger;
      if (this.state) this.restartTimers();
      else this.restartGame();
    }, 0);
  }

  private saveState() {
    // TODO: Storage temporarily disabled for debugging
    // this.storageService.set('state', this.state);
  }

  restartTimers() {
    this.board.restartTimers();
  }

  startingNewGame = false;
  restartGame() {
    // TODO: Storage temporarily disabled for debugging
    // localStorage.removeItem('state'); // Always clear state before new game
    const params: MatDialogConfig = {
      panelClass: 'new-game-dialog-panel',
      width: '500px',
      height: '450px'
    };
    const d = this.dialogs.open(NewGameDialog, params);
    d.afterClosed().subscribe(async (v: { bank: string, isUpperCase: boolean, randomColors: boolean, gameOverSoundFile: string, gameOverImg: string, wildcard: string, wildcardMagic: boolean, difficulty: 'קליל' | 'קל' | 'קשה' | 'קשה מאוד' }) => {
      // debugger;
      const bank = v?.bank;
      if (bank) {
        this.bank = bank;
        this.startingNewGame = true;
        await this.board.restartGame(v);
        this.startingNewGame = false;
      }
    })
  }

}
