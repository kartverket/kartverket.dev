import { SecurityChamp } from '../types';

type ChampionGroup = Map<string, { champ: SecurityChamp; repositoryNames: string[] }>;

export function exportSecurityChampionsAsCsv(champions: ChampionGroup) {
  const rows = [
    ['security champion', 'repositories'],
    ...[...champions.entries()].map(([email, { repositoryNames }]) => [
      email,
      repositoryNames.join(';'),
    ]),
  ];
  const csv = rows.map(row => row.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8,' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', 'list_of_security_champions.csv');
  link.click();
  URL.revokeObjectURL(url);
}
