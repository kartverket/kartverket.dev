import { useMutation } from '@tanstack/react-query';
import { getRegelrettRequestHeaders } from '../utils/authenticationUtils';
import {
  configApiRef,
  identityApiRef,
  microsoftAuthApiRef,
  useApi,
} from '@backstage/frontend-plugin-api';
import { RegelrettForm } from '../types';

export interface RegelrettApiError extends Error {
  status: number;
}

export const useRegelrettCreateContextMutation = () => {
  const config = useApi(configApiRef);
  const backstageAuthApi = useApi(identityApiRef);
  const microsoftAuthApi = useApi(microsoftAuthApiRef);

  return useMutation<
    RegelrettForm,
    RegelrettApiError,
    { functionName: string; formId: string; teamId: string }
  >({
    mutationFn: async ({ functionName, formId, teamId }) => {
      const headers = await getRegelrettRequestHeaders(
        config,
        backstageAuthApi,
        microsoftAuthApi,
      );

      const url = new URL(
        `${config.getString('backend.baseUrl')}/api/regelrett-schemas/proxy/create-regelrett-form`,
      );

      url.searchParams.set('name', functionName);
      url.searchParams.set('formId', formId);
      url.searchParams.set('teamId', teamId);

      const response = await fetch(url, {
        method: 'POST',
        headers,
      });

      const data = await response.json();

      if (response.ok) {
        return data;
      }

      throw Object.assign(new Error(data?.message ?? response.statusText), {
        status: response.status,
      });
    },
  });
};
