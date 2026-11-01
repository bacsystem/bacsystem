import { TestBed } from '@angular/core/testing';
import { MonogramComponent } from './monogram.component';

describe('MonogramComponent', () => {
  function create(text: string, size?: 'sm' | 'md'): HTMLElement {
    const f = TestBed.createComponent(MonogramComponent);
    f.componentRef.setInput('text', text);
    if (size) f.componentRef.setInput('size', size);
    f.detectChanges();
    return f.nativeElement as HTMLElement;
  }

  it('shows the initials and is hidden from assistive tech (the name is next to it)', () => {
    const el = create('CB');
    expect(el.textContent?.trim()).toBe('CB');
    expect(el.getAttribute('aria-hidden')).toBe('true');
    expect(el.classList).toContain('ui-monogram');
  });

  it('has a small size for cards', () => {
    expect(create('k', 'sm').classList).toContain('ui-monogram--sm');
  });
});
