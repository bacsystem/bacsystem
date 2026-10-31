import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IconComponent } from '../../../shared/ui';

interface PreviewRow {
  number: string;
  client: string;
  amount: string;
  status: 'accepted' | 'pending';
}

interface InvoiceLine {
  description: string;
  amount: string;
}

// EJEMPLO: datos ficticios para ilustrar la interfaz; reemplazar por captura real.
const ROWS: PreviewRow[] = [
  { number: 'F001-000219', client: 'Cliente Ejemplo S.A.C.', amount: 'S/ 2,360.00', status: 'accepted' },
  { number: 'B001-001842', client: 'Empresa Demo E.I.R.L.', amount: 'S/ 418.90', status: 'accepted' },
  { number: 'F001-000218', client: 'Negocio Muestra S.A.', amount: 'S/ 7,045.20', status: 'pending' },
  { number: 'F001-000217', client: 'Cliente Demo S.A.C.', amount: 'S/ 1,284.00', status: 'accepted' },
];

// EJEMPLO: alturas relativas de las barras (ventas por semana).
const BARS = [34, 42, 38, 51, 47, 58, 55, 63, 60, 72, 68, 84];

// EJEMPLO: líneas de una factura ficticia.
const LINES: InvoiceLine[] = [
  { description: 'Licencia anual · plan Equipo', amount: 'S/ 1,600.00' },
  { description: 'Implementación y capacitación', amount: 'S/ 400.00' },
];

/**
 * Ilustración de una interfaz de producto hecha con HTML/CSS y tokens.
 * No es una captura: se reemplaza cuando existan capturas reales.
 */
@Component({
  selector: 'app-product-preview',
  standalone: true,
  imports: [TranslateModule, IconComponent],
  templateUrl: './product-preview.component.html',
  styleUrl: './product-preview.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductPreviewComponent {
  readonly variant = input<'dashboard' | 'invoice'>('dashboard');

  protected readonly rows = ROWS;
  protected readonly bars = BARS;
  protected readonly lines = LINES;
}
