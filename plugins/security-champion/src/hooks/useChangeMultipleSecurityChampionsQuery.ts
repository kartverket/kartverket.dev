import { useMutation } from '@tanstack/react-query';
import { post } from '../api/client';
import { getBackstageToken } from '../utils/authenticationUtils';
import {
  configApiRef,
  identityApiRef,
  useApi,
} from '@backstage/core-plugin-api';
import { SecurityChampionBatchUpdate } from '../types';

export const useSetMultipleSecurityChampionsMutation = () => {
  const backendUrl = useApi(configApiRef).getString('backend.baseUrl');
  const backstageAuthApi = useApi(identityApiRef);

  return useMutation({
    mutationFn: async (securityChampionBatch: SecurityChampionBatchUpdate) => {
      const { backstageToken } = await getBackstageToken(backstageAuthApi);
      const { email } = await backstageAuthApi.getProfileInfo();
      const userEmail = email ? email : 'no user email';

      const endpointUrl = `${backendUrl}/api/proxy/security-champion-proxy/api/setSecurityChampions`;

      return post<
        {
          repositoryNames: string[];
          securityChampionEmail: string;
          modifiedBy: string;
        },
        string
      >(endpointUrl, backstageToken, {
        repositoryNames: securityChampionBatch.repositoryNames,
        securityChampionEmail: securityChampionBatch.securityChampionEmail,
        modifiedBy: userEmail,
      });
    },
  });
};
