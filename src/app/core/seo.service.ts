import { inject, Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { take } from 'rxjs/operators';

/** Canonical base URL — update when custom domain is configured */
const SITE_URL = 'https://bacsystemsolutions.com';
const OG_IMAGE = `${SITE_URL}/assets/img/bacsystem/og-cover.png`;

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly titleService = inject(Title);
  private readonly meta         = inject(Meta);
  private readonly document     = inject(DOCUMENT);
  private readonly translate    = inject(TranslateService);

  /** Re-apply all SEO tags for the currently active language.
   *  Call once on app init and after every language change. */
  update(): void {
    const lang   = this.translate.currentLang ?? 'en';
    const locale = lang === 'es' ? 'es_PE' : 'en_US';

    this.translate
      .get(['application.seo.title', 'application.seo.description', 'application.seo.keywords'])
      .pipe(take(1))
      .subscribe(t => {
        const title = t['application.seo.title'];
        const desc  = t['application.seo.description'];
        const keys  = t['application.seo.keywords'];

        // ── Basic ────────────────────────────────────────────
        this.titleService.setTitle(title);
        this.meta.updateTag({ name: 'description', content: desc });
        this.meta.updateTag({ name: 'keywords',    content: keys });
        this.meta.updateTag({ name: 'robots',      content: 'index, follow' });

        // ── Open Graph ───────────────────────────────────────
        this.meta.updateTag({ property: 'og:type',        content: 'website'             });
        this.meta.updateTag({ property: 'og:site_name',   content: 'Bacsystem Solutions' });
        this.meta.updateTag({ property: 'og:url',         content: SITE_URL              });
        this.meta.updateTag({ property: 'og:title',       content: title                 });
        this.meta.updateTag({ property: 'og:description', content: desc                  });
        this.meta.updateTag({ property: 'og:image',       content: OG_IMAGE              });
        this.meta.updateTag({ property: 'og:locale',      content: locale                });

        // ── Twitter Card ─────────────────────────────────────
        this.meta.updateTag({ name: 'twitter:card',        content: 'summary_large_image' });
        this.meta.updateTag({ name: 'twitter:title',       content: title                 });
        this.meta.updateTag({ name: 'twitter:description', content: desc                  });
        this.meta.updateTag({ name: 'twitter:image',       content: OG_IMAGE              });

        // ── html[lang] ───────────────────────────────────────
        this.document.documentElement.setAttribute('lang', lang);

        // ── Canonical ────────────────────────────────────────
        this.setCanonical(SITE_URL);
      });
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
