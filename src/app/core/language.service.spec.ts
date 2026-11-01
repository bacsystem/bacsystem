import { TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageService } from './language.service';

describe('LanguageService', () => {
  let service: LanguageService;

  const setup = (): void => {
    TestBed.configureTestingModule({ imports: [TranslateModule.forRoot()] });
    const translate = TestBed.inject(TranslateService);
    translate.setTranslation('es', { hi: 'hola' });
    translate.setTranslation('en', { hi: 'hello' });
    service = TestBed.inject(LanguageService);
  };

  afterEach(() => {
    localStorage.clear();
    document.documentElement.lang = '';
  });

  it('defaults to es without stored value', async () => {
    setup();
    await service.init();
    expect(service.getCurrentLang()).toBe('es');
    expect(document.documentElement.lang).toBe('es');
  });

  it('uses stored en', async () => {
    localStorage.setItem('lang', 'en');
    setup();
    await service.init();
    expect(service.getCurrentLang()).toBe('en');
    expect(document.documentElement.lang).toBe('en');
  });

  it('falls back to es for invalid stored value', async () => {
    localStorage.setItem('lang', 'fr');
    setup();
    await service.init();
    expect(service.getCurrentLang()).toBe('es');
  });

  it('falls back to es when localStorage throws', async () => {
    spyOn(Storage.prototype, 'getItem').and.throwError('denied');
    setup();
    await service.init();
    expect(service.getCurrentLang()).toBe('es');
  });

  it('useLanguage persists and updates html lang', async () => {
    setup();
    await service.init();
    service.useLanguage('en');
    expect(localStorage.getItem('lang')).toBe('en');
    expect(document.documentElement.lang).toBe('en');
    expect(service.getCurrentLang()).toBe('en');
  });

  it('useLanguage ignores unsupported', async () => {
    setup();
    await service.init();
    service.useLanguage('xx');
    expect(service.getCurrentLang()).toBe('es');
    expect(document.documentElement.lang).toBe('es');
    expect(localStorage.getItem('lang')).toBeNull();
  });
});
