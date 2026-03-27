import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class ScrollNavService {
  constructor(
    private readonly router: Router,
    @Inject(PLATFORM_ID) private readonly platformId: object,
  ) {}

  scrollTo(sectionId: string): void {
    const onHome = this.router.url.startsWith('/public/home');
    if (onHome && isPlatformBrowser(this.platformId)) {
      document.getElementById('section-' + sectionId)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      this.router.navigate(['/public/home']).then(() => {
        if (isPlatformBrowser(this.platformId)) {
          setTimeout(() => {
            document.getElementById('section-' + sectionId)?.scrollIntoView({ behavior: 'smooth' });
          }, 350);
        }
      });
    }
  }
}
