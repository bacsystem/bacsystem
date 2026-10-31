import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { BrandMarkComponent } from './brand-mark.component';

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
    expect(el.querySelectorAll('.mark__echo').length).toBeGreaterThanOrEqual(2);
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
});
