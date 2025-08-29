import { OAuthApi } from '@backstage/core-plugin-api';
import type { CatalogImportApi } from '@backstage/plugin-catalog-import';

import type { CatalogInfoForm, RequiredYamlFields } from '../model/types.ts';

import yaml from 'yaml';

import { updateYaml } from '../translator/translator.ts';

export class GithubController {
    constructor(
        private catalogImportApi: CatalogImportApi,
        private githubAuthApi: OAuthApi
    ) { }

    submitCatalogInfoToGithub = async (url: string, initialYaml: RequiredYamlFields, catalogInfo: CatalogInfoForm) => {
        if (url === '') {
            console.log('No GitHub repository URL specified');
            return;
        }

        try {
            // Parse owner and repo from URL
            const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
            if (!match) {
                console.log('Invalid GitHub repository URL');
                return;
            }

            const yamlContent = updateYaml(initialYaml, catalogInfo);

            // Use api to get default commit message + title, handle possibly missing method
            const { title, body } = await (this.catalogImportApi.preparePullRequest?.() ?? Promise.resolve({
                title: 'Add catalog-info.yaml',
                body: 'This PR adds a Backstage catalog-info.yaml file for import.',
            }));

            // Submit the PR
            const result = await this.catalogImportApi.submitPullRequest({
                repositoryUrl: url,  // 👈 the repo URL the user typed in
                fileContent: yamlContent,
                title,
                body,
            });

            console.log('Pull request created:', result.link);
            console.log('Entity will be available at:', result.location);
        } catch (error) {
            console.error('Error processing GitHub repository:', error);
        }
    };

    fetchCatalogInfo = async (url: string): Promise<RequiredYamlFields | undefined> => {

        const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
        if (!match) {
            console.log('Invalid GitHub repository URL');
            return;
        }

        const owner = match[1];
        const repo = match[2];

        const token = await this.githubAuthApi.getAccessToken();

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
            const data = await response.json();
            const content = atob(data.content);
            try {
                const parsed = yaml.parse(content);
                return parsed;
            } catch (error) {
                console.error('Error parsing YAML content:', error);
                return;
            }

        } else if (response.status === 404) {
            console.log('catalog-info.yaml does not exist in the repository.');
            return;
        } else {
            console.log('Error checking catalog-info.yaml:', response.statusText);
            return;
        }
    }
}