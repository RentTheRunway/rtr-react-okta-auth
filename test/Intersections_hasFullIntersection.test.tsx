import { hasFullIntersection } from '../src/Intersections';

describe('<WhenMemberOf />', () => {
  describe('hasFullIntersection()', () => {
    it('NOT intersects left overlap', () => {
      const left = ['1', '2', '3', '4', '5'];
      const right = ['4', '5', '6', '7', '8'];
      const intersects = hasFullIntersection(left, right);
      expect(intersects).toBe(false);
    });

    it('NOT intersects right overlap', () => {
      const right = ['1', '2', '3', '4', '5'];
      const left = ['4', '5', '6', '7', '8'];
      const intersects = hasFullIntersection(left, right);
      expect(intersects).toBe(false);
    });

    it('intersects all overlap', () => {
      const left = ['1', '2', '3', '4', '5'];
      const right = ['1', '2', '3', '4', '5'];
      const intersects = hasFullIntersection(left, right);
      expect(intersects).toBe(true);
    });

    it('NOT intersects no overlap', () => {
      const left = ['1', '2', '3', '4', '5'];
      const right = ['6', '7', '8', '9', '10'];
      const intersects = hasFullIntersection(left, right);
      expect(intersects).toBe(false);
    });

    it('NOT intersects on empty', () => {
      const left: string[] = [];
      const right: string[] = [];
      const intersects = hasFullIntersection(left, right);
      expect(intersects).toBe(false);
    });

    it('NOT intersects on empty overlap', () => {
      const left: string[] = ['1', '2'];
      const right: string[] = [];
      let intersects = hasFullIntersection(left, right);
      expect(intersects).toBe(false);
      intersects = hasFullIntersection(right, left);
      expect(intersects).toBe(false);
    });
  });
});
