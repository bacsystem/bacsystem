import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  inject,
} from '@angular/core';
import { MotionService, Stoppable } from '../../../shared/motion/motion.service';
import { introHeld } from '../../../shared/motion/intro';
import { DURATION, EASE_IN_OUT, EASE_OUT, MARK, SPRING } from '../../../shared/motion/motion.tokens';

/** Parallax only where it makes sense: a fine pointer that hovers, and motion welcome. */
const PARALLAX_QUERY = '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)';

/* Choreography timings and distances: MARK in shared/motion/motion.tokens.ts. */

/**
 * Hero brand graphic: the Bacsystem isotype (navy "C" and teal corner) as inline SVG, with one
 * outlined echo. Purely decorative. The markup is the finished logo; the docking story is played
 * with Motion in the browser only, never on the server or with reduced motion:
 *
 *   intro  0.0–0.8  the C is drawn (outline stroke-dashoffset), its fill floods in from 0.45
 *          0.3      the empty slot outline fades in where the teal piece belongs
 *          0.7–1.4  the teal piece arcs in from outside, rotating to 0, decelerating to a slight
 *                   overshoot; then a spring click (scale 1.06 → 1), the slot pulses teal once,
 *                   the C recoils a few px
 *          ~1.55    the echo outline slides out of the C into its offset, then breathes
 *   loop   every ~7.5s while visible: the piece lifts out, circles and clicks back in.
 *
 * If the page hydrates after the hero's CSS failsafe already showed the logo, the intro is skipped
 * (no vanish-and-replay): the logo stays put, the echo breathes and the loop starts later.
 * All of it (animations, their callbacks and the loop timer) runs outside Angular's zone.
 *
 * Plus an optional pointer parallax: listeners on the enclosing hero section (the SVG ignores
 * pointer events) write --mark-px / --mark-py in [-1, 1]; CSS turns them into a few px.
 */
