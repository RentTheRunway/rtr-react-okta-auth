import { hasAllProperties } from "../Intersections";

describe("hasAllProperties()", () => {
  it("true when all properties", () => {
    const obj = {
        "2": true,
        "3": true
    };
    const properties = ["2", "3"];
    const intersects = hasAllProperties(obj, properties);
    expect(intersects).toBe(true);
  });

  it("true when every property", () => {
    const obj = {
        "2": true,
        "4": true
    };
    const properties = ["2", "4"];
    const intersects = hasAllProperties(obj, properties);
    expect(intersects).toBe(true);
  });

  it("true when mixed", () => {
    const obj = {
        "2": true,
        "4": true,
        "5": true       
    };
    const properties = ["4", "2"];
    const intersects = hasAllProperties(obj, properties);
    expect(intersects).toBe(true);
  });

  it("false for no matching object property", () => {
    const obj = {
        none: true
    };
    const properties = ["1", "2", "3"];
    const intersects = hasAllProperties(obj, properties);
    expect(intersects).toBe(false);
  });

  it("false for no matching array property", () => {
    const obj = {
        "2": true,
        "4": true,
        "5": true       
    };
    const properties = ["6", "7", "8"];
    const intersects = hasAllProperties(obj, properties);
    expect(intersects).toBe(false);
  });

  it("false for extra array properties", () => {
    const obj = {
        "2": true,
        "4": true,
        "5": true       
    };
    const properties = ["2", "4", "5", "6"];
    const intersects = hasAllProperties(obj, properties);
    expect(intersects).toBe(false);
  });

  it("false for empty property array", () => {
    const obj = {
        none: true
    };
    const properties: string[] = [];
    const intersects = hasAllProperties(obj, properties);
    expect(intersects).toBe(false);
  });

  it("false for partial empty property array", () => {
    const obj = {
      "2": true,
      "4": true,
      "5": true       
  };
    const properties = Object.keys(obj).concat([""]);
    const intersects = hasAllProperties(obj, properties);
    expect(intersects).toBe(false);
  });

  it("false for empty object", () => {
    const obj = {};
    const properties = ["1", "2", "3"];
    const intersects = hasAllProperties(obj, properties);
    expect(intersects).toBe(false);
  });

  it("false for empty object and empty array", () => {
    const obj = {};
    const properties: string[] = [];
    const intersects = hasAllProperties(obj, properties);
    expect(intersects).toBe(false);
  });

});
