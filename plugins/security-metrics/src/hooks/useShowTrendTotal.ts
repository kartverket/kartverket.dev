import { useApi, storageApiRef } from '@backstage/core-plugin-api';
import { useEffect, useState } from 'react';

const BUCKET = 'security-metrics-view-settings';
const KEY = 'showTrendTotal';

export const useShowTrendTotal = () => {
  const storage = useApi(storageApiRef).forBucket(BUCKET);

  const [showTotal, setShowTotal] = useState<boolean>(() => {
    const snap = storage.snapshot<boolean>(KEY);
    return snap?.presence === 'present' ? (snap.value ?? false) : false;
  });

  useEffect(() => {
    storage.set<boolean>(KEY, showTotal);
  }, [showTotal, storage]);

  return { showTotal, toggleShowTotal: () => setShowTotal(prev => !prev) };
};
