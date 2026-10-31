import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { SERVICE_DETAILS, ServiceDetail } from '../../data/site.data';
import { RevealGroupDirective } from '../../shared/directives/reveal-group.directive';
import { PositionPipe } from '../../shared/pipes/position.pipe';
import { WordsPipe } from '../../shared/pipes/words.pipe';
import { ContactBandComponent } from '../../shared/sections';
import { IconComponent, SectionComponent } from '../../shared/ui';
import { SERVICES_PAGE_CHOREO } from './services.motion';

/**
 * Servicios: intro with an index of the services, one block per service (alternating sides,
 * big number, what it is / when it fits / what you get, each with its #anchor) and the shared
 * contact band. The process and the products teaser live only on Home. Everything
 * renders in its final state on the server; entrances only play for blocks below the fold.
 */
@Component({
  selector: 'app-services-page',
  standalone: true,
  imports: [
    RouterLink,
    TranslateModule,
    IconComponent,
    SectionComponent,
    RevealGroupDirective,
    ContactBandComponent,
    PositionPipe,
    WordsPipe,
  ],
  templateUrl: './services.page.html',
  styleUrl: './services.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServicesPageComponent {
  services: ServiceDetail[] = SERVICE_DETAILS;

  protected readonly choreo = SERVICES_PAGE_CHOREO;
}
