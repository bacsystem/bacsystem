import { TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import es from '../../../../../public/i18n/es.json';
import en from '../../../../../public/i18n/en.json';
import { WhatsappFormComponent } from './whatsapp-form.component';

describe('WhatsappFormComponent', () => {
  const t = es.application.site.contactPage.form;

  function create() {
    TestBed.configureTestingModule({ imports: [WhatsappFormComponent, TranslateModule.forRoot()] });
    const translate = TestBed.inject(TranslateService);
    translate.setTranslation('es', es);
    translate.use('es');
    const fixture = TestBed.createComponent(WhatsappFormComponent);
    fixture.detectChanges();
    return { fixture, component: fixture.componentInstance, el: fixture.nativeElement as HTMLElement };
  }

  it('shows no errors before the first send, then flags the empty required fields without opening WhatsApp', () => {
    const { fixture, component, el } = create();
    const open = spyOn(window, 'open');
    expect(el.querySelector('.ui-field__error')).toBeNull();
    component.send();
    fixture.detectChanges();
    const errors = Array.from(el.querySelectorAll('.ui-field__error')).map(e => e.textContent?.trim());
    expect(errors).toEqual([t.errors.required, t.errors.required]);
    expect(open).not.toHaveBeenCalled();
  });

  it('moves focus to the first field to fix', () => {
    const { fixture, component, el } = create();
    spyOn(window, 'open');
    document.body.appendChild(el);
    component.form.controls.name.setValue('Ana');
    fixture.detectChanges(); // as after typing: the name field is now valid in the DOM
    component.send();
    fixture.detectChanges();
    expect(document.activeElement).toBe(el.querySelector('textarea'));
    el.remove();
  });

  it('opens a WhatsApp chat with the number and the brief already written', () => {
    const { component } = create();
    const open = spyOn(window, 'open');
    component.form.setValue({ name: ' Ana ', company: 'Ferretería Sur', need: 'Un sistema de inventario para dos locales.', when: 'months' });
    component.send();
    expect(open).toHaveBeenCalledOnceWith(jasmine.any(String), '_blank', 'noopener');
    const url = new URL(open.calls.mostRecent().args[0] as string);
    expect(url.origin + url.pathname).toBe('https://wa.me/51972107074');
    expect(url.searchParams.get('text')).toBe(
      'Hola, soy Ana, de Ferretería Sur. Necesito: Un sistema de inventario para dos locales. Plazo: En 1 a 3 meses.',
    );
  });

  it('leaves the company out of the greeting when it is empty', () => {
    const { component } = create();
    component.form.setValue({ name: 'Luis', company: '', need: 'Mejorar nuestro sistema de ventas.', when: 'exploring' });
    expect(component.message()).toBe('Hola, soy Luis. Necesito: Mejorar nuestro sistema de ventas. Plazo: Solo estoy averiguando.');
  });

  it('asks for a little more detail when the need is too short', () => {
    const { fixture, component, el } = create();
    spyOn(window, 'open');
    component.form.setValue({ name: 'Ana', company: '', need: 'web', when: 'soon' });
    component.send();
    fixture.detectChanges();
    expect(el.querySelector('.ui-field__error')?.textContent?.trim()).toBe(t.errors.needShort);
  });

  it('has the same form keys in Spanish and English', () => {
    const keys = (o: object, prefix = ''): string[] =>
      Object.entries(o).flatMap(([k, v]) => (v && typeof v === 'object' ? keys(v, `${prefix}${k}.`) : [`${prefix}${k}`]));
    expect(keys(en.application.site.contactPage.form)).toEqual(keys(t));
  });
});