@Component({
  selector: 'app-brand-mark',
  standalone: true,
  templateUrl: './brand-mark.component.html',
  styleUrl: './brand-mark.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BrandMarkComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly platformId = inject(PLATFORM_ID);
  private readonly zone = inject(NgZone);
  private readonly motion = inject(MotionService);
  private readonly document = inject(DOCUMENT);

  private target?: HTMLElement;
  private frame = 0;
  private pending?: { x: number; y: number };

  private readonly running = new Set<Stoppable>();
  private timer?: ReturnType<typeof setTimeout>;
  private destroyed = false;

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

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const svg = this.host.querySelector<SVGSVGElement>('svg');
    if (!svg) return;
    if (!this.motion.enabled) {
      svg.dataset['intro'] = 'off';
      return;
    }
    this.motion.run(() => {
      if (introHeld(this.document, svg)) {
        this.intro(svg);
      } else {
        svg.dataset['intro'] = 'off';
        this.breathe(this.pieces(svg).echo);
        this.schedule(svg);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    this.target?.removeEventListener('pointermove', this.onMove);
    this.target?.removeEventListener('pointerleave', this.onLeave);
    if (this.frame) cancelAnimationFrame(this.frame);
    this.frame = 0;
    this.target = undefined;
    clearTimeout(this.timer);
    this.running.forEach(r => r.stop());
    this.running.clear();
  }

  private setOffset(x: number, y: number): void {
    this.host.style.setProperty('--mark-px', x.toFixed(3));
    this.host.style.setProperty('--mark-py', y.toFixed(3));
  }

  /** Motion's animate, tracked so everything can be stopped on destroy. */
  private play(...args: Parameters<MotionService['animate']>): Promise<unknown> {
    const controls = (this.motion.animate as (...a: unknown[]) => Stoppable & { finished: Promise<unknown> })(...args);
    this.running.add(controls);
    return controls.finished.then(() => this.running.delete(controls));
  }

  private pieces(svg: SVGSVGElement) {
    const q = (s: string) => svg.querySelector<SVGElement>(s) as SVGElement;
    return { c: q('.mark__c'), line: q('.mark__line'), slot: q('.mark__slot'), l: q('.mark__l'), echo: q('.mark__echo') };
  }

  private intro(svg: SVGSVGElement): void {
    const { c, line, slot, l, echo } = this.pieces(svg);
    const echoOpacity = Number(getComputedStyle(echo).opacity) || 0.5;

    // Pre-state, written right before playing (inline / attribute, never in CSS).
    c.style.opacity = '0';
    line.style.opacity = '1';
    line.setAttribute('stroke-dashoffset', '1');
    l.style.opacity = '0';
    echo.style.opacity = '0';
    svg.dataset['intro'] = 'on';

    const d = MARK.delay;
    // 1. The company is drawn, then filled.
    this.play(line, { strokeDashoffset: [1, 0] }, { duration: MARK.draw.duration, ease: EASE_IN_OUT, delay: d });
    this.play(c, { opacity: [0, 1] }, { duration: MARK.fill.duration, ease: EASE_OUT, delay: d + MARK.fill.at });
    this.play(line, { opacity: [1, 0] }, { duration: DURATION.base, delay: d + MARK.lineOut.at }).then(() => {
      line.removeAttribute('stroke-dashoffset');
      line.style.removeProperty('opacity');
    });
    // 2. Its empty slot appears.
    this.play(slot, { opacity: [0, MARK.slot.opacity] }, { duration: MARK.slot.duration, ease: EASE_OUT, delay: d + MARK.slot.at });
    // 3. The complement arcs in from outside the composition, decelerating to a slight overshoot.
    const { arc } = MARK;
    this.play(l, { opacity: [0, 1] }, { duration: DURATION.base, delay: d + arc.at });
    this.play(
      l,
      { x: [...arc.x], y: [...arc.y], rotate: [...arc.rotate] },
      { duration: arc.duration, delay: d + arc.at, times: [...arc.times], ease: [EASE_IN_OUT, EASE_OUT] },
    ).then(() => {
      if (this.destroyed) return;
      this.click(svg);
      // 4. Last, the echo slides out of the C into its offset, then breathes.
      const o = MARK.echo.offset;
      this.play(echo, { x: [-o, 0], y: [-o, 0], opacity: [0, echoOpacity] }, { duration: DURATION.enter, ease: EASE_OUT, delay: MARK.echo.after }).then(() => {
        echo.style.removeProperty('opacity');
        this.breathe(echo);
      });
      this.schedule(svg);
    });
  }

  /** The snap: spring click with a little scale, one teal slot pulse, the C recoils. */
  private click(svg: SVGSVGElement): void {
    const { c, slot, l } = this.pieces(svg);
    const { click } = MARK;
    this.play(l, { x: 0, y: 0, rotate: 0, scale: [click.scale, 1] }, SPRING.click);
    slot.classList.add('is-click');
    this.play(
      slot,
      { opacity: [MARK.slot.opacity, 1, 0], scale: [1, click.slotScale] },
      { duration: DURATION.slow, ease: EASE_OUT, times: [0, 0.2, 1] },
    ).then(() => slot.classList.remove('is-click'));
    this.play(c, { x: [0, -click.recoil, 0], y: [0, click.recoil, 0] }, { duration: click.recoilDuration, ease: EASE_OUT, times: [0, 0.3, 1] });
  }

  private breathe(echo: SVGElement): void {
    if (this.destroyed) return;
    const { breath, breathDuration } = MARK.echo;
    this.play(echo, { x: [0, breath, 0], y: [0, -breath, 0] }, { duration: breathDuration, ease: EASE_IN_OUT, repeat: Infinity });
  }

  private schedule(svg: SVGSVGElement): void {
    if (this.destroyed) return;
    this.timer = this.motion.run(() => setTimeout(() => this.cycle(svg), MARK.cycle.rest * 1000));
  }

  /** The repeating docking cycle: lift out, a short arc around, back to the overshoot, click. */
  private cycle(svg: SVGSVGElement): void {
    if (this.destroyed) return;
    const rect = this.host.getBoundingClientRect();
    const visible = rect.bottom > 0 && rect.top < window.innerHeight && !document.hidden;
    if (!visible) return this.schedule(svg); // nobody is watching: wait for the next beat
    const { slot, l } = this.pieces(svg);
    const { cycle } = MARK;
    this.play(slot, { opacity: [0, MARK.slot.opacity], scale: 1 }, { duration: MARK.slot.duration, ease: EASE_OUT });
    this.play(
      l,
      { x: [...cycle.x], y: [...cycle.y], rotate: [...cycle.rotate] },
      { duration: cycle.duration, times: [...cycle.times], ease: [EASE_IN_OUT, EASE_IN_OUT, EASE_IN_OUT, EASE_OUT] },
    ).then(() => {
      if (this.destroyed) return;
      this.click(svg);
      this.schedule(svg);
    });
  }
}
