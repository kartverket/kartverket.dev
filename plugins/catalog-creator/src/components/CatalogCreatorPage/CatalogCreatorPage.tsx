import { TextField, Button, Box, Card, Flex } from '@backstage/ui';

import {
  Page,
  Content,
  ContentHeader,
  SupportButton,
} from '@backstage/core-components';

import { githubAuthApiRef, OAuthApi, useApi } from '@backstage/core-plugin-api';
import { useTheme } from '@material-ui/core/styles';

import {
  AnalyzeResult,
  catalogImportApiRef,
} from '@backstage/plugin-catalog-import';

import { CatalogForm } from '../CatalogForm';

import { GithubController } from '../../controllers/githubController';

import { getCatalogInfo } from '../../utils/getCatalogInfo';
import { useAsyncFn } from 'react-use';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import { useState } from 'react';
import { FormEntity } from '../../model/types';
import Link from '@mui/material/Link';
import { getRepoInfo } from '../../utils/getRepoInfo';
import { InfoBox } from './InfoBox';

export const CatalogCreatorPage = () => {
  const catalogImportApi = useApi(catalogImportApiRef);
  const githubAuthApi: OAuthApi = useApi(githubAuthApiRef);
  const githubController = new GithubController();

  const [url, setUrl] = useState('');
  const [defaultName, setDefaultName] = useState<string>('');

  const [showForm, setShowForm] = useState<boolean>(false);
  const theme = useTheme();

  const scrollToTop = () => {
    const article = document.querySelector('article');
    if (article && article.parentElement) {
      article.parentElement.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const [catalogInfoState, doFetchCatalogInfo] = useAsyncFn(
    async (catInfoUrl: string | null) => {
      if (catInfoUrl === null) {
        return null;
      }
      const result = await getCatalogInfo(catInfoUrl, githubAuthApi);

      return result;
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

  const [repoInfo, doGetRepoInfo] = useAsyncFn(async () => {
    const result = await getRepoInfo(url, githubAuthApi);
    return result;
  }, [url, githubAuthApi]);

  const [repoState, doSubmitToGithub] = useAsyncFn(
    async (submitUrl: string, catalogInfoFormList?: FormEntity[]) => {
      scrollToTop();
      if (catalogInfoFormList !== undefined) {
        return await githubController.submitCatalogInfoToGithub(
          submitUrl,
          repoInfo.value?.default_branch,
          catalogInfoState.value || [],
          catalogInfoFormList,
          githubAuthApi,
        );
      }
      return undefined;
    },
    [
      githubController.submitCatalogInfoToGithub,
      githubAuthApi,
      catalogInfoState.value,
    ],
  );

  const loading =
    repoInfo.loading || analysisResult.loading || catalogInfoState.loading;
  const error =
    repoInfo.error ||
    analysisResult.error ||
    catalogInfoState.error ||
    repoInfo.value?.existingPrUrl;

  function getDefaultNameFromUrl() {
    const regexMatch = url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
    if (regexMatch && regexMatch[2]) {
      setDefaultName(regexMatch[2]);
    }
  }

  return (
    <Page themeId="tool">
      <Content>
        <ContentHeader title="Edit or Create Components">
          <SupportButton />
        </ContentHeader>
        <Flex>
          <Box flex-shrink="0" width="600px">
            {repoState.value?.severity === 'success' ? (
              <Card>
                <Box px="2rem">
                  <Flex
                    direction="column"
                    align={{ xs: 'start', md: 'center' }}
                    py="2rem"
                  >
                    <Alert
                      sx={{ fontWeight: 'bold', textAlign: 'center' }}
                      severity="success"
                    >
                      Successfully created a pull request:{' '}
                      {repoState?.value?.prUrl ? (
                        <Link
                          href={repoState.value.prUrl}
                          sx={{ fontWeight: 'normal' }}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {repoState.value.prUrl}
                        </Link>
                      ) : (
                        <p>Could not retrieve pull request URL.</p>
                      )}
                    </Alert>
                    <Link
                      color="inherit"
                      onClick={() => {
                        setUrl('');
                        setDefaultName('');
                        setShowForm(false);
                        doSubmitToGithub('', undefined);
                      }}
                    >
                      Register a new component?
                    </Link>
                  </Flex>
                </Box>
              </Card>
            ) : (
              <Card style={{ position: 'relative', overflow: 'visible' }}>
                <form
                  onSubmit={e => {
                    e.preventDefault();
                    doGetRepoInfo();
                    doAnalyzeUrl();
                    getDefaultNameFromUrl();
                    doSubmitToGithub('', undefined);
                    setShowForm(false);
                  }}
                >
                  <Box px="2rem">
                    <Flex align="end">
                      <div style={{ flexGrow: 1 }}>
                        <TextField
                          label="Repository URL"
                          size="small"
                          placeholder="Enter a URL"
                          name="url"
                          value={url}
                          onChange={e => {
                            setUrl(e);
                          }}
                        />
                      </div>
                      <Button type="submit">Fetch!</Button>
                    </Flex>
                  </Box>
                </form>

                {analysisResult.value?.type === 'locations' &&
                  !(error || loading || repoState.error) &&
                  showForm && (
                    <Alert sx={{ mx: 2 }} severity="info">
                      Catalog-info.yaml already exists. Editing existing file.
                    </Alert>
                  )}

                {catalogInfoState.value === null &&
                  !repoInfo.value?.existingPrUrl &&
                  showForm &&
                  !(error || loading || repoState.error) && (
                    <Alert sx={{ mx: 2 }} severity="info">
                      Catalog-info.yaml does not exist. Creating a new file.
                    </Alert>
                  )}

                {repoInfo.value?.existingPrUrl && !loading && (
                  <Alert sx={{ mx: 2 }} severity="error">
                    There already exists a pull request:{' '}
                    <Link
                      href={repoInfo.value.existingPrUrl}
                      sx={{ fontWeight: 'normal' }}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {repoInfo.value.existingPrUrl}
                    </Link>
                  </Alert>
                )}

                {analysisResult.error && (
                  <Alert sx={{ mx: 2 }} severity="error">
                    {analysisResult.error?.message}
                  </Alert>
                )}

                {repoState.error && (
                  <Alert sx={{ mx: 2 }} severity="error">
                    {repoState.error?.message}
                  </Alert>
                )}

                {repoInfo.error && (
                  <Alert sx={{ mx: 2 }} severity="error">
                    {repoInfo.error?.message}
                  </Alert>
                )}

                {catalogInfoState.error && (
                  <Alert sx={{ mx: 2 }} severity="error">
                    {catalogInfoState.error?.message ||
                      repoState.error?.message}
                  </Alert>
                )}

                {loading ? (
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
                    {showForm &&
                      catalogInfoState.value !== undefined &&
                      !error && (
                        <div style={{ position: 'relative' }}>
                          {repoState.loading && (
                            <div
                              style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                backgroundColor:
                                  theme.palette.type === 'dark'
                                    ? 'rgba(118, 118, 118, 0.4)'
                                    : 'rgba(255, 255, 255, 0.7)',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                zIndex: 1,
                              }}
                            >
                              <CircularProgress />
                            </div>
                          )}
                          <CatalogForm
                            onSubmit={data =>
                              doSubmitToGithub(
                                getSubmitUrl(analysisResult.value!),
                                data,
                              )
                            }
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
          <Box flex-shrink="1" width="500px ">
            <InfoBox />
          </Box>
        </Flex>
      </Content>
    </Page>
  );
};

function getSubmitUrl(analysisResult: AnalyzeResult) {
  if (analysisResult.type === 'locations') {
    return analysisResult.locations[0].target;
  }
  return analysisResult.url;
}
