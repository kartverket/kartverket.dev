import { catalogApiRef } from '@backstage/plugin-catalog-react';
import { useApi } from '@backstage/core-plugin-api';
import { useAsync } from 'react-use';
import { UserEntity } from '@backstage/catalog-model';

export const useUserProfile = (email: string) => {
  const catalogApi = useApi(catalogApiRef);

  const {
    value: user,
    loading,
    error,
  } = useAsync(async () => {
    const users = await catalogApi.getEntities({
      filter: {
        kind: 'User',
        'spec.profile.email': email,
      },
    });
    return users.items.find((item): item is UserEntity => item.kind === 'User');
  }, [email]);
  return { user, loading, error };
};
