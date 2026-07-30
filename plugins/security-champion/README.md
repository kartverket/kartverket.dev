# Security champion plugin

A simple card displaying user profiles at group, system and component view.

This security champion plugin displays the security champion of a backstage component in the Kartverket.dev developer portal and enables changing the security champion from within backstage. The plugin enables a loged in user to search through users in the catalog by email and set a user as security champion. The plugin is dependent on the [Security Champion API](https://github.com/kartverket/security-champion-api).

## Run the plugin
 The security champion plugin is a frontend backstage plugin implying that react components can be imported directly into the pages they are used. In order for the frontend to connect to the Security Champion API, running locally, a local proxy address must be defined in app-config.local.yaml:

```yaml
'/security-champion-proxy':
    target: http://localhost:8080
```

Kartverket.dev is set up using microsoft authentication, and authentication is necessary for the plugin to attach a valid backstage token to the proxy API. Assuming this is in order, the application can be run using `yarn install` followed by `yarn dev`.
