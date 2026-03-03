import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { About } from '../../core/models/about.model';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css',
})
export class AboutComponent {
  readonly items: About[] = [
    {
      id: 1,
      name: 'application.about.cards.item1',
      label: 'label',
      description: 'description',
      icon: 'bi bi-bullseye',
      enable: true,
    },
    {
      id: 2,
      name: 'application.about.cards.item2',
      label: 'label',
      description: 'description',
      icon: 'bi bi-rocket-takeoff',
      enable: true,
    },
    {
      id: 3,
      name: 'application.about.cards.item3',
      label: 'label',
      description: 'description',
      icon: 'bi bi-award',
      enable: true,
    },
    {
      id: 4,
      name: 'application.about.cards.item4',
      label: 'label',
      description: 'description',
      icon: 'bi bi-microsoft-teams rotation-icon',
      enable: true,
    },
  ];
}
