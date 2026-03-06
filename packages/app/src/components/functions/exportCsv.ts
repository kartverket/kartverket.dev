import { FunctionEntityV1alpha1 } from '@internal/plugin-function-kind-common';

function escapeCsvField(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function exportFunctionsToCsv(entities: FunctionEntityV1alpha1[]): void {
  const headers = ['Name', 'Owner', 'Parent', 'Description', 'Criticality'];
  const rows = entities.map(entity => {
    return [
      entity.metadata.name,
      entity.spec.owner ?? '',
      entity.spec.parentFunction ?? '',
      entity.metadata.description ?? '',
      entity.spec.criticality ?? '',
    ].map(escapeCsvField);
  });

  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = 'functions.csv';
  link.click();

  URL.revokeObjectURL(url);
}
