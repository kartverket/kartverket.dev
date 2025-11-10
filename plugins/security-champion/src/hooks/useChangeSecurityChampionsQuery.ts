import { useMutation } from '@tanstack/react-query';

import { SecurityChamp } from '../types';
import { post } from '../api/client';
import { getBackstageToken } from '../utils/authenticationUtils';
import {
  configApiRef,
  identityApiRef,
  useApi,
} from '@backstage/core-plugin-api';

export const useSetSecurityChampionMutation = () => {
  const backendUrl = useApi(configApiRef).getString('backend.baseUrl');
  const backstageAuthApi = useApi(identityApiRef);

  return useMutation({
    mutationFn: async (securityChampion: SecurityChamp) => {
      const { backstageToken } = await getBackstageToken(backstageAuthApi);
      const { email } = await backstageAuthApi.getProfileInfo();

      const userEmail = email ? email : 'no user email';

      const endpointUrl = `${backendUrl}/api/proxy/security-champion-proxy/api/setSecurityChampion`;

      return post<
        {
          repositoryName: string;
          securityChampionEmail: string;
          modifiedBy: string;
        },
        string
      >(endpointUrl, backstageToken, {
        repositoryName: securityChampion.repositoryName,
        securityChampionEmail: securityChampion.securityChampionEmail,
        modifiedBy: userEmail,
      });
    },
  });
};
