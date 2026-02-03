import { useQuery } from '@tanstack/react-query';
import { getAuthenticationTokens } from '../utils/authenticationUtils';
import {
  configApiRef,
  identityApiRef,
  microsoftAuthApiRef,
  useApi,
} from '@backstage/frontend-plugin-api';
import { RegelrettForm } from '../types';

export const useRegelrettQuery = (functionName: string) => {
  const config = useApi(configApiRef);
  const backstageAuthApi = useApi(identityApiRef);
  const microsoftAuthApi = useApi(microsoftAuthApiRef);

  return useQuery<RegelrettForm[]>({
    queryKey: ['regelrett-forms', functionName],
    enabled: !!functionName,
    queryFn: async () => {
      const { entraIdToken, backstageToken } = await getAuthenticationTokens(
        config,
        backstageAuthApi,
        microsoftAuthApi,
      );

      const url = new URL(
        `${config.getString('backend.baseUrl')}/api/regelrett-schemas/proxy/fetch-regelrett-form`,
      );

      url.searchParams.set('name', functionName);
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
