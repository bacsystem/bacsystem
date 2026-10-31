import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { SITE } from '../../../data/site.data';
import { RevealGroupDirective } from '../../directives/reveal-group.directive';
import { WordsPipe } from '../../pipes/words.pipe';
import { ButtonComponent, IconComponent, SectionComponent } from '../../ui';
import { CONTACT_REVEAL } from './contact-band.motion';

/** The closing navy band that sends visitors to /contacto. Shared by Home and Nosotros; renders its own #contacto section. */
@Component({
  selector: 'app-contact-band',
  standalone: true,
  imports: [RouterLink, TranslateModule, ButtonComponent, IconComponent, SectionComponent, RevealGroupDirective, WordsPipe],
  templateUrl: './contact-band.component.html',
  styleUrl: './contact-band.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactBandComponent {
  protected readonly email = SITE.email;
  protected readonly reveal = CONTACT_REVEAL;
}
