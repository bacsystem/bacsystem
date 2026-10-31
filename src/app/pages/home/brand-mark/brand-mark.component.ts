import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, NgZone, OnDestroy, OnInit, PLATFORM_ID, inject } from '@angular/core';

/** Parallax only where it makes sense: a fine pointer that hovers, and motion welcome. */
const PARALLAX_QUERY = '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)';

/**
 * Hero brand graphic: the Bacsystem isotype (navy "C" and teal corner) drawn as inline SVG,
 * with a few outlined echo shapes. Purely decorative. The docking story (intro + repeating
 * cycle + ambient drift) is CSS only, so prerendered / no-JS output is the assembled logo.
 *
 * The only script is an optional pointer parallax: it listens on the enclosing hero section
 * (the SVG itself ignores pointer events) and writes two unitless custom properties,
 * --mark-px / --mark-py in [-1, 1], that the CSS turns into a few px of layer offset.
 */
@Component({
  selector: 'app-brand-mark',
  standalone: true,
  templateUrl: './brand-mark.component.html',
  styleUrl: './brand-mark.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BrandMarkComponent implements OnInit, OnDestroy {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly platformId = inject(PLATFORM_ID);
  private readonly zone = inject(NgZone);

  private target?: HTMLElement;
  private frame = 0;
  private pending?: { x: number; y: number };

  private readonly onMove = (event: PointerEvent): void => {
    this.pending = { x: event.clientX, y: event.clientY };
    if (!this.frame) this.frame = requestAnimationFrame(this.apply);
  };

  private readonly onLeave = (): void => {
    this.pending = undefined;
    if (this.frame) cancelAnimationFrame(this.frame);
    this.frame = 0;
    this.setOffset(0, 0);
  };

  private readonly apply = (): void => {
    this.frame = 0;
    if (!this.pending) return;
    const rect = this.host.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const clamp = (v: number) => Math.max(-1, Math.min(1, v));
    const x = clamp((this.pending.x - (rect.left + rect.width / 2)) / (rect.width / 2));
    const y = clamp((this.pending.y - (rect.top + rect.height / 2)) / (rect.height / 2));
    this.setOffset(x, y);
  };

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (typeof window.matchMedia !== 'function' || !window.matchMedia(PARALLAX_QUERY).matches) return;
    this.target = this.host.closest<HTMLElement>('section') ?? this.host;
    this.zone.runOutsideAngular(() => {
      this.target?.addEventListener('pointermove', this.onMove, { passive: true });
      this.target?.addEventListener('pointerleave', this.onLeave, { passive: true });
    });
  }

  ngOnDestroy(): void {
    this.target?.removeEventListener('pointermove', this.onMove);
    this.target?.removeEventListener('pointerleave', this.onLeave);
    if (this.frame) cancelAnimationFrame(this.frame);
    this.frame = 0;
    this.target = undefined;
  }

  private setOffset(x: number, y: number): void {
    this.host.style.setProperty('--mark-px', x.toFixed(3));
    this.host.style.setProperty('--mark-py', y.toFixed(3));
  }
}
