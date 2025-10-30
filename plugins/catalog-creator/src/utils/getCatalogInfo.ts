import { OAuthApi } from '@backstage/core-plugin-api';
import { Octokit } from '@octokit/rest';
import * as yaml from 'yaml';
import { RequiredYamlFields } from '../types/types';

export async function getCatalogInfo(
  url: string,
  githubAuthApi: OAuthApi,
): Promise<RequiredYamlFields[] | null> {
  const match = url.match(
    /github\.com\/([^\/]+)\/([^\/]+)\/(?:blob|tree)\/([^\/]+)\/(.+)/,
  );

  if (!match) {
    throw new Error('Invalid GitHub repository URL');
  }

  const owner = match[1];
  const repo = match[2];
  const ref = match[3];
  const path = match[4];

  try {
    const octokit = new Octokit({
      auth: await githubAuthApi.getAccessToken(),
    });

    const response = await octokit.rest.repos.getContent({
      owner: owner,
      repo: repo,
      path: path,
      ref: ref,
    });

    const fileContent = Buffer.from(
      (response.data as { content: string }).content,
      'base64',
    ).toString('utf8');
    const parsedYaml = yaml.parseAllDocuments(fileContent);
    const documentList: Array<RequiredYamlFields> = parsedYaml.map(document => {
      return document.toJSON();
    });
    return documentList;
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message.toLowerCase().includes('credentials')) {
        throw error;
      }
      return null;
    }
    throw error;
  }
}
