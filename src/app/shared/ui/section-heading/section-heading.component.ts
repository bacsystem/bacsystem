import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { WordsPipe } from '../../pipes/words.pipe';

@Component({
  selector: 'ui-section-heading',
  standalone: true,
  imports: [WordsPipe],
  templateUrl: './section-heading.component.html',
  styleUrl: './section-heading.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionHeadingComponent {
  readonly eyebrow = input<string>();
  readonly title = input.required<string>();
  readonly subtitle = input<string>();
  readonly level = input<'h1' | 'h2'>('h2');
  readonly align = input<'start' | 'center'>('start');
}
