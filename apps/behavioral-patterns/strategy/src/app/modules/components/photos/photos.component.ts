import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input, OnDestroy, OnInit } from '@angular/core';
import { AppStore } from '../../../app.store';
import { SearchStrategy } from '../../../layout/components/search/search-strategy';
import { Photo } from '../../models/photo.interface';
import { FavouritesService } from '../favourites/favourites.service';

@Component({
  selector: 'app-photos',
  templateUrl: './photos.component.html',
  standalone: true,
  imports: [NgOptimizedImage],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhotosComponent implements OnInit, OnDestroy {
  readonly appStore = inject(AppStore);
  private readonly _favouritesService = inject(FavouritesService);

  strategy = input.required<SearchStrategy>();

  ngOnInit(): void {
    this.appStore.setStrategy(this.strategy());

    if (this.appStore.$photos()?.length === 0) {
      this.loadMorePhotos();
    }
  }

  ngOnDestroy(): void {
    this.appStore.setPhotos([]);
    this.appStore.clearSearchInput();
  }

  loadMorePhotos(totals = 20): void {
    this.appStore.loadMorePhotos(totals);
  }

  addFavourite(photo: Photo): void {
    this._favouritesService.addToFavourites(photo);
  }
}
