import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IconComponent } from './icon.component';

describe('IconComponent', () => {
  let fixture: ComponentFixture<IconComponent>;
  beforeEach(() => {
    fixture = TestBed.createComponent(IconComponent);
    fixture.componentRef.setInput('name', 'whatsapp');
  });

  it('is decorative (aria-hidden) without a label', () => {
    fixture.detectChanges();
    const i: HTMLElement = fixture.nativeElement.querySelector('i.bi.bi-whatsapp');
    expect(i).toBeTruthy();
    expect(i.getAttribute('aria-hidden')).toBe('true');
    expect(i.getAttribute('role')).toBeNull();
  });

  it('exposes role=img and aria-label with a label', () => {
    fixture.componentRef.setInput('label', 'Correo');
    fixture.detectChanges();
    const i: HTMLElement = fixture.nativeElement.querySelector('i.bi');
    expect(i.getAttribute('aria-label')).toBe('Correo');
    expect(i.getAttribute('role')).toBe('img');
    expect(i.hasAttribute('aria-hidden')).toBeFalse();
  });

  it('applies the size class', () => {
    fixture.componentRef.setInput('size', 'lg');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('i').classList).toContain('ui-icon--lg');
  });
});
