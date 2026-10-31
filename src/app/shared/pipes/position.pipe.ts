import { Pipe, PipeTransform } from '@angular/core';

/** Two-digit position label for numbered lists: 0 → '01', 5 → '06'. */
@Pipe({ name: 'position', standalone: true })
export class PositionPipe implements PipeTransform {
  transform(index: number): string {
    return String(index + 1).padStart(2, '0');
  }
}
