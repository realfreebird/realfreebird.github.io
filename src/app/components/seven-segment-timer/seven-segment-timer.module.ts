import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SevenSegmentTimerComponent } from './seven-segment-timer.component';

@NgModule({
  declarations: [SevenSegmentTimerComponent],
  imports: [CommonModule],
  exports: [SevenSegmentTimerComponent]
})
export class SevenSegmentTimerModule {}
