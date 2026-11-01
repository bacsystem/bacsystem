import { TestBed } from '@angular/core/testing';
import { CardComponent } from './card.component';

describe('CardComponent', () => {
  it('defaults to outlined and non interactive', () => {
    const f = TestBed.createComponent(CardComponent);
    f.detectChanges();
    const el: HTMLElement = f.nativeElement;
    expect(el.classList).toContain('ui-card--outlined');
    expect(el.classList).not.toContain('ui-card--interactive');
  });

  it('adds ui-card--interactive when interactive', () => {
    const f = TestBed.createComponent(CardComponent);
    f.componentRef.setInput('interactive', true);
    f.componentRef.setInput('variant', 'tinted');
    f.detectChanges();
    expect(f.nativeElement.classList).toContain('ui-card--interactive');
    expect(f.nativeElement.classList).toContain('ui-card--tinted');
  });
});
