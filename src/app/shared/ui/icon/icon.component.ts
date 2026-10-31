import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Every icon the site may use (Bootstrap Icons names, without the `bi-` prefix). */
export const ICON_NAMES = [
  'arrow-right',
  'arrow-up-right',
  'list',
  'x-lg',
  'globe2',
  'sun-fill',
  'moon-fill',
  'circle-half',
  'telephone',
  'geo-alt',
  'check2-circle',
  'code-slash',
  'gear',
  'graph-up-arrow',
  'cloud',
  'box',
  'chevron-right',
  'bullseye',
  'rocket-takeoff',
  'whatsapp',
] as const;

export type IconName = (typeof ICON_NAMES)[number];

@Component({
  selector: 'ui-icon',
  standalone: true,
  templateUrl: './icon.component.html',
  styleUrl: './icon.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconComponent {
  readonly name = input.required<IconName>();
  readonly label = input<string>();
  readonly size = input<'sm' | 'md' | 'lg'>('md');
}
