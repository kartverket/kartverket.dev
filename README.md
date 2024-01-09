# [Backstage](https://backstage.io)

This is your newly scaffolded Backstage App, Good Luck!

## Local dev 

1. Create a personal access token on GitHub with `repo` and `workflow` scopes. Authorize for Kartverket after creation.
2. Create app-config.local.yaml:
```yaml
integrations:
  github:
    - host: github.com
      token: your-token
```
### Persistent sqlite

add this snippet to your app-config.local.yaml

```yaml
backend:
  database:
    client: better-sqlite3
    connection:
      directory: /home/nygmar/Kildekode/utviklerportal/db
```

To start the app, run:

```yaml
```sh
yarn install
yarn dev
```
