import { useQuery } from '@tanstack/react-query';
import { getAuthenticationTokens } from '../utils/authenticationUtils';
import {
  configApiRef,
  identityApiRef,
  microsoftAuthApiRef,
  useApi,
} from '@backstage/frontend-plugin-api';
import { RegelrettForm } from '../types';

export const useRegelrettCreateContextQuery = (
  functionName: string,
  formId: string,
  teamId: string,
  submit: boolean,
) => {
  const config = useApi(configApiRef);
  const backstageAuthApi = useApi(identityApiRef);
  const microsoftAuthApi = useApi(microsoftAuthApiRef);

  return useQuery<RegelrettForm>({
    queryKey: ['create-regelrett-forms', functionName],
    enabled: submit,
    queryFn: async () => {
      const { entraIdToken, backstageToken } = await getAuthenticationTokens(
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
