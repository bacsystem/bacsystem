import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { PURPOSE, PurposeItem, TEAM, TeamMember, VALUES, ValueItem } from '../../data/site.data';
import { RevealGroupDirective } from '../../shared/directives/reveal-group.directive';
import { PositionPipe } from '../../shared/pipes/position.pipe';
import { WordsPipe } from '../../shared/pipes/words.pipe';
import { ContactBandComponent } from '../../shared/sections';
import { SectionComponent, SectionHeadingComponent } from '../../shared/ui';
import { ABOUT_CHOREO } from './about.motion';

const FACTS = ['place', 'people'] as const;

/**
 * Nosotros: who we are (intro + facts), mission and vision, values in practice, the team, and
 * the shared contact band (the process lives only on Home). Everything renders in its final
 * state on the server; entrances only play for sections still below the fold.
 */
@Component({
  selector: 'app-about-page',
  standalone: true,
  imports: [
    TranslateModule,
    SectionComponent,
    SectionHeadingComponent,
    RevealGroupDirective,
    ContactBandComponent,
    PositionPipe,
    WordsPipe,
  ],
  templateUrl: './about.page.html',
  styleUrl: './about.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutPageComponent {
  purpose: PurposeItem[] = PURPOSE;
  values: ValueItem[] = VALUES;
  team: TeamMember[] = TEAM;

  protected readonly facts = FACTS;
  protected readonly choreo = ABOUT_CHOREO;
}
