import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    loadChildren: async () => (await import('./layout/layout.routes')).LAYOUT_ROUTES
  },
  {
    path: '**',
    redirectTo: ''
  }
];
