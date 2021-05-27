import { hasIntersection } from '../src/Intersections';

describe('hasIntersection()', () => {
  it('intersects left overlap', () => {
    const left = ['1', '2', '3', '4', '5'];
    const right = ['4', '5', '6', '7', '8'];
    const intersects = hasIntersection(left, right);
    expect(intersects).toBe(true);
  });

  it('intersects right overlap', () => {
    const right = ['1', '2', '3', '4', '5'];
    const left = ['4', '5', '6', '7', '8'];
    const intersects = hasIntersection(left, right);
    expect(intersects).toBe(true);
  });

  it('intersects all overlap', () => {
    const left = ['1', '2', '3', '4', '5'];
    const right = ['1', '2', '3', '4', '5'];
    const intersects = hasIntersection(left, right);
    expect(intersects).toBe(true);
  });

  it('NOT intersects no overlap', () => {
    const left = ['1', '2', '3', '4', '5'];
    const right = ['6', '7', '8', '9', '10'];
    const intersects = hasIntersection(left, right);
    expect(intersects).toBe(false);
  });

  it('NOT intersects on empty', () => {
    const left: string[] = [];
    const right: string[] = [];
    const intersects = hasIntersection(left, right);
    expect(intersects).toBe(false);
  });

  it('NOT intersects on empty overlap', () => {
    const left: string[] = ['1', '2'];
    const right: string[] = [];
    let intersects = hasIntersection(left, right);
    expect(intersects).toBe(false);
    intersects = hasIntersection(right, left);
    expect(intersects).toBe(false);
  });
});
