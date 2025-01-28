import { Component } from '@angular/core';
import {RouterModule} from '@angular/router';
import {HeaderComponent} from './header/header.component';

@Component({
  selector: 'app-public',
  standalone: true,
  imports: [RouterModule, HeaderComponent],
  templateUrl: './public.component.html',
  styleUrl: './public.component.css'
})
export class PublicComponent {

}
