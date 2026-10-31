import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CLIENTS, ClientLogo, PRODUCTS, ProductItem, SERVICES, SITE, STATS, ServiceItem, StatItem } from '../../data/site.data';
import { CountUpDirective } from '../../shared/directives/count-up.directive';
import { RevealDirective } from '../../shared/directives/reveal.directive';
import { ButtonComponent, IconComponent, SectionComponent, SectionHeadingComponent, TagComponent } from '../../shared/ui';
import { ProductPreviewComponent } from './product-preview/product-preview.component';

/** Below this many logos the strip stays still: a loop of two logos reads as filler. */
const MIN_LOGOS_TO_SCROLL = 5;

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    RouterLink,
    TranslateModule,
    ButtonComponent,
    IconComponent,
    SectionComponent,
    SectionHeadingComponent,
    TagComponent,
    RevealDirective,
    CountUpDirective,
    ProductPreviewComponent,
  ],
  templateUrl: './home.page.html',
  styleUrl: './home.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageComponent {
  clients: ClientLogo[] = CLIENTS;
  featured: ProductItem | undefined = PRODUCTS.find(p => p.featured);
  services: ServiceItem[] = SERVICES;
  stats: StatItem[] = STATS;

  protected readonly email = SITE.email;

  protected get logosScroll(): boolean {
    return this.clients.length >= MIN_LOGOS_TO_SCROLL;
  }

  /** Two-digit position label: 01, 02… */
  protected index(i: number): string {
    return String(i + 1).padStart(2, '0');
  }
}
