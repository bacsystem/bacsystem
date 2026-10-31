import { inject, Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { filter } from 'rxjs/operators';

/** Canonical base URL */
const SITE_URL = 'https://bacsystemsolutions.com';
// EJEMPLO: reemplazar por og-cover.png real
const OG_IMAGE = `${SITE_URL}/assets/img/bacsystem/Logo_BACSYSTEM-%5BColor-Horizontal%5D.png`;

export interface SeoRouteData {
  titleKey: string;
  descriptionKey: string;
  /** Default true */
  indexable?: boolean;
}

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly titleService = inject(Title);
  private readonly meta         = inject(Meta);
  private readonly document     = inject(DOCUMENT);
  private readonly translate    = inject(TranslateService);
  private readonly router       = inject(Router);

  private current: { seo: SeoRouteData; path: string } | null = null;
  private started = false;

  /** Subscribes to navigation and language changes and re-applies SEO tags. */
  init(): void {
    if (this.started) return;
    this.started = true;

    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(e => {
        const seo = this.deepest(this.router.routerState.snapshot.root).data['seo'] as SeoRouteData | undefined;
        if (!seo) return;
        this.current = { seo, path: e.urlAfterRedirects };
        this.apply(seo, e.urlAfterRedirects);
      });

    this.translate.onLangChange.subscribe(() => {
      if (this.current) this.apply(this.current.seo, this.current.path);
    });
  }

  apply(seo: SeoRouteData, path: string): void {
    const lang   = this.translate.currentLang || this.translate.defaultLang || 'es';
    const locale = lang === 'es' ? 'es_PE' : 'en_US';
    const t      = this.translate.instant([seo.titleKey, seo.descriptionKey]) as Record<string, string>;
    const title  = t[seo.titleKey];
    const desc   = t[seo.descriptionKey];
    const url    = SITE_URL + this.normalize(path);
    const robots = seo.indexable === false ? 'noindex, nofollow' : 'index, follow';

    this.titleService.setTitle(title);
    this.meta.updateTag({ name: 'description', content: desc });
    this.meta.updateTag({ name: 'robots',      content: robots });

    this.meta.updateTag({ property: 'og:type',        content: 'website'             });
    this.meta.updateTag({ property: 'og:site_name',   content: 'Bacsystem Solutions' });
    this.meta.updateTag({ property: 'og:url',         content: url                   });
    this.meta.updateTag({ property: 'og:title',       content: title                 });
    this.meta.updateTag({ property: 'og:description', content: desc                  });
    this.meta.updateTag({ property: 'og:image',       content: OG_IMAGE              });
    this.meta.updateTag({ property: 'og:locale',      content: locale                });

    this.meta.updateTag({ name: 'twitter:card',        content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title',       content: title                 });
    this.meta.updateTag({ name: 'twitter:description', content: desc                  });
    this.meta.updateTag({ name: 'twitter:image',       content: OG_IMAGE              });

    this.document.documentElement.setAttribute('lang', lang);
    this.setCanonical(url);
  }

  private deepest(route: ActivatedRouteSnapshot): ActivatedRouteSnapshot {
    let r = route;
    while (r.firstChild) r = r.firstChild;
    return r;
  }

  private normalize(path: string): string {
    const clean = path.split(/[?#]/)[0].replace(/\/+$/, '');
    if (!clean) return '/';
    return clean.startsWith('/') ? clean : `/${clean}`;
  }

  private setCanonical(url: string): void {
    let link = this.document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.document.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }
}
