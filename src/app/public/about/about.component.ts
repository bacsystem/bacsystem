import {Component, OnInit} from '@angular/core';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [
    TranslatePipe
  ],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent implements OnInit {

  items: Array<About> = [];

  ngOnInit(): void {
    this.items = new Array<About>(
      {
        id: 1,
        name: "application.about.cards.item1",
        label: "label",
        description: "description",
        icon: "bi bi-briefcase", enable: true,
      },
      {
        id: 2,
        name: "application.about.cards.item2",
        label: "label",
        description: "description",
        icon: "bi bi-gem",
        enable: true,
      },
      {
        id: 3,
        name: "application.about.cards.item2",
        label: "label",
        description: "description",
        icon: "bi bi-broadcast",
        enable: true,
      },
      {
        id: 4,
        name: "application.about.cards.item2",
        label: "label",
        description: "description",
        icon: "bi bi-easel",
        enable: true,
      }
    );

  }

}

interface About {
  id: number;
  enable: boolean;
  icon: string
  name: string;
  label: string;
  description: string;
}
