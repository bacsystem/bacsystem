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

  it('writes the final value on the server', () => {
    expect(mount('server').textContent).toBe('42');
  });

  it('writes the final value without IntersectionObserver', () => {
    (window as any).IntersectionObserver = undefined;
    expect(mount().textContent).toBe('42');
  });
});
