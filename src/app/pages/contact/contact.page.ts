import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { SITE, TEL_HREF, WHATSAPP_HREF } from '../../data/site.data';
import { IconComponent, SectionComponent, SectionHeadingComponent } from '../../shared/ui';

@Component({
  selector: 'app-contact-page',
  standalone: true,
  imports: [TranslateModule, IconComponent, SectionComponent, SectionHeadingComponent],
  templateUrl: './contact.page.html',
  styleUrl: './contact.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactPageComponent {
  protected readonly site = SITE;
  protected readonly whatsappHref = WHATSAPP_HREF;
  protected readonly telHref = TEL_HREF;
}
