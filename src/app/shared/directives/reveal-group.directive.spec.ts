import { Component, PLATFORM_ID } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MotionService } from '../motion/motion.service';
import { Choreography, RevealGroupDirective } from './reveal-group.directive';

const calls = { hide: 0, play: 0, stopped: 0 };
const choreo: Choreography = {
  hide: () => calls.hide++,
  play: () => {
    calls.play++;
    return [{ stop: () => calls.stopped++ }];
  },
};

@Component({
  standalone: true,
  imports: [RevealGroupDirective],
  template: `<ul [appRevealGroup]="choreo" id="t"><li>a</li><li>b</li><li>c</li></ul>`,
})
class HostComponent {
  choreo = choreo;
}

/** A Motion stand-in: records the inView registration instead of observing. */
class FakeMotion {
  enabled = true;
  onEnter?: () => void;
  viewStopped = 0;
  inViewOnce(_el: Element, onEnter: () => void) {
    this.onEnter = onEnter;
    return { stop: () => this.viewStopped++ };
  }
}

describe('RevealGroupDirective', () => {
  let motion: FakeMotion;
  const realIO = (window as any).IntersectionObserver;

  afterEach(() => {
    (window as any).IntersectionObserver = realIO;
  });

  function mount(opts: { platform?: string; offscreen?: boolean } = {}): { fixture: ComponentFixture<HostComponent>; el: HTMLElement } {
    calls.hide = calls.play = calls.stopped = 0;
    motion = new FakeMotion();
    const top = opts.offscreen === false ? 10 : window.innerHeight + 500;
    spyOn(HTMLElement.prototype, 'getBoundingClientRect').and.returnValue({ top, bottom: top + 100 } as DOMRect);
    TestBed.configureTestingModule({
      imports: [HostComponent],
      providers: [
        { provide: PLATFORM_ID, useValue: opts.platform ?? 'browser' },
        { provide: MotionService, useValue: motion },
      ],
    });
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    return { fixture, el: fixture.nativeElement.querySelector('#t') as HTMLElement };
  }

  it('sets --i on each child, in order', () => {
    const { el } = mount();
    expect(Array.from(el.children).map(c => (c as HTMLElement).style.getPropertyValue('--i'))).toEqual(['0', '1', '2']);
  });

  it('hides an off-screen group and plays it once when it comes into view', () => {
    const { el } = mount();
    expect(calls.hide).toBe(1);
    expect(el.classList).toContain('is-motion-pending');
    expect(calls.play).toBe(0);
    motion.onEnter!();
    expect(calls.play).toBe(1);
    expect(el.classList).not.toContain('is-motion-pending');
  });

  it('never hides a group already in the viewport', () => {
    const { el } = mount({ offscreen: false });
    expect(calls.hide).toBe(0);
    expect(motion.onEnter).toBeUndefined();
    expect(el.classList).not.toContain('is-motion-pending');
  });

  it('touches nothing with reduced motion (motion disabled)', () => {
    calls.hide = 0;
    const fixtureFn = () => {
      motion = new FakeMotion();
      motion.enabled = false;
      spyOn(HTMLElement.prototype, 'getBoundingClientRect').and.returnValue({ top: 5000, bottom: 5100 } as DOMRect);
      TestBed.configureTestingModule({ imports: [HostComponent], providers: [{ provide: MotionService, useValue: motion }] });
      const f = TestBed.createComponent(HostComponent);
      f.detectChanges();
      return f.nativeElement.querySelector('#t') as HTMLElement;
    };
    const el = fixtureFn();
    expect(calls.hide).toBe(0);
    expect(motion.onEnter).toBeUndefined();
    expect(el.classList).not.toContain('is-motion-pending');
  });

  it('touches nothing on the server', () => {
    const { el } = mount({ platform: 'server' });
    expect(calls.hide).toBe(0);
    expect(el.classList).not.toContain('is-motion-pending');
    expect(el.querySelector('li')?.style.getPropertyValue('--i')).toBe('');
  });

  it('stays visible without IntersectionObserver', () => {
    (window as any).IntersectionObserver = undefined;
    mount();
    expect(calls.hide).toBe(0);
  });

  it('stops the observer and the running entrance on destroy', () => {
    const { fixture } = mount();
    motion.onEnter!();
    fixture.destroy();
    expect(motion.viewStopped).toBe(1);
    expect(calls.stopped).toBe(1);
  });
});
