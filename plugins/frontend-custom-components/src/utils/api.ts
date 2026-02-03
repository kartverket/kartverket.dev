import { RegelrettForm } from '../types';

export const getContext = async (
  url: URL,
  backstageToken: string,
  entraIdToken: string,
): Promise<RegelrettForm[]> => {
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${backstageToken}`,
      EntraId: entraIdToken,
    },
  });

  return await response.json();
};
