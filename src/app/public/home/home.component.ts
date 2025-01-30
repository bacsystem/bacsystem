import { Component } from '@angular/core';
import {RouterModule} from '@angular/router';
import {NgOptimizedImage} from '@angular/common';
import {TranslatePipe} from '@ngx-translate/core';
import {ClientsComponent} from '../clients/clients.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, NgOptimizedImage, TranslatePipe, ClientsComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
