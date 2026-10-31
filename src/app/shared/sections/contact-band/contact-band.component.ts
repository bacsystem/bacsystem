import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { RevealGroupDirective } from '../../directives/reveal-group.directive';
import { WordsPipe } from '../../pipes/words.pipe';
import { ButtonComponent, IconComponent, SectionComponent } from '../../ui';
import { CONTACT_REVEAL } from './contact-band.motion';

/** The closing navy band that sends visitors to /contacto. Shared by every page except Contacto (the footer below carries the e-mail); renders its own #contacto section. */
@Component({
  selector: 'app-contact-band',
  standalone: true,
  imports: [RouterLink, TranslateModule, ButtonComponent, IconComponent, SectionComponent, RevealGroupDirective, WordsPipe],
  templateUrl: './contact-band.component.html',
  styleUrl: './contact-band.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactBandComponent {
  protected readonly reveal = CONTACT_REVEAL;
}
