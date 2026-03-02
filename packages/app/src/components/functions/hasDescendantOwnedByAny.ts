import { EntityData } from './types';

/** Check if a node or any of its descendants is owned by any of the given teams */
export const hasDescendantOwnedByAny = (
  nodeRef: string,
  funcMap: Map<string | undefined, EntityData[]>,
  teamNames: string[],
  visited: Set<string> = new Set(),
): boolean => {
  if (visited.has(nodeRef)) return false;
  visited.add(nodeRef);
  const children = funcMap.get(nodeRef) ?? [];
  return children.some(
    child =>
      teamNames.some(team =>
        child.owner?.toLowerCase().includes(team.toLowerCase()),
      ) ||
      (child.ref !== undefined &&
        hasDescendantOwnedByAny(child.ref, funcMap, teamNames, visited)),
  );
};
