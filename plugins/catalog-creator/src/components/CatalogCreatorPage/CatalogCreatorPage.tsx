import { useEffect } from 'react';
import { Box, Flex } from '@backstage/ui';
import { Content, SupportButton } from '@backstage/core-components';
import { githubAuthApiRef, OAuthApi, useApi } from '@backstage/core-plugin-api';
import { useTheme } from '@material-ui/core/styles';
import CircularProgress from '@mui/material/CircularProgress';

import { CatalogForm } from '../CatalogForm';
import { FormEntity } from '../../types/types';
import { getDefaultNameFromUrl, getSubmitUrl } from '../../utils/pageUtils';
import { useCatalogCreator } from '../../hooks/useCatalogCreator';
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
  createFunction: boolean;
}

export const CatalogCreatorPage = ({
  originLocation,
  entityKind,
  entityName,
  docsLink,
  createFunction,
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
    repoFunctionState,
    doAnalyzeUrl,
    doGetRepoInfo,
    doSubmitToGithub,
    doSubmitFunctionToGithub,
    isLoading,
    hasError,
    hasExistingCatalogFile,
    shouldCreateNewFile,
    shouldShowForm,
  } = useCatalogCreator(githubAuthApi);
  const { t } = useTranslationRef(catalogCreatorTranslationRef);

  const state = createFunction ? repoFunctionState : repoState;

  useEffect(() => {
    document.title = `${t('contentHeader.title')} | ${window.location.hostname}`;
    if (originLocation && !url) {
      setUrl(originLocation);
    }
  }, [originLocation, url, setUrl, t]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    doGetRepoInfo(entityKind, entityName);
    doAnalyzeUrl();
    setDefaultName(getDefaultNameFromUrl(url));
    doSubmitToGithub('', undefined);
    setShowForm(false);
  };

  const handleCatalogFormSubmit = (data: FormEntity[]) => {
    doSubmitToGithub(
      getSubmitUrl(analysisResult.value!),
      data,
      entityKind,
      entityName,
    );
  };

  const handleFunctionCatalogFormSubmit = (data: FormEntity[]) => {
    doSubmitFunctionToGithub();
  };

  const handleResetForm = () => {
    setUrl('');
    setDefaultName('');
    setShowForm(false);
    doSubmitToGithub('', undefined);
  };

  return (
    <Content>
      <Box className={style.catalogCreatorBox}>
        <Flex justify="between" align="center">
          {entityKind ? (
            <h1>
              {t('contentHeader.editTitle')} {` ${entityKind}`}
            </h1>
          ) : (
            <h1>{t('contentHeader.title')}</h1>
          )}
          <SupportButton />
        </Flex>
        <Flex>
          <Box flex-grow="1" width="100%">
            {state.value?.severity === 'success' ? (
              <SuccessMessage
                prUrl={state.value.prUrl}
                onReset={handleResetForm}
              />
            ) : (
              <div className={style.repositoryCard}>
                <RepositoryForm
                  url={originLocation || url}
                  onUrlChange={setUrl}
                  onSubmit={handleFormSubmit}
                  disableTextField={originLocation !== undefined}
                  docsLink={docsLink}
                />

                <StatusMessages
                  hasExistingCatalogFile={hasExistingCatalogFile}
                  shouldCreateNewFile={shouldCreateNewFile}
                  hasError={hasError}
                  isLoading={isLoading}
                  repoStateError={Boolean(state.error)}
                  showForm={showForm}
                  existingPrUrl={repoInfo.value?.existingPrUrl}
                  analysisError={analysisResult.error}
                  repoStateErrorMessage={state.error?.message}
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
                        {state.loading && (
                          <LoadingOverlay
                            isDarkTheme={theme.palette.type === 'dark'}
                          />
                        )}
                        <CatalogForm
                          onSubmit={
                            createFunction
                              ? handleFunctionCatalogFormSubmit
                              : handleCatalogFormSubmit
                          }
                          currentYaml={catalogInfoState.value!}
                          defaultName={defaultName}
                        />
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </Box>
        </Flex>
      </Box>
    </Content>
  );
};
