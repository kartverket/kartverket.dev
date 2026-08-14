# Bidra til Kartverket.dev

Under finner du alt du trenger for å komme i gang med et lokalt utviklingsmiljø.

## Kom i gang lokalt

```sh
# 1. Aktiver yarn som pakkehåndterer (Node 24 kreves, se «Forutsetninger»)
corepack enable
corepack install

# 2. Installer og start
yarn install --immutable
yarn dev
```

Backstage kjører nå på `http://localhost:3000` (frontend) og
`http://localhost:7007` (backend). Velg en tydelig beskrevet syntetisk persona
på innloggingssiden. Ingen Entra ID-tenant, app-registrering,
GitHub-organisasjon eller andre hemmeligheter er nødvendig.

<br>

## Forutsetninger

### Node

Prosjektet bruker Node v24 (kilden er [`mise.toml`](mise.toml)). Verifiser at riktig versjon er aktiv i repoet:

```sh
node -v
>>> v24.x.x
```

Trenger du å håndtere flere Node-versjoner, er verktøy som [`mise`](https://mise.jdx.dev/), [`nvm`](https://github.com/nvm-sh/nvm) eller `nodenv` fine å bruke.

Aktiver deretter `yarn` som pakkehåndterer via `corepack` (følger med Node). Versjonen leses fra `package.json`.

```sh
corepack enable
corepack install
```

<br>

## Lokal utvikling

Den vanlige utviklingskommandoen laster [`app-config.yaml`](app-config.yaml),
den innsjekkede syntetiske profilen i
[`app-config.development.yaml`](app-config.development.yaml), og til slutt den
gitignorede `app-config.local.yaml` dersom den finnes. Den lokale filen er den
eneste konfigurasjonsfilen en utvikler skal redigere.

Filen kan mangle eller være tom. Standardoppsettet gir:

- Valg mellom sju syntetiske personas som dekker teammedlemskap,
  multiteammedlemskap, produktområde, forretningsenhet, manglende team og
  administrator-/rapporteringstilgang.
- En midlertidig SQLite-database kjører i minnet.
- Katalogen leses fra syntetiske YAML-filer under
  [`examples/local/`](examples/local/).
- Regelrett bruker en lokal, syntetisk adapter uten Microsoft eller en kjørende
  Regelrett-tjeneste. Andre eksterne integrasjoner og backend-plugins som krever
  Entra ID, GitHub, Google eller interne Kartverket-tjenester er deaktivert.

Frontend-rutene er de samme som i produksjon. En deaktivert integrasjon viser en
forklaring og hvilken lokal konfigurasjon som mangler, i stedet for å kalle en
utilgjengelig tjeneste.

Katalogen inneholder representative hierarkier for domener, systemer,
komponenter, API-er, ressurser, funksjoner, grupper og brukere. Dataene er
syntetiske og blir resatt ved omstart.

<br>

## Koble til én ekstern tjeneste

Legg bare konfigurasjonen for tjenesten du trenger i
`app-config.local.yaml`. Integrasjoner som støtter syntetiske svar har en
eksplisitt modus: `disabled`, `synthetic` eller `connected`. Manglende
konfigurasjon velger aldri automatisk syntetiske data.

| Funksjon                | Lokal konfigurasjon                                      |
| ----------------------- | -------------------------------------------------------- |
| Microsoft OAuth         | `auth.providers.microsoft.development` og MSGraph-katalog |
| Google OAuth            | `auth.providers.google.development`                      |
| GitHub OAuth            | `auth.providers.github.development`                      |
| GitHub-integrasjon      | `integrations.github`                                    |
| GitHub-katalog          | `catalog.providers.github`                              |
| Microsoft Graph-katalog | `catalog.providers.microsoftGraphOrg`                   |
| Regelrett               | `regelrett.mode: connected`                             |
| Sikkerhetsmetrikker     | `sikkerhetsmetrikker.mode: connected`                   |
| RiSc                    | `ros.mode: connected`                                   |
| Lighthouse-backend      | `lighthouse.mode: connected`                            |

Microsoft-innlogging krever også Microsoft Graph-katalogen fordi den eksisterende
resolveren må finne den virkelige brukeren i katalogen. Den kan legges til uten
å konfigurere Google eller GitHub:

```yaml
# app-config.local.yaml
auth:
  providers:
    microsoft:
      development:
        tenantId: ${AUTH_MICROSOFT_TENANT_ID}
        clientId: ${AUTH_MICROSOFT_CLIENT_ID}
        clientSecret: ${AUTH_MICROSOFT_CLIENT_SECRET}

catalog:
  providers:
    microsoftGraphOrg:
      default:
        tenantId: ${AUTH_MICROSOFT_TENANT_ID}
        clientId: ${MSGRAPH_CLIENT_ID}
        clientSecret: ${MSGRAPH_CLIENT_SECRET}
        schedule:
          frequency: PT1H
          timeout: PT10M
```

Da viser innloggingssiden både de syntetiske personaene og Microsoft. Fjern de
to Microsoft-seksjonene for å gå tilbake til bare syntetiske personas.

En Entra-autentisert Regelrett-tilkobling er for eksempel eksplisitt:

```yaml
regelrett:
  mode: connected
  authentication: entra
  baseUrl: http://localhost:8080
  url: http://localhost:8080
  clientId: ${REGELRETT_CLIENT_ID}
```

Regelrett står på `synthetic` i utviklingsprofilen. Adapteren tilbyr de samme fire
operasjonene som portalen bruker: skjematyper, oppslag per funksjon, oppslag per
lag og opprettelse. Opprettede skjemaer lever i minnet frem til backend startes
på nytt.

| Tilstand | Slik testes den |
| -------- | --------------- |
| Populert | Logg inn som Kari Knekk og åpne «Fastslå hva som er spiselig» eller Lag Knekk. |
| Tom | Logg inn som Mikkel Mellomlag og åpne «Hjelpe innbyggerne med å finne godsakene». |
| Avvist | Logg inn som Kari Knekk og åpne en funksjon eid av Lag Seig. |
| Tjenestefeil | Logg inn som Mikkel Mellomlag og åpne «Utgi Lørdagsatlaset» eller Lag Skum. |

Skjemalenker er med hensikt ikke klikkbare i syntetisk modus fordi adapteren
simulerer API-kontrakten, ikke Regelretts egen brukerflate. Bytt eksplisitt til
`connected` for å teste den virkelige tjenesten. For andre integrasjoner er
`synthetic` bare tilgjengelig når en tilsvarende adapter er implementert.

Den syntetiske katalogen forblir aktiv når en ekstern tjeneste kobles til. Hvis
en ekstern katalog-provider skal erstatte dummydataene, legg også dette i den
lokale filen:

```yaml
catalog:
  locations: []
```

Bare miljøvariabler som refereres fra `app-config.local.yaml` må være satt.
Start eller restart deretter med `yarn dev`. Ikke bruk produksjonsdata eller
produksjonstilganger når syntetiske data eller en testtjeneste er tilstrekkelig.

<br>

Mer detaljert informasjon om oppsett av spesifikke plugins finnes i deres README-er under [`plugins/`](plugins/).

## Kjøre appen

```sh
yarn install
yarn dev
```

### Utvikle en plugin

Den komplette portalen er foreløpig den autoritative utviklingsverten:

```sh
yarn dev
```

Ikke alle pakker har en fungerende frittstående utviklingsvert selv om de har et
`start`-script. Se
[`docs/architecture/plugin-development-support.md`](docs/architecture/plugin-development-support.md)
før du bruker `yarn start` i en pluginmappe.
