import { Box, Card, Flex } from '@backstage/ui';
import { githubAuthApiRef, OAuthApi, useApi } from '@backstage/core-plugin-api';
import { useTheme } from '@material-ui/core/styles';
import { useEffect } from 'react';
import CircularProgress from '@mui/material/CircularProgress';

import { CatalogForm } from '../CatalogForm';
import { FormEntity } from '../../types/types';
import { getDefaultNameFromUrl, getSubmitUrl } from '../../utils/pageUtils';
import { useCatalogCreator } from '../../hooks/useCatalogCreator';

import { EditOrGenerateCatalogInfoBox } from '../CatalogCreatorPage/EditOrGenerateCatalogInfoBox';
import { SuccessMessage } from '../CatalogCreatorPage/SuccessMessage';
import { StatusMessages } from '../CatalogCreatorPage/StatusMessages';
import { RepositoryForm } from '../CatalogCreatorPage/RepositoryForm';
import { LoadingOverlay } from '../CatalogCreatorPage/LoadingOverlay';

export interface EntityCatalogCreatorProps {
  gitUrl?: string;
}

export const EntityCatalogCreator = ({ gitUrl }: EntityCatalogCreatorProps) => {
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

  // Initialize with the provided git URL
  useEffect(() => {
    if (gitUrl && gitUrl !== url) {
      setUrl(gitUrl);
      setDefaultName(getDefaultNameFromUrl(gitUrl));
    }
  }, [gitUrl, url, setUrl, setDefaultName]);

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
              url={url}
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
  );
};
