import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

/** Stub: Task 6 replaces this with header/footer shell. */
@Component({
  selector: 'app-site-layout',
  standalone: true,
  imports: [RouterOutlet],
  template: '<router-outlet />',
})
export class SiteLayoutComponent {}
