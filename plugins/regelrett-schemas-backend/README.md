# regelrett-schemas

Backend-plugin som eksponerer informasjon om eksisterende Regelrett-skjemaer og status på disse til Backstage-frontend.

## Installasjon

Pluginen ligger som `@internal/backstage-plugin-regelrett-schemas-backend`
i dette repoet og er allerede registrert i `packages/backend/src/index.ts`:

```ts
backend.add(import('@internal/backstage-plugin-regelrett-schemas-backend'));
```

## Konfigurasjon

Pluginen leser `regelrett.*` fra `app-config.*.yaml`. Kopier blokk 5b fra
[`app-config.local.example.yaml`](../../app-config.local.example.yaml) inn i
din `app-config.local.yaml` og fyll inn `REGELRETT_CLIENT_ID`. Krever at
regelrett-backend kjører lokalt (typisk på `http://localhost:8080`).

