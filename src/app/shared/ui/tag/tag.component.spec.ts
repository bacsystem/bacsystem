import { TestBed } from '@angular/core/testing';
import { TagComponent } from './tag.component';

describe('TagComponent', () => {
  it('defaults to neutral tone', () => {
    const f = TestBed.createComponent(TagComponent);
    f.detectChanges();
    expect(f.nativeElement.classList).toContain('ui-tag--neutral');
  });

  it('applies the tone', () => {
    const f = TestBed.createComponent(TagComponent);
    f.componentRef.setInput('tone', 'accent');
    f.detectChanges();
    expect(f.nativeElement.classList).toContain('ui-tag--accent');
  });
});
