import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { PRODUCTS, ProductItem } from '../../data/site.data';
import { RevealGroupDirective } from '../../shared/directives/reveal-group.directive';
import { WordsPipe } from '../../shared/pipes/words.pipe';
import { ContactBandComponent } from '../../shared/sections';
import { ButtonComponent, IconComponent, MonogramComponent, SectionComponent, TagComponent } from '../../shared/ui';

/**
 * Productos (/productos): one card per own product with its real status (available or in
 * construction), what it does, who it is for and a link to its page. Home only carries the
 * one-line teaser; the detail lives on each product page.
 */
@Component({
  selector: 'app-products-page',
  standalone: true,
  imports: [
    RouterLink,
    TranslateModule,
    ButtonComponent,
    IconComponent,
    MonogramComponent,
    SectionComponent,
    TagComponent,
    RevealGroupDirective,
    ContactBandComponent,
    WordsPipe,
  ],
  templateUrl: './products.page.html',
  styleUrl: './products.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsPageComponent {
  products: ProductItem[] = PRODUCTS;
}
