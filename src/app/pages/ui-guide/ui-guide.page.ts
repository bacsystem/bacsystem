import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ThemeService } from '../../core/theme.service';
import {
  ButtonComponent,
  CardComponent,
  FieldComponent,
  ICON_NAMES,
  IconComponent,
  SectionHeadingComponent,
  TagComponent,
} from '../../shared/ui';

/** Internal reference page (dev builds only): tokens and shared UI at a glance. */
@Component({
  selector: 'app-ui-guide-page',
  standalone: true,
  imports: [ButtonComponent, CardComponent, FieldComponent, IconComponent, SectionHeadingComponent, TagComponent],
  templateUrl: './ui-guide.page.html',
  styleUrl: './ui-guide.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiGuidePageComponent {
  protected readonly theme = inject(ThemeService);
  protected readonly icons = ICON_NAMES;

  protected readonly colors = [
    'bg',
    'bg-alt',
    'surface',
    'text',
    'text-muted',
    'heading',
    'primary',
    'primary-hover',
    'on-primary',
    'accent',
    'accent-text',
    'accent-soft',
    'border',
    'border-strong',
    'focus',
  ].map(name => ({ name: `--color-${name}`, value: `var(--color-${name})` }));

  protected readonly typeScale = ['4xl', '3xl', '2xl', 'xl', 'lg', 'md', 'sm', 'xs'].map(step => ({
    name: `--text-${step}`,
    value: `var(--text-${step})`,
  }));
}
