import { useQuery } from '@tanstack/react-query';

import { SecurityChamp } from '../types';
import { post } from '../api/client';
import {
  configApiRef,
  identityApiRef,
  useApi,
} from '@backstage/core-plugin-api';
import { getBackstageToken } from '../utils/authenticationUtils';

export const useSecurityChampionsQuery = (repositoryNames: string[]) => {
  const backendUrl = useApi(configApiRef).getString('backend.baseUrl');
  const backstageAuthApi = useApi(identityApiRef);

  return useQuery<SecurityChamp[], Error>({
    queryKey: ['security-champions', repositoryNames],
    queryFn: async () => {
      const { backstageToken } = await getBackstageToken(backstageAuthApi);

      const endpointUrl =
        `${backendUrl  }/api/proxy/security-champion-proxy/api/securityChampion`;
      return post<{ repositoryNames: string[] }, SecurityChamp[]>(
        endpointUrl,
        backstageToken,
        { repositoryNames },
      );
    },
    enabled: repositoryNames.length !== 0,
    staleTime: 3600000,
  });
};
