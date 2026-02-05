import type { FormEntity, RequiredYamlFields, Status } from '../types/types.ts';

import {
  updateFunctionLocationsFile,
  updateYaml,
} from '../translator/translator';
import { Octokit } from '@octokit/core';
import { createPullRequest, DELETE_FILE } from 'octokit-plugin-create-pull-request';
import { OAuthApi } from '@backstage/core-plugin-api';
import { getCatalogInfo } from '../utils/getCatalogInfo.ts';
import { CatalogApi } from '@backstage/plugin-catalog-react';

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
    catalogApi?: CatalogApi,
  ): Promise<Status | undefined> => {
    const completeYaml = this.createNewYaml(catalogInfo, initialYaml);

    const OctokitPlugin = Octokit.plugin(createPullRequest);
    const token = await githubAuthApi.getAccessToken();
    const octokit = new OctokitPlugin({ auth: token });

    const { repo, owner, relative_path } = this.extractUrlInfo(url);

    if(entityKind && entityKind === 'Function' && this.parentIsNew(catalogInfo[0], initialYaml[0])){
      // eslint-disable-next-line no-console
      console.log("new parentSpotted", relative_path);
      // define new relative path -> kan gjøres i "submitnew"

      if(catalogApi){
            return this.submitFunctionCatalogInfoToGithub(githubAuthApi, couldNotCreatePRErrorMsg,catalogInfo,catalogApi,relative_path)
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

  // fjerne mulighet for foreldre funksjon, eller "fikse" flyttingen?
  submitFunctionCatalogInfoToGithub = async (
    githubAuthApi: OAuthApi,
    couldNotCreatePRErrorMsg: string,
    catalogInfo: FormEntity[],
    catalogApi: CatalogApi,
    oldPath?: string | undefined
  ): Promise<Status | undefined> => {
    if (!(catalogInfo[0].kind === 'Function')) {
      const message = couldNotCreatePRErrorMsg;
      throw new Error(message);
    }

    /* henter parent-function, og finner lokation/path*/
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
    /* henter parent-function, og finner lokation/path*/
    
    const { repo, owner } = this.extractUrlInfo(managedbylocation);

    /* henter parent yaml*/
    const locationsYamlContent = await getCatalogInfo(
      managedbyoriginlocation.replace(/^url:/, ''),
      githubAuthApi,
    );

    if (!locationsYamlContent) {
      throw new Error(couldNotCreatePRErrorMsg);
    }

    // eslint-disable-next-line no-console
    console.log("gammal path", oldPath)
    const updatedLocationsYamlContent = locationsYamlContent.map(content =>
      updateFunctionLocationsFile(
        content,
        `./${parentFolderPath}/${catalogInfo[0].name}/${catalogInfo[0].name}.yaml`,
        `./${oldPath}`
      ),
    );

    // eslint-disable-next-line no-console
    console.log(updatedLocationsYamlContent)

    const completeUpdatedLocationsYamlContent =
      updatedLocationsYamlContent.join('\n---\n');

    const newFilePath = `${parentFolderPath}/${catalogInfo[0].name}/${catalogInfo[0].name}.yaml`;

    const completeYaml = this.createNewYaml(catalogInfo, undefined);

    const OctokitPlugin = Octokit.plugin(createPullRequest);
    const token = await githubAuthApi.getAccessToken();
    const octokit = new OctokitPlugin({ auth: token });



    const changes = oldPath? {
      files: {
                [newFilePath]: completeYaml,
                ['catalog-info.yaml']: completeUpdatedLocationsYamlContent,
                [oldPath]: DELETE_FILE,

              },
              commit: `Moved function ${catalogInfo[0].name}`, 
    }:
    {
      files: {
                [newFilePath]: completeYaml,
                ['catalog-info.yaml']: completeUpdatedLocationsYamlContent,
              },
              commit: `Created new function`,
    }

    try {
      if (owner && repo) {
        const result = await octokit.createPullRequest({
          owner: owner,
          repo: repo,
          title: `Create ${catalogInfo[0].name} function`,
          body: 'Creates new catalog file and updates existing catalog with reference',
          head: `create-${catalogInfo[0].name}-function`,
          changes: changes,
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

  SubmitChangedParentForFunctionToGithub = (): createPullRequest.Changes => {

    
    return {
      files: {
        'oldlocation': 'locations minus this target',
        'new path for this file': 'old file content',
        'old path for this file': DELETE_FILE,
        'new location': 'locations plus this target'
      }, 
      commit: 'changedParent'
    }
  }

  private parentIsNew(catalogInfo: FormEntity,
    initialYaml: RequiredYamlFields | undefined = undefined){
      if( catalogInfo.kind === 'Function' && initialYaml?.kind === 'Function'){
        return catalogInfo.parentFunction !== initialYaml?.spec.parentFunction
      }
      return false
  }


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
