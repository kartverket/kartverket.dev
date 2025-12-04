import { useState } from 'react';
import { useAsyncFn } from 'react-use';
import { OAuthApi, useApi } from '@backstage/core-plugin-api';
import { catalogImportApiRef } from '@backstage/plugin-catalog-import';
import { GithubController } from '../controllers/githubController';
import { getCatalogInfo } from '../utils/getCatalogInfo';
import { getRepoInfo } from '../utils/getRepoInfo';
import { scrollToTop } from '../utils/pageUtils';
import { FormEntity } from '../types/types';
import { catalogCreatorTranslationRef } from '../utils/translations';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';

export const useCatalogCreator = (githubAuthApi: OAuthApi) => {
  const catalogImportApi = useApi(catalogImportApiRef);
  const githubController = new GithubController();
  const { t } = useTranslationRef(catalogCreatorTranslationRef);

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

  const [repoInfo, doGetRepoInfo] = useAsyncFn(
    async () =>
      await getRepoInfo(
        url,
        githubAuthApi,
        t('form.knownErrorAlerts.repoNotFound'),
      ),
    [url, githubAuthApi],
  );

  const [analysisResult, doAnalyzeUrl] = useAsyncFn(async () => {
    let result;
    try {
      result = await catalogImportApi.analyzeUrl(url);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(t('form.knownErrorAlerts.analyzeLocationError'));
      } else {
        throw error;
      }
    }

    if (
      result &&
      result.type === 'repository' &&
      url.match(/^https:\/\/github\.com\/kartverket\/[^\/]+$/)
    ) {
      try {
        const backup_result = await catalogImportApi.analyzeUrl(
          `${url}/blob/${
            (
              await getRepoInfo(
                url,
                githubAuthApi,
                t('form.knownErrorAlerts.repoNotFound'),
              )
            ).default_branch
          }/catalog-info.yaml`,
        );
        if (backup_result && backup_result.type === 'locations')
          result = backup_result;
      } catch {
        // This API call is a failsafe to check for a likely catalog-info.yaml location.
        // If it fails we continue trusting the result from the first call.
      }
    }
    if (result && result.type === 'locations') {
      doFetchCatalogInfo(result.locations[0].target);
    } else {
      doFetchCatalogInfo(null);
    }

    setShowForm(true);
    return result;
  }, [
    url,
    githubAuthApi,
    catalogImportApi.analyzeUrl,
    doFetchCatalogInfo,
    getRepoInfo,
  ]);

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
        t('form.knownErrorAlerts.couldNotCreatePR'),
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
    repoInfo,
    analysisResult,
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
