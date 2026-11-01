import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;

  beforeEach(() => {
    localStorage.removeItem('theme-mode');
    delete document.documentElement.dataset['theme'];
    document.body.classList.remove('dark-mode');
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemeService);
  });

  afterEach(() => {
    localStorage.removeItem('theme-mode');
    delete document.documentElement.dataset['theme'];
    document.body.classList.remove('dark-mode');
  });

  it('defaults to light when nothing is saved', () => {
    service.init();

    expect(document.documentElement.dataset['theme']).toBe('light');
    expect(service.currentMode).toBe('light');
    expect(service.isDark).toBeFalse();
    expect(service.icon).toBe('sun-fill');
  });

  it('restores a saved dark mode', () => {
    localStorage.setItem('theme-mode', 'dark');

    service.init();

    expect(document.documentElement.dataset['theme']).toBe('dark');
    expect(service.currentMode).toBe('dark');
    expect(service.isDark).toBeTrue();
    expect(service.icon).toBe('moon-fill');
  });

  it('cycles light -> dark -> system -> light', () => {
    service.init();
    expect(service.currentMode).toBe('light');

    service.cycle();
    expect(service.currentMode).toBe('dark');
    expect(localStorage.getItem('theme-mode')).toBe('dark');

    service.cycle();
    expect(service.currentMode).toBe('system');
    expect(service.icon).toBe('circle-half');

    service.cycle();
    expect(service.currentMode).toBe('light');
  });

  it('never adds the legacy dark-mode class to the body', () => {
    localStorage.setItem('theme-mode', 'dark');

    service.init();
    service.cycle();

    expect(document.body.classList.contains('dark-mode')).toBeFalse();
  });

  it('falls back to light when the saved value is invalid', () => {
    localStorage.setItem('theme-mode', 'sepia');

    service.init();

    expect(service.currentMode).toBe('light');
    expect(document.documentElement.dataset['theme']).toBe('light');
  });
});
