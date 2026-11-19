import {
  alertApiRef,
  featureFlagsApiRef,
  useApi,
} from '@backstage/core-plugin-api';
import { catalogApiRef, DefaultFilters } from '@backstage/plugin-catalog-react';
import { Button } from '@backstage/ui';
import Box from '@mui/material/Box';
import { useState } from 'react';
import { exportComponentsToJson } from './exportComponentsToJson';

export const CatalogExportFilters = () => {
  const featureFlagsApi = useApi(featureFlagsApiRef);
  const catalogApi = useApi(catalogApiRef);
  const alertApi = useApi(alertApiRef);
  const [exporting, setExporting] = useState(false);

  return (
    <>
      <DefaultFilters initialKind="component" initiallySelectedFilter="owned" />
      {featureFlagsApi.isActive('catalog-export') && (
        <Box mt={2}>
          <Button
            variant="secondary"
            isDisabled={exporting}
            onPress={async () => {
              setExporting(true);
              try {
                await exportComponentsToJson(catalogApi);
              } catch {
                alertApi.post({
                  message:
                    'Could not export catalog components. Please try again.',
                  severity: 'error',
                  display: 'transient',
                });
              } finally {
                setExporting(false);
              }
            }}
          >
            {exporting
              ? 'Exporting components…'
              : 'Export all components (JSON)'}
          </Button>
        </Box>
      )}
    </>
  );
};
