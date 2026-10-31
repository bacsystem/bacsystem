import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'ui-section',
  standalone: true,
  templateUrl: './section.component.html',
  styleUrl: './section.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionComponent {
  readonly tone = input<'default' | 'alt' | 'primary'>('default');
  readonly sectionId = input<string>();
}
