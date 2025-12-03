import { useApi, storageApiRef } from '@backstage/core-plugin-api';
import { useEffect, useMemo, useState } from 'react';
import { FilterEnum } from '../typesFrontend';

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

  const starredRefs = useMemo(
    () => allRefs.filter(ref => starredEntities.has(ref)),
    [allRefs, starredEntities],
  );

  const hasStarred = starredRefs.length > 0;

  const getInitialFilter = (): FilterEnum => {
    const snap = storage.snapshot<FilterEnum>(storageKey);

    if (snap?.presence === 'present' && snap.value) {
      return snap.value;
    }

    return 'all';
  };

  const [filterChoice, setFilterChoice] =
    useState<FilterEnum>(getInitialFilter);

  const effectiveFilter: FilterEnum =
    hasStarred && filterChoice === 'starred' ? 'starred' : 'all';

  const visibleRefs = useMemo(
    () => new Set(effectiveFilter === 'starred' ? starredRefs : allRefs),
    [effectiveFilter, allRefs, starredRefs],
  );

  useEffect(() => {
    storage.set<FilterEnum>(storageKey, filterChoice);
  }, [filterChoice, storage, storageKey]);

  return {
    hasStarred,
    effectiveFilter,
    visibleRefs,
    setFilterChoice,
  };
};
