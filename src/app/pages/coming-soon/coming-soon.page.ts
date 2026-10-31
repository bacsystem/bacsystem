import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonComponent, SectionComponent, SectionHeadingComponent } from '../../shared/ui';

@Component({
  selector: 'app-coming-soon-page',
  standalone: true,
  imports: [RouterLink, TranslateModule, ButtonComponent, SectionComponent, SectionHeadingComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ui-section>
      <ui-section-heading
        [title]="titleKey | translate"
        [subtitle]="'application.site.comingSoon.text' | translate"
      />
      <a ui-button routerLink="/">{{ 'application.site.comingSoon.backHome' | translate }}</a>
    </ui-section>
  `,
})
export class ComingSoonPageComponent {
  private readonly data = inject(ActivatedRoute).snapshot.data;
  /** Short page name (not the SEO title, which carries the "| Bacsystem Solutions" suffix). */
  protected readonly titleKey =
    (this.data['headingKey'] as string | undefined) ?? 'application.site.comingSoon.title';
}
