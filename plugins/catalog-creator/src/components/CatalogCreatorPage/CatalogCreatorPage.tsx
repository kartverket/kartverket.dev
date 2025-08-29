import {
  TextField,
  Button,
  Box,
  Card,
  Icon,
  Flex,
} from '@backstage/ui';

import {
  Page,
  Content,
  ContentHeader,
  SupportButton,
} from '@backstage/core-components';


import { useApi, githubAuthApiRef } from '@backstage/core-plugin-api';

import { catalogImportApiRef } from '@backstage/plugin-catalog-import';

import { useState } from 'react';

import type { CatalogInfoForm, RequiredYamlFields } from '../../model/types';
import { CatalogForm } from '../CatalogForm';

import { GithubController } from '../../controllers/githubController';
import { updateYaml } from '../../translator/translator';

export const CatalogCreatorPage = () => {

  const [url, setUrl] = useState('');

  const [initialYaml, setInitialYaml] = useState<RequiredYamlFields | undefined>(undefined);

  const [catalogInfoForm, setCatalogInfoForm] = useState<CatalogInfoForm>(
    {
      kind: null,
      name: '',
      owner: '',
      lifecycle: null,
      type: null,
      system: '',
      domain: '',
      providesApis: [],
      consumesApis: [],
      dependsOn: [],
      definition: [],
    }
  );

  const [yamlContent, setYamlContent] = useState<string>('');

  const catalogImportApi = useApi(catalogImportApiRef);
  const githubAuth = useApi(githubAuthApiRef);
  const githubController = new GithubController(catalogImportApi, githubAuth);


  const submitFetchCatalogInfo = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const fetchedCatalogInfo = await githubController.fetchCatalogInfo(url);

    setInitialYaml(fetchedCatalogInfo);

    if (fetchedCatalogInfo) {
      setCatalogInfoForm({
        kind: fetchedCatalogInfo.kind as any || null,
        name: fetchedCatalogInfo.metadata.name || '',
        owner: fetchedCatalogInfo.spec.owner || '',
        lifecycle: fetchedCatalogInfo.spec.lifecycle as any || null,
        type: fetchedCatalogInfo.spec.type as any || null,
        system: fetchedCatalogInfo.spec.system || '',
        domain: fetchedCatalogInfo.spec.domain || '',
        providesApis: fetchedCatalogInfo.spec.providesApis || [],
        consumesApis: fetchedCatalogInfo.spec.consumesApis || [],
        dependsOn: fetchedCatalogInfo.spec.dependsOn || [],
        definition: fetchedCatalogInfo.spec.definition || [],
      });
    }
  };

  const submitGithubRepo = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!initialYaml) {
      console.log('No initial YAML found');
      return;
    }

    await githubController.submitCatalogInfoToGithub(url, initialYaml, catalogInfoForm);
    setYamlContent(updateYaml(initialYaml, catalogInfoForm));
  };

  return (
    <Page themeId="tool">
      <Content>
        <ContentHeader title="Catalog Creator">
          <SupportButton>A description of your plugin goes here.</SupportButton>
        </ContentHeader>

        <Box maxWidth={'500px'}>
          <Card>
            <form onSubmit={submitFetchCatalogInfo}>
              <Box px={'2rem'}>
                <Flex direction={'row'} align={'end'}>
                  <TextField
                    label="Repository URL"
                    size="small"
                    icon={<Icon name="sparkling" />}
                    placeholder="Enter a URL"
                    name="url"
                    value={url}
                    onChange={(e) => {
                      setUrl(e);
                    }}
                  />
                  <Button type='submit'>Fetch!</Button>
                </Flex>
              </Box>
            </form>

            {initialYaml && (
              <CatalogForm
                onSubmit={submitGithubRepo}
                catalogInfoForm={catalogInfoForm}
                setCatalogInfoForm={setCatalogInfoForm}
                yamlContent={yamlContent}
                setYamlContent={setYamlContent}
              />
            )}
          </Card>
        </Box>
      </Content>
    </Page >
  );
};
