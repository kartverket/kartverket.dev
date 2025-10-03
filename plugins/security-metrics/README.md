# Security metrics (frontend-plugin)

This is a frontend plugin for the Security Metrics Backstage plugin. It gives an overview of security-metrics delivered
by scanners on repositories owned by kartverket. The plugin is dependent on a associated backend-plugin for Backstage
and a separate kotlin/spring-boot backend. The package should be added in the `packages/app`directory

> **_NOTE:_** Ensure that you have installed and configured the backend plugin as
> well: [@kartverket/backstage-plugin-security-metrics-backend](https://www.npmjs.com/package/@kartverket)

### kartverket.dev configuration

To show the tab introduced by the plugin, add the following component to the needed pages in `EntityPage.tsx`.

```typescript
<EntityLayout.Route path="/securityMetrics" title="Sikkerhetsmetrikker">
    <SecurityMetricsPage />
</EntityLayout.Route>
```

### Links

- [Github repository for both plugins](https://github.com/kartverket/sikkerhetsmetrikker-plugin)

- [Github repository for backend](https://github.com/kartverket/sikkerhetsmetrikker-plugin-backend)
