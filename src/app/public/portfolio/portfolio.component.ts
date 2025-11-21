import { Component, AfterViewInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

declare var GLightbox: any;

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './portfolio.component.html',
  styleUrl: './portfolio.component.css'
})
export class PortfolioComponent implements AfterViewInit {

  ngAfterViewInit(): void {
    this.initFilters();
    this.initGLightbox();
  }

  private initFilters(): void {
    // Simple filtering without Isotope
    const filterButtons = document.querySelectorAll('.portfolio-filters li');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('filter-active'));
        // Add active class to clicked button
        button.classList.add('filter-active');

        const filterValue = button.getAttribute('data-filter');

        // Show/hide items based on filter
        portfolioItems.forEach((item: any) => {
          const element = item as HTMLElement;
          if (filterValue === '*' || element.classList.contains(filterValue!.substring(1))) {
            element.style.display = 'block';
          } else {
            element.style.display = 'none';
          }
        });
      });
    });
  }

  private initGLightbox(): void {
    // Initialize GLightbox for image gallery
    if (typeof GLightbox !== 'undefined') {
      GLightbox({
        selector: '.glightbox'
      });
    }
  }
}
