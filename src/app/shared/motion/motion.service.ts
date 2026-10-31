import { isPlatformBrowser } from '@angular/common';
import { Injectable, NgZone, PLATFORM_ID, inject } from '@angular/core';
import { animate, inView, scroll, stagger } from 'motion';

/** What callers keep to stop a running animation, observer or scroll binding. */
export interface Stoppable {
  stop(): void;
}

/**
 * The one door to the Motion library (motion.dev). Everything here runs outside Angular's zone,
 * so animation frames never trigger change detection, and `enabled` is the single gate:
 * false on the server and with prefers-reduced-motion, where callers must leave the final
 * state alone. Only lazy routes (Home) import this, so Motion stays out of the initial bundle.
 * Specs replace this service with a fake to check behaviour without running animations.
 */
@Injectable({ providedIn: 'root' })
export class MotionService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly zone = inject(NgZone);

  /** True only in a browser that welcomes motion. */
  get enabled(): boolean {
    if (!isPlatformBrowser(this.platformId)) return false;
    if (typeof window.matchMedia !== 'function') return true;
    return !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /** True when a media query matches (false on the server or without matchMedia). */
  matches(query: string): boolean {
    return isPlatformBrowser(this.platformId) && typeof window.matchMedia === 'function' && window.matchMedia(query).matches;
  }

  /** Runs `fn` outside Angular's zone: timers, promise callbacks and frames it starts never trigger change detection. */
  run<T>(fn: () => T): T {
    return this.zone.runOutsideAngular(fn);
  }

  readonly animate = ((...args: unknown[]) => this.run(() => (animate as (...a: unknown[]) => unknown)(...args))) as typeof animate;

  /**
   * Runs `onEnter` the first time the element is in view, then stops watching it. The default starts a
   * little before the element reaches the screen (any pixel, viewport extended 10% downwards), so a fast
   * scroll never lands on an empty, still-hidden section.
   */
  inViewOnce(element: Element, onEnter: () => void, amount = 0, margin: `${number}px ${number}px ${number}% ${number}px` = '0px 0px 10% 0px'): Stoppable {
    const cancel = this.run(() =>
      inView(
        element,
        () => {
          cancel();
          onEnter();
        },
        { amount, margin },
      ),
    );
    return { stop: cancel };
  }

  readonly scroll = ((...args: unknown[]) => this.run(() => (scroll as (...a: unknown[]) => unknown)(...args))) as typeof scroll;

  readonly stagger = stagger;
}
