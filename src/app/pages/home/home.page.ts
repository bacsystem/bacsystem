import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, NgZone, OnDestroy, PLATFORM_ID, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import {
  CLIENTS,
  ClientLogo,
  PROCESS,
  PRODUCTS,
  ProcessStep,
  ProductItem,
  SERVICES,
  SITE,
  STATS,
  ServiceItem,
  StatItem,
} from '../../data/site.data';
import { CountUpDirective } from '../../shared/directives/count-up.directive';
import { RevealDirective } from '../../shared/directives/reveal.directive';
import { RevealGroupDirective } from '../../shared/directives/reveal-group.directive';
import { MotionService, Stoppable } from '../../shared/motion/motion.service';
import { SPRING } from '../../shared/motion/motion.tokens';
import { WordsPipe } from '../../shared/pipes/words.pipe';
import { BrandMarkComponent } from './brand-mark/brand-mark.component';
import { HOME_CHOREO, hideHero, playHero } from './home.motion';
import { ButtonComponent, IconComponent, SectionComponent, SectionHeadingComponent, TagComponent } from '../../shared/ui';

/** Below this many logos the strip stays still: a loop of two logos reads as filler. */
const MIN_LOGOS_TO_SCROLL = 5;

/** Product cards lean toward the pointer at most this much (deg), fine pointers only. */
const TILT = 4;
/** Perspective (px) for the card tilt. */
const PERSPECTIVE = 900;
const FINE_POINTER = '(hover: hover) and (pointer: fine)';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    RouterLink,
    TranslateModule,
    ButtonComponent,
    IconComponent,
    SectionComponent,
    SectionHeadingComponent,
    TagComponent,
    RevealDirective,
    RevealGroupDirective,
    CountUpDirective,
    BrandMarkComponent,
    WordsPipe,
  ],
  templateUrl: './home.page.html',
  styleUrl: './home.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageComponent implements AfterViewInit, OnDestroy {
  clients: ClientLogo[] = CLIENTS;
  services: ServiceItem[] = SERVICES;
  products: ProductItem[] = PRODUCTS;
  stats: StatItem[] = STATS;

  protected readonly email = SITE.email;
  protected readonly process: ProcessStep[] = PROCESS;
  protected readonly choreo = HOME_CHOREO;
  /** The counters start as their rule finishes growing (ms). */
  protected readonly countDelay = 400;

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly platformId = inject(PLATFORM_ID);
  private readonly motion = inject(MotionService);
  private readonly zone = inject(NgZone);
  private stops: Stoppable[] = [];
  private cleanups: (() => void)[] = [];

  protected get logosScroll(): boolean {
    return this.clients.length >= MIN_LOGOS_TO_SCROLL;
  }

  /** Two-digit position label: 01, 02… */
  protected index(i: number): string {
    return String(i + 1).padStart(2, '0');
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const copy = this.host.querySelector<HTMLElement>('.hero__copy');
    const intro = Array.from(copy?.querySelectorAll<HTMLElement>('[data-intro]') ?? []);
    if (!copy || !this.motion.enabled) {
      intro.forEach(el => (el.dataset['intro'] = 'off'));
      return;
    }
    // Hero intro: inline pre-state first, then release the CSS hold, then play.
    hideHero(copy);
    intro.forEach(el => (el.dataset['intro'] = 'on'));
    this.stops.push(...playHero(this.motion, copy));
    this.scrollAwayDepth();
    this.tiltCards();
  }

  ngOnDestroy(): void {
    this.stops.forEach(s => s.stop());
    this.cleanups.forEach(c => c());
    this.stops = [];
    this.cleanups = [];
  }

  /** As the hero scrolls away the brand mark recedes a little (scale, rise, fade). Never the text. */
  private scrollAwayDepth(): void {
    const hero = this.host.querySelector<HTMLElement>('#inicio');
    const visual = this.host.querySelector<HTMLElement>('.hero__visual');
    if (!hero || !visual) return;
    const depth = this.motion.animate(visual, { scale: [1, 0.94], y: [0, -24], opacity: [1, 0.6] }, { ease: 'linear' });
    this.stops.push(depth);
    this.cleanups.push(this.motion.scroll(depth, { target: hero, offset: ['start start', 'end start'] }));
  }

  /** Product cards lean a few degrees toward a fine pointer (spring), and settle back on leave. */
  private tiltCards(): void {
    if (!this.motion.matches(FINE_POINTER)) return;
    for (const card of Array.from(this.host.querySelectorAll<HTMLElement>('.products__item'))) {
      let current: Stoppable | undefined;
      const lean = (rotateX: number, rotateY: number, spring: (typeof SPRING)[keyof typeof SPRING]) =>
        (current = this.motion.animate(card, { rotateX, rotateY, transformPerspective: PERSPECTIVE }, spring));
      const onMove = (e: PointerEvent) => {
        const r = card.getBoundingClientRect();
        const x = ((e.clientX - r.left) / r.width) * 2 - 1;
        const y = ((e.clientY - r.top) / r.height) * 2 - 1;
        lean(-y * TILT, x * TILT, SPRING.follow);
      };
      const onLeave = () => lean(0, 0, SPRING.settle);
      // Listeners outside the zone: pointer moves must never trigger change detection.
      this.zone.runOutsideAngular(() => {
        card.addEventListener('pointermove', onMove, { passive: true });
        card.addEventListener('pointerleave', onLeave, { passive: true });
      });
      this.cleanups.push(() => {
        card.removeEventListener('pointermove', onMove);
        card.removeEventListener('pointerleave', onLeave);
        current?.stop();
      });
    }
  }
}
