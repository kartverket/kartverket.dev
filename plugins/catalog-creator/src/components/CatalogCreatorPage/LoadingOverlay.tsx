import CircularProgress from '@mui/material/CircularProgress';

import style from '../../catalog.module.css';

type LoadingOverlayProps = {
  isDarkTheme: boolean;
};

export const LoadingOverlay = ({ isDarkTheme }: LoadingOverlayProps) => (
  <div
    className={`${style.loadingOverlay} ${isDarkTheme ? style.darkLoadingOverlay : style.lightLoadingOverlay}`}
    aria-live="polite"
    role="status"
  >
    <CircularProgress />
  </div>
);
