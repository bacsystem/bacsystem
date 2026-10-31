import { PLATFORM_ID } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MotionService } from '../../../shared/motion/motion.service';
import { BrandMarkComponent } from './brand-mark.component';

/** Records animate calls instead of running them; `finished` never settles, so nothing chains. */
class FakeMotion {
  enabled = true;
  calls = 0;
  stopped = 0;
  animate = () => {
    this.calls++;
    return { stop: () => this.stopped++, finished: new Promise(() => undefined) };
  };
}

describe('BrandMarkComponent', () => {
  function render(platform: 'browser' | 'server' = 'browser'): HTMLElement {
    TestBed.configureTestingModule({
      imports: [BrandMarkComponent],
      providers: [{ provide: PLATFORM_ID, useValue: platform }],
    });
    const fixture = TestBed.createComponent(BrandMarkComponent);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('renders a decorative svg hidden from assistive technology', () => {
    const el = render();
    const svg = el.querySelector('svg');
    expect(svg).toBeTruthy();
    expect(svg?.getAttribute('aria-hidden')).toBe('true');
    expect(svg?.getAttribute('focusable')).toBe('false');
  });

  it('draws the isotype pieces and carries no text', () => {
    const el = render();
    expect(el.querySelector('.mark__c')).toBeTruthy();
    expect(el.querySelector('.mark__l')).toBeTruthy();
    // the empty place the complement docks into, drawn with the same geometry as the teal piece
    expect(el.querySelector('.mark__slot')?.getAttribute('href')).toBe(el.querySelector('.mark__l')?.getAttribute('href'));
    // exactly one clean echo, and no dashed construction guides
    expect(el.querySelectorAll('.mark__echo').length).toBe(1);
    expect(el.querySelector('line, .mark__guides')).toBeNull();
    expect(el.querySelector('text, title, desc')).toBeNull();
    expect(el.textContent?.trim()).toBe('');
  });

  it('never sets literal colors on the shapes', () => {
    const el = render();
    for (const node of Array.from(el.querySelectorAll('svg *'))) {
      expect(node.getAttribute('fill')).toBeNull();
      expect(node.getAttribute('stroke')).toBeNull();
    }
  });

  it('renders on the server platform without errors', () => {
    let el: HTMLElement | undefined;
    expect(() => (el = render('server'))).not.toThrow();
    expect(el?.querySelector('svg')).toBeTruthy();
  });

  it('shows the finished logo in the server markup (no hidden pre-state)', () => {
    const el = render('server');
    const pieces = Array.from(el.querySelectorAll<SVGElement>('svg *'));
    expect(pieces.every(p => !p.getAttribute('style'))).toBeTrue();
    expect(el.querySelector('svg')?.getAttribute('data-intro')).toBe('pending');
  });

  describe('docking motion (Motion library)', () => {
    function create(platform: 'browser' | 'server', enabled: boolean): { fixture: ComponentFixture<BrandMarkComponent>; motion: FakeMotion } {
      const motion = new FakeMotion();
      motion.enabled = enabled;
      TestBed.configureTestingModule({
        imports: [BrandMarkComponent],
        providers: [
          { provide: PLATFORM_ID, useValue: platform },
          { provide: MotionService, useValue: motion },
        ],
      });
      const fixture = TestBed.createComponent(BrandMarkComponent);
      fixture.detectChanges();
      return { fixture, motion };
    }

    it('plays the intro in the browser when motion is welcome', () => {
      const { fixture, motion } = create('browser', true);
      const el = fixture.nativeElement as HTMLElement;
      expect(motion.calls).toBeGreaterThan(0);
      expect(el.querySelector('svg')?.getAttribute('data-intro')).toBe('on');
    });

    it('never animates on the server', () => {
      const { motion } = create('server', true);
      expect(motion.calls).toBe(0);
    });

    it('shows the docked logo at once with reduced motion', () => {
      const { fixture, motion } = create('browser', false);
      const el = fixture.nativeElement as HTMLElement;
      expect(motion.calls).toBe(0);
      expect(el.querySelector('svg')?.getAttribute('data-intro')).toBe('off');
      expect(el.querySelector<SVGElement>('.mark__c')?.style.opacity).toBe('');
    });

    it('stops every running animation on destroy', () => {
      const { fixture, motion } = create('browser', true);
      const started = motion.calls;
      fixture.destroy();
      expect(motion.stopped).toBe(started);
    });
  });

  describe('pointer parallax', () => {
    function create(parallax: boolean): ComponentFixture<BrandMarkComponent> {
      spyOn(window, 'matchMedia').and.returnValue({ matches: parallax } as MediaQueryList);
      TestBed.configureTestingModule({ imports: [BrandMarkComponent] });
      const fixture = TestBed.createComponent(BrandMarkComponent);
      fixture.detectChanges();
      return fixture;
    }

    it('follows the pointer with offsets clamped to [-1, 1] on fine pointers', async () => {
      const fixture = create(true);
      const host = fixture.nativeElement as HTMLElement;
      host.style.display = 'block';
      host.style.width = '200px';
      host.style.height = '100px';
      document.body.appendChild(host);
      const rect = host.getBoundingClientRect();
      host.dispatchEvent(new PointerEvent('pointermove', { clientX: rect.right + 500, clientY: rect.top + rect.height / 2 }));
      await new Promise(r => requestAnimationFrame(() => r(null)));
      expect(host.style.getPropertyValue('--mark-px')).toBe('1.000');
      expect(host.style.getPropertyValue('--mark-py')).toBe('0.000');
      host.dispatchEvent(new PointerEvent('pointerleave'));
      expect(host.style.getPropertyValue('--mark-px')).toBe('0.000');
      host.remove();
    });

    it('does not listen at all with reduced motion or coarse pointers', () => {
      const add = spyOn(HTMLElement.prototype, 'addEventListener').and.callThrough();
      create(false);
      expect(add.calls.allArgs().some(([type]) => type === 'pointermove')).toBeFalse();
    });

    it('removes its listeners on destroy', () => {
      const remove = spyOn(HTMLElement.prototype, 'removeEventListener').and.callThrough();
      const fixture = create(true);
      fixture.destroy();
      const types = remove.calls.allArgs().map(([type]) => type);
      expect(types).toContain('pointermove');
      expect(types).toContain('pointerleave');
    });
  });
});
