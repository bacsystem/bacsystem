import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Initials on a navy tile with the teal corner piece of the logo: the stand-in for a photo or a logo
 * file (team members, own products). Decorative: the name always sits next to it in text.
 */
@Component({
  selector: 'ui-monogram',
  standalone: true,
  template: '{{ text() }}',
  styleUrl: './monogram.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'ui-monogram',
    'aria-hidden': 'true',
    '[class.ui-monogram--sm]': "size() === 'sm'",
  },
})
export class MonogramComponent {
  readonly text = input.required<string>();
  readonly size = input<'sm' | 'md'>('md');
}
