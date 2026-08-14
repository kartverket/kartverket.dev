import { useQuery } from '@tanstack/react-query';
import { getRegelrettRequestHeaders } from '../utils/authenticationUtils';
import {
  configApiRef,
  identityApiRef,
  microsoftAuthApiRef,
  useApi,
} from '@backstage/frontend-plugin-api';
import { RegelrettForm } from '../types';
import { ApiError } from '../errors';

export const useRegelrettQuery = (
  functionName: string,
  options?: { enabled?: boolean },
) => {
  const config = useApi(configApiRef);
  const backstageAuthApi = useApi(identityApiRef);
  const microsoftAuthApi = useApi(microsoftAuthApiRef);

  return useQuery<RegelrettForm[]>({
    queryKey: ['fetch-regelrett-forms', functionName],
    enabled: !!functionName && (options?.enabled ?? true),
    queryFn: async () => {
      const headers = await getRegelrettRequestHeaders(
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
        headers,
      });

      const data = await response.json();

      if (response.ok) {
        return data;
      }
      throw new ApiError(data?.message ?? response.statusText, response.status);
    },
  });
};
