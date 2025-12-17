import CircularProgress from '@mui/material/CircularProgress';

import style from '../../catalog.module.css';

interface LoadingOverlayProps {
  isDarkTheme: boolean;
}

export const LoadingOverlay = ({ isDarkTheme }: LoadingOverlayProps) => (
  <div
    className={`${style.loadingOverlay} ${isDarkTheme ? style.darkLoadingOverlay : style.lightLoadingOverlay}`}
  >
    <CircularProgress />
  </div>
);
