import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { catalogCreatorTranslationRef } from '../../utils/translations';
import { Text } from '@backstage/ui';
import style from '../../catalog.module.css';

export const EntityDescription = ({ entityKind }: { entityKind: string }) => {
  const { t } = useTranslationRef(catalogCreatorTranslationRef);

  switch (entityKind) {
    case 'Component':
      return (
        <Text className={style.entityText}>
          {t('formInfo.componentParagraph')}
        </Text>
      );
    case 'API':
      return (
        <div>
          <Text className={style.entityText}>
            {t('formInfo.APIParagraph')}{' '}
          </Text>

          <Text className={style.entityText}>{t('formInfo.APIremark')}</Text>
        </div>
      );
    case 'System':
      return (
        <Text className={style.entityText}>
          {t('formInfo.systemParagraph')}
        </Text>
      );
    case 'Resource':
      return (
        <Text className={style.entityText}>
          {t('formInfo.resourceParagraph')}
        </Text>
      );
    case 'Function':
      return (
        <Text className={style.entityText}>
          {t('formInfo.functionParagraph')}
        </Text>
      );
    case 'Domain':
      return (
        <Text className={style.entityText}>
          {t('formInfo.domainParagraph')}
        </Text>
      );
    default:
      return <></>;
  }
};
