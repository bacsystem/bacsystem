import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import es from '../../../../../public/i18n/es.json';
import { PROCESS } from '../../../data/site.data';
import { ProcessStepsComponent } from './process-steps.component';

describe('ProcessStepsComponent', () => {
  function create(platform: 'browser' | 'server' = 'browser'): HTMLElement {
    TestBed.configureTestingModule({
      imports: [ProcessStepsComponent, TranslateModule.forRoot()],
      providers: [{ provide: PLATFORM_ID, useValue: platform }],
    });
    const translate = TestBed.inject(TranslateService);
    translate.setTranslation('es', es);
    translate.use('es');
    const f = TestBed.createComponent(ProcessStepsComponent);
    f.detectChanges();
    return f.nativeElement as HTMLElement;
  }

  it('renders its own #proceso section with the heading as an h2', () => {
    const el = create();
    const section = el.querySelector('section#proceso') as HTMLElement;
    expect(section).toBeTruthy();
    expect(section.querySelector('h2')?.getAttribute('aria-label')).toBe(es.application.home.process.label);
    expect(el.querySelector('h1')).toBeNull();
  });

  it('shows every step in order with a two-digit marker', () => {
    const el = create();
    const steps = Array.from(el.querySelectorAll('.process__step'));
    expect(steps.length).toBe(PROCESS.length);
    expect(steps.map(s => s.querySelector('.process__marker')?.textContent?.trim())).toEqual(['01', '02', '03', '04']);
  });

  it('marks only the first step as the starting point', () => {
    const el = create();
    const steps = Array.from(el.querySelectorAll('.process__step'));
    expect(steps.map(s => s.classList.contains('is-current'))).toEqual([true, false, false, false]);
    expect(steps[0].querySelector('ui-tag')?.textContent?.trim()).toBe(es.application.home.process.start);
  });

  it('draws one connector between each pair of markers, visible on the server', () => {
    const el = create('server');
    expect(el.querySelectorAll('.process__link').length).toBe(PROCESS.length - 1);
    expect(el.querySelector('[style]')).toBeNull();
  });
});
