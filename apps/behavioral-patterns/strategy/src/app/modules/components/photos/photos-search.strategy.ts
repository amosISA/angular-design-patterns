import { inject, Injectable } from '@angular/core';
import { AppStore } from '../../../app.store';
import { SearchStrategy } from '../../../layout/components/search/search-strategy';
import { Photo } from '../../models/photo.interface';

@Injectable()
export class PhotoSearchStrategy implements SearchStrategy {
  private readonly _appStore = inject(AppStore);

  filter(searchTerm: string): void {
    if (!searchTerm) {
      this._appStore.setPhotosTotals(this._appStore.$photos().length);
      this._appStore.setItemsBeingFiltered(0);
      this._appStore.setFilteredPhotos([...this._appStore.$photos()]);
      return;
    }
    this._appStore.setFilteredPhotos([...this._appStore.$photos().filter(
      (p: Photo) => p.id.includes(searchTerm)
    )]);
    this._appStore.setItemsBeingFiltered(this._appStore.$filteredPhotos().length);
    this._appStore.setPhotosTotals(this._appStore.$photos().length);
  }
}
