import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { MenuService, MenuItem } from '../../core/menu.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterModule, TranslatePipe],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent implements OnInit {
  currentYear = new Date().getFullYear();
  navItems: MenuItem[] = [];
  readonly svcKeys = ['svc1', 'svc2', 'svc3', 'svc4', 'svc5', 'svc6'];

  constructor(
    private readonly menuService: MenuService,
    private readonly router: Router,
    @Inject(PLATFORM_ID) private readonly platformId: object,
  ) {}

  ngOnInit(): void {
    this.navItems = this.menuService.getMenuItems().filter(i => i.active);
  }

  navClick(item: MenuItem): void {
    this.navToSection(item.routerLink.split('/').pop() ?? 'home');
  }

  navToSection(sectionId: string): void {
    const onHome = this.router.url.startsWith('/public/home');
    if (onHome && isPlatformBrowser(this.platformId)) {
      document.getElementById('section-' + sectionId)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      this.router.navigate(['/public/home']).then(() => {
        if (isPlatformBrowser(this.platformId)) {
          setTimeout(() => {
            document.getElementById('section-' + sectionId)?.scrollIntoView({ behavior: 'smooth' });
          }, 350);
        }
      });
    }
  }
}
