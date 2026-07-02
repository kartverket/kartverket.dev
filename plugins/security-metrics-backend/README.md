# Sikkerhetsmetrikker – backend-plugin

`@kartverket/backstage-plugin-security-metrics-backend`

Backend-plugin til Backstage som fungerer som en autentiserende proxy mellom [frontend-pluginen](../security-metrics/README.md) og det eksterne sikkerhetsmetrikker-APIet ([`kartverket/sikkerhetsmetrikker`](https://github.com/kartverket/sikkerhetsmetrikker), Kotlin/Spring Boot).

> Hva pluginen viser, hvorfor arkitekturen ser ut som den gjør og hvordan OBO-flyten fungerer er dokumentert i Confluence under Produkter og *Sikkerhetsmetrikker*. Denne README-en dekker kun oppsett og kjøring.

Pluginen registrerer seg som Backstage-backend-plugin med `pluginId: 'security-metrics'`, og monterer en Express-router på `/api/security-metrics`. Ruter under `/proxy/*` verifiserer det innloggede Backstage-brukeren og veksler brukerens Entra ID-token via [MSAL](https://learn.microsoft.com/entra/identity-platform/v2-oauth2-on-behalf-of-flow) før kallet videresendes.

Router-endepunktene er markert som `allow: 'unauthenticated'` på Backstage-nivå, fordi auth håndteres inne i routeren (`requireBackstageToken`).

## Endepunkter routeren eksponerer

| Metode | Sti (under `/api/security-metrics`)    | Upstream-endepunkt                                     |
| ------ | --------------------------------------- | ------------------------------------------------------- |
| GET    | `/proxy/metrics-update-status/`         | `GET /api/scannerData/{entity}/status`                   |
| POST   | `/proxy/fetch-overview/`                | `POST /api/scannerData/{entity}/overview`                |
| POST   | `/proxy/fetch-components/`              | `POST /api/scannerData/{entity}/components`              |
| POST   | `/proxy/fetch-systems/`                 | `POST /api/scannerData/{entity}/systems`                 |
| POST   | `/proxy/fetch-unique-vulnerabilities/`  | `POST /api/scannerData/{entity}/uniqueVulnerabilities`   |
| GET    | `/proxy/fetch-component-metrics/`       | `GET /api/scannerData/{component}`                       |
| POST   | `/proxy/fetch-owners-metrics/`          | `POST /api/scannerData/{entity}/owners`                  |
| POST   | `/proxy/fetch-trends/`                  | `POST /api/scannerData/{entity}/trends`                  |
| PUT    | `/proxy/change-status-vulnerability/`   | `PUT /api/oppdateringer/alertsMetadata/status`           |
| GET    | `/proxy/configure-notifications/`       | `GET /api/slack/configure-notifications`                 |
| PUT    | `/proxy/configure-notifications/`       | `PUT /api/slack/configure-notifications`                 |

## Feilkoder

Alle feil normaliseres til `{ status: number, code: string, message: string }`:

| `code` | Årsak |
| ------ | ----- |
| `BAD_REQUEST` (400) | Manglende `entityName`/`teamName`/`EntraId`-header e.l. |
| `UNAUTHORIZED` (401) | Ugyldig eller manglende Backstage-token |
| `TOKEN_FETCH_FAILED` (401) | OBO-vekslingen mot Entra ID feilet – sjekk tenant/klient/hemmelighet og admin consent |
| `INVALID_UPSTREAM_ENDPOINT` (500) | Ugyldig sti mot upstream (må stå i allowlisten i `api.service.ts`) |
| `UPSTREAM_REQUEST_FAILED` (503) | Sikkerhetsmetrikker-APIet er ikke tilgjengelig |

## Konfigurasjon

Pluginen leser `auth.providers.microsoft.*` og `sikkerhetsmetrikker.*` fra
`app-config.*.yaml`. Kopier blokk 3 og 5a fra
[`app-config.local.example.yaml`](../../app-config.local.example.yaml) inn i
din `app-config.local.yaml` og fyll inn env-vars:

- `AUTH_MICROSOFT_TENANT_ID`, `AUTH_MICROSOFT_CLIENT_ID`,
  `AUTH_MICROSOFT_CLIENT_SECRET` – Backstages Microsoft-app-registrering.
- `SIKKERHETSMETRIKKER_CLIENT_ID` – app-registreringen som representerer
  sikkerhetsmetrikker-APIet (audience for OBO-tokenet).

Backstages Microsoft-app-registrering må ha admin consent for å be om
scope mot sikkerhetsmetrikker-APIets app-registrering, ellers feiler
OBO-flyten med `TOKEN_FETCH_FAILED`.

For at proxyen skal fungere trenger du:

1. **Sikkerhetsmetrikker-APIet kjørende lokalt** på `http://localhost:8080`. Se [kartverket/sikkerhetsmetrikker](https://github.com/kartverket/sikkerhetsmetrikker) for oppstart, og sett `sikkerhetsmetrikker.baseUrl` i `app-config.local.yaml` deretter.
2. **Gyldig `sikkerhetsmetrikker.clientId`** (app-registreringen som representerer APIet) og en fungerende Microsoft-provider i Backstage.
3. **Bruker logget inn med Microsoft** i frontend, slik at et Entra ID-token kan hentes og sendes med kallet.