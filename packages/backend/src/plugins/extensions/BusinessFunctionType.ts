export type BusinessFunction = {
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
    parentFunction?: string;
    childFunctions?: string[];
    systems?: string[];
    [key: string]: any; // Allow additional spec fields
  };
};
