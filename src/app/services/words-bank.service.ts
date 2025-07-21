import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import * as XLSX from 'xlsx';
import banksLocal from './words.json';

export interface Word {
  eng: string,
  heb: string,
  ignore?: boolean
}

function shuffle(array: any[]) {
  let currentIndex = array.length, randomIndex;
  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
  return array;
}

@Injectable({
  providedIn: 'root'
})
export class WordsBankService {
  banks: any[] = [];

  constructor() {
  }

  async loadBanks() {
    if (environment.wordBankSource === 'google') {
      try {
        console.log('Loading banks from Google Sheets...');
        const resp = await fetch(environment.googleSheetUrl);
        console.log('Google Sheets response:', resp);
        if (!resp.ok) throw new Error('Failed to fetch Google Sheet');
        const data = await resp.arrayBuffer();
        const workbook = XLSX.read(data, { type: 'array' });
        this.banks = this.parseGoogleSheet(workbook);
        // list the banks and number of words for each bank
        console.log('Banks loaded from Google Sheets:', this.banks.map(b => `${b.eng} (${b.words.length})`));
        if (!this.banks.length) throw new Error('No banks loaded from Google Sheet');
      } catch (e) {
        console.error(e);
        // fallback to local
        this.banks = banksLocal;
      }
    } else {
      this.banks = banksLocal;
    }
    // --- Add dynamic combined bank 'הפתעה' ---
    if (this.banks && this.banks.length) {
      const allWords = this.banks.flatMap(b => b.words).filter(w => w && w.eng && w.heb && !w.ignore);
      const surpriseBank = {
        eng: 'surprise',
        heb: 'הפתעה',
        words: allWords,
        wildcard: '🌸',
        // randomColors: true
      };
      this.banks = [surpriseBank, ...this.banks];
    }
  }

  private parseGoogleSheet(workbook: XLSX.WorkBook): any[] {
    // Each sheet is a bank
    const banks: any[] = [];
    workbook.SheetNames.forEach(sheetName => {
      const ws = workbook.Sheets[sheetName];
      const rows = XLSX.utils.sheet_to_json(ws, { header: 1 });
      if (!rows.length) return;
      // Find header row
      const headerRow = rows[0] as string[];
      if (!headerRow.includes('eng') || !headerRow.includes('heb')) return;
      // Find where the word list ends (empty row or property table)
      let wordRows: any[] = [];
      let i = 1;
      for (; i < rows.length; i++) {
        const row = rows[i] as any[];
        if (!row[0] && !row[1]) break;
        if (row[0] === 'property' && row[1] === 'value') break;
        wordRows.push(row);
      }
      const words = wordRows.map((r: any[]) => ({ eng: r[0], heb: r[1] })).filter(w => w.eng && w.heb);
      // Parse properties if present
      let props: any = {};
      for (; i < rows.length; i++) {
        const row = rows[i] as any[];
        if (row[0] === 'property' && row[1] === 'value') continue;
        if (row[0] && row[1]) props[row[0]] = row[1];
      }
      // Bank name: sheetName, or parse for display
      banks.push({
        eng: sheetName.split('|')[0] || sheetName,
        heb: sheetName.split('|')[1] || '',
        words,
        ...props
      });
    });
    return banks;
  }

  async get(bank: string, max: number, isUpperCase: boolean): Promise<Word[]> {
    const r = this.banks.find(x => x.eng === bank);
    if (r) {
      let words0: Word[] = [...(r.words as Word[]).filter(w =>!w.ignore)];
      const f = (s: string) => isUpperCase ? s.toUpperCase() : s.toLocaleLowerCase();
      const words = words0.map(w => ({ ...w, eng: f(w.eng) }))
      const ret = shuffle(words).splice(0, max);
      return ret;
    }
    return [];
  }
}
