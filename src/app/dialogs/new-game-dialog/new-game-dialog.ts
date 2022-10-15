import { Component, OnInit } from '@angular/core';
import { WordsBankService } from 'src/app/services/services';

@Component({
  selector: 'app-new-game-dialog',
  templateUrl: './new-game-dialog.html',
  styleUrls: ['./new-game-dialog.scss']
})
export class NewGameDialog implements OnInit {

  banks;
  cols = 2;

  constructor(public wordsBankService: WordsBankService) {
    this.banks = wordsBankService.getBanks();
    const n = this.banks.length;
    if (n === 0) {
      throw new Error('failed to fetch banks');
    }

    for (let i = 5; i>0; i--) {
      if (n % i === 0 ) {
        this.cols = i; break;
      }
    }

    // if (n <= 5) this.cols = n;
    // else {

    //   for (this.cols = 5; this.cols > 0; this.cols--) {
    //     if (n % this.cols == 0) break;
    //   }
    // }
  }

  ngOnInit(): void {
  }

}
