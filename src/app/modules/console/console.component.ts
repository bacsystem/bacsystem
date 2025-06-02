import {Component, OnInit} from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';
import ButtonComponent from "../../shared/ui/button/button.component";

@Component({
  selector: 'app-console',
  standalone: true,
  imports: [
    RouterLink,
    RouterOutlet,
    ButtonComponent,
  ],
  templateUrl: './console.component.html',
  styleUrl: './console.component.css'
})
export default class ConsoleComponent implements OnInit {


  listButton: ConsoleList[] = []

  ngOnInit(): void {
    this.listButton = [
      {
        name: "Region",
        link: "region",
        activated: true,
        icon: 'bi bi-house'
      },
      {
        name: "Country",
        link: "country",
        activated: true,
        icon: 'bi bi-house-door'
      },
      {
        name: "State",
        link: "state",
        activated: true,
        icon: 'bi bi-house-fill'
      },
      {
        name: "City",
        link: "city",
        activated: true,
        icon: 'bi bi-house-gear'
      },
      {
        name: "Address Type",
        link: "address-type",
        activated: true,
        icon: 'bi bi-house-slash'
      },
      {
        name: "Address",
        link: "address",
        activated: true,
        icon: 'bi bi-house-up'
      },
      {
        name: "Tenant Type",
        link: "tenant-type",
        activated: true,
        icon: 'bi bi-house-x'
      }, {
        name: "Tenant",
        link: "tenant",
        activated: true,
        icon: 'bi bi-houses'
      }
    ]
  }

}


interface ConsoleList {
  name: string;
  link: string;
  activated: boolean;
  icon?: string;
}
