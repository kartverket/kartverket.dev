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

    const prBody = `catalog-info.yaml ${hasMore ? 'now includes more entities' : (hasLess ? 'now includes fewer entities' : 'has been updated')}

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
              : (initialYaml === null
                ? `Create catalog-info.yaml`
                : `Update catalog-info.yaml`),
          body: prBody,
          base: default_branch,
          head:
            entityKind && entityKind === 'Function'
              ? `update-${entityName}-function`
              : (initialYaml === null
                ? `create-catalog-info`
                : `update-catalog-info`),
          changes: [
            {
              files: {
                [relative_path]: completeYaml,
              },
              commit:
                (initialYaml === null
                  ? `New catalog-info.yaml`
                  : `Updated catalog-info.yaml`),
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
}
