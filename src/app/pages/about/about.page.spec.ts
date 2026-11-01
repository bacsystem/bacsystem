import { PLATFORM_ID } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import es from '../../../../public/i18n/es.json';
import en from '../../../../public/i18n/en.json';
import { TEAM, VALUES } from '../../data/site.data';
import { AboutPageComponent } from './about.page';

describe('AboutPageComponent', () => {
  let fixture: ComponentFixture<AboutPageComponent>;
  const t = es.application.aboutPage;

  function setup(platform: 'browser' | 'server' = 'browser'): AboutPageComponent {
    TestBed.configureTestingModule({
      imports: [AboutPageComponent, TranslateModule.forRoot()],
      providers: [provideRouter([]), { provide: PLATFORM_ID, useValue: platform }],
    });
    const translate = TestBed.inject(TranslateService);
    translate.setTranslation('es', es);
    translate.use('es');
    fixture = TestBed.createComponent(AboutPageComponent);
    return fixture.componentInstance;
  }

  function render(): HTMLElement {
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  const text = (el: Element | null | undefined) => el?.textContent?.replace(/\s+/g, ' ').trim();

  it('renders exactly one h1 with the page statement and the positioning lead', () => {
    setup();
    const el = render();
    const h1s = el.querySelectorAll('h1');
    expect(h1s.length).toBe(1);
    expect(text(h1s[0])).toBe(t.intro.title);
    expect(h1s[0].getAttribute('aria-label')).toBe(t.intro.title);
    expect(text(el.querySelector('.intro__lead'))).toBe(t.intro.lead);
  });

  it('keeps the h1 short (the display face wraps badly past ~32 characters)', () => {
    expect(t.intro.title.length).toBeLessThanOrEqual(32);
    expect(en.application.aboutPage.intro.title.length).toBeLessThanOrEqual(32);
  });

  it('shows the mission and the vision, each with its label', () => {
    setup();
    const el = render();
    const blocks = Array.from(el.querySelectorAll('#mision .purpose__block'));
    expect(blocks.length).toBe(2);
    expect(text(blocks[0].querySelector('h2'))).toBe(t.mission.label);
    expect(text(blocks[0].querySelector('.purpose__text'))).toBe(t.mission.text);
    expect(text(blocks[1].querySelector('h2'))).toBe(t.vision.label);
    expect(text(blocks[1].querySelector('.purpose__text'))).toBe(t.vision.text);
    expect(blocks.map(b => b.querySelector('.purpose__icon i')?.className)).withContext('icons of the original site').toEqual([
      jasmine.stringContaining('bi-bullseye'),
      jasmine.stringContaining('bi-rocket-takeoff'),
    ]);
  });

  it('lists the six values, numbered, each with its name and what it means in practice', () => {
    setup();
    const el = render();
    const items = Array.from(el.querySelectorAll('#valores .values__item'));
    expect(VALUES.length).toBe(6);
    expect(items.length).toBe(6);
    expect(items.map(i => text(i.querySelector('.values__index')))).toEqual(['01', '02', '03', '04', '05', '06']);
    expect(text(items[1].querySelector('h3'))).toBe(t.values.items.integrity.title);
    expect(text(items[1].querySelector('.values__text'))).toBe(t.values.items.integrity.text);
    expect(items.every(i => !i.querySelector('ui-icon'))).withContext('typographic list, not icon cards').toBeTrue();
  });

  it('does not repeat what Home already shows (process, positioning phrase)', () => {
    setup();
    const el = render();
    expect(el.querySelector('#proceso')).toBeNull();
    expect(t.intro.lead).not.toBe(es.application.home.hero.subtitle);
  });

  it('introduces the three team members with real names, roles and monograms when there is no photo', () => {
    setup();
    const el = render();
    const members = Array.from(el.querySelectorAll('#equipo .team__member'));
    expect(members.length).toBe(3);
    expect(members.map(m => text(m.querySelector('h3')))).toEqual(['Christian Bacilio', 'José Bacilio', 'Faustina Del Rosario']);
    expect(members.map(m => text(m.querySelector('.team__monogram')))).toEqual(['CB', 'JB', 'FD']);
    expect(members.every(m => !m.querySelector('img'))).toBeTrue();
    expect(text(members[0].querySelector('.team__role'))).toBe(t.team.members.christian.role);
    expect(text(members[0].querySelector('.team__bio'))).toBe(t.team.members.christian.bio);
    expect(el.querySelector('#equipo a[href="#"]')).withContext('no placeholder social links').toBeNull();
  });

  it('keeps the monogram out of the accessibility tree (the name is the heading)', () => {
    setup();
    const el = render();
    expect(el.querySelector('.team__monogram')?.getAttribute('aria-hidden')).toBe('true');
  });

  it('shows a member photo instead of the monogram once one is provided', () => {
    const page = setup();
    page.team = [{ ...TEAM[0], photo: '/assets/img/team/christian.jpg' }, ...TEAM.slice(1)];
    const el = render();
    const first = el.querySelector('#equipo .team__member') as HTMLElement;
    const img = first.querySelector('img');
    expect(img?.getAttribute('src')).toBe('/assets/img/team/christian.jpg');
    expect(img?.getAttribute('alt')).withContext('the name is the heading right below; no double announcement').toBe('');
    expect(first.querySelector('.team__monogram')).toBeNull();
  });

  it('removes the team section when there are no members', () => {
    const page = setup();
    page.team = [];
    const el = render();
    expect(el.querySelector('#equipo')).toBeNull();
  });

  it('ends with the shared contact band linking to /contacto', () => {
    setup();
    const el = render();
    expect(el.querySelector('app-contact-band #contacto a[href="/contacto"]')).toBeTruthy();
  });

  it('renders the sections in order', () => {
    setup();
    const el = render();
    const ids = Array.from(el.querySelectorAll('section')).map(s => s.id);
    expect(ids).toEqual(['nosotros', 'mision', 'valores', 'equipo', 'contacto']);
  });

  it('renders everything visible on the server (no inline pre-state)', () => {
    setup('server');
    const el = render();
    expect(el.querySelector('[style]')).toBeNull();
    expect(el.querySelector('.is-motion-pending')).toBeNull();
  });

  it('has the same aboutPage keys in Spanish and English, and no superseded legacy copy', () => {
    const keys = (o: object, prefix = ''): string[] =>
      Object.entries(o).flatMap(([k, v]) => (v && typeof v === 'object' ? keys(v, `${prefix}${k}.`) : [`${prefix}${k}`]));
    expect(keys(en.application.aboutPage)).toEqual(keys(es.application.aboutPage));
    for (const lang of [es, en]) {
      expect('about' in lang.application).toBeFalse();
      expect('team' in lang.application).toBeFalse();
    }
  });

  it('never uses the banned clichés in its copy (mission and vision are the owner\'s official text, kept verbatim)', () => {
    const banned = /innovador|excelencia|líder(es)? en|disruptiv|redefin/i;
    const { mission, vision, ...rest } = es.application.aboutPage;
    expect(banned.test(JSON.stringify(rest))).toBeFalse();
    expect(mission.text).toBe('Crear soluciones tecnológicas innovadoras y de calidad que mejoren los procesos de los clientes y fomenten su crecimiento.');
    expect(vision.text).toBe('Ser líderes en transformación digital y desarrollo de software, destacando por excelencia y soluciones escalables.');
  });
});
