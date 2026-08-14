export const teamIdsForRegelrettFormsQuery = ({
  regelrettMode,
  teamIds,
}: {
  regelrettMode?: string;
  teamIds: string[];
}): string[] => {
  if (regelrettMode !== 'connected' && regelrettMode !== 'synthetic') {
    return [];
  }

  return teamIds;
};
