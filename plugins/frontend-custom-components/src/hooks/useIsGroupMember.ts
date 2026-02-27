import { identityApiRef, useApi } from '@backstage/frontend-plugin-api';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import { useQuery } from '@tanstack/react-query';

/**
 * Returns whether the current user is a member of the given group, or a member
 * of any group that is a descendant of it at any depth in the group hierarchy.
 *
 * First checks direct membership via `ownershipEntityRefs` (no catalog call).
 * If not a direct member, walks up the `childOf` relation chain using batched
 * catalog lookups (one call per hierarchy level) until the target group is found
 * or all ancestors are exhausted.
 *
 * Defaults to `{ isMember: false }` on any error, so access is always denied
 * on failure.
 */
export const useIsGroupMember = (groupRef: string | undefined) => {
  const identityApi = useApi(identityApiRef);
  const catalogApi = useApi(catalogApiRef);

  const { data: isMember, isLoading } = useQuery({
    queryKey: ['group-membership', groupRef],
    enabled: !!groupRef,
    queryFn: async () => {
      const identity = await identityApi.getBackstageIdentity();
      const userGroups = identity.ownershipEntityRefs.filter(r =>
        r.startsWith('group:'),
      );
      const normalizedTarget = groupRef!.toLowerCase();

      // Phase 1: direct membership — no catalog call needed
      if (userGroups.some(r => r.toLowerCase() === normalizedTarget)) {
        return true;
      }

      // Phase 2: batched BFS up the childOf chain
      const visited = new Set<string>(userGroups.map(r => r.toLowerCase()));
      let frontier = [...userGroups];

      while (frontier.length > 0) {
        const { items } = await catalogApi.getEntitiesByRefs({
          entityRefs: frontier,
        });
        const nextFrontier: string[] = [];

        for (const entity of items) {
          if (!entity) continue;
          const parents =
            entity.relations
              ?.filter(r => r.type === 'childOf')
              .map(r => r.targetRef) ?? [];

          for (const parent of parents) {
            const normalized = parent.toLowerCase();
            if (normalized === normalizedTarget) return true;
            if (!visited.has(normalized)) {
              visited.add(normalized);
              nextFrontier.push(parent);
            }
          }
        }
        frontier = nextFrontier;
      }

      return false;
    },
  });

  return { isMember: isMember ?? false, isLoading };
};
