import { Pipe, PipeTransform } from '@angular/core';

/**
 * Splits a heading into words so motion can reveal it line by line. Templates render each
 * word in a `.ui-word` span followed by `&ngsp;`, so the text, wrapping and accessible name
 * stay the same as the plain string.
 */
@Pipe({ name: 'words', standalone: true })
export class WordsPipe implements PipeTransform {
  transform(value: string | null | undefined): string[] {
    return (value ?? '').split(/\s+/).filter(Boolean);
  }
}
