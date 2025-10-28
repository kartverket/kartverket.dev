import { useState } from 'react';
import { useAsyncFn } from 'react-use';
import { OAuthApi, useApi } from '@backstage/core-plugin-api';
import { catalogImportApiRef } from '@backstage/plugin-catalog-import';
import { GithubController } from '../controllers/githubController';
import { getCatalogInfo } from '../utils/getCatalogInfo';
import { getRepoInfo } from '../utils/getRepoInfo';
import { scrollToTop } from '../utils/pageUtils';
import { FormEntity } from '../model/types';

export const useCatalogCreator = (githubAuthApi: OAuthApi) => {
  const catalogImportApi = useApi(catalogImportApiRef);
  const githubController = new GithubController();

  const [url, setUrl] = useState('');
  const [defaultName, setDefaultName] = useState('');
  const [showForm, setShowForm] = useState(false);

  const [catalogInfoState, doFetchCatalogInfo] = useAsyncFn(
    async (catInfoUrl: string | null) => {
      if (catInfoUrl === null) {
        return null;
      }
      return await getCatalogInfo(catInfoUrl, githubAuthApi);
    },
    [url, githubAuthApi],
  );

  const [analysisResult, doAnalyzeUrl] = useAsyncFn(async () => {
    const result = await catalogImportApi.analyzeUrl(url);

    if (result.type === 'locations') {
      doFetchCatalogInfo(result.locations[0].target);
    } else {
      doFetchCatalogInfo(null);
    }

    setShowForm(true);
    return result;
  }, [url, githubAuthApi, catalogImportApi.analyzeUrl, doFetchCatalogInfo]);

  const [repoInfo, doGetRepoInfo] = useAsyncFn(
    async () => await getRepoInfo(url, githubAuthApi),
    [url, githubAuthApi],
  );

  const [repoState, doSubmitToGithub] = useAsyncFn(
    async (submitUrl: string, catalogInfoFormList?: FormEntity[]) => {
      scrollToTop();

      if (!catalogInfoFormList) {
        return undefined;
      }

      return await githubController.submitCatalogInfoToGithub(
        submitUrl,
        repoInfo.value?.default_branch,
        catalogInfoState.value || [],
        catalogInfoFormList,
        githubAuthApi,
      );
    },
    [
      githubController.submitCatalogInfoToGithub,
      githubAuthApi,
      catalogInfoState.value,
    ],
  );

  const isLoading =
    repoInfo.loading || analysisResult.loading || catalogInfoState.loading;
  const hasError = Boolean(
    repoInfo.error ||
      analysisResult.error ||
      catalogInfoState.error ||
      repoInfo.value?.existingPrUrl,
  );

  const hasExistingCatalogFile = analysisResult.value?.type === 'locations';
  const shouldCreateNewFile =
    catalogInfoState.value === null &&
    !repoInfo.value?.existingPrUrl &&
    showForm;
  const shouldShowForm =
    showForm && catalogInfoState.value !== undefined && !hasError;

  return {
    url,
    setUrl,
    defaultName,
    setDefaultName,
    showForm,
    setShowForm,

    catalogInfoState,
    analysisResult,
    repoInfo,
    repoState,

    doFetchCatalogInfo,
    doAnalyzeUrl,
    doGetRepoInfo,
    doSubmitToGithub,

    isLoading,
    hasError,
    hasExistingCatalogFile,
    shouldCreateNewFile,
    shouldShowForm,
  };
};
