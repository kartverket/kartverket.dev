import CircularProgress from '@mui/material/CircularProgress';

interface LoadingOverlayProps {
  isDarkTheme: boolean;
}

export const LoadingOverlay = ({ isDarkTheme }: LoadingOverlayProps) => (
  <div
    style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: isDarkTheme
        ? 'rgba(118, 118, 118, 0.4)'
        : 'rgba(255, 255, 255, 0.7)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1,
    }}
  >
    <CircularProgress />
  </div>
);
