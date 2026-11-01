import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'ui-card',
  standalone: true,
  template: '<ng-content />',
  styleUrl: './card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'ui-card',
    '[class.ui-card--plain]': "variant() === 'plain'",
    '[class.ui-card--outlined]': "variant() === 'outlined'",
    '[class.ui-card--tinted]': "variant() === 'tinted'",
    '[class.ui-card--interactive]': 'interactive()',
  },
})
export class CardComponent {
  readonly variant = input<'plain' | 'outlined' | 'tinted'>('outlined');
  readonly interactive = input(false);
}
