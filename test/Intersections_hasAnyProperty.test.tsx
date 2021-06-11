import { hasAnyProperty } from '../src/Intersections';

describe('hasAnyProperty()', () => {
  it('true for matching property', () => {
    const obj = {
      '2': true,
      '5': true,
    };
    const properties = ['1', '2', '3'];
    const intersects = hasAnyProperty(obj, properties);
    expect(intersects).toBe(true);
  });

  it('true for more than one matching property', () => {
    const obj = {
      '2': true,
      '4': true,
    };
    const properties = ['1', '2', '3', '4', '5'];
    const intersects = hasAnyProperty(obj, properties);
    expect(intersects).toBe(true);
  });

  it('true for first matching property', () => {
    const obj = {
      '2': true,
    };
    const properties = ['2', '3', '4', '5'];
    const intersects = hasAnyProperty(obj, properties);
    expect(intersects).toBe(true);
  });

  it('true for last matching property', () => {
    const obj = {
      '4': true,
    };
    const properties = ['1', '2', '3', '4'];
    const intersects = hasAnyProperty(obj, properties);
    expect(intersects).toBe(true);
  });

  it('false for no matching object property', () => {
    const obj = {
      none: true,
    };
    const properties = ['1', '2', '3'];
    const intersects = hasAnyProperty(obj, properties);
    expect(intersects).toBe(false);
  });

  it('false for empty property array', () => {
    const obj = {
      none: true,
    };
    const properties: string[] = [];
    const intersects = hasAnyProperty(obj, properties);
    expect(intersects).toBe(false);
  });

  it('false for empty object', () => {
    const obj = {};
    const properties = ['1', '2', '3'];
    const intersects = hasAnyProperty(obj, properties);
    expect(intersects).toBe(false);
  });

  it('false for empty object and empty array', () => {
    const obj = {};
    const properties: string[] = [];
    const intersects = hasAnyProperty(obj, properties);
    expect(intersects).toBe(false);
  });
});
