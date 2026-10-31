import { isPlatformBrowser } from '@angular/common';
import { Directive, ElementRef, OnDestroy, OnInit, PLATFORM_ID, inject, input } from '@angular/core';

@Directive({ selector: '[appCountUp]', standalone: true })
export class CountUpDirective implements OnInit, OnDestroy {
  readonly appCountUp = input.required<number>();
  readonly duration = input(1200);

  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly platformId = inject(PLATFORM_ID);
  private observer?: IntersectionObserver;
  private frame = 0;

  ngOnInit(): void {
    const target = this.appCountUp();
    this.el.textContent = String(target);
    if (!isPlatformBrowser(this.platformId)) return;
    if (typeof IntersectionObserver === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // Already visible at init (e.g. right after hydration): keep the final value, no flip.
    const rect = this.el.getBoundingClientRect();
    if (rect.bottom > 0 && rect.top < window.innerHeight) return;

    this.el.textContent = '0';
    this.observer = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        this.observer?.disconnect();
        this.animate(target);
      }
    });
    this.observer.observe(this.el);
  }

  private animate(target: number): void {
    const duration = Math.max(this.duration(), 1);
    const start = performance.now();
    const step = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      this.el.textContent = String(Math.round(target * eased));
      if (t < 1) this.frame = requestAnimationFrame(step);
    };
    this.frame = requestAnimationFrame(step);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    if (this.frame) cancelAnimationFrame(this.frame);
  }
}
