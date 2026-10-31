import { WordsPipe } from './words.pipe';

describe('WordsPipe', () => {
  const pipe = new WordsPipe();

  it('splits on any whitespace and drops empties', () => {
    expect(pipe.transform('  Software a\n medida   para empresas ')).toEqual(['Software', 'a', 'medida', 'para', 'empresas']);
  });

  it('keeps punctuation and accents with their word', () => {
    expect(pipe.transform('Cuéntanos qué te quita tiempo.')).toEqual(['Cuéntanos', 'qué', 'te', 'quita', 'tiempo.']);
  });

  it('returns no words for empty, null or undefined', () => {
    expect(pipe.transform('')).toEqual([]);
    expect(pipe.transform(null)).toEqual([]);
    expect(pipe.transform(undefined)).toEqual([]);
  });
});
