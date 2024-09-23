# Contributing to Kartverket.dev

You want to contribute to Kartverket.dev? Awesome! Thanks a lot for the
support :) Here's how you can get started:

## Issues and roadmap

We use GitHub issues to track bugs and feature requests. You can find the
backlog as well as the current roadmap in the following places:

- Project backlog: https://github.com/orgs/kartverket/projects/13/views/1
- Project board: https://github.com/orgs/kartverket/projects/13/views/2
- All issues: https://github.com/kartverket/kartverket.dev/issues

## Local development

To start a local development environment, follow the instructions below.

### prerequisites

1. install [nvm](https://github.com/nvm-sh/nvm)
2. `nvm install 20`
3. `nvm use 20`
4. enable corepack `corepack enable`

### GitHub integration

1. Create a personal access token on GitHub with `repo` and `workflow` scopes. Authorize for Kartverket after creation.
2. Create app-config.local.yaml:

```yaml
integrations:
  github:
    - host: github.com
      token: your-token
```

### Persistent sqlite

1. mkdir db
2. add this snippet to your app-config.local.yaml

```yaml
backend:
  database:
    client: better-sqlite3
    connection:
      directory: /<absolute>/<path>/<to>/<repo>/db
```

### Add local guest user
To `app-config.local.yaml` add: 
```yaml
auth:
  providers:
    guest: {}
```
### Getting user data and orgs

#### Using the anonymized data from Kartverket

```yaml
catalog:
  rules:
    - allow: [Component, API, Location, Resource, Template, Group, User]
  locations:
    - type: file
      target: ../../test_data/org.yaml
```

To refresh the data, delete your local sqlites and sync with microsoft provider following the instructions below.
Then run the script `extract_entities.py` in `/test_data`

#### Using AZ Cli to get org data

Delete the `sqlite` files in the `db` folder before syncing.
For this you need to have the [az cli](https://learn.microsoft.com/en-us/cli/azure/install-azure-cli-linux?pivots=apt) and [microsoft intune](https://learn.microsoft.com/en-us/mem/intune/user-help/microsoft-intune-app-linux) installed.
After setting up intune you can log in to az cli using: `az login --allow-no-subscriptions --scope https://graph.microsoft.com//.default --use-device-code`
You might have to ask IT to enroll your device.
Now you can use the following configuration in `app-config.local.yaml` to get user data from microsoft graph. (it might take 5-10 minutes to sync)

```yaml
catalog:
  providers:
  microsoftGraphOrg:
    default:
      tenantId: 7f74c8a2-43ce-46b2-b0e8-b6306cba73a3
      queryMode: 'advanced'
      user:
        filter: accountEnabled eq true and userType eq 'member'
      group:
        filter: >
          startswith(displayName, 'CLOUD_SK')
      schedule:
        frequency: PT1H
        timeout: PT50M
```

### Testing OAuth locally

We run with azure on kubernetes, but for local testing create your own [github app](https://github.com/settings/developers).    
The end result should be the same, as far as backstage is considered.

In your Oauth Application configure homepage Url to  `http://localhost:3000` and callback url to `http://localhost:7007/api/auth/github/handler/frame`

Configure github auth in `app-config.local.yaml`: 
```yaml
auth:
  environment: development
  providers:
    github:
      development:
        clientId: x
        clientSecret: x
```

To login you NEED to use the anonymized data from Kartverket in `test_data/org.yaml`

Find a user in `test_data/org.yaml` and replace the `annotations.microsoft/email` with your github username.
```yaml
apiVersion: backstage.io/v1alpha1
kind: User
metadata:
  annotations:
    microsoft.com/email: YOUR-GITHUB-USERNAME
  name: Lynn.Villanueva_kartverket.dev
  namespace: default
  uid: 40cdf86d-90a1-44b8-830a-db920aadac82
spec:
  memberOf: []
  profile:
    displayName: Lynn Villanueva
    email: Lynn.Villanueva@kartverket.dev
    picture: https://i.imgur.com/zcal7OY.jpeg
```
### start the app

```sh
yarn install
yarn dev
```

## Plugins

[Linguist](https://github.com/backstage/backstage/tree/master/plugins/linguist) - Plugin to show languages in github repositories
