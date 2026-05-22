export const regelrettKeys = {
  all: ['regelrett'] as const,
  forms: () => [...regelrettKeys.all, 'forms'] as const,
  form: (functionName: string) =>
    [...regelrettKeys.forms(), functionName] as const,
  formsByTeam: (teamId: string) =>
    [...regelrettKeys.all, 'formsByTeam', teamId] as const,
  formTypes: () => [...regelrettKeys.all, 'formTypes'] as const,
};

export const groupKeys = {
  all: ['group'] as const,
  membership: (groupRef: string) =>
    [...groupKeys.all, 'membership', groupRef] as const,
};
