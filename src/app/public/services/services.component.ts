import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { Service } from '../../core/models/service.model';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [TranslatePipe, RouterModule],
  templateUrl: './services.component.html',
  styleUrl: './services.component.css',
})
export class ServicesComponent {
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
