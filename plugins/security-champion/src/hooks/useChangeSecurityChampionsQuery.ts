import { useMutation, useQueryClient } from '@tanstack/react-query';

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
  const queryClient = useQueryClient();

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
    onMutate: async (newChampion: SecurityChamp) => {
      const queryKey = ['security-champions', [newChampion.repositoryName]];

      await queryClient.cancelQueries({ queryKey });

      const previousChampions =
        queryClient.getQueryData<SecurityChamp[]>(queryKey);

      queryClient.setQueryData<SecurityChamp[]>(queryKey, old => {
        if (!old) return [newChampion];

        const existingIndex = old.findIndex(
          champ => champ.repositoryName === newChampion.repositoryName,
        );

        if (existingIndex >= 0) {
          const updated = [...old];
          updated[existingIndex] = newChampion;
          return updated;
        }
        return [...old, newChampion];
      });

      return { previousChampions, queryKey };
    },
  });
};
