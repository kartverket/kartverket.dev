import { Box, Card, Flex } from '@backstage/ui';
import { Page, Content, SupportButton } from '@backstage/core-components';
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

export interface CatalogCreatorPageProps {
  gitUrl?: string;
}

export const CatalogCreatorPage = ({ gitUrl }: CatalogCreatorPageProps) => {
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
  } = useCatalogCreator(githubAuthApi);
  const { t } = useTranslationRef(catalogCreatorTranslationRef);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    doGetRepoInfo();
    doAnalyzeUrl();
    setDefaultName(getDefaultNameFromUrl(url));
    doSubmitToGithub('', undefined);
    setShowForm(false);
  };

  const handleCatalogFormSubmit = (data: FormEntity[]) => {
    doSubmitToGithub(getSubmitUrl(analysisResult.value!), data);
  };

  const handleResetForm = () => {
    setUrl('');
    setDefaultName('');
    setShowForm(false);
    doSubmitToGithub('', undefined);
  };

  return (
    <Page themeId="tool">
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
              <Card style={{ position: 'relative', overflow: 'visible' }}>
                <RepositoryForm
                  url={gitUrl || url}
                  onUrlChange={setUrl}
                  onSubmit={handleFormSubmit}
                />
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
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      padding: '1.5rem',
                      minHeight: '10rem',
                    }}
                  >
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
            <EditOrGenerateCatalogInfoBox />
          </Box>
        </Flex>
      </Content>
    </Page>
  );
};
