import { TestBed } from '@angular/core/testing';
import { SectionHeadingComponent } from './section-heading.component';

describe('SectionHeadingComponent', () => {
  function create(inputs: Record<string, unknown>) {
    const f = TestBed.createComponent(SectionHeadingComponent);
    for (const [k, v] of Object.entries(inputs)) f.componentRef.setInput(k, v);
    f.detectChanges();
    return f.nativeElement as HTMLElement;
  }

  it('renders the h2 title and is-center alignment', () => {
    const el = create({ title: 'X', align: 'center' });
    expect(el.querySelector('h2')?.textContent?.trim()).toBe('X');
    expect(el.querySelector('.ui-section-heading')?.classList).toContain('is-center');
  });

  it('does not render eyebrow or subtitle when absent', () => {
    const el = create({ title: 'X' });
    expect(el.querySelector('.ui-section-heading__eyebrow')).toBeNull();
    expect(el.querySelector('.ui-section-heading__subtitle')).toBeNull();
    expect(el.querySelector('.ui-section-heading')?.classList).not.toContain('is-center');
  });

  it('renders eyebrow and subtitle when given', () => {
    const el = create({ title: 'X', eyebrow: 'E', subtitle: 'S' });
    expect(el.querySelector('.ui-section-heading__eyebrow')?.textContent?.trim()).toBe('E');
    expect(el.querySelector('.ui-section-heading__subtitle')?.textContent?.trim()).toBe('S');
  });
});
