import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { IconComponent } from '../../shared/ui';
import { SITE, TEL_HREF, WHATSAPP_HREF } from '../../data/site.data';
import { NAV_LINKS } from '../nav-links';

@Component({
  selector: 'app-site-footer',
  standalone: true,
  imports: [RouterLink, TranslateModule, IconComponent],
  templateUrl: './site-footer.component.html',
  styleUrl: './site-footer.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SiteFooterComponent {
  protected readonly links = NAV_LINKS;
  protected readonly contact = SITE;
  protected readonly phoneHref = TEL_HREF;
  protected readonly whatsappHref = WHATSAPP_HREF;
  protected readonly year = new Date().getFullYear();
}
