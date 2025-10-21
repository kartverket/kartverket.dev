import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

interface ErrorBannerProps {
  errorTitle?: string;
  errorMessage?: string;
}

export const ErrorBanner = ({
  errorTitle,
  errorMessage = 'En uventet feil oppsto. Vennligst prøv igjen senere.',
}: ErrorBannerProps) => (
  <Alert severity="error">
    {errorTitle && <AlertTitle>{errorTitle}</AlertTitle>}
    {errorMessage}
  </Alert>
);
