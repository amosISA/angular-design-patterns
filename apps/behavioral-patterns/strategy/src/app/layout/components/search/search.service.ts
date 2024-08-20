import { Injectable } from '@angular/core';
import { SearchStrategy } from './search-strategy';

@Injectable()
export class SearchService {
  private _strategy!: SearchStrategy;

  setStrategy(strategy: SearchStrategy): void {
    this._strategy = strategy;
  }

  filter(searchTerm: string): void {
    if (!this._strategy) {
      return;
    }
    this._strategy.filter(searchTerm);
  }
}
