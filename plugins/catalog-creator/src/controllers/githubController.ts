import type { FormEntity, RequiredYamlFields, Status } from '../types/types.ts';

import { updateYaml } from '../translator/translator';
import { Octokit } from '@octokit/core';
import { createPullRequest } from 'octokit-plugin-create-pull-request';
import { OAuthApi } from '@backstage/core-plugin-api';

export class GithubController {
  submitCatalogInfoToGithub = async (
    url: string,
    default_branch: string | undefined,
    initialYaml: RequiredYamlFields[],
    catalogInfo: FormEntity[],
    githubAuthApi: OAuthApi,
    couldNotCreatePRErrorMsg: string,
    entityKind?: string,
    entityName?: string,
  ): Promise<Status | undefined> => {
    const emptyRequiredYaml: RequiredYamlFields = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: '',
      metadata: {
        name: '',
      },
      spec: {
        type: '',
      },
    };

    const yamlStrings = catalogInfo.map(val =>
      updateYaml(initialYaml[val.id] ?? emptyRequiredYaml, val),
    );

    const completeYaml = yamlStrings.join('\n---\n');

    const OctokitPlugin = Octokit.plugin(createPullRequest);
    const token = await githubAuthApi.getAccessToken();
    const octokit = new OctokitPlugin({ auth: token });

    let owner;
    let repo;
    let relative_path;

    if (url.includes('blob') || url.includes('tree')) {
      const match = url.match(
        /github\.com\/([^\/]+)\/([^\/]+)\/(blob|tree)\/[^\/]+\/(.+)/,
      );
      if (match) {
        owner = match[1];
        repo = match[2];
        relative_path = match[4] ? match[4] : 'catalog-info.yaml';
      }
    } else {
      const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)(.*)/);
      if (match) {
        owner = match[1];
        repo = match[2];
        relative_path = match[3] ? match[3] : 'catalog-info.yaml';
      }
    }

    try {
      if (owner && repo && relative_path && default_branch) {
        const result = await octokit.createPullRequest({
          owner: owner,
          repo: repo,
          title:
            entityKind && entityKind === 'Function'
              ? `Update ${entityName} function`
              : 'Create/update catalog-info.yaml',
          body: 'Creates or updates catalog-info.yaml',
          base: default_branch,
          head:
            entityKind && entityKind === 'Function'
              ? `update-${entityName}-function`
              : 'Update-or-create-catalog-info',
          changes: [
            {
              files: {
                [relative_path]: completeYaml,
              },
              commit: 'New or updated catalog-info.yaml',
            },
          ],
        });
        return {
          message: 'created a pull request',
          severity: 'success',
          prUrl: result?.data.html_url,
        };
      }
      throw new Error();
    } catch (error: unknown) {
      if (error instanceof Error) {
        error.message = couldNotCreatePRErrorMsg;
        throw error;
      } else {
        throw new Error('Unkown error when trying to create a PR.');
      }
    }
  };

  submitFunctionCatalogInfoToGithub = async (
    githubAuthApi: OAuthApi,
    couldNotCreatePRErrorMsg: string,
  ): Promise<Status | undefined> => {
    const newFileContent = 'testcontent';
    const newFilePath = 'folder/newfile.yaml';

    const existingFilePath = 'catalog-info.yaml';
    const updatedContent = `locations: ${newFilePath}`;

    const OctokitPlugin = Octokit.plugin(createPullRequest);
    const token = await githubAuthApi.getAccessToken();
    const octokit = new OctokitPlugin({ auth: token });

    try {
      const result = await octokit.createPullRequest({
        owner: 'kartverket',
        repo: 'funksjonsregister-PoC',
        title: 'Test function',
        body: 'Creates new catalog file and updates existing catalog with reference',
        head: 'add-catalog-file',
        changes: [
          {
            files: {
              [newFilePath]: newFileContent,
              [existingFilePath]: updatedContent,
            },
            commit: 'Test test test',
          },
        ],
      });
      return {
        message: 'created a pull request',
        severity: 'success',
        prUrl: result?.data.html_url,
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        error.message = couldNotCreatePRErrorMsg;
        throw error;
      } else {
        throw new Error('Unknown error when trying to create a PR.');
      }
    }
  };
}
