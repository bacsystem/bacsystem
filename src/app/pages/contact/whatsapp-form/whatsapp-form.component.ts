import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { WHATSAPP_HREF } from '../../../data/site.data';
import { ButtonComponent, FieldComponent, IconComponent } from '../../../shared/ui';

/** "When" options, in the order shown (labels in application.site.contactPage.form.when.options). */
export const WHEN_OPTIONS = ['soon', 'months', 'later', 'exploring'] as const;
type When = (typeof WHEN_OPTIONS)[number];

const T = 'application.site.contactPage.form';

/**
 * A short brief that ends in WhatsApp: name, company, what they need and when. On send it opens a chat
 * with SITE.phone and the message already written; nothing is stored or sent anywhere by the site, so
 * there is no inbox to watch and no personal data to keep.
 */
@Component({
  selector: 'app-whatsapp-form',
  standalone: true,
  imports: [ReactiveFormsModule, TranslateModule, ButtonComponent, FieldComponent, IconComponent],
  templateUrl: './whatsapp-form.component.html',
  styleUrl: './whatsapp-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WhatsappFormComponent {
  private readonly translate = inject(TranslateService);
  private readonly window = inject(DOCUMENT).defaultView;
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;

  protected readonly whenOptions = WHEN_OPTIONS;
  protected readonly submitted = signal(false);

  readonly form = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(80)] }),
    company: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(80)] }),
    need: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(10), Validators.maxLength(600)] }),
    when: new FormControl<When>('soon', { nonNullable: true }),
  });

  /** The error key to show for a field, only once the visitor tried to send. */
  protected errorFor(name: 'name' | 'need'): string | undefined {
    const control = this.form.controls[name];
    if (!this.submitted() || control.valid) return undefined;
    if (control.hasError('required')) return `${T}.errors.required`;
    if (control.hasError('minlength')) return `${T}.errors.needShort`;
    return `${T}.errors.tooLong`;
  }

  /** The chat message, in the visitor's language. */
  message(): string {
    const { name, company, need, when } = this.form.getRawValue();
    const who = company.trim()
      ? this.translate.instant(`${T}.message.whoCompany`, { name: name.trim(), company: company.trim() })
      : this.translate.instant(`${T}.message.who`, { name: name.trim() });
    const whenText = this.translate.instant(`${T}.when.options.${when}`);
    return this.translate.instant(`${T}.message.body`, { who, need: need.trim(), when: whenText });
  }

  /** wa.me link with the message prefilled. */
  href(): string {
    return `${WHATSAPP_HREF}?text=${encodeURIComponent(this.message())}`;
  }

  send(): void {
    this.submitted.set(true);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      // Take the visitor to the first field to fix (it carries the error message via aria-describedby).
      this.host.querySelector<HTMLElement>('input.ng-invalid, textarea.ng-invalid')?.focus();
      return;
    }
    this.window?.open(this.href(), '_blank', 'noopener');
  }
}
