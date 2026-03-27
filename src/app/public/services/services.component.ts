import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { Service } from '../../core/models/service.model';
import { ScrollNavService } from '../../core/scroll-nav.service';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './services.component.html',
  styleUrl: './services.component.css',
})
export class ServicesComponent {
  constructor(public readonly nav: ScrollNavService) {}
  readonly items: Service[] = [
    {
      id: 1,
      name: 'application.services.cards.webdev',
      icon: 'bi bi-code-slash',
      enable: true,
    },
    {
      id: 2,
      name: 'application.services.cards.consulting',
      icon: 'bi bi-gear',
      enable: true,
    },
    {
      id: 3,
      name: 'application.services.cards.optimization',
      icon: 'bi bi-graph-up',
      enable: true,
    },
    {
      id: 4,
      name: 'application.services.cards.cloud',
      icon: 'bi bi-cloud',
      enable: true,
    },
  ];
}
