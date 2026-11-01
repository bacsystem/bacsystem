import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { SITE, TEL_HREF } from '../../data/site.data';
import { ButtonComponent, IconComponent, SectionComponent, SectionHeadingComponent } from '../../shared/ui';
import { WhatsappPipe } from '../../shared/pipes/whatsapp.pipe';

@Component({
  selector: 'app-contact-page',
  standalone: true,
  imports: [TranslateModule, ButtonComponent, IconComponent, SectionComponent, SectionHeadingComponent, WhatsappPipe],
  templateUrl: './contact.page.html',
  styleUrl: './contact.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactPageComponent {
  protected readonly site = SITE;
  protected readonly telHref = TEL_HREF;
}
