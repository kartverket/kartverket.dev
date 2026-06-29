// Prevent from running more than once (due to worker threads)
const { isMainThread } = require('node:worker_threads');

if (isMainThread) {
  const { NodeSDK } = require('@opentelemetry/sdk-node');
  const {
    getNodeAutoInstrumentations,
  } = require('@opentelemetry/auto-instrumentations-node');
  const { PrometheusExporter } = require('@opentelemetry/exporter-prometheus');

  // Exposes Prometheus metrics on localhost:9464/metrics for scraping.
  const prometheusExporter = new PrometheusExporter();

  // Traces are exported via OTLP/gRPC only when an endpoint is configured
  const tracingEnabled = Boolean(process.env.OTEL_EXPORTER_OTLP_ENDPOINT);
  let traceExporter;
  if (tracingEnabled) {
    const {
      OTLPTraceExporter,
    } = require('@opentelemetry/exporter-trace-otlp-grpc');
    traceExporter = new OTLPTraceExporter();
  }

  const sdk = new NodeSDK({
    metricReader: prometheusExporter,
    ...(traceExporter ? { traceExporter } : {}),
    instrumentations: [getNodeAutoInstrumentations()],
  });

  sdk.start();
}
