import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { IconComponent } from '../../shared/ui';
import { NAV_LINKS } from '../nav-links';

// mover a site.data.ts en Task 7
const CONTACT = {
  email: 'bacsystem.sac@gmail.com',
  phone: '+51 907 892 868',
  address: 'Av. B 200 Lima',
} as const;

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
  protected readonly contact = CONTACT;
  protected readonly phoneHref = `tel:${CONTACT.phone.replace(/\s+/g, '')}`;
  protected readonly year = new Date().getFullYear();
}
