import {Component, inject, OnInit} from '@angular/core';
import {RouterModule} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import {SeoService} from './core/seo.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterModule,
    TranslateModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  private readonly seoService = inject(SeoService);

  title = 'bacsystem';

  ngOnInit(): void {
    this.seoService.init();
  }
}
