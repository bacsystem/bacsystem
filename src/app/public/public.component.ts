import { Component } from '@angular/core';
import {RouterModule} from '@angular/router';
import {HeaderComponent} from './header/header.component';
import {HomeComponent} from './home/home.component';

@Component({
  selector: 'app-public',
  standalone: true,
  imports: [RouterModule, HeaderComponent, HomeComponent],
  templateUrl: './public.component.html',
  styleUrl: './public.component.css'
})
export class PublicComponent {

}
