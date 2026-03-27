import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { ScrollNavService } from '../../core/scroll-nav.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
})
export class ProductsComponent {
  constructor(public readonly nav: ScrollNavService) {}
  showOperaModal = false;
  activeTab: 'overview' | 'modules' | 'pricing' | 'faq' = 'overview';
  openFaq: number | null = null;

  readonly faqItems = [
    { q: '¿Necesito tarjeta de crédito para empezar?',          a: 'No. Los 30 días de prueba son completamente gratis. Solo necesitas tu RUC y los datos básicos de tu empresa.' },
    { q: '¿La facturación electrónica es válida ante SUNAT?',   a: 'Sí. Estamos conectados a Nubefact, un Operador de Servicios Electrónicos (OSE) autorizado por SUNAT. Cada comprobante queda validado oficialmente.' },
    { q: '¿Qué pasa si quiero cambiar de plan?',               a: 'El upgrade es inmediato — los nuevos módulos aparecen en tu cuenta en segundos. Si bajas de plan, el cambio aplica al inicio del siguiente mes.' },
    { q: '¿Puedo usarlo con mi equipo?',                       a: 'Sí. Puedes invitar a tu equipo con distintos roles (admin, vendedor, cajero, contador) y cada uno accede solo a lo que necesita.' },
    { q: '¿Y si cancelo? ¿Pierdo mis datos?',                  a: 'No. Conservamos todos tus datos por 90 días después de cancelar. Si quieres volver, reactivas tu cuenta y todo sigue donde lo dejaste.' },
    { q: '¿Tienen soporte si me trabo?',                       a: 'Sí, soporte en español incluido en todos los planes. Starter por email, PYME con respuesta prioritaria, Enterprise con soporte dedicado.' },
  ];

  openModal(): void {
    this.showOperaModal = true;
    this.activeTab = 'overview';
    this.openFaq = null;
    document.body.style.overflow = 'hidden';
  }

  closeModal(): void {
    this.showOperaModal = false;
    document.body.style.overflow = '';
  }

  setTab(tab: 'overview' | 'modules' | 'pricing' | 'faq'): void {
    this.activeTab = tab;
  }

  toggleFaq(i: number): void {
    this.openFaq = this.openFaq === i ? null : i;
  }
}
