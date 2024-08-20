import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AppStore } from '../../../app.store';

export interface HeaderItem {
  id: number;
  text: string;
  url: string;
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  private readonly _appStore = inject(AppStore);
  headerItems = signal<HeaderItem[]>([
    { id: 1, text: 'Photos', url: 'photos' },
    { id: 2, text: 'Favourites', url: 'favourites' },
  ]);

  getTotals(id: number): number {
    return id == 1 ? this._appStore.$totalPhotos() : this._appStore.$totalFavourites();
  }
}
