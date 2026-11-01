import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'a[ui-button], button[ui-button]',
  standalone: true,
  template: '<ng-content />',
  styleUrl: './button.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'ui-btn',
    '[class.ui-btn--primary]': "variant() === 'primary'",
    '[class.ui-btn--secondary]': "variant() === 'secondary'",
    '[class.ui-btn--text]': "variant() === 'text'",
    '[class.ui-btn--md]': "size() === 'md'",
    '[class.ui-btn--lg]': "size() === 'lg'",
  },
})
export class ButtonComponent {
  readonly variant = input<'primary' | 'secondary' | 'text'>('primary');
  readonly size = input<'md' | 'lg'>('md');
}
