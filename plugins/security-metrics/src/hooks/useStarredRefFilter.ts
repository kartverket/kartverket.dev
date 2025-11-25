import { useApi, storageApiRef } from '@backstage/core-plugin-api';
import { useEffect, useMemo, useState } from 'react';

type FilterEnum = 'all' | 'starred';

export const useStarredRefFilter = ({
  allRefs,
  starredEntities,
  storageKey = 'filterChoice',
  bucket = 'group-page-filter',
}: {
  allRefs: string[];
  starredEntities: Set<string>;
  storageKey?: string;
  bucket?: string;
}) => {
  const storageApi = useApi(storageApiRef);
  const storage = storageApi.forBucket(bucket);

  const [filterChoice, setFilterChoice] = useState<FilterEnum>('starred');
  const [initialized, setInitialized] = useState(false);

  const starredRefs = useMemo(
    () => allRefs.filter(ref => starredEntities.has(ref)),
    [allRefs, starredEntities],
  );

  const hasStarred = starredRefs.length > 0;

  const effectiveFilter: FilterEnum =
    hasStarred && filterChoice === 'starred' ? 'starred' : 'all';

  const visibleRefs = useMemo(
    () => new Set(effectiveFilter === 'starred' ? starredRefs : allRefs),
    [effectiveFilter, allRefs, starredRefs],
  );

  useEffect(() => {
    if (!allRefs.length) return;

    if (!initialized) {
      const snap = storage.snapshot<FilterEnum>(storageKey);
      const next: FilterEnum =
        snap?.presence === 'present' && snap.value ? snap.value : 'all';

      setFilterChoice(next);
      setInitialized(true);
      return;
    }

    storage.set<FilterEnum>(storageKey, filterChoice);
  }, [allRefs.length, initialized, filterChoice, storage, storageKey]);

  return {
    hasStarred,
    effectiveFilter,
    visibleRefs,
    setFilterChoice,
  };
};
