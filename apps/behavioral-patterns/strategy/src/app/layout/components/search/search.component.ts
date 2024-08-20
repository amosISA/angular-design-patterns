import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, signal } from "@angular/core";
import { takeUntilDestroyed, toObservable } from "@angular/core/rxjs-interop";
import { FormsModule } from "@angular/forms";
import { debounceTime, distinctUntilChanged, Observable, tap } from "rxjs";
import { AppStore } from "../../../app.store";
import { SearchStrategy } from "./search-strategy";
import { SearchService } from "./search.service";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  standalone: true,
  imports: [FormsModule],
  providers: [SearchService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchComponent {
  private readonly _searchService = inject(SearchService);
  private readonly _appStore = inject(AppStore);
  private readonly _destroy = inject(DestroyRef);

  totalItemsFiltered = computed(() => this._appStore.$itemsBeingFiltered());
  search = signal('');
  searchTerm: Observable<string>;
  strategy = computed(() => this._appStore.$strategy());

  constructor() {
    this._appStore.$clearSearch.pipe(takeUntilDestroyed(this._destroy)).subscribe(() => this.search.set(''));

    this.searchTerm = toObservable(this.search).pipe(
      tap(() => this._searchService.setStrategy(this.strategy() as SearchStrategy)),
      debounceTime(500),
      distinctUntilChanged(),
      tap((term: string) => this._searchService.filter(term))
    );
    this.searchTerm.subscribe();
  }
}
