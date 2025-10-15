import { useEntity } from '@backstage/plugin-catalog-react';
import { SecurityChampion } from './SecurityChampion';
import { ErrorBanner } from './ErrorBanner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export const SecurityChampionCard = () => {
  const { entity } = useEntity();
  let componentNames;

  if (entity.kind === 'System') {
    componentNames = entity.relations
      ?.filter(rel => {
        return rel.targetRef.startsWith('component');
      })
      .map(rel => rel.targetRef.split('/')[1]) as string[];
  } else if (entity.kind === 'Component') {
    componentNames = [entity.metadata.name];
  }

  if (!componentNames)
    return <ErrorBanner errorMessage="Kunne ikke hente Security Champion" />;

  return (
    <QueryClientProvider client={queryClient}>
      <SecurityChampion repositoryNames={componentNames} />
    </QueryClientProvider>
  );
};
