import { useEffect } from 'react';
import { Box, Card, Flex, Link, Text } from '@backstage/ui';
import { Content, SupportButton } from '@backstage/core-components';
import { githubAuthApiRef, OAuthApi, useApi } from '@backstage/core-plugin-api';
import { useTheme } from '@material-ui/core/styles';
import CircularProgress from '@mui/material/CircularProgress';

import { CatalogForm } from '../CatalogForm';
import { FormEntity } from '../../types/types';
import { getDefaultNameFromUrl, getSubmitUrl } from '../../utils/pageUtils';
import { useCatalogCreator } from '../../hooks/useCatalogCreator';

import { EditOrGenerateCatalogInfoBox } from './EditOrGenerateCatalogInfoBox';
import { SuccessMessage } from './SuccessMessage';
import { StatusMessages } from './StatusMessages';
import { RepositoryForm } from './RepositoryForm';
import { LoadingOverlay } from './LoadingOverlay';
import { catalogCreatorTranslationRef } from '../../utils/translations';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';

import style from '../../catalog.module.css';

export interface CatalogCreatorPageProps {
  originLocation?: string;
  docsLink?: string;
  entityKind?: string;
  entityName?: string;
}

export const CatalogCreatorPage = ({
  originLocation,
  docsLink,
  entityKind,
  entityName,
}: CatalogCreatorPageProps) => {
  const githubAuthApi: OAuthApi = useApi(githubAuthApiRef);
  const theme = useTheme();

  const {
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
    doAnalyzeUrl,
    doGetRepoInfo,
    doSubmitToGithub,
    isLoading,
    hasError,
    hasExistingCatalogFile,
    shouldCreateNewFile,
    shouldShowForm,
  } = useCatalogCreator(githubAuthApi, originLocation ?? '');
  const { t } = useTranslationRef(catalogCreatorTranslationRef);

  const fetchCatalogInfoFromGithub = () => {
    doGetRepoInfo();
    doAnalyzeUrl();
    setDefaultName(getDefaultNameFromUrl(url));
    doSubmitToGithub('', undefined);
    setShowForm(false);
  };

  useEffect(() => {
    document.title = `${t('contentHeader.title')} | ${window.location.hostname}`;
  }, [originLocation, url, setUrl, t]);

  useEffect(() => {
    if (url && originLocation && catalogInfoState.value === undefined) {
      fetchCatalogInfoFromGithub();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCatalogInfoFromGithub();
  };

  const handleCatalogFormSubmit = (data: FormEntity[]) => {
    doSubmitToGithub(
      getSubmitUrl(analysisResult.value!),
      data,
      entityKind,
      entityName,
    );
  };

  const handleResetForm = () => {
    setUrl('');
    setDefaultName('');
    setShowForm(false);
    doSubmitToGithub('', undefined);
  };

  return (
    <Content>
      <Flex justify="between" align="center">
        <h1>{t('contentHeader.title')}</h1>
        <SupportButton />
      </Flex>
      <Flex>
        <Box flex-shrink="0" width="600px">
          {repoState.value?.severity === 'success' ? (
            <SuccessMessage
              prUrl={repoState.value.prUrl}
              onReset={handleResetForm}
            />
          ) : (
            <Card className={style.repositoryCard}>
              <Box px="2rem">
                {originLocation ? (
                  <Text>
                    {t('repositoryFetch')} <Link>{url}</Link>
                  </Text>
                ) : (
                  <RepositoryForm
                    url={originLocation || url}
                    onUrlChange={setUrl}
                    onSubmit={handleFormSubmit}
                    disableTextField={originLocation !== undefined}
                  />
                )}
              </Box>

              <StatusMessages
                hasExistingCatalogFile={hasExistingCatalogFile}
                shouldCreateNewFile={shouldCreateNewFile}
                hasError={hasError}
                isLoading={isLoading}
                repoStateError={Boolean(repoState.error)}
                showForm={showForm}
                existingPrUrl={repoInfo.value?.existingPrUrl}
                analysisError={analysisResult.error}
                repoStateErrorMessage={repoState.error?.message}
                repoInfoError={repoInfo.error}
                catalogInfoError={catalogInfoState.error}
              />
              {isLoading ? (
                <div className={style.loadingContainer}>
                  <CircularProgress />
                </div>
              ) : (
                <>
                  {shouldShowForm && (
                    <div style={{ position: 'relative' }}>
                      {/* Submission Loading Overlay */}
                      {repoState.loading && (
                        <LoadingOverlay
                          isDarkTheme={theme.palette.type === 'dark'}
                        />
                      )}
                      <CatalogForm
                        onSubmit={handleCatalogFormSubmit}
                        currentYaml={catalogInfoState.value!}
                        defaultName={defaultName}
                      />
                    </div>
                  )}
                </>
              )}
            </Card>
          )}
        </Box>
        <Box flex-shrink="1" width="500px">
          <EditOrGenerateCatalogInfoBox docsLink={docsLink} />
        </Box>
      </Flex>
    </Content>
  );
};
