import { Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

export interface Client {
  src: string;
  alt: string;
  width: number;
  height: number;
}

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [NgOptimizedImage, TranslatePipe],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.css',
})
export class ClientsComponent {
  readonly clients: Client[] = [
    {
      src: 'assets/img/clients/client-7.png',
      alt: 'Client 7',
      width: 141,
      height: 44,
    },
    {
      src: 'assets/img/clients/client-8.png',
      alt: 'Client 8',
      width: 141,
      height: 44,
    },
  ];
}
