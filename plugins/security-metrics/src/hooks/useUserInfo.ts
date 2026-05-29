import { catalogApiRef } from '@backstage/plugin-catalog-react';
import { useApi } from '@backstage/core-plugin-api';
import { useQuery } from '@tanstack/react-query';
import { GroupEntity, UserEntity } from '@backstage/catalog-model';

export const useUserInfo = (id: string) => {
  const catalogApi = useApi(catalogApiRef);

  return useQuery({
    queryKey: ['user', id],
    queryFn: async () => {
      const users = await catalogApi.getEntities({
        filter: {
          kind: 'User',
          'metadata.annotations.graph.microsoft.com/user-id': id,
        },
      });
      return users.items[0] as UserEntity | undefined;
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useGroupInfo = (groupId: string) => {
  const catalogApi = useApi(catalogApiRef);

  return useQuery({
    queryKey: ['group', groupId],
    queryFn: async () => {
      const groups = await catalogApi.getEntities({
        filter: {
          kind: 'Group',
          'metadata.annotations.graph.microsoft.com/group-id': groupId,
        },
      });
      return groups.items[0] as GroupEntity | undefined;
    },
    staleTime: 5 * 60 * 1000,
  });
};
