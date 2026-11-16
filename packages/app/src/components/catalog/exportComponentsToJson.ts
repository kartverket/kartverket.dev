import type { CatalogApi } from '@backstage/plugin-catalog-react';
import type { Entity } from '@backstage/catalog-model';

export async function exportComponentsToJson(
  catalogApi: CatalogApi,
): Promise<void> {
  const components: Entity[] = [];
  for await (const page of catalogApi.streamEntities({
    filter: { kind: 'component' },
  })) {
    components.push(...page);
  }

  const url = URL.createObjectURL(
    new Blob([JSON.stringify(components, null, 2)], {
      type: 'application/json',
    }),
  );
  const link = document.createElement('a');
  try {
    link.href = url;
    link.download = 'catalog-components.json';
    document.body.appendChild(link);
    link.click();
  } finally {
    link.remove();
    URL.revokeObjectURL(url);
  }
}
