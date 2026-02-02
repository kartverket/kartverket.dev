import { OAuthApi } from '@backstage/core-plugin-api';
import { Octokit } from '@octokit/rest';

export async function getRepoInfo(
  url: string,
  githubAuthApi: OAuthApi,
  canNotFindRepoErrorMsg: string,
  entityKind?: string,
  entityName?: string,
) {
  const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/);

  if (!match) {
    throw new Error('Invalid GitHub repository URL');
  }
  const owner = match[1];
  const repo = match[2];

  const returnObject: {
    default_branch?: string;
    existingPrUrl?: string;
  } = {};

  const octokit = new Octokit({
    auth: await githubAuthApi.getAccessToken(),
  });

  try {
    const response = await octokit.rest.repos.get({
      owner: owner,
      repo: repo,
      headers: {
        'If-None-Match': '',
      },
    });

    returnObject.default_branch = response.data.default_branch;
  } catch (error: unknown) {
    if (error instanceof Error) {
      error.message = `${canNotFindRepoErrorMsg}${url}`;
      throw error;
    } else {
      throw new Error(
        'Unkown error when trying to find the GitHub repository.',
      );
    }
  }

  try {
    const response = await octokit.rest.pulls.list({
      owner: owner,
      repo: repo,
      state: 'open',
      headers: {
        'If-None-Match': '',
      },
    });

    const matchingPr = response.data.find(pr => {
      if (entityKind === 'Function') {
        return (
          pr.title === `Update ${entityName} function` ||
          pr.title === `Create ${entityName} function`
        );
      }
      if (entityKind !== 'Function') {
        return pr.title === 'Create/update catalog-info.yaml';
      }
      return false;
    });

    if (matchingPr) {
      returnObject.existingPrUrl = matchingPr.html_url;
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message.toLowerCase().includes('credentials')) {
        throw error;
      }
      error.message = `Could not check if the pull request already exists for: ${url}.`;
      throw error;
    } else {
      throw new Error(
        'Unkown error when trying to find the GitHub repository.',
      );
    }
  }
  return returnObject;
}
