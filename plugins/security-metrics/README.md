# Sikkerhetsmetrikker – frontend-plugin

`@kartverket/backstage-plugin-security-metrics-frontend`

Frontend-plugin som legger fanen **«Sikkerhetsmetrikker»** på entiteter i Backstage-katalogen. Visualiserer sikkerhetsmetrikker-data som hentes fra det eksterne sikkerhetsmetrikker-APIet ([`kartverket/sikkerhetsmetrikker`](https://github.com/kartverket/sikkerhetsmetrikker).

> Hvorfor denne pluginen finnes og hvordan OBO-flyten (On-Behalf-Of) fungerer i detalj er dokumentert i Confluence under Produkter og *Sikkerhetsmetrikker*. Denne README-en dekker kun oppsett og kjøring.

## Avhengigheter

- Backend-pluginen `@kartverket/backstage-plugin-security-metrics-backend` må være konfigurert i `packages/backend`.
- Microsoft-innlogging må være aktivert i Backstage (`auth.providers.microsoft.*`) – se root-repoets `CONTRIBUTING.md`.
- Det eksterne sikkerhetsmetrikker-APIet ([`kartverket/sikkerhetsmetrikker`](https://github.com/kartverket/sikkerhetsmetrikker)) må være tilgjengelig for Backstage-backenden.
## Konfigurasjon

Ingen egen konfigurasjon utover det Backstage har fra før:

- `backend.baseUrl` brukes til å bygge URLen til proxy-endepunktene.
- `auth.providers.microsoft.*` må være aktivert for at brukeren skal kunne hente et Entra ID-token.
  Nøklene under `sikkerhetsmetrikker.*` leses av backend-pluginen, se [dens README](../security-metrics-backend/README.md).

For at fanen skal vise data må i tillegg dette være på plass:

1. Sikkerhetsmetrikker-APIet kjører lokalt, som standard på `http://localhost:8080` – se `sikkerhetsmetrikker.baseUrl` i `app-config.local.yaml`. Oppstart er dekket i [kartverket/sikkerhetsmetrikker](https://github.com/kartverket/sikkerhetsmetrikker).
2. Du er logget inn i Backstage med Microsoft-kontoen din.