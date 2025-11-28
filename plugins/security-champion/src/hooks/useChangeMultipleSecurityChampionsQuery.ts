import { useMutation, useQueryClient } from '@tanstack/react-query';
import { post } from '../api/client';
import { getBackstageToken } from '../utils/authenticationUtils';
import {
  configApiRef,
  identityApiRef,
  useApi,
} from '@backstage/core-plugin-api';
import { SecurityChamp, SecurityChampionBatchUpdate } from '../types';

export const useSetMultipleSecurityChampionsMutation = () => {
  const backendUrl = useApi(configApiRef).getString('backend.baseUrl');
  const backstageAuthApi = useApi(identityApiRef);
  const queryClient = useQueryClient();

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
    onMutate: async (batch: SecurityChampionBatchUpdate) => {
      const queryKey = ['security-champions', batch.repositoryNames];

      await queryClient.cancelQueries({ queryKey });

      const previousChampions =
        queryClient.getQueryData<SecurityChamp[]>(queryKey);

      queryClient.setQueryData<SecurityChamp[]>(queryKey, old => {
        if (!old || old.length === 0) {
          return batch.repositoryNames.map(repo => ({
            repositoryName: repo,
            securityChampionEmail: batch.securityChampionEmail,
          }));
        }

        const updated = old.map(champ => {
          if (batch.repositoryNames.includes(champ.repositoryName)) {
            return {
              ...champ,
              securityChampionEmail: batch.securityChampionEmail,
            };
          }
          return champ;
        });

        const existingRepoNames = old.map(c => c.repositoryName);
        const newRepos = batch.repositoryNames
          .filter(repo => !existingRepoNames.includes(repo))
          .map(repo => ({
            repositoryName: repo,
            securityChampionEmail: batch.securityChampionEmail,
          }));

        return [...updated, ...newRepos];
      });

      return { previousChampions, queryKey };
    },
  });
};
