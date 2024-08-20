import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AppStore } from '../../../app.store';
import { Favourite } from '../../models/favourite.interface';

@Injectable({ providedIn: 'root' })
export class FavouritesService {
  private _favouritesSubject$ = new BehaviorSubject<Favourite[]>([]);
  private _favourites: Favourite[] = [];

  private readonly _appStore = inject(AppStore);

  constructor() {
    this._loadFavourites();
  }

  getFavourites(): Observable<Favourite[]> {
    return this._favouritesSubject$.asObservable();
  }

  getFavourite(photoId: string): Favourite | undefined {
    return this._favourites.find((photo: Favourite) => photo.id === photoId);
  }

  addToFavourites(photo: Favourite): void {
    if (!this._favourites.some((p: Favourite) => p.id === photo.id)) {
      this._favourites.push(photo);
      this._saveFavourites();
      this._appStore.setFavouritesTotals(this._favourites.length);
    }
  }

  removeFromFavourites(photoId: string): void {
    this._favourites = this._favourites.filter((p: Favourite) => p.id !== photoId);
    this._saveFavourites();
    this._appStore.setFavouritesTotals(this._favourites.length);
  }

  private _saveFavourites(): void {
    localStorage.setItem('favourites', JSON.stringify(this._favourites));
    this._favouritesSubject$.next(this._favourites);
  }

  private _loadFavourites(): void {
    const storedFavourites = localStorage.getItem('favourites');
    if (storedFavourites) {
      this._favourites = JSON.parse(storedFavourites);
      this._favouritesSubject$.next(this._favourites);
      this._appStore.setFavouritesTotals(this._favourites.length);
    }
  }
}
