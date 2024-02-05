import { CatalogProcessor, CatalogProcessorEmit, processingResult } from '@backstage/plugin-catalog-node';
import { LocationSpec } from '@backstage/plugin-catalog-common'
import { Entity, entityKindSchemaValidator, getCompoundEntityRef, parseEntityRef } from '@backstage/catalog-model';
import roleV1alpha1Schema from './schema/Role.v1alpha1.schema.json';
import { RoleV1alpha1} from "./kind/RoleV1alpha1";
import {useApi} from "@backstage/core-plugin-api";
import {catalogApiRef} from "@backstage/plugin-catalog-react";

export class RoleEntitiesProcessor implements CatalogProcessor {

    private readonly validators = [
        entityKindSchemaValidator(roleV1alpha1Schema)
    ];


    getProcessorName(): string {
        return 'RuleEntitiesProcessor'
    }

    async validateEntityKind(entity: Entity): Promise<boolean> {
        for (const validator of this.validators) {
            if (validator(entity)) {
                return true;
            }
        }
        return false;
    }

    async postProcessEntity(
        entity: Entity,
        _location: LocationSpec,
        emit: CatalogProcessorEmit,
    ): Promise<Entity> {


        if (
            entity.apiVersion === 'kartverket.dev/v1alpha1' &&
            entity.kind === 'Role'
        ) {
            const role = entity as RoleV1alpha1;
/*            let group = await catalogApi.getEntities({
                filter: {
                    kind: 'Group',
                    namespace: 'default',
                    'metadata.name': role.spec.group
                }
            }).then((r) => r.items[0])

            if (!group) {
                emit(
                    processingResult.notFoundError(
                        { type: 'Group', target: role.spec.group},
                        `Group ${role.spec.group} not found in the catalog`,
                    ),
                );
            }

            let user = await catalogApi.getEntities({
                filter: {
                    kind: 'User',
                    namespace: 'default',
                    'metadata.name': role.spec.user
                }
            }).then((r) => r.items[0])

            if (!user) {
                emit(
                    processingResult.notFoundError(
                        { type: 'User', target: role.spec.user},
                        `Group ${role.spec.group} not found in the catalog`,
                    ),
                );
            }

            console.log(user)
            console.log(group)*/
            emit(processingResult.relation({
                source:
                    { name: role.spec.group, kind: 'Group', namespace: 'default' },
                type: role.spec.type,
                target: {
                    kind: 'User',
                    namespace: 'default',
                    name: role.spec.user
                }
            }))
            emit(processingResult.relation({
                source:
                    { name: role.metadata.name, kind: 'Role', namespace: 'default' },
                type: 'ownerOf',
                target: {
                    kind: 'User',
                    namespace: 'default',
                    name: role.spec.user
                }
            }))
            emit(processingResult.relation({
                source:
                    { name: role.metadata.name, kind: 'Role', namespace: 'default' },
                type: 'ownedBy',
                target: {
                    kind: 'Group',
                    namespace: 'default',
                    name: role.spec.group
                }
            }))

        }
        return entity;
    }
}

