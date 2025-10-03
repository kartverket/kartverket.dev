import { useEntity } from '@backstage/plugin-catalog-react';
import { ErrorBanner } from './components/ErrorBanner';
import { SystemPage } from './components/Views/SystemPage';
import { SingleComponentPage } from './components/Views/SingleComponentPage';
import { GroupPage } from './components/Views/GroupPage';

enum ViewType {
  GROUP = 'Group',
  SYSTEM = 'System',
  COMPONENT = 'Component',
}

export const MetricsPlugin = () => {
  const { entity } = useEntity();

  switch (entity.kind) {
    case ViewType.GROUP:
      return <GroupPage />;

    case ViewType.SYSTEM:
      return <SystemPage />;

    case ViewType.COMPONENT:
      return <SingleComponentPage />;

    default:
      return <ErrorBanner />;
  }
};
