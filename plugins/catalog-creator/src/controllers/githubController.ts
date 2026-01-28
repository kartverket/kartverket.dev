import type { FormEntity, RequiredYamlFields, Status } from '../types/types.ts';

import {
  updateFunctionLocationsFile,
  updateYaml,
} from '../translator/translator';
import { Octokit } from '@octokit/core';
import { createPullRequest } from 'octokit-plugin-create-pull-request';
import { OAuthApi } from '@backstage/core-plugin-api';
import { getCatalogInfo } from '../utils/getCatalogInfo.ts';
import { CatalogApi } from '@backstage/plugin-catalog-react';

/* eslint-disable no-nested-ternary */

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
    const completeYaml = this.createNewYaml(catalogInfo, initialYaml);

    const OctokitPlugin = Octokit.plugin(createPullRequest);
    const token = await githubAuthApi.getAccessToken();
    const octokit = new OctokitPlugin({ auth: token });

    const { repo, owner, relative_path } = this.extractUrlInfo(url);

    const hasMore = catalogInfo.length > initialYaml.length;
    const hasLess = catalogInfo.length < initialYaml.length;
    const removedEntities = initialYaml.filter(
      item =>
        !catalogInfo.some(
          u => u.kind === item.kind && u.name === item.metadata.name,
        ),
    );
    const addedEntities = catalogInfo.filter(
      item =>
        !initialYaml.some(
          i => i.kind === item.kind && i.metadata.name === item.name,
        ),
    );

    const prBody = `catalog-info.yaml ${hasMore ? 'now includes more entities' : hasLess ? 'now includes fewer entities' : 'has been updated'}

        ${removedEntities.length > 0 ? `Removed entities:` : ''}
        ${removedEntities
          .map(entity => `name: ${entity.metadata.name}, kind: ${entity.kind}`)
          .join('\n        ')}

        ${addedEntities.length > 0 ? `Added entities:` : ''}
        ${addedEntities
          .map(entity => `name: ${entity.name}, kind: ${entity.kind}`)
          .join('\n        ')}

        All entities in catalog-info.yaml:
        ${catalogInfo.map(info => `name: ${info.name}, kind: ${info.kind}`).join('\n        ')} 
        
        \n\n This PR was created using the Catalog Creator plugin in Backstage.`;

    try {
      if (owner && repo && relative_path && default_branch) {
        const result = await octokit.createPullRequest({
          owner: owner,
          repo: repo,
          title:
            entityKind && entityKind === 'Function'
              ? `Update ${entityName} function`
              : initialYaml === null
                ? `Create catalog-info.yaml`
                : `Update catalog-info.yaml`,
          body: prBody,
          base: default_branch,
          head:
            entityKind && entityKind === 'Function'
              ? `update-${entityName}-function`
              : initialYaml === null
                ? `create-catalog-info`
                : `update-catalog-info`,
          changes: [
            {
              files: {
                [relative_path]: completeYaml,
              },
              commit:
                initialYaml === null
                  ? `New catalog-info.yaml`
                  : `Updated catalog-info.yaml`,
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
    catalogInfo: FormEntity[],
    catalogApi: CatalogApi,
  ): Promise<Status | undefined> => {
    if (!(catalogInfo[0].kind === 'Function')) {
      const message = couldNotCreatePRErrorMsg;
      throw new Error(message);
    }

    const fetchedEntity = await catalogApi.getEntityByRef(
      catalogInfo[0].parentFunction,
    );

    const managedbylocation =
      fetchedEntity?.metadata.annotations?.['backstage.io/managed-by-location'];
    const managedbyoriginlocation =
      fetchedEntity?.metadata.annotations?.[
        'backstage.io/managed-by-origin-location'
      ];

    if (!(managedbylocation && managedbyoriginlocation)) {
      throw new Error(couldNotCreatePRErrorMsg);
    }

    const parentFolderPath = managedbylocation
      .match(/tree\/main\/(.+)/)?.[1]
      ?.replace(/\/[^/]+$/, '');

    const { repo, owner } = this.extractUrlInfo(managedbylocation);

    const locationsYamlContent = await getCatalogInfo(
      managedbyoriginlocation.replace(/^url:/, ''),
      githubAuthApi,
    );

    if (!locationsYamlContent) {
      throw new Error(couldNotCreatePRErrorMsg);
    }

    const updatedLocationsYamlContent = locationsYamlContent.map(content =>
      updateFunctionLocationsFile(
        content,
        `./${parentFolderPath}/${catalogInfo[0].name}/${catalogInfo[0].name}.yaml`,
      ),
    );

    const completeUpdatedLocationsYamlContent =
      updatedLocationsYamlContent.join('\n---\n');

    const newFilePath = `${parentFolderPath}/${catalogInfo[0].name}/${catalogInfo[0].name}.yaml`;

    const completeYaml = this.createNewYaml(catalogInfo, undefined);

    const OctokitPlugin = Octokit.plugin(createPullRequest);
    const token = await githubAuthApi.getAccessToken();
    const octokit = new OctokitPlugin({ auth: token });

    try {
      if (owner && repo) {
        const result = await octokit.createPullRequest({
          owner: owner,
          repo: repo,
          title: `Create ${catalogInfo[0].name} function`,
          body: 'Creates new catalog file and updates existing catalog with reference',
          head: `create-${catalogInfo[0].name}-function`,
          changes: [
            {
              files: {
                [newFilePath]: completeYaml,
                ['catalog-info.yaml']: completeUpdatedLocationsYamlContent,
              },
              commit: `Created new function`,
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
        throw new Error('Unknown error when trying to create a PR.');
      }
    }
  };

  private createNewYaml(
    catalogInfo: FormEntity[],
    initialYaml: RequiredYamlFields[] | undefined = undefined,
  ) {
    const emptyRequiredYaml: RequiredYamlFields = {
      apiVersion: '',
      kind: '',
      metadata: {
        name: '',
      },
      spec: {
        type: '',
      },
    };
    let yamlStrings: string[];
    if (initialYaml) {
      yamlStrings = catalogInfo.map(val =>
        updateYaml(initialYaml[val.id] ?? emptyRequiredYaml, val),
      );
    } else {
      yamlStrings = catalogInfo.map(val => updateYaml(emptyRequiredYaml, val));
    }

    return yamlStrings.join('\n---\n');
  }

  private extractUrlInfo(url: string) {
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
    return { owner, repo, relative_path };
  }
}
