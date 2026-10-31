import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Hero brand graphic: the Bacsystem isotype (navy "C" and teal corner) drawn as inline SVG,
 * with a few outlined echo shapes. Purely decorative; the pieces settle into place on load
 * via CSS only, so prerendered / no-JS output is already the assembled logo.
 */
@Component({
  selector: 'app-brand-mark',
  standalone: true,
  templateUrl: './brand-mark.component.html',
  styleUrl: './brand-mark.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BrandMarkComponent {}
