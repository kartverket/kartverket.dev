import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import Alert from '@mui/material/Alert';
import Link from '@mui/material/Link';
import { catalogCreatorTranslationRef } from '../../utils/translations';

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
    <>
      {hasExistingCatalogFile &&
        !(hasError || isLoading || repoStateError) &&
        showForm && (
          <Alert sx={{ mx: 2 }} severity="info">
            {t('form.infoAlerts.alreadyExists')}
          </Alert>
        )}

      {shouldCreateNewFile && !(hasError || isLoading || repoStateError) && (
        <Alert sx={{ mx: 2 }} severity="info">
          {t('form.infoAlerts.doesNotExist')}
        </Alert>
      )}

      {existingPrUrl && !isLoading && (
        <Alert sx={{ mx: 2 }} severity="error">
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

      {analysisError && (
        <Alert sx={{ mx: 2 }} severity="error">
          {analysisError.message}
        </Alert>
      )}

      {repoStateError && (
        <Alert sx={{ mx: 2 }} severity="error">
          {repoStateErrorMessage}
        </Alert>
      )}

      {repoInfoError && (
        <Alert sx={{ mx: 2 }} severity="error">
          {repoInfoError.message}
        </Alert>
      )}

      {catalogInfoError && (
        <Alert sx={{ mx: 2 }} severity="error">
          {catalogInfoError.message}
        </Alert>
      )}
    </>
  );
};
