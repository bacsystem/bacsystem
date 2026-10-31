import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Directive, ElementRef, OnDestroy, PLATFORM_ID, inject, input } from '@angular/core';
import { MotionService, Stoppable } from '../motion/motion.service';
import { all, hideFade, revealFade } from '../motion/reveal';
import { RISE } from '../motion/motion.tokens';

/**
 * A scroll entrance for a group of elements, played once with Motion.
 * `hide` sets the pre-state inline; `play` runs the entrance and returns what to stop on destroy.
 */
export interface Choreography {
  hide(el: HTMLElement, motion: MotionService): void;
  play(el: HTMLElement, motion: MotionService): Stoppable[];
}

/** Default: the direct children rise in, one stagger step apart. */
export const RISE_CHILDREN: Choreography = {
  hide: el => hideFade(all(el, ':scope > *'), RISE),
  play: (el, motion) => revealFade(motion, all(el, ':scope > *'), { rise: RISE }),
};

/**
 * `appRevealGroup` — sibling of `appReveal` for choreographed groups.
 * - Browser only, motion welcome, and only for elements still below the fold after the first
 *   render: the pre-state is set right then, and the entrance plays the first time the group
 *   comes into view. Never re-triggers.
 * - Server, prefers-reduced-motion, no IntersectionObserver, or already on screen: nothing is
 *   touched, so the final state shows immediately.
 * - Everything (pre-state, observer, entrance and its cleanup callbacks) runs outside Angular's zone.
 */
@Directive({ selector: '[appRevealGroup]', standalone: true })
export class RevealGroupDirective implements AfterViewInit, OnDestroy {
  /** The choreography to play; empty (the bare attribute) means RISE_CHILDREN. */
  readonly appRevealGroup = input<Choreography | ''>('');

  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly motion = inject(MotionService);
  private readonly platformId = inject(PLATFORM_ID);
  private stops: Stoppable[] = [];

  /** After view init: the group's children (often an @for) exist by now. */
  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (!this.motion.enabled || typeof IntersectionObserver === 'undefined') return;
    const rect = this.el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) return; // already visible: never hide it

    const choreography = this.appRevealGroup() || RISE_CHILDREN;
    this.motion.run(() => {
      choreography.hide(this.el, this.motion);
      this.el.classList.add('is-motion-pending');
      this.stops.push(
        this.motion.inViewOnce(this.el, () => {
          this.el.classList.remove('is-motion-pending');
          this.stops.push(...choreography.play(this.el, this.motion));
        }),
      );
    });
  }

  ngOnDestroy(): void {
    this.stops.forEach(s => s.stop());
    this.stops = [];
  }
}
