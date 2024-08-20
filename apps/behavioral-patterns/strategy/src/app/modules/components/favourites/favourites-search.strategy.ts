import { inject, Injectable } from '@angular/core';
import { AppStore } from '../../../app.store';
import { SearchStrategy } from '../../../layout/components/search/search-strategy';
import { Favourite } from '../../models/favourite.interface';

@Injectable()
export class FavouriteSearchStrategy implements SearchStrategy {
  private readonly _appStore = inject(AppStore);

  filter(searchTerm: string): void {
    if (!searchTerm) {
      this._appStore.setFavouritesTotals(this._appStore.$favourites().length);
      this._appStore.setItemsBeingFiltered(0);
      this._appStore.setFilteredFavourites([...this._appStore.$favourites()]);
      return;
    }
    this._appStore.setFilteredFavourites([...this._appStore.$favourites().filter(
      (p: Favourite) => p.id.includes(searchTerm)
    )]);
    this._appStore.setItemsBeingFiltered(this._appStore.$filteredFavourites().length);
    this._appStore.setFavouritesTotals(this._appStore.$favourites().length);
  }
}
