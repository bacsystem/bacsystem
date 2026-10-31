import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { WANKA_INDUSTRIES, WANKA_MODULES } from '../../data/site.data';
import { RevealGroupDirective } from '../../shared/directives/reveal-group.directive';
import { HEADING_REVEAL } from '../../shared/motion/choreo';
import { PositionPipe } from '../../shared/pipes/position.pipe';
import { ContactBandComponent } from '../../shared/sections';
import { ButtonComponent, IconComponent, SectionComponent, SectionHeadingComponent, TagComponent } from '../../shared/ui';
import { IndustryPreviewComponent } from './industry-preview/industry-preview.component';

/**
 * Wanka (/productos/wanka), in construction: what it is with the industry-menu illustration, the
 * screens each industry gets, what every business shares, and a contact band. Clearly marked as in
 * construction; no prices, dates or sign-up. Everything renders in its final state on the server.
 */
@Component({
  selector: 'app-wanka-page',
  standalone: true,
  imports: [
    RouterLink,
    TranslateModule,
    ButtonComponent,
    IconComponent,
    SectionComponent,
    SectionHeadingComponent,
    TagComponent,
    RevealGroupDirective,
    ContactBandComponent,
    IndustryPreviewComponent,
    PositionPipe,
  ],
  templateUrl: './wanka.page.html',
  styleUrl: './wanka.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WankaPageComponent {
  protected readonly industries = WANKA_INDUSTRIES;
  protected readonly modules = WANKA_MODULES;
  protected readonly choreo = { heading: HEADING_REVEAL };
}
