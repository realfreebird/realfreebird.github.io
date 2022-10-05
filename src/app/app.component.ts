import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import packageJson from '../../package.json';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(title: Title) {
    const s  = 'פאזל מילים לזוהר | v' + packageJson.version;
    title.setTitle(s);
  }

//   playAudio() {
// // debugger;
//     let audio = document.querySelector('audio');
//     if (!audio) audio = document.createElement('audio');

//     if (audio.canPlayType('audio/mpeg')) {
//       audio.setAttribute('src','assets/success-1-6297.mp3');
//       // audio.setAttribute('src','assets/cheering-and-clapping-crowd-1-5995.mp3');
//       // audio.setAttribute('src','assets/mixkit-ending-show-audience-clapping-478.wav');
//     }
    
//     // if (audio.canPlayType('audio/ogg')) {
//     //   audio.setAttribute('src','audiofile.ogg');
//     // }
    
//     // alert('play');
    
//     audio.play();
    
//     // alert('stop');
    
//     // audio.pause();
    
//     // alert('play from 5 seconds in');
    
//     // audio.currentTime = 5;
//     // audio.play();
    
//   }

}
