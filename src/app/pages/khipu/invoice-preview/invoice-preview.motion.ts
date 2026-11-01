import type { MotionService, Stoppable } from '../../../shared/motion/motion.service';
import { INVOICE, SPRING } from '../../../shared/motion/motion.tokens';
import { all } from '../../../shared/motion/reveal';

/** The send steps, in order (labels in application.khipuPage.preview.steps). */
export const INVOICE_STEPS = ['totals', 'signed', 'sent', 'cdr'] as const;

/**
 * Plays the send in a loop: steps go back to pending, light up one by one (each dot pops on a
 * spring), then the pill flips from "Enviada" to "Aceptada". State lives in two classes
 * (.is-done per step, .is-accepted on the preview) so CSS owns the look; this only times them.
 */
export function playInvoice(host: HTMLElement, motion: MotionService): Stoppable[] {
  const preview = host.querySelector<HTMLElement>('.preview');
  const steps = all(host, '.flow__step');
  if (!preview || !steps.length) return [];

  const timers: ReturnType<typeof setTimeout>[] = [];
  const at = (seconds: number, fn: () => void) => timers.push(setTimeout(fn, seconds * 1000));
  const acceptAt = INVOICE.start + steps.length * INVOICE.step + INVOICE.accept;

  const cycle = () => {
    timers.length = 0; // every timer of the previous cycle has fired by now
    preview.classList.remove('is-accepted');
    steps.forEach(s => s.classList.remove('is-done'));
    steps.forEach((step, i) =>
      at(INVOICE.start + i * INVOICE.step, () => {
        step.classList.add('is-done');
        const dot = step.querySelector('.flow__dot');
        if (dot) motion.animate(dot, { scale: [0.6, 1] }, SPRING.click);
      }),
    );
    at(acceptAt, () => {
      preview.classList.add('is-accepted');
      const pill = preview.querySelector('.pill');
      if (pill) motion.animate(pill, { scale: [0.92, 1] }, SPRING.click);
    });
    at(acceptAt + INVOICE.rest, cycle);
  };

  motion.run(cycle);
  return [{ stop: () => timers.forEach(clearTimeout) }];
}
