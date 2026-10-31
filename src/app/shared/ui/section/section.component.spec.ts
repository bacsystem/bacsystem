import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SectionComponent } from './section.component';

@Component({
  standalone: true,
  imports: [SectionComponent],
  template: `<ui-section tone="alt" sectionId="about"><p class="inner">Hi</p></ui-section>`,
})
class HostComponent {}

describe('SectionComponent', () => {
  it('projects content in .container, sets tone class and id', () => {
    const f = TestBed.createComponent(HostComponent);
    f.detectChanges();
    const el: HTMLElement = f.nativeElement;
    const section = el.querySelector('section') as HTMLElement;
    expect(section.id).toBe('about');
    expect(section.classList).toContain('ui-section--alt');
    expect(section.querySelector('.container .inner')).toBeTruthy();
  });
});
