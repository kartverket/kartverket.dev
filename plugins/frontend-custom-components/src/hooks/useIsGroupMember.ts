import { identityApiRef, useApi } from '@backstage/frontend-plugin-api';
import { useQuery } from '@tanstack/react-query';

export const useIsGroupMember = (groupRef: string | undefined) => {
  const identityApi = useApi(identityApiRef);

  const { data: isMember, isLoading } = useQuery({
    queryKey: ['group-membership', groupRef],
    enabled: !!groupRef,
    queryFn: async () => {
      const identity = await identityApi.getBackstageIdentity();
      return identity.ownershipEntityRefs.some(
        ref => ref.toLowerCase() === groupRef?.toLowerCase(),
      );
    },
  });

  return { isMember: isMember ?? false, isLoading };
};
