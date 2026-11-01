import { PositionPipe } from './position.pipe';

describe('PositionPipe', () => {
  const pipe = new PositionPipe();

  it('turns a zero-based index into a two-digit position', () => {
    expect(pipe.transform(0)).toBe('01');
    expect(pipe.transform(5)).toBe('06');
    expect(pipe.transform(11)).toBe('12');
  });
});
