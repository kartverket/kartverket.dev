import { useState, useEffect, useRef } from 'react';
import { getAuthenticationTokens } from '../utils/authenticationUtils';
import {
  configApiRef,
  identityApiRef,
  microsoftAuthApiRef,
  useApi,
} from '@backstage/frontend-plugin-api';
import { RegelrettForm } from '../types';

/**
 * Fetches regelrett forms for all of the user's teams in parallel using the
 * team endpoint, and returns a map from function name to whether any of its
 * forms have expired answers.
 *
 * Intentionally uses useState/useEffect rather than @tanstack/react-query so
 * that the hook can be called from packages/app without requiring a shared
 * QueryClientProvider (the plugin's react-query instance is a separate module
 * and would not see a provider created in the app package).
 */
export const useAllFunctionFormsQuery = (teamIds: string[]) => {
  const config = useApi(configApiRef);
  const backstageAuthApi = useApi(identityApiRef);
  const microsoftAuthApi = useApi(microsoftAuthApiRef);

  const [data, setData] = useState<Map<string, boolean> | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | undefined>(undefined);

  const key = teamIds.slice().sort().join(',');
  const fetchedKey = useRef('');

  useEffect(() => {
    if (!key || fetchedKey.current === key) return;
    fetchedKey.current = key;

    const ids = key.split(',');
    setIsLoading(true);
    setError(undefined);

    (async () => {
      try {
        const { entraIdToken, backstageToken } = await getAuthenticationTokens(
          config,
          backstageAuthApi,
          microsoftAuthApi,
        );
        const baseUrl = config.getString('backend.baseUrl');

        const results = await Promise.all(
          ids.map(async teamId => {
            const url = new URL(
              `${baseUrl}/api/regelrett-schemas/proxy/fetch-regelrett-forms-by-team-id`,
            );
            url.searchParams.set('teamId', teamId);
            const response = await fetch(url, {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${backstageToken}`,
                EntraId: entraIdToken,
              },
            });
            if (!response.ok) return [] as RegelrettForm[];
            return (await response.json()) as RegelrettForm[];
          }),
        );

        const expiredMap = new Map<string, boolean>();
        for (const form of results.flat()) {
          if (form.expiredCount > 0) {
            expiredMap.set(form.name, true);
          } else if (!expiredMap.has(form.name)) {
            expiredMap.set(form.name, false);
          }
        }
        setData(expiredMap);
      } catch (e) {
        setError(e instanceof Error ? e : new Error(String(e)));
      } finally {
        setIsLoading(false);
      }
    })();
  }, [key, config, backstageAuthApi, microsoftAuthApi]);

  return { data, isLoading, error };
};
