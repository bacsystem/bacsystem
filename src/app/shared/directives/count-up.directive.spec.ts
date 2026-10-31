import { Component, PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { CountUpDirective } from './count-up.directive';

@Component({
  standalone: true,
  imports: [CountUpDirective],
  template: `<span [appCountUp]="42" id="t"></span>`,
})
class HostComponent {}

function mount(platform = 'browser') {
  TestBed.configureTestingModule({
    imports: [HostComponent],
    providers: [{ provide: PLATFORM_ID, useValue: platform }],
  });
  const f = TestBed.createComponent(HostComponent);
  f.detectChanges();
  return f.nativeElement.querySelector('#t') as HTMLElement;
}

describe('CountUpDirective', () => {
  const realIO = (window as any).IntersectionObserver;
  afterEach(() => {
    (window as any).IntersectionObserver = realIO;
  });

  it('writes the final value with prefers-reduced-motion', () => {
    spyOn(window, 'matchMedia').and.returnValue({ matches: true } as MediaQueryList);
    expect(mount().textContent).toBe('42');
  });

  it('keeps the final value when already in the viewport at init', () => {
    spyOn(window, 'matchMedia').and.returnValue({ matches: false } as MediaQueryList);
    spyOn(HTMLElement.prototype, 'getBoundingClientRect').and.returnValue({
      top: 10, bottom: 50, left: 0, right: 50, width: 50, height: 40, x: 0, y: 10, toJSON: () => ({}),
    } as DOMRect);
    expect(mount().textContent).toBe('42');
  });

  it('resets to 0 when off-screen at init', () => {
    spyOn(window, 'matchMedia').and.returnValue({ matches: false } as MediaQueryList);
    spyOn(HTMLElement.prototype, 'getBoundingClientRect').and.returnValue({
      top: window.innerHeight + 500, bottom: window.innerHeight + 540, left: 0, right: 50, width: 50, height: 40,
      x: 0, y: window.innerHeight + 500, toJSON: () => ({}),
    } as DOMRect);
    expect(mount().textContent).toBe('0');
  });

  it('writes the final value on the server', () => {
    expect(mount('server').textContent).toBe('42');
  });

  it('writes the final value without IntersectionObserver', () => {
    (window as any).IntersectionObserver = undefined;
    expect(mount().textContent).toBe('42');
  });

  it('destroys on the server without throwing', () => {
    TestBed.configureTestingModule({
      imports: [HostComponent],
      providers: [{ provide: PLATFORM_ID, useValue: 'server' }],
    });
    const f = TestBed.createComponent(HostComponent);
    f.detectChanges();
    const g = globalThis as any;
    const real = g.cancelAnimationFrame;
    g.cancelAnimationFrame = undefined;
    try {
      expect(() => f.destroy()).not.toThrow();
    } finally {
      g.cancelAnimationFrame = real;
    }
  });
});
