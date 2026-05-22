import { useQuery } from '@tanstack/react-query';
import { getAuthenticationTokens } from '../utils/authenticationUtils';
import {
  configApiRef,
  identityApiRef,
  microsoftAuthApiRef,
  useApi,
} from '@backstage/frontend-plugin-api';
import { RegelrettForm } from '../types';
import { ApiError } from '../errors';
import { Entity } from '@backstage/catalog-model';
import { regelrettKeys } from './queryKeys';

export const useTeamRegelrettQuery = (
  groupEntity: Entity,
  options?: { enabled?: boolean },
) => {
  const config = useApi(configApiRef);
  const backstageAuthApi = useApi(identityApiRef);
  const microsoftAuthApi = useApi(microsoftAuthApiRef);

  const teamId =
    groupEntity.metadata.annotations?.['graph.microsoft.com/group-id'];

  return useQuery<RegelrettForm[]>({
    queryKey: regelrettKeys.formsByTeam(teamId ?? ''),
    enabled: !!teamId && (options?.enabled ?? true),
    queryFn: async () => {
      const { entraIdToken, backstageToken } = await getAuthenticationTokens(
        config,
        backstageAuthApi,
        microsoftAuthApi,
      );

      const url = new URL(
        `${config.getString('backend.baseUrl')}/api/regelrett-schemas/proxy/fetch-regelrett-forms-by-team-id`,
      );

      url.searchParams.set('teamId', teamId!);
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
      throw new ApiError(data?.message ?? response.statusText, response.status);
    },
  });
};
