import { Injectable } from '@angular/core';
import banks from './words.json';

export interface Word {
  eng: string,
  heb: string,
  // found: boolean,
}

// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffle(array: any[]) {
  let currentIndex = array.length, randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}


@Injectable({
  providedIn: 'root'
})
export class WordsBankService {

  getBanks() {
    return banks.map(b => ({ eng: b.eng, heb: b.heb, randomColors: b.randomColors, gameOverSoundFile: b.gameOverSoundFile, gameOverImg: b.gameOverImg }))
  }

  get(bank: string, max: number, isUpperCase: boolean): Word[] {
    const r = banks.find(x => x.eng === bank);
    if (r) {
      let words0 = [...r.words];
      const f = (s: string) => isUpperCase ? s.toUpperCase() : s.toLocaleLowerCase();
      const words = words0.map(w => ({ ...w, eng: f(w.eng) }))
      return shuffle(words).splice(0, max);
    }
    return [];
  }

  constructor() { }
}
