import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnDestroy, PLATFORM_ID, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { WANKA_INDUSTRIES } from '../../../data/site.data';
import { MotionService, Stoppable } from '../../../shared/motion/motion.service';
import { playIndustries } from './industry-preview.motion';

/**
 * Ilustración del menú de Wanka (HTML/CSS y tokens, no captura): arriba los rubros, abajo el menú.
 * Los tres ítems comunes no cambian; los dos propios del rubro sí. Renderiza el primer rubro; en el
 * navegador, con movimiento permitido, pasa de un rubro al siguiente en bucle.
 */
@Component({
  selector: 'app-industry-preview',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './industry-preview.component.html',
  styleUrl: './industry-preview.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IndustryPreviewComponent implements AfterViewInit, OnDestroy {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly motion = inject(MotionService);
  private readonly platformId = inject(PLATFORM_ID);
  private stops: Stoppable[] = [];

  protected readonly industries = WANKA_INDUSTRIES;
  protected readonly common = ['sales', 'inventory', 'customers'] as const;

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId) || !this.motion.enabled) return;
    this.stops = playIndustries(this.host, this.motion);
  }

  ngOnDestroy(): void {
    this.stops.forEach(s => s.stop());
  }
}
