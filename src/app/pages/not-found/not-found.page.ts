import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NAV_LINKS, NavLink } from '../../layout/nav-links';
import { ButtonComponent, IconComponent, SectionComponent, SectionHeadingComponent } from '../../shared/ui';

/**
 * 404: says plainly the page doesn't exist and offers the way back (Home first, then the main
 * sections). Rendered for any unknown URL (the address stays as typed) and prerendered as
 * 404.html, which Cloudflare Pages serves with a real 404 status.
 */
@Component({
  selector: 'app-not-found-page',
  standalone: true,
  imports: [RouterLink, TranslateModule, ButtonComponent, IconComponent, SectionComponent, SectionHeadingComponent],
  templateUrl: './not-found.page.html',
  styleUrl: './not-found.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFoundPageComponent {
  protected readonly links: NavLink[] = NAV_LINKS;
}
