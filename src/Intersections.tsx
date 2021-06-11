function getIntersection(_arrayA: string[], _arrayB: string[]): string[] {
  const arrayA = _arrayA.map(e => e.toLowerCase().trim());
  const arrayB = _arrayB.map(e => e.toLowerCase().trim());
  const intersection = arrayA.filter(e => arrayB.includes(e));
  return intersection;
}

function hasIntersection(arrayA: string[], arrayB: string[]): boolean {
  const intersection = getIntersection(arrayA, arrayB);
  return intersection.length > 0;
}

function hasFullIntersection(
  groupsRequested: string[],
  availableGroups: string[]
): boolean {
  const intersection = getIntersection(groupsRequested, availableGroups);
  return (
    intersection.length === groupsRequested.length && groupsRequested.length > 0
  );
}

function hasAnyProperty(obj: any, properties: string[]): boolean {
  for (let i = 0; i < properties.length; i++) {
    if (obj.hasOwnProperty(properties[i])) {
      return true;
    }
  }
  return false;
}

function hasAllProperties(obj: any, properties: string[]): boolean {
  const matching = properties.filter((property: string) => {
    return obj.hasOwnProperty(property);
  });

  return !!properties.length && matching.length === properties.length;
}

export {
  hasIntersection,
  hasFullIntersection,
  hasAnyProperty,
  hasAllProperties,
};
