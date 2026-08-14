import {
  ApiError,
  Context,
  ContextWithMetrics,
  Form,
  RegelrettRequestIdentity,
  RegelrettService,
  Result,
} from '../types';

export const syntheticTeamIds = {
  knekk: '00000000-0000-4000-8000-000000000004',
  seig: '00000000-0000-4000-8000-000000000005',
  skum: '00000000-0000-4000-8000-000000000008',
} as const;

const forms: Form[] = [
  { id: 'synthetic-ros', name: 'Syntetisk ROS-analyse' },
  { id: 'synthetic-privacy', name: 'Syntetisk personvernvurdering' },
  { id: 'synthetic-readiness', name: 'Syntetisk produksjonsklarering' },
];

const initialContexts: ContextWithMetrics[] = [
  {
    id: '00000000-0000-4000-a000-000000000001',
    teamId: syntheticTeamIds.knekk,
    formId: 'synthetic-ros',
    name: 'Fastslå hva som er spiselig',
    answeredCount: 6,
    expiredCount: 1,
    totalCount: 8,
  },
  {
    id: '00000000-0000-4000-a000-000000000002',
    teamId: syntheticTeamIds.knekk,
    formId: 'synthetic-privacy',
    name: 'Kartlegge sjokolade, skum og gelé',
    answeredCount: 5,
    expiredCount: 0,
    totalCount: 5,
  },
  {
    id: '00000000-0000-4000-a000-000000000003',
    teamId: syntheticTeamIds.knekk,
    formId: 'synthetic-readiness',
    name: 'Lag Knekk sin syntetiske årsrapport',
    answeredCount: 3,
    expiredCount: 0,
    totalCount: 7,
  },
  {
    id: '00000000-0000-4000-a000-000000000004',
    teamId: syntheticTeamIds.seig,
    formId: 'synthetic-ros',
    name: 'Finne den siste favorittbiten',
    answeredCount: 2,
    expiredCount: 2,
    totalCount: 8,
  },
];

const functionOwnerTeamIds: Record<string, string> = {
  'Fastslå hva som er spiselig': syntheticTeamIds.knekk,
  'Kartlegge sjokolade, skum og gelé': syntheticTeamIds.knekk,
  'Finne den siste favorittbiten': syntheticTeamIds.seig,
  'Hjelpe innbyggerne med å finne godsakene': syntheticTeamIds.skum,
  'Utgi Lørdagsatlaset': syntheticTeamIds.skum,
};

const groupTeamIds: Record<string, readonly string[]> = {
  'group:default/lag-knekk': [syntheticTeamIds.knekk],
  'group:default/lag-seig': [syntheticTeamIds.seig],
  'group:default/lag-skum': [syntheticTeamIds.skum],
  'group:default/spiselig-eiendom': [
    syntheticTeamIds.knekk,
    syntheticTeamIds.seig,
  ],
  'group:default/sjokolade-og-fast-eiendom': [
    syntheticTeamIds.knekk,
    syntheticTeamIds.seig,
  ],
  'group:default/godteriverket': Object.values(syntheticTeamIds),
};

const failureFunctionName = 'Utgi Lørdagsatlaset';

const error = (
  statusCode: number,
  message: string,
): Result<ApiError, never> => ({
  ok: false,
  error: { statusCode, message },
});

export class SyntheticRegelrettService implements RegelrettService {
  private contexts = initialContexts.map(context => ({ ...context }));
  private nextContextNumber = initialContexts.length + 1;

  async fetchContextByFunctionName(
    identity: RegelrettRequestIdentity,
    name: string,
  ): Promise<Result<ApiError, ContextWithMetrics[]>> {
    const ownerTeamId = functionOwnerTeamIds[name];
    if (ownerTeamId && !this.canAccessTeam(identity, ownerTeamId)) {
      return error(403, 'Den syntetiske personen har ikke tilgang til laget');
    }
    if (name === failureFunctionName) {
      return error(503, 'Syntetisk Regelrett-feil for testing');
    }

    const contexts = this.contexts
      .filter(context => context.name === name)
      .filter(context => this.canAccessTeam(identity, context.teamId))
      .map(context => ({ ...context }));
    return { ok: true, data: contexts };
  }

  async createRegelrettContext(
    identity: RegelrettRequestIdentity,
    name: string,
    formId: string,
    teamId: string,
  ): Promise<Result<ApiError, Context>> {
    if (!this.canAccessTeam(identity, teamId)) {
      return error(403, 'Den syntetiske personen har ikke tilgang til laget');
    }
    if (name === failureFunctionName) {
      return error(503, 'Syntetisk Regelrett-feil for testing');
    }
    if (!forms.some(form => form.id === formId)) {
      return error(400, `Ukjent syntetisk skjematype '${formId}'`);
    }
    if (
      this.contexts.some(
        context =>
          context.name === name &&
          context.formId === formId &&
          context.teamId === teamId,
      )
    ) {
      return error(409, 'Skjemaet finnes allerede i syntetisk Regelrett');
    }

    const context: ContextWithMetrics = {
      id: `00000000-0000-4000-a000-${String(this.nextContextNumber).padStart(12, '0')}`,
      teamId,
      formId,
      name,
      answeredCount: 0,
      expiredCount: 0,
      totalCount: 6,
    };
    this.nextContextNumber += 1;
    this.contexts.push(context);
    return { ok: true, data: { id: context.id, teamId, formId, name } };
  }

  async fetchForms(
    _identity: RegelrettRequestIdentity,
  ): Promise<Result<ApiError, Form[]>> {
    return { ok: true, data: forms.map(form => ({ ...form })) };
  }

  async fetchContextByTeamId(
    identity: RegelrettRequestIdentity,
    teamId: string,
  ): Promise<Result<ApiError, ContextWithMetrics[]>> {
    if (!this.canAccessTeam(identity, teamId)) {
      return error(403, 'Den syntetiske personen har ikke tilgang til laget');
    }
    if (teamId === syntheticTeamIds.skum) {
      return error(503, 'Syntetisk Regelrett-feil for testing');
    }

    return {
      ok: true,
      data: this.contexts
        .filter(context => context.teamId === teamId)
        .map(context => ({ ...context })),
    };
  }

  private canAccessTeam(
    identity: RegelrettRequestIdentity,
    teamId: string,
  ): boolean {
    return identity.ownershipEntityRefs.some(ref =>
      groupTeamIds[ref.toLowerCase()]?.includes(teamId),
    );
  }
}
