import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import Alert from '@mui/material/Alert';
import Link from '@mui/material/Link';
import { catalogCreatorTranslationRef } from '../../utils/translations';
import { Box } from '@backstage/ui';

interface StatusMessagesProps {
  hasExistingCatalogFile: boolean;
  shouldCreateNewFile: boolean;
  hasError: boolean;
  isLoading: boolean;
  repoStateError: boolean;
  showForm: boolean;
  existingPrUrl?: string;
  analysisError?: Error;
  repoStateErrorMessage?: string;
  repoInfoError?: Error;
  catalogInfoError?: Error;
}

export const StatusMessages = ({
  hasExistingCatalogFile,
  shouldCreateNewFile,
  hasError,
  isLoading,
  repoStateError,
  showForm,
  existingPrUrl,
  analysisError,
  repoStateErrorMessage,
  repoInfoError,
  catalogInfoError,
}: StatusMessagesProps) => {
  const { t } = useTranslationRef(catalogCreatorTranslationRef);
  return (
    <Box px="2rem">
      {hasExistingCatalogFile &&
        !(hasError || isLoading || repoStateError) &&
        showForm && (
          <Alert severity="info">{t('form.infoAlerts.alreadyExists')}</Alert>
        )}

      {shouldCreateNewFile && !(hasError || isLoading || repoStateError) && (
        <Alert severity="info">{t('form.infoAlerts.doesNotExist')}</Alert>
      )}

      {existingPrUrl && !isLoading && (
        <Alert severity="error">
          {t('form.knownErrorAlerts.PRExists')}:{' '}
          <Link
            href={existingPrUrl}
            sx={{ fontWeight: 'normal' }}
            target="_blank"
            rel="noopener noreferrer"
          >
            {existingPrUrl}
          </Link>
        </Alert>
      )}

      {analysisError && <Alert severity="error">{analysisError.message}</Alert>}

      {repoStateError && (
        <Alert severity="error">{repoStateErrorMessage}</Alert>
      )}

      {repoInfoError && <Alert severity="error">{repoInfoError.message}</Alert>}

      {catalogInfoError && (
        <Alert severity="error">{catalogInfoError.message}</Alert>
      )}
    </Box>
  );
};
