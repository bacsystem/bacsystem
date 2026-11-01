import { Pipe, PipeTransform } from '@angular/core';

/**
 * Splits a heading into words so motion can reveal it line by line. Templates render each
 * word in an aria-hidden `.ui-word` span followed by `&ngsp;` (same visible text and wrapping)
 * and put the full string on the heading's aria-label, so it is announced as one title.
 */
@Pipe({ name: 'words', standalone: true })
export class WordsPipe implements PipeTransform {
  transform(value: string | null | undefined): string[] {
    return (value ?? '').split(/\s+/).filter(Boolean);
  }
}
