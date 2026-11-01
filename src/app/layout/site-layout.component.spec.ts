import { ViewportScroller } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { SiteLayoutComponent } from './site-layout.component';

describe('SiteLayoutComponent', () => {
  const style = document.createElement('style');
  style.textContent = 'html { scroll-padding-top: 72px; }';

  afterEach(() => style.remove());

  function create(): ViewportScroller {
    document.head.appendChild(style);
    TestBed.configureTestingModule({
      imports: [SiteLayoutComponent, TranslateModule.forRoot()],
      providers: [provideRouter([]), { provide: PLATFORM_ID, useValue: 'browser' }],
    });
    const scroller = TestBed.inject(ViewportScroller);
    spyOn(scroller, 'setOffset').and.callThrough();
    TestBed.createComponent(SiteLayoutComponent).detectChanges();
    return scroller;
  }

  it('offsets router anchor scrolling by the sticky header (the page scroll-padding)', () => {
    const scroller = create();
    expect(scroller.setOffset).toHaveBeenCalled();
    const offset = (scroller.setOffset as jasmine.Spy).calls.mostRecent().args[0] as () => [number, number];
    expect(offset()).toEqual([0, 72]);
  });
});
