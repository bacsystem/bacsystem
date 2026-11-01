import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { PROCESS, ProcessStep } from '../../../data/site.data';
import { RevealGroupDirective } from '../../directives/reveal-group.directive';
import { PositionPipe } from '../../pipes/position.pipe';
import { SectionComponent, SectionHeadingComponent, TagComponent } from '../../ui';
import { PROCESS_REVEAL } from './process-steps.motion';

/**
 * "Así trabajamos contigo": the four steps on one thread (vertical on mobile, horizontal on
 * desktop), the line drawn by scroll progress. Shared by Home and Nosotros; renders its own
 * #proceso section.
 */
@Component({
  selector: 'app-process-steps',
  standalone: true,
  imports: [TranslateModule, SectionComponent, SectionHeadingComponent, TagComponent, RevealGroupDirective, PositionPipe],
  templateUrl: './process-steps.component.html',
  styleUrl: './process-steps.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProcessStepsComponent {
  protected readonly steps: ProcessStep[] = PROCESS;
  protected readonly reveal = PROCESS_REVEAL;
}
