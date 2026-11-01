import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewEncapsulation,
  effect,
  inject,
  input,
} from '@angular/core';

let nextId = 0;

@Component({
  selector: 'ui-field',
  standalone: true,
  templateUrl: './field.component.html',
  styleUrl: './field.component.css',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldComponent implements AfterContentInit {
  readonly label = input.required<string>();
  readonly hint = input<string>();
  readonly error = input<string>();

  protected readonly controlId = `ui-field-${++nextId}`;
  protected readonly hintId = `${this.controlId}-hint`;
  protected readonly errorId = `${this.controlId}-error`;

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private control: HTMLElement | null = null;

  constructor() {
    effect(() => {
      const hasError = !!this.error();
      const hasHint = !!this.hint();
      const control = this.control;
      if (!control) return;
      if (hasError) control.setAttribute('aria-invalid', 'true');
      else control.removeAttribute('aria-invalid');
      const described = [hasHint ? this.hintId : '', hasError ? this.errorId : ''].filter(Boolean);
      if (described.length) control.setAttribute('aria-describedby', described.join(' '));
      else control.removeAttribute('aria-describedby');
    });
  }

  ngAfterContentInit(): void {
    this.control = this.host.nativeElement.querySelector('input, textarea, select');
    this.control?.setAttribute('id', this.controlId);
  }
}
