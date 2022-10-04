import { Injectable } from '@angular/core';

// https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis
// https://github.com/mdn/dom-examples/tree/main/web-speech-api/speak-easy-synthesis

@Injectable({
  providedIn: 'root'
})
export class TtsService {

  constructor() { }

  speak(s: string) {
    let utterance = new SpeechSynthesisUtterance(s);
    speechSynthesis.speak(utterance);
  }
}
