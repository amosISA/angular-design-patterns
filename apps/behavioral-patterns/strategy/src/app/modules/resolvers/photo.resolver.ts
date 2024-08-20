import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, Router } from "@angular/router";
import { of } from "rxjs";
import { FavouritesService } from "../components/favourites/favourites.service";

export const photoResolver = (route: ActivatedRouteSnapshot) => {
  const photoId = route.paramMap.get('id');

  if (!photoId) {
    return of(undefined);
  }

  const photo = inject(FavouritesService).getFavourite(photoId);
  if (!photo) {
    const router = inject(Router);
    return router.navigate(['photos']);
  }

  return photo;
}