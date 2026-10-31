import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'ui-tag',
  standalone: true,
  template: '<ng-content />',
  styleUrl: './tag.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'ui-tag',
    '[class.ui-tag--neutral]': "tone() === 'neutral'",
    '[class.ui-tag--accent]': "tone() === 'accent'",
    '[class.ui-tag--primary]': "tone() === 'primary'",
  },
})
export class TagComponent {
  readonly tone = input<'neutral' | 'accent' | 'primary'>('neutral');
}
