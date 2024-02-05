import {Entity} from "@backstage/catalog-model";

export interface RoleV1alpha1 extends Entity {
    apiVersion: 'kartverket.dev/v1alpha1';
    kind: 'Role';
    spec: {
        type: string;
        group: string;
        user: string;
    };
}
