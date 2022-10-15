import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { BoardState } from 'src/app/components/board/types';
import { BoardComponent } from 'src/app/components/components';
import { NewGameDialog } from 'src/app/dialogs/dialogs';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
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

  constructor(public route: ActivatedRoute, private dialogs: MatDialog, public storageService: StorageService) {
    const state: BoardState | null = this.storageService.get('state')
    if (state) this.state = state;
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (!this.state) this.restartGame();
    }, 0);
  }

  private saveState() {
    this.storageService.set('state', this.state);
  }

  startingNewGame = false;
  restartGame() {
    const params: MatDialogConfig = {
      panelClass: 'new-game-dialog-panel',
      width: '300px',
      // height: '200px'
    };
    const d = this.dialogs.open(NewGameDialog, params);
    d.afterClosed().subscribe(async (bank: string) => {
      if (bank) {
        this.bank = bank;
        this.startingNewGame = true;
        await this.board.restartGame(this.bank);
        this.startingNewGame = false;
      }
    })
  }

}
