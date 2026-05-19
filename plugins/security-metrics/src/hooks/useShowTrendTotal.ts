import { useApi, storageApiRef, StorageApi } from '@backstage/core-plugin-api';
import { useEffect, useState } from 'react';

const BUCKET = 'security-metrics-view-settings';

const SHOW_TREND_TOTAL_KEY = 'showTrendTotal';
const SHOW_OPEN_VULNERABILITIES_KEY = 'showOpenVulnerabilities';

const getInitialValue = (storage: StorageApi, key: string) => {
  const snap = storage.snapshot<boolean>(key);
  return snap?.presence === 'present' ? (snap.value ?? false) : false;
};

export const useSecurityMetricsViewSettings = () => {
  const storage = useApi(storageApiRef).forBucket(BUCKET);

  const [showTotal, setShowTotal] = useState<boolean>(() =>
    getInitialValue(storage, SHOW_TREND_TOTAL_KEY),
  );

  const [showOpen, setShowOpen] = useState<boolean>(() =>
    getInitialValue(storage, SHOW_OPEN_VULNERABILITIES_KEY),
  );

  useEffect(() => {
    storage.set<boolean>(SHOW_TREND_TOTAL_KEY, showTotal);
  }, [showTotal, storage]);

  useEffect(() => {
    storage.set<boolean>(SHOW_OPEN_VULNERABILITIES_KEY, showOpen);
  }, [showOpen, storage]);

  return {
    showTotal,
    showOpen,
    toggleShowTotal: (
      _: React.ChangeEvent<HTMLInputElement>,
      checked: boolean,
    ) => setShowTotal(checked),
    toggleShowOpen: (
      _: React.ChangeEvent<HTMLInputElement>,
      checked: boolean,
    ) => setShowOpen(checked),
  };
};
