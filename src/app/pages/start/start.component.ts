import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class StartComponent {
  selectedCase: 'lower' | 'upper' = 'lower';
  selectedDiff: 'easy' | 'medium' | 'hard' = 'easy';
  selectedCat: string | null = null;

  categories = [
    { value: 'המממ', label: 'המממ' },
    { value: '🍎', label: '🍎' },
    { value: '🌠', label: '🌠' },
    { value: 'ים', label: 'ים' },
    { value: 'טבע', label: 'טבע' },
    { value: 'crazy cat', label: 'crazy cat' },
    { value: '🎂', label: '🎂' },
    { value: 'חיות', label: 'חיות' },
    { value: 'צבעים', label: 'צבעים' },
    { value: 'מספרים', label: 'מספרים' },
    { value: 'שונות', label: 'שונות' }
  ];

  floatingLettersTop: {char: string, x: number, y: number, delay: number, size: number, dist: number}[] = [];
  floatingLettersBottom: {char: string, x: number, y: number, delay: number, size: number, dist: number}[] = [];
  topicAnimIndex = 0;
  private topicAnimTimer: any;
  private topicAnimActive = false;

  constructor(private router: Router) {
    this.floatingLettersTop = this.generateFloatingLetters();
    this.floatingLettersBottom = this.generateFloatingLetters();
  }

  ngOnInit() {
    this.topicAnimActive = true;
    this.startTopicAnimLoop();
  }
  ngOnDestroy() {
    this.topicAnimActive = false;
    if (this.topicAnimTimer) clearTimeout(this.topicAnimTimer);
  }

  generateFloatingLetters() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const arr = [];
    for (let i = 0; i < 18; i++) {
      arr.push({
        char: chars[Math.floor(Math.random() * chars.length)],
        x: Math.random() * 92 + 2,
        y: Math.random() * 80,
        delay: Math.random() * 3,
        size: Math.random() * 18 + 22,
        dist: Math.random() * 32 + 24
      });
    }
    return arr;
  }

  startTopicAnimLoop() {
    const perBtn = 5000 / this.categories.length;
    let i = 0;
    const animateNext = () => {
      if (!this.topicAnimActive) return;
      this.topicAnimIndex = i;
      i++;
      if (i < this.categories.length) {
        this.topicAnimTimer = setTimeout(animateNext, perBtn);
      } else {
        // End of loop: wait 5s, then restart
        this.topicAnimTimer = setTimeout(() => {
          if (!this.topicAnimActive) return;
          i = 0;
          animateNext();
        }, 5000);
      }
    };
    animateNext();
  }

  selectCase(val: 'lower' | 'upper') {
    this.selectedCase = val;
  }
  selectDifficulty(val: 'easy' | 'medium' | 'hard') {
    this.selectedDiff = val;
  }
  selectCategory(val: string) {
    this.selectedCat = val;
  }
  startGame() {
    if (!this.selectedCat) {
      alert('בחרו נושא!');
      return;
    }
    // Navigate to play page with params
    this.router.navigate(['/play'], {
      queryParams: {
        case: this.selectedCase,
        cat: this.selectedCat,
        diff: this.selectedDiff
      }
    });
  }
}
