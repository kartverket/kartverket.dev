# Security metrics (backend-plugin)

This is a backend plugin for the Security metrics Backstage plugin. The backend plugin works as a proxy for the frontend
plugin, and allows the system to communicate with the security metrics API. The backend plugin has two roles:

- Handle the on-behalf-of flow to acquire JWT for the backend API
- Provide the user with a scope to aquire the Entra ID JWT that was used to log into backstage

### Kartverket.dev configuration

> **_NOTE:_** Ensure that you have installed
> the [frontend plugin](https://www.npmjs.com/package/@kartverket/backstage-plugin-security-metrics-frontend) aswell
>
> In `app-config.production.yaml` add the following under the `sikkerhetsmetrikker` config-block:

```yaml
clientId: ${SMAPI_CLIENT_ID}
baseUrl: http://sikkerhetsmetrikker.sikkerhetsmetrikker-main:8080/api
```

In `packages/backend/src/index.ts` add the following line in order add the backend plugin:

```typescript
// Security metrics
backend.add(import("@kartverket/backstage-plugin-security-metrics-backend"))
```

and in `packages/backend/package.json` add the following dependency.

```json
"@kartverket/backstage-plugin-security-metrics-backend": "^1.0.0"
```

It may be better to use `yarn add @kartverket/backstage-plugin-security-metrics-backend` from the `packages/backend`
directory

### Links

- [Github repository for both plugins](https://github.com/kartverket/sikkerhetsmetrikker-plugin)
- [Github repository for backend](https://github.com/kartverket/sikkerhetsmetrikker-plugin-backend)
