import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-seven-segment-timer',
  templateUrl: './seven-segment-timer.component.html',
  styleUrls: ['./seven-segment-timer.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class SevenSegmentTimerComponent implements OnChanges {
  @Input() seconds: number = 0;
  @Input() urgent: boolean = false;
  minutesStr: string = '00';
  secondsStr: string = '00';
  minutesArr: string[] = ['0', '0'];
  secondsArr: string[] = ['0', '0'];

  ngOnChanges(changes: SimpleChanges): void {
    this.updateDisplay();
  }

  private updateDisplay() {
    const min = Math.floor(this.seconds / 60);
    const sec = this.seconds % 60;
    this.minutesStr = min.toString().padStart(2, '0');
    this.secondsStr = sec.toString().padStart(2, '0');
    this.minutesArr = this.minutesStr.split('');
    this.secondsArr = this.secondsStr.split('');
  }
}
