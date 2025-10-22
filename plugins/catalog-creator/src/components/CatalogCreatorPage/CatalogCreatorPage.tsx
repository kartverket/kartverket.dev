import { TextField, Button, Box, Card, Icon, Flex } from '@backstage/ui';

import {
  Page,
  Content,
  ContentHeader,
  SupportButton,
} from '@backstage/core-components';

import { githubAuthApiRef, OAuthApi, useApi } from '@backstage/core-plugin-api';

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

export const CatalogCreatorPage = () => {
  const catalogImportApi = useApi(catalogImportApiRef);
  const githubAuthApi: OAuthApi = useApi(githubAuthApiRef);
  const githubController = new GithubController();

  const [url, setUrl] = useState('');
  const [defaultName, setDefaultName] = useState<string>('');

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
    return result;
  }, [url, githubAuthApi, catalogImportApi.analyzeUrl, doFetchCatalogInfo]);

  const [repoState, doSubmitToGithub] = useAsyncFn(
    async (submitUrl: string, catalogInfoFormList?: FormEntity[]) => {
      if (catalogInfoFormList !== undefined) {
        return await githubController.submitCatalogInfoToGithub(
          submitUrl,
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

  function getDefaultNameFromUrl() {
    const regexMatch = url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
    if (regexMatch && regexMatch[2]) {
      setDefaultName(regexMatch[2]);
    }
  }

  return (
    <Page themeId="tool">
      <Content>
        <ContentHeader title="Catalog Creator">
          <SupportButton />
        </ContentHeader>

        <Box maxWidth="500px">
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
                  doAnalyzeUrl();
                  getDefaultNameFromUrl();
                  doSubmitToGithub('', undefined);
                }}
              >
                <Box px="2rem">
                  <Flex align="end">
                    <div style={{ flexGrow: 1 }}>
                      <TextField
                        label="Repository URL"
                        size="small"
                        icon={<Icon name="sparkling" />}
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
                !(catalogInfoState.error || repoState.error) && (
                  <Alert sx={{ mx: 2 }} severity="info">
                    Catalog-info.yaml already exists. Editing existing file.
                  </Alert>
                )}

              {repoState.error && (
                <Alert sx={{ mx: 2 }} severity="error">
                  {repoState.error?.message}
                </Alert>
              )}

              {catalogInfoState.error && (
                <Alert sx={{ mx: 2 }} severity="error">
                  {catalogInfoState.error?.message || repoState.error?.message}
                </Alert>
              )}

              {repoState.loading ||
              analysisResult.loading ||
              catalogInfoState.loading ? (
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
                <div>
                  {catalogInfoState.value !== undefined &&
                    analysisResult.value !== undefined && (
                      <CatalogForm
                        onSubmit={data =>
                          doSubmitToGithub(
                            getSubmitUrl(analysisResult.value),
                            data,
                          )
                        }
                        currentYaml={catalogInfoState.value}
                        defaultName={defaultName}
                      />
                    )}
                </div>
              )}
            </Card>
          )}
        </Box>
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
