import { EmptyState } from '@backstage/core-components';
import { configApiRef, useApi } from '@backstage/core-plugin-api';
import { PropsWithChildren } from 'react';

type IntegrationBoundaryProps = PropsWithChildren<{
  configKey: string;
  title: string;
  syntheticAvailable?: boolean;
}>;

export const IntegrationUnavailableState = ({
  configKey,
  title,
  mode,
}: {
  configKey: string;
  title: string;
  mode?: string;
}) => {
  let description = `${title} has no valid integration mode. Configure '${configKey}.mode' as disabled, synthetic, or connected.`;
  if (mode === 'synthetic') {
    description = `The synthetic ${title} adapter is not available yet. Set '${configKey}.mode' to 'connected' with the required non-production settings, or leave it disabled.`;
  } else if (mode === 'disabled') {
    description = `${title} is intentionally disabled in this profile. Set '${configKey}.mode' to 'connected' in app-config.local.yaml and add only the required non-production settings.`;
  }

  return (
    <EmptyState
      missing="info"
      title={`${title} is not configured`}
      description={description}
    />
  );
};

export const IntegrationBoundary = ({
  children,
  configKey,
  title,
  syntheticAvailable = false,
}: IntegrationBoundaryProps) => {
  const configApi = useApi(configApiRef);
  const mode = configApi.getOptionalString(`${configKey}.mode`);

  if (mode === 'connected' || (mode === 'synthetic' && syntheticAvailable)) {
    return <>{children}</>;
  }

  return (
    <IntegrationUnavailableState
      configKey={configKey}
      title={title}
      mode={mode}
    />
  );
};
