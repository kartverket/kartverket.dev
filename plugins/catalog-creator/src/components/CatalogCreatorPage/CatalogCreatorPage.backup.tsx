import {
  TextField,
  Button,
  Box,
  Card,
  Icon,
  Flex,
} from '@backstage/ui';
import yaml from 'yaml';

import {
  Page,
  Content,
  ContentHeader,
  SupportButton,
} from '@backstage/core-components';

import { useState } from 'react';
import { useApi, githubAuthApiRef } from '@backstage/core-plugin-api';

import { catalogImportApiRef } from '@backstage/plugin-catalog-import';

import type { CatalogInfoForm } from '../../model/types';
import { CatalogForm } from '../CatalogForm';

export const CatalogCreatorPage = () => {

  const api = useApi(catalogImportApiRef);

  const [url, setUrl] = useState('');
  const [entityData, setEntityData] = useState<any>(null);
  const githubAuth = useApi(githubAuthApiRef);

  const [catalogInfoForm, setCatalogInfoForm] = useState<CatalogInfoForm>(
    {
      kind: null, // Check
      name: '', // Check
      owner: '', // Check
      lifecycle: null, // Check
      type: null, // Check
      system: '',
      domain: '',
      providesApis: [],
      consumesApis: [],
      dependsOn: [],
      definition: [],
    }
  );

  const submitGithubRepo = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const url = formData.get('url') as string;
    setUrl(url);

    try {
      // Parse owner and repo from URL
      const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
      if (!match) {
        console.log('Invalid GitHub repository URL');
        return;
      }
      const owner = match[1];
      const repo = match[2];

      const token = await githubAuth.getAccessToken();

      console.log('GitHub token:', token);

      if (entityData) {
        // Convert entityData to .yaml file
        const yamlContent = yaml.stringify(entityData);

        console.log('Generated YAML content:', yamlContent);

        // Use api to get default commit message + title, handle possibly missing method
        const { title, body } = await (api.preparePullRequest?.() ?? Promise.resolve({
          title: 'Add catalog-info.yaml',
          body: 'This PR adds a Backstage catalog-info.yaml file for import.',
        }));

        // Submit the PR
        const result = await api.submitPullRequest({
          repositoryUrl: url,  // 👈 the repo URL the user typed in
          fileContent: yamlContent,
          title,
          body,
        });

        console.log('Pull request created:', result.link);
        console.log('Entity will be available at:', result.location);

      } else {

        const result = await api.analyzeUrl(url);
        console.log('Analyze URL result:', result);
        // If no entityData, just check if catalog-info.yaml exists and fetch it
        const response = await fetch(
          `https://api.github.com/repos/${owner}/${repo}/contents/catalog-info.yaml`,
          {
            headers: {
              Authorization: `token ${token}`,
              Accept: 'application/vnd.github.v3+json',
            },
          }
        );

        if (response.ok) {
          // console.log('catalog-info.yaml exists in the repository.');
          const data = await response.json();
          const content = atob(data.content);
          // console.log('catalog-info.yaml content:', content);
          try {
            const parsed = yaml.parse(content);
            // console.log('Parsed YAML content:', parsed);
            setEntityData(parsed);
          } catch (error) {
            console.error('Error parsing YAML content:', error);
            try {
              const parsed = yaml.parseAllDocuments(content);
              const res = parsed.map((item) => item.toJS());
              // console.log('Parsed multiple documents (0):', res[0]);
              setEntityData(res[0]);
            } catch (error) {
              // console.error('Error parsing multiple YAML documents:', error);
            }
          }

        } else if (response.status === 404) {
          console.log('catalog-info.yaml does not exist in the repository.');
        } else {
          console.log('Error checking catalog-info.yaml:', response.statusText);
        }
      }
    } catch (error) {
      console.error('Error processing GitHub repository:', error);
    }
  };


  return (
    <Page themeId="tool">
      <Content>
        <ContentHeader title="Catalog Creator">
          <SupportButton>A description of your plugin goes here.</SupportButton>
        </ContentHeader>

        <Box maxWidth={'500px'}>
          <Card>
            <form onSubmit={submitGithubRepo}>
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

            <CatalogForm
              onSubmit={submitGithubRepo}
              catalogInfoForm={catalogInfoForm}
              setCatalogInfoForm={setCatalogInfoForm}
            />
          </Card>
        </Box>
      </Content>
    </Page >
  );
};
