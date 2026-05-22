import { useApi } from '@backstage/core-plugin-api';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import { UserEntity } from '@backstage/catalog-model';
import { useEffect, useMemo, useRef, useState } from 'react';

/**
 * Lazy user search hook. Fetches all users once on the first query (≥2 chars),
 * then filters client-side. Avoids loading the full catalog on page mount.
 */
export function useUserSearch(query: string) {
  const [allUsers, setAllUsers] = useState<UserEntity[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const hasFetched = useRef(false);
  const catalogApi = useApi(catalogApiRef);

  useEffect(() => {
    let cancelled = false;

    if (query.length < 2 || hasFetched.current) {
      return () => {
        cancelled = true;
      };
    }

    setIsLoading(true);
    catalogApi
      .getEntities({ filter: { kind: 'User' } })
      .then(results => {
        if (cancelled) {
          return;
        }

        setAllUsers(
          results.items.filter(
            (item): item is UserEntity => item.kind === 'User',
          ),
        );
        hasFetched.current = true;
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [query, catalogApi]);

  const users = useMemo(() => {
    if (query.length < 2) return [];
    const q = query.toLowerCase();
    return allUsers.filter(user => {
      const email = user.spec.profile?.email?.toLowerCase() ?? '';
      const displayName = user.spec.profile?.displayName?.toLowerCase() ?? '';
      return email.includes(q) || displayName.includes(q);
    });
  }, [allUsers, query]);

  return { users, isLoading };
}
