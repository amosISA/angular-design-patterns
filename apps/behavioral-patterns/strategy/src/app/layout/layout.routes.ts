import { inject } from "@angular/core";
import { ResolveFn, Route } from "@angular/router";
import { AppStore } from "../app.store";
import { FavouriteSearchStrategy } from "../modules/components/favourites/favourites-search.strategy";
import { PhotoSearchStrategy } from "../modules/components/photos/photos-search.strategy";
import { photoResolver } from "../modules/resolvers/photo.resolver";
import { SearchStrategy } from "./components/search/search-strategy";
import { LayoutComponent } from "./layout.component";

export const photoStrategyResolver: ResolveFn<SearchStrategy | null> = () => {
  const appStore = inject(AppStore);
  appStore.setStrategy(new PhotoSearchStrategy());
  return appStore.$strategy();
};

export const favouriteStrategyResolver: ResolveFn<SearchStrategy | null> = () => {
  const appStore = inject(AppStore);
  appStore.setStrategy(new FavouriteSearchStrategy());
  return appStore.$strategy();
};

export const LAYOUT_ROUTES: Route[] = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            {
              path: 'photos',
              loadComponent: () => import('../modules/components/photos/photos.component').then(
                  (c) => c.PhotosComponent
              ),
              resolve: { strategy: photoStrategyResolver }
            },
            {
              path: 'photos/:id',
              loadComponent: () => import('../modules/components/photo/photo.component').then(
                  (c) => c.PhotoComponent
              ),
              resolve: {
                photo: photoResolver
              }
            },
            {
              path: 'favourites',
              loadComponent: () => import('../modules/components/favourites/favourites.component').then(
                  (c) => c.FavouritesComponent
              ),
              resolve: { strategy: favouriteStrategyResolver }
            },
            {
              path: '**',
              redirectTo: 'photos'
            }
        ]
    }
];