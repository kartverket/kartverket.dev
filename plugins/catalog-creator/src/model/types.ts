import { Control, FieldErrors } from 'react-hook-form';
import z from 'zod/v4';
import { entitySchema, formSchema } from '../schemas/formSchema';

export enum AllowedEntityKinds {
  Component = 'Component',
  API = 'API',
  Template = 'Template',
  System = 'System',
  Domain = 'Domain',
  Resource = 'Resource',
}

export enum ComponentTypes {
  website = 'website',
  library = 'library',
  service = 'service',
}

export enum ApiTypes {
  openapi = 'openapi',
  asyncapi = 'asyncapi',
  graphql = 'graphql',
  grpc = 'grpc',
}

export enum SystemTypes {
  product = 'product',
  service = 'service',
  featureset = 'feature-set',
}

const Kinds = {
  API: 'API',
  Component: 'Component',
  System: 'System',
} as const;

export type Kind = (typeof Kinds)[keyof typeof Kinds];

export enum AllowedLifecycleStages {
  development = 'development',
  production = 'production',
  deprecated = 'deprecated',
}

export type Status = {
  message: string;
  severity: 'error' | 'success' | 'warning' | 'info';
  prUrl?: string;
};

export type FormEntity = z.infer<typeof entitySchema>;

export type RequiredYamlFields = {
  apiVersion: 'backstage.io/v1alpha1';
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
          $text: string | undefined;
        }
      | string;
    target?: string;
    [key: string]: any; // Allow additional spec fields
  };
};

export type FormProps = {
  index: number;
  control: Control<z.infer<typeof formSchema>>;
  errors: FieldErrors<z.infer<typeof formSchema>>;
};

type entity = z.infer<typeof entitySchema>;

type ExtractEntity<T extends z.infer<typeof entitySchema>['kind']> = Extract<
  entity,
  { kind: T }
>;

export type EntityErrors<T extends entity['kind']> = FieldErrors<
  ExtractEntity<T>
>;
