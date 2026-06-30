import { Kind } from '../types/types';

function isFullyQualifiedRef(kind: Kind, val: string): boolean {
  const pattern = new RegExp(`^${kind}:[^/]+/.+$`, 'i');
  return pattern.test(val);
}

export function toEntityRefList(
  kind: Kind,
  entityStrings: string | string[] | undefined,
) {
  let values: string[] = [];

  if (Array.isArray(entityStrings)) {
    values = entityStrings;
  } else if (entityStrings) {
    values = [entityStrings];
  }

  return values.map(val => {
    if (isFullyQualifiedRef(kind, val)) {
      return val.toLowerCase();
    }
    return `${kind}:default/${val}`.toLowerCase();
  });
}

export function toEntityRef(kind: Kind, entityString: string) {
  if (isFullyQualifiedRef(kind, entityString)) {
    return entityString.toLowerCase();
  }
  return `${kind}:default/${entityString}`.toLowerCase();
}
