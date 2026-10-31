import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnDestroy, PLATFORM_ID, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { MotionService, Stoppable } from '../../../shared/motion/motion.service';
import { IconComponent } from '../../../shared/ui';
import { INVOICE_STEPS, playInvoice } from './invoice-preview.motion';

interface InvoiceLine {
  description: string;
  amount: string;
}

// EJEMPLO: datos ficticios para ilustrar un comprobante (el RUC de ejemplo tiene dígito verificador válido).
const LINES: InvoiceLine[] = [
  { description: 'Mantenimiento de equipos · octubre', amount: 'S/ 1,200.00' },
  { description: 'Repuestos y materiales', amount: 'S/ 800.00' },
];

/**
 * Ilustración de una factura emitida con khipu, hecha con HTML/CSS y tokens (no es una captura).
 * Debajo, los cuatro pasos del envío. Renderiza en su estado final (aceptada); en el navegador, con
 * movimiento permitido, los pasos se encienden uno a uno y la etiqueta pasa de "Enviada" a "Aceptada".
 */
@Component({
  selector: 'app-invoice-preview',
  standalone: true,
  imports: [TranslateModule, IconComponent],
  templateUrl: './invoice-preview.component.html',
  styleUrl: './invoice-preview.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvoicePreviewComponent implements AfterViewInit, OnDestroy {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly motion = inject(MotionService);
  private readonly platformId = inject(PLATFORM_ID);
  private stops: Stoppable[] = [];

  protected readonly lines = LINES;
  protected readonly steps = INVOICE_STEPS;

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId) || !this.motion.enabled) return;
    this.stops = playInvoice(this.host, this.motion);
  }

  ngOnDestroy(): void {
    this.stops.forEach(s => s.stop());
  }
}
