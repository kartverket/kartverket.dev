import { FieldErrors } from 'react-hook-form';
import z from 'zod/v4';
import { entitySchema } from '../schemas/formSchema';

export const AllowedEntityKinds = {
  Component: 'Component',
  API: 'API',
  System: 'System',
  Domain: 'Domain',
  Resource: 'Resource',
} as const;

export type AllowedEntityKind =
  (typeof AllowedEntityKinds)[keyof typeof AllowedEntityKinds];

export const ComponentTypes = {
  website: 'website',
  library: 'library',
  service: 'service',
  ops: 'ops',
  documentation: 'documentation',
  job: 'job',
} as const;

export type ComponentType =
  (typeof ComponentTypes)[keyof typeof ComponentTypes];

export const ApiTypes = {
  openapi: 'openapi',
  asyncapi: 'asyncapi',
  graphql: 'graphql',
  grpc: 'grpc',
  wsdl: 'wsdl',
} as const;

export type ApiType = (typeof ApiTypes)[keyof typeof ApiTypes];

export const SystemTypes = {
  product: 'product',
  service: 'service',
  featureset: 'feature-set',
} as const;

export type SystemType = (typeof SystemTypes)[keyof typeof SystemTypes];

export const ResourceTypes = {
  database: 'database',
  s3bucket: 's3-bucket',
  kubernetescluster: 'kubernetes-cluster',
} as const;

export type ResourceType = (typeof ResourceTypes)[keyof typeof ResourceTypes];

export const DomainTypes = {
  productarea: 'product-area',
  productgroup: 'product-group',
  bundle: 'bundle',
} as const;

export type DomainType = (typeof DomainTypes)[keyof typeof DomainTypes];

export const FunctionCriticalityLevels = {
  low: 'Lav',
  medium: 'Middels',
  high: 'Høy',
} as const;

export type FunctionCriticalityLevel =
  (typeof FunctionCriticalityLevels)[keyof typeof FunctionCriticalityLevels];

export const Kinds = {
  API: 'API',
  Component: 'Component',
  System: 'System',
  Resource: 'Resource',
  Domain: 'Domain',
  Template: 'Template',
  Group: 'Group',
  User: 'User',
  Location: 'Location',
  Function: 'Function',
} as const;

export type Kind = (typeof Kinds)[keyof typeof Kinds];

export const AllowedLifecycleStages = {
  experimental: 'experimental',
  production: 'production',
  deprecated: 'deprecated',
} as const;

export type AllowedLifecycleStage =
  (typeof AllowedLifecycleStages)[keyof typeof AllowedLifecycleStages];

export type Status = {
  message: string;
  severity: 'error' | 'success' | 'warning' | 'info';
  prUrl?: string;
};

export type FormEntity = z.infer<typeof entitySchema>;

export type RequiredYamlFields = {
  apiVersion: string;
  kind: string;
  metadata: {
    name: string;
    title?: string;
    description?: string;
    namespace?: string;
    tags?: string[];
    labels?: Record<string, string>;
    annotations?: Record<string, string>;
    links?: [
      {
        url: string;
        title: string;
        type?: string;
      },
    ];
  };
  spec: {
    owner?: string;
    lifecycle?: string;
    type?: string;
    system?: string;
    domain?: string;
    providesApis?: string[];
    consumesApis?: string[];
    dependsOn?: string[];
    implementsApis?: string[];
    definition?:
      | {
          $text?: string | undefined;
          $openapi?: string | undefined;
          $graphql?: string | undefined;
          $asyncapi?: string | undefined;
        }
      | string;
    targets?: string[];
    dependencyOf?: string[];
    [key: string]: any; // Allow additional spec fields
  };
};

type entity = z.infer<typeof entitySchema>;

type ExtractEntity<T extends z.infer<typeof entitySchema>['kind']> = Extract<
  entity,
  { kind: T }
>;

export type EntityErrors<T extends entity['kind']> = FieldErrors<
  ExtractEntity<T>
>;
