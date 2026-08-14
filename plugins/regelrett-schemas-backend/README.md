# regelrett-schemas

Backend-plugin som eksponerer informasjon om eksisterende Regelrett-skjemaer og status på disse til Backstage-frontend.

## Installasjon

Pluginen ligger som `@internal/backstage-plugin-regelrett-schemas-backend`
i dette repoet og er allerede registrert i `packages/backend/src/index.ts`:

```ts
backend.add(import('@internal/backstage-plugin-regelrett-schemas-backend'));
```

## Konfigurasjon

Utviklingsprofilen bruker som standard den syntetiske adapteren:

```yaml
regelrett:
  mode: synthetic
```

Den krever bare en syntetisk Backstage-person. Den bruker de stabile
Graph-kompatible gruppe-ID-ene fra `examples/local/organization.yaml`, tilbyr
skjematyper og representative skjemadata, og lar utvikleren opprette skjemaer i
minnet. Tilstanden tilbakestilles når backend startes på nytt. Den foretar ingen
nettverkskall til Regelrett eller Microsoft.

Adapteren har dokumenterte, deterministiske tilstander for populert, tomt,
avvist og tjenestefeil; se
[`CONTRIBUTING.md`](../../CONTRIBUTING.md#koble-til-én-ekstern-tjeneste).

For å bruke en virkelig Regelrett-instans, overstyr bare Regelrett i den
gitignorede `app-config.local.yaml`-filen:

```yaml
regelrett:
  mode: connected
  authentication: entra
  baseUrl: http://localhost:8080
  url: http://localhost:8080
  clientId: ${REGELRETT_CLIENT_ID}
```

Dette krever at Regelrett-backend kjører lokalt, typisk på
`http://localhost:8080`. Endepunkter som bruker Entra ID-token krever i tillegg
en Microsoft-provider under `auth.providers.microsoft.development` og en
Microsoft Graph-katalog-provider; se
[`CONTRIBUTING.md`](../../CONTRIBUTING.md#koble-til-én-ekstern-tjeneste).

Produksjon bruker fortsatt `mode: connected` og `authentication: entra`.
