import { Kind } from '../types/types';

export function toEntityRefList(kind: Kind, entityStrings: string[]) {
  return entityStrings.map(val => {
    if (val.toLowerCase().includes(`${kind}:default/`.toLowerCase())) {
      return val;
    }
    return `${kind}:default/${val}`.toLowerCase();
  });
}

export function toEntityRef(kind: Kind, entityString: string) {
  if (entityString.toLowerCase().includes(`${kind}:default/`.toLowerCase())) {
    return entityString;
  }
  return `${kind}:default/${entityString}`.toLowerCase();
}
