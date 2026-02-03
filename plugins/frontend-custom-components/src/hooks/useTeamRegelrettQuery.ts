import { useQuery } from '@tanstack/react-query';
import { getAuthenticationTokens } from '../utils/authenticationUtils';
import {
  configApiRef,
  identityApiRef,
  microsoftAuthApiRef,
  useApi,
} from '@backstage/frontend-plugin-api';
import { RegelrettForm } from '../types';
import { Entity } from '@backstage/catalog-model';

export const useTeamRegelrettQuery = (groupEntity: Entity) => {
  const config = useApi(configApiRef);
  const backstageAuthApi = useApi(identityApiRef);
  const microsoftAuthApi = useApi(microsoftAuthApiRef);

  return useQuery<RegelrettForm[]>({
    queryKey: ['groupEntity', groupEntity],
    enabled: !!groupEntity,
    queryFn: async () => {
      if (!groupEntity.metadata.annotations) {
        throw new Error('Group entity does not have annotations');
      }
      const { entraIdToken, backstageToken } = await getAuthenticationTokens(
        config,
        backstageAuthApi,
        microsoftAuthApi,
      );

      const url = new URL(
        `${config.getString('backend.baseUrl')}/api/regelrett-schemas/proxy/fetch-regelrett-forms-by-team-id`,
      );

      url.searchParams.set(
        'teamId',
        groupEntity.metadata.annotations['graph.microsoft.com/group-id'],
      );
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${backstageToken}`,
          EntraId: entraIdToken,
        },
      });

      const data = await response.json();

      if (response.ok) {
        return data;
      }
      throw data ?? { message: response.statusText };
    },
  });
};
