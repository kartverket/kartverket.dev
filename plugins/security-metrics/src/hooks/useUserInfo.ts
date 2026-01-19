import { catalogApiRef } from '@backstage/plugin-catalog-react';
import { useApi } from '@backstage/core-plugin-api';
import { useAsync } from 'react-use';
import { UserEntity } from '@backstage/catalog-model';

export const useUserInfo = (id: string) => {
  const catalogApi = useApi(catalogApiRef);

  const {
    value: user,
    loading,
    error,
  } = useAsync(async () => {
    const users = await catalogApi.getEntities({
      filter: {
        kind: 'User',
        'metadata.annotations.graph.microsoft.com/user-id': id,
      },
    });
    return users.items[0] as UserEntity;
  }, [id]);
  return { user, loading, error };
};
