import { inject, Injectable, signal } from "@angular/core";
import { createEffect } from "ngxtension/create-effect";
import { concatMap, finalize, Observable, Subject, tap } from "rxjs";
import { SearchStrategy } from "./layout/components/search/search-strategy";
import { PhotosService } from "./modules/components/photos/photos.service";
import { Favourite } from "./modules/models/favourite.interface";
import { Photo } from "./modules/models/photo.interface";

@Injectable({ providedIn: 'root' })
export class AppStore {
  private readonly _photosService = inject(PhotosService);
  private readonly _state = {
    // Global
    $strategy: signal<SearchStrategy | null>(null),
    $itemsBeingFiltered: signal(0),
    $isLoading: signal(false),
    $clearSearch: new Subject<null>(),

    // Photos
    $totalPhotos: signal(0),
    $photos: signal<Photo[]>([]),
    $filteredPhotos: signal<Photo[]>([]),
    
    // Favourites
    $totalFavourites: signal(0),
    $favourites: signal<Favourite[]>([]),
    $filteredFavourites: signal<Favourite[]>([]),
  };

  // Global
  readonly $strategy = this._state.$strategy.asReadonly();
  readonly $isLoading = this._state.$isLoading.asReadonly();
  readonly $itemsBeingFiltered = this._state.$itemsBeingFiltered.asReadonly();
  readonly $clearSearch = this._state.$clearSearch.asObservable();

  setStrategy(strategy: SearchStrategy): void {
    this._state.$strategy.set(strategy);
  }

  setItemsBeingFiltered(totals: number): void {
    this._state.$itemsBeingFiltered.set(totals);
  }

  setIsLoading(isLoading: boolean): void {
    this._state.$isLoading.set(isLoading);
  }

  clearSearchInput(): void {
    this._state.$clearSearch.next(null);
  }

  // Photos
  readonly $totalPhotos = this._state.$totalPhotos.asReadonly();
  readonly $photos = this._state.$photos.asReadonly();
  readonly $filteredPhotos = this._state.$filteredPhotos.asReadonly();

  setPhotosTotals(totals: number): void {
    this._state.$totalPhotos.set(totals);
  }

  setPhotos(photos: Photo[]): void {
    this._state.$photos.set(photos);
  }

  setFilteredPhotos(filteredPhotos: Photo[]): void {
    this._state.$filteredPhotos.set(filteredPhotos);
  }

  public readonly loadMorePhotos = createEffect(
    (totalPhotos: Observable<number>) => totalPhotos.pipe(
      tap(() => this.setIsLoading(true)),
      concatMap((total: number) => {
        return this._photosService.getRandomPhotos(total).pipe(
          tap((newPhotos: Photo[]) => {
            this.setPhotos([...this._state.$photos(), ...newPhotos]);
            this.setFilteredPhotos([...this._state.$photos()]);
            this.setPhotosTotals(this._state.$photos().length);
          }),
          finalize(() => this.setIsLoading(false))
        )
      })
    )
  );
  
  // Favourites
  readonly $totalFavourites = this._state.$totalFavourites.asReadonly();
  readonly $favourites = this._state.$favourites.asReadonly();
  readonly $filteredFavourites = this._state.$filteredFavourites.asReadonly();

  setFavouritesTotals(totals: number): void {
    this._state.$totalFavourites.set(totals);
  }

  setFavourites(favourites: Favourite[]): void {
    this._state.$favourites.set(favourites);
  }

  setFilteredFavourites(filteredFavourites: Favourite[]): void {
    this._state.$filteredFavourites.set(filteredFavourites);
  }
}