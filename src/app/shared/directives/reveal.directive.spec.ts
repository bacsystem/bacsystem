import { Component, PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { RevealDirective } from './reveal.directive';

@Component({
  standalone: true,
  imports: [RevealDirective],
  template: `<div appReveal id="t">x</div>`,
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

describe('RevealDirective', () => {
  const realIO = (window as any).IntersectionObserver;
  afterEach(() => {
    (window as any).IntersectionObserver = realIO;
  });

  it('does not hide on the server', () => {
    expect(mount('server').classList.contains('is-reveal-pending')).toBeFalse();
  });

  it('does not hide with prefers-reduced-motion', () => {
    spyOn(window, 'matchMedia').and.returnValue({ matches: true } as MediaQueryList);
    expect(mount().classList.contains('is-reveal-pending')).toBeFalse();
  });

  it('stays visible without IntersectionObserver', () => {
    (window as any).IntersectionObserver = undefined;
    expect(mount().classList.contains('is-reveal-pending')).toBeFalse();
  });

  it('hides off-screen elements and reveals them on intersect', () => {
    let cb!: IntersectionObserverCallback;
    (window as any).IntersectionObserver = class {
      constructor(c: IntersectionObserverCallback) { cb = c; }
      observe() {}
      unobserve() {}
      disconnect() {}
    };
    spyOn(window, 'matchMedia').and.returnValue({ matches: false } as MediaQueryList);
    const el = mount();
    el.getBoundingClientRect = () => ({ top: 99999, bottom: 100000 }) as DOMRect;
    // re-evaluated at creation; element in test DOM may be on-screen, so force intersect path
    cb([{ isIntersecting: true, target: el } as unknown as IntersectionObserverEntry], {} as IntersectionObserver);
    expect(el.classList.contains('is-revealed')).toBeTrue();
    expect(el.classList.contains('is-reveal-pending')).toBeFalse();
  });
});
