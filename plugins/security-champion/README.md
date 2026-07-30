# Security champion plugin

A simple card for viewing and updating the security champion on Backstage entities.

This security champion plugin displays the security champion of a Backstage component in the Kartverket.dev developer portal and enables changing the security champion from within Backstage. The plugin enables a logged in user to search through users in the catalog by email and set a user as security champion. The plugin is dependent on the [Security Champion API](https://github.com/kartverket/security-champion-api).

## Run the plugin
The security champion plugin is a frontend Backstage plugin, which means React components can be imported directly into the pages where they are used. To connect to the Security Champion API locally, ensure the proxy endpoint is configured under `proxy.endpoints` (it already exists in `app-config.yaml`, and can be overridden in `app-config.local.yaml` if needed):

    proxy:
      endpoints:
        '/security-champion-proxy':
          target: http://localhost:8080
          changeOrigin: true

Kartverket.dev is set up using microsoft authentication, and authentication is necessary for the plugin to attach a valid backstage token to the proxy API. Assuming this is in order, the application can be run using `yarn install` followed by `yarn dev`.
