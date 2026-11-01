import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FieldComponent } from './field.component';

@Component({
  standalone: true,
  imports: [FieldComponent],
  template: `
    <ui-field label="Email" error="Inválido" hint="Tu correo"><input type="email" /></ui-field>
    <ui-field label="Mensaje"><textarea></textarea></ui-field>
  `,
})
class HostComponent {}

describe('FieldComponent', () => {
  it('links label and control with a generated unique id and shows the error', () => {
    const f = TestBed.createComponent(HostComponent);
    f.detectChanges();
    const el: HTMLElement = f.nativeElement;
    const labels = Array.from(el.querySelectorAll('label'));
    const input = el.querySelector('input') as HTMLInputElement;
    const textarea = el.querySelector('textarea') as HTMLTextAreaElement;
    expect(input.id).toBeTruthy();
    expect(labels[0].getAttribute('for')).toBe(input.id);
    expect(labels[0].textContent).toContain('Email');
    expect(textarea.id).toBeTruthy();
    expect(textarea.id).not.toBe(input.id);
    expect(labels[1].getAttribute('for')).toBe(textarea.id);
    expect(el.querySelector('[role="alert"]')?.textContent).toContain('Inválido');
    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(input.getAttribute('aria-describedby')).toBeTruthy();
    expect(textarea.getAttribute('aria-invalid')).toBeNull();
  });
});
