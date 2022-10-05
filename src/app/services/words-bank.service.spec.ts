import { TestBed } from '@angular/core/testing';

import { WordsBankService } from './words-bank.service';

describe('WordsBankService', () => {
  let service: WordsBankService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WordsBankService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
