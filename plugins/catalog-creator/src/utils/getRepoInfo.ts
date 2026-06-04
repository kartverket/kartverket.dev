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
  const decodedUrl = decodeURI(url);
  const targetPathMatch = decodedUrl.match(
    /github\.com\/[^\/]+\/[^\/]+\/(?:blob|tree)\/[^\/]+\/(.+)/,
  );
  const targetPath = targetPathMatch?.[1];

  if (!match) {
    throw new Error('Invalid GitHub repository URL');
  }
  const owner = match[1];
  const repo = match[2];

  const returnObject: {
    default_branch?: string;
    existingPrUrl?: string;
    existingPrPath?: string;
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

    let matchingPr;

    if (entityKind === 'Function') {
      matchingPr = response.data.find(
        pr =>
          pr.title === `Update ${entityName} function` ||
          pr.title === `Create ${entityName} function`,
      );
      if (matchingPr) {
        const changedFiles = await octokit.paginate(
          octokit.rest.pulls.listFiles,
          {
            owner,
            repo,
            pull_number: matchingPr.number,
            per_page: 100,
            headers: {
              'If-None-Match': '',
            },
          },
        );

        const filenames = changedFiles.map(file => decodeURI(file.filename));
        returnObject.existingPrPath = filenames.join(', ');
      }
    } else {
      const candidatePrs = response.data.filter(
        pr =>
          pr.title === 'Create catalog-info.yaml' ||
          pr.title === 'Update catalog-info.yaml',
      );

      if (!targetPath) {
        matchingPr = candidatePrs[0];
      } else {
        for (const pr of candidatePrs) {
          const changedFiles = await octokit.paginate(
            octokit.rest.pulls.listFiles,
            {
              owner,
              repo,
              pull_number: pr.number,
              per_page: 100,
              headers: {
                'If-None-Match': '',
              },
            },
          );

          const matchesPath = changedFiles.some(file => {
            const filename = decodeURI(file.filename);
            return filename === targetPath;
          });

          if (matchesPath) {
            matchingPr = pr;
            returnObject.existingPrPath = targetPath;
            break;
          }
        }
      }
    }

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
