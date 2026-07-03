# Bidra til Kartverket.dev

Under finner du alt du trenger for å komme i gang med et lokalt utviklingsmiljø.

## Kom i gang lokalt

```sh
# 1. Aktiver yarn som pakkehåndterer (Node 24 kreves, se «Forutsetninger»)
corepack enable
corepack install

# 2. Kopier eksempel-konfigurasjonen og fyll inn env-vars
cp app-config.local.example.yaml app-config.local.yaml
# Se «Lokal konfigurasjon»

# 3. Installer og start
yarn install
yarn dev
```

Backstage kjører nå på `http://localhost:3000` (frontend) og
`http://localhost:7007` (backend).

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

## Lokal konfigurasjon

All lokal konfigurasjon ligger i [`app-config.local.example.yaml`](app-config.local.example.yaml).
Kopier den til `app-config.local.yaml` (gitignored via `*.local.yaml`) og
fyll inn de aktuelle miljøvariablene.

<br>

## Sett opp auth-providers

Backstage bruker tre OAuth-providere lokalt:

| Provider  | Kreves for                                                            |
| --------- |-----------------------------------------------------------------------|
| Microsoft | Innlogging + Entra-avhengige plugins (kreves alltid)                  |
| GitHub    | catalog-creator (hente catalog-info) og RiSc (lese/skrive til GitHub) |
| Google    | RiSc (tilgangsstyring)                                                |

<br>

Mer detaljert informasjon om oppsett av spesifikke plugins finnes i deres README-er under [`plugins/`](plugins/).

## Kjøre appen

```sh
yarn install
yarn dev
```

### Kjøre en enkelt plugin isolert

Alle plugins under [`plugins/`](plugins/) eksponerer `yarn start`
([`backstage-cli package start`](https://backstage.io/docs/local-dev/cli-commands#package-start)),
som gir et minimalt oppsett uten resten av Backstage-appen. Praktisk når
du utvikler på selve pluginen:

```sh
cd plugins/<plugin-navn>
yarn start
```

