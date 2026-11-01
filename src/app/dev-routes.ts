import { Route } from '@angular/router';

/**
 * Routes that exist only while developing: the internal UI guide. Production builds swap this file
 * for dev-routes.prod.ts (angular.json fileReplacements), so the guide is not even shipped as a chunk.
 */
export const DEV_ROUTES: Route[] = [
  {
    path: 'guia-ui',
    loadComponent: () => import('./pages/ui-guide/ui-guide.page').then(m => m.UiGuidePageComponent),
    data: { seo: { titleKey: 'application.site.seo.uiGuide.title', descriptionKey: 'application.site.seo.uiGuide.description', indexable: false } },
  },
];
