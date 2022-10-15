import { Injectable } from '@angular/core';

class StorageValueIsNoObjectError extends Error { }

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  get<T extends {}>(key: string): T | null {
    const s = localStorage.getItem(key);
    if (s === null) return s;
    try {
      return JSON.parse(s);
    }
    catch (e) {
      if (e instanceof SyntaxError) {
        throw new StorageValueIsNoObjectError(e.message);
      }
      throw e;
    }
  }
  set<T extends {}>(key: string, val: T) {
    const s = JSON.stringify(val, null, 2);
    return localStorage.setItem(key, s);
  }
}


