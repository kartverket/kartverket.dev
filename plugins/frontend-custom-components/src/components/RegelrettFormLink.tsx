import { PropsWithChildren } from 'react';
import { Link } from '@backstage/core-components';
import { configApiRef, useApi } from '@backstage/frontend-plugin-api';
import { buildFormUrl } from '../utils/formUrl';

export function RegelrettFormLink({
  contextId,
  children,
}: PropsWithChildren<{ contextId: string }>) {
  const config = useApi(configApiRef);
  if (config.getString('regelrett.mode') === 'synthetic') {
    return <span title="Syntetisk Regelrett-skjema">{children}</span>;
  }

  return (
    <Link
      to={buildFormUrl(config.getString('regelrett.url'), contextId)}
      target="_blank"
      rel="noopener"
    >
      {children}
    </Link>
  );
}
