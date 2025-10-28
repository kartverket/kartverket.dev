import Alert from '@mui/material/Alert';
import Link from '@mui/material/Link';

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
}: StatusMessagesProps) => (
  <>
    {hasExistingCatalogFile &&
      !(hasError || isLoading || repoStateError) &&
      showForm && (
        <Alert sx={{ mx: 2 }} severity="info">
          Catalog-info.yaml already exists. Editing existing file.
        </Alert>
      )}

    {shouldCreateNewFile && !(hasError || isLoading || repoStateError) && (
      <Alert sx={{ mx: 2 }} severity="info">
        Catalog-info.yaml does not exist. Creating a new file.
      </Alert>
    )}

    {existingPrUrl && !isLoading && (
      <Alert sx={{ mx: 2 }} severity="error">
        There already exists a pull request:{' '}
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