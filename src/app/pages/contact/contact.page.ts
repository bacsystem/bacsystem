import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { SITE } from '../../data/site.data';
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
  protected readonly mailHref = `mailto:${SITE.email}`;
  protected readonly telHref = `tel:${SITE.phone.replace(/\s+/g, '')}`;
}
