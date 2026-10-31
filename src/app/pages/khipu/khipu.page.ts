import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { KHIPU_BENEFITS, KHIPU_CHANNELS, KHIPU_DOCUMENTS, KHIPU_STEPS, KhipuDocument, KhipuStep } from '../../data/site.data';
import { RevealGroupDirective } from '../../shared/directives/reveal-group.directive';
import { PositionPipe } from '../../shared/pipes/position.pipe';
import { ContactBandComponent } from '../../shared/sections';
import { ButtonComponent, IconComponent, SectionComponent, SectionHeadingComponent, TagComponent } from '../../shared/ui';
import { InvoicePreviewComponent } from './invoice-preview/invoice-preview.component';
import { KHIPU_CHOREO } from './khipu.motion';

interface StepGroup {
  when: KhipuStep['when'];
  steps: (KhipuStep & { index: number })[];
}

/** Steps grouped by how often they happen, numbered across both groups (01–04). */
function groupSteps(steps: KhipuStep[]): StepGroup[] {
  const numbered = steps.map((step, index) => ({ ...step, index }));
  return (['once', 'each'] as const).map(when => ({ when, steps: numbered.filter(s => s.when === when) }));
}

/**
 * khipu (/productos/khipu): what it is with an invoice illustration, how it works (once vs. every
 * document), what it takes off your plate, who it is for, which SUNAT documents it issues today, and a
 * contact band asking for beta access. Everything renders in its final state on the server.
 */
@Component({
  selector: 'app-khipu-page',
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
    InvoicePreviewComponent,
    PositionPipe,
  ],
  templateUrl: './khipu.page.html',
  styleUrl: './khipu.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KhipuPageComponent {
  protected readonly groups = groupSteps(KHIPU_STEPS);
  protected readonly benefits = KHIPU_BENEFITS;
  protected readonly channels = KHIPU_CHANNELS;
  documents: KhipuDocument[] = KHIPU_DOCUMENTS;

  protected readonly choreo = KHIPU_CHOREO;
}
