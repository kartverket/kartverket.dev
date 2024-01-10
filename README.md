# [Backstage](https://backstage.io)

This is your newly scaffolded Backstage App, Good Luck!

## Local dev 

### prerequisites
1. install [nvm](https://github.com/nvm-sh/nvm)
2. `nvm install 18`
3. `nvm use 18`

#### GitHub integration
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

### start the app

```sh
yarn install
yarn dev
```


## Plugins
[Linguist](https://github.com/backstage/backstage/tree/master/plugins/linguist) - Plugin to show languages in github repositories