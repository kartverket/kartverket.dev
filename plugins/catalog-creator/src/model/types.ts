export enum AllowedEntityKinds {
    Component = 'Component',
    API = 'API',
    System = 'System',
    Domain = 'Domain',
    Resource = 'Resource'
};

export enum AllowedLifecycleStages {
    development = 'development',
    production = 'production',
    deprecated = 'deprecated'
};

export enum AllowedEntityTypes {
    service = 'service',
    library = 'library',
    website = 'website'
};

export type CatalogInfoForm = {
    kind: AllowedEntityKinds | null;
    name: string;
    owner: string;
    lifecycle?: AllowedLifecycleStages | null;
    type?: AllowedEntityTypes | null;
    system?: string;
    domain?: string;
    providesApis?: string[];
    consumesApis?: string[];
    dependsOn?: string[];
    definition?: string[];
};

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
        links?: [{
            url: string;
            title: string;
            type: string;
        }];
    }
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
        definition?: string[];
        target?: string;
        [key: string]: any; // Allow additional spec fields
    };
}
