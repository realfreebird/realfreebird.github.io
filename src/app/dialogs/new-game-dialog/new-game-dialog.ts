import { Component, OnInit } from '@angular/core';
import { WordsBankService } from 'src/app/services/services';
import { StorageService } from 'src/app/services/storage.service';

@Component({
    selector: 'app-new-game-dialog',
    templateUrl: './new-game-dialog.html',
    styleUrls: ['./new-game-dialog.scss'],
    standalone: false
})
export class NewGameDialog implements OnInit {

  lettersCase: 'upper' | 'lower' = 'lower';
  banks: any[] = [];
  cols = 2;
  loading = true;

  constructor(public wordsBankService: WordsBankService, public storageService: StorageService) {
    // Bank loading moved to ngOnInit
  }

  async ngOnInit(): Promise<void> {
    // Clear saved state to force reload of banks
    localStorage.removeItem('state');
    this.loading = true;
    await this.wordsBankService.loadBanks();
    this.banks = this.wordsBankService.banks;
    const n = this.banks.length;
    if (n === 0) {
      throw new Error('failed to fetch banks');
    }
    for (let i = 5; i > 0; i--) {
      if (n % i === 0) {
        this.cols = i; break;
      }
    }
    this.loading = false;
  }

}
