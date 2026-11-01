import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { RevealGroupDirective } from '../../directives/reveal-group.directive';
import { WordsPipe } from '../../pipes/words.pipe';
import { ButtonComponent, IconComponent, SectionComponent } from '../../ui';
import { CONTACT_REVEAL } from './contact-band.motion';

/** The closing navy band that sends visitors to /contacto. Shared by every page except Contacto (the footer below carries WhatsApp and the address); renders its own #contacto section. */
@Component({
  selector: 'app-contact-band',
  standalone: true,
  imports: [RouterLink, TranslateModule, ButtonComponent, IconComponent, SectionComponent, RevealGroupDirective, WordsPipe],
  templateUrl: './contact-band.component.html',
  styleUrl: './contact-band.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactBandComponent {
  /** Copy keys; the defaults are the custom-software pitch, product pages pass their own. */
  readonly titleKey = input('application.home.contact.title');
  readonly subtitleKey = input('application.home.contact.subtitle');
  readonly ctaKey = input('application.home.contact.cta');
  /** An external destination for the button (e.g. a product's sign-up); empty keeps /contacto. */
  readonly ctaHref = input('');

  protected readonly reveal = CONTACT_REVEAL;
}
