import {CatalogBuilder } from '@backstage/plugin-catalog-backend';
import { ScaffolderEntitiesProcessor } from '@backstage/plugin-catalog-backend-module-scaffolder-entity-model';
import { Router } from 'express';
import { PluginEnvironment } from '../types';
import { GithubEntityProvider } from '@backstage/plugin-catalog-backend-module-github';
import { MicrosoftGraphOrgEntityProvider } from '@backstage/plugin-catalog-backend-module-msgraph';
import {msGraphGroupTransformer} from "./transformers/msGraphTransformer";
import {SecurityChampionGroupProcessor} from "./processors/securitychampion";

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  const builder = await CatalogBuilder.create(env);
  builder.addProcessor(new ScaffolderEntitiesProcessor());
  builder.addEntityProvider(
      GithubEntityProvider.fromConfig(env.config, {
        logger: env.logger,
        scheduler: env.scheduler,
      }),
  );
  builder.addEntityProvider(
      MicrosoftGraphOrgEntityProvider.fromConfig(env.config, {
          logger: env.logger,
          scheduler: env.scheduler,
          groupTransformer: msGraphGroupTransformer,
      }),
  );
  builder.addProcessor(new SecurityChampionGroupProcessor(env.config))
  const { processingEngine, router } = await builder.build();
  await processingEngine.start();
  return router;
}
