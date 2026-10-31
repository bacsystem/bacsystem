import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ButtonComponent } from './button.component';

@Component({
  standalone: true,
  imports: [ButtonComponent],
  template: `
    <a ui-button variant="secondary" size="lg" class="extra" href="/x">Go</a>
    <button ui-button>Default</button>
  `,
})
class HostComponent {}

describe('ButtonComponent', () => {
  it('applies variant and size classes and keeps consumer classes', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const [a, b] = Array.from(fixture.nativeElement.querySelectorAll('[ui-button]')) as HTMLElement[];
    for (const c of ['ui-btn', 'ui-btn--secondary', 'ui-btn--lg', 'extra']) {
      expect(a.classList).toContain(c);
    }
    expect(a.textContent).toContain('Go');
    for (const c of ['ui-btn', 'ui-btn--primary', 'ui-btn--md']) {
      expect(b.classList).toContain(c);
    }
  });
});
