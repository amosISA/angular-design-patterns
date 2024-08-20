import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input, OnDestroy, OnInit } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { AppStore } from '../../../app.store';
import { SearchStrategy } from '../../../layout/components/search/search-strategy';
import { Favourite } from '../../models/favourite.interface';
import { FavouritesService } from './favourites.service';

@Component({
  selector: 'app-favourites',
  templateUrl: './favourites.component.html',
  standalone: true,
  imports: [NgOptimizedImage],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FavouritesComponent implements OnInit, OnDestroy {
  readonly appStore = inject(AppStore);
  private readonly _favouritesService = inject(FavouritesService);
  private readonly _router = inject(Router);

  strategy = input.required<SearchStrategy>();

  favourites = toSignal(
    this._favouritesService.getFavourites().pipe(
      tap((favs: Favourite[]) => {
        this.appStore.setFavourites([...favs]);
        this.appStore.setFilteredFavourites([...favs]);
      })
    )
  );

  ngOnInit(): void {
    this.appStore.setStrategy(this.strategy());
  }

  ngOnDestroy(): void {
    this.appStore.clearSearchInput();
  }

  removeFavourite(photoId: string): void {
    this._favouritesService.removeFromFavourites(photoId);
  }

  showPhoto(photoId: string): void {
    this._router.navigateByUrl(`/photos/${photoId}`);
  }
}
