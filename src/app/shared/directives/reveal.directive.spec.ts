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

  function fakeObserver() {
    const state: { cb?: IntersectionObserverCallback } = {};
    (window as any).IntersectionObserver = class {
      constructor(c: IntersectionObserverCallback) { state.cb = c; }
      observe() {}
      unobserve() {}
      disconnect() {}
    };
    spyOn(window, 'matchMedia').and.returnValue({ matches: false } as MediaQueryList);
    return state;
  }

  it('hides off-screen elements and reveals them on intersect', () => {
    const state = fakeObserver();
    spyOn(HTMLElement.prototype, 'getBoundingClientRect').and.returnValue(
      { top: window.innerHeight + 500, bottom: window.innerHeight + 600 } as DOMRect,
    );
    const el = mount();
    expect(el.classList.contains('is-reveal-pending')).toBeTrue();
    state.cb!([{ isIntersecting: true, target: el } as unknown as IntersectionObserverEntry], {} as IntersectionObserver);
    expect(el.classList.contains('is-revealed')).toBeTrue();
    expect(el.classList.contains('is-reveal-pending')).toBeFalse();
  });

  it('never hides an element already in the viewport', () => {
    fakeObserver();
    spyOn(HTMLElement.prototype, 'getBoundingClientRect').and.returnValue({ top: 10, bottom: 60 } as DOMRect);
    const el = mount();
    expect(el.classList.contains('is-reveal-pending')).toBeFalse();
  });
});
