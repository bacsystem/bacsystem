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
      src: 'assets/img/clients/client-1.png',
      alt: 'Client 1',
      width: 102,
      height: 44,
    },
    {
      src: 'assets/img/clients/client-2.png',
      alt: 'Client 2',
      width: 126,
      height: 44,
    },
    {
      src: 'assets/img/clients/client-3.png',
      alt: 'Client 3',
      width: 124,
      height: 44,
    },
    {
      src: 'assets/img/clients/client-4.png',
      alt: 'Client 4',
      width: 125,
      height: 44,
    },
    {
      src: 'assets/img/clients/client-5.png',
      alt: 'Client 5',
      width: 124,
      height: 44,
    },
    {
      src: 'assets/img/clients/client-6.png',
      alt: 'Client 6',
      width: 141,
      height: 44,
    },
  ];
}
