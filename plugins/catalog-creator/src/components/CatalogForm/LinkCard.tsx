import { Control, Controller, UseFieldArrayRemove } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import z from 'zod/v4';
import DeleteIcon from '@mui/icons-material/Delete';

import style from '../../catalog.module.css';
import { Button, Card, Flex } from '@backstage/ui';
import { formSchema } from '../../schemas/formSchema';
import { EntityErrors } from '../../types/types';
import { FieldHeader } from './FieldHeader';
import { catalogCreatorTranslationRef } from '../../utils/translations';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';

type LinkCardProps = {
  index: number;
  linkIndex: number;
  control: Control<z.infer<typeof formSchema>>;
  errors: EntityErrors<'Function'>;
  required?: boolean;
  removeLink: UseFieldArrayRemove;
};

export const LinkCard = ({
  index,
  linkIndex,
  control,
  removeLink,
}: LinkCardProps) => {
  const { t } = useTranslationRef(catalogCreatorTranslationRef);
  return (
    <>
      <Card className={style.linkCard}>
        <Flex justify="between">
          <h4>
            {t('form.functionForm.links.cardTitle')} {linkIndex + 1}
          </h4>
          <Button
            className={style.deleteEntityButton}
            onClick={() => removeLink(linkIndex)}
          >
            <DeleteIcon />
          </Button>
        </Flex>
        <FieldHeader
          fieldName={t('form.functionForm.links.urlName')}
          tooltipText={t('form.functionForm.links.urlTooltipText')}
        />
        <Controller
          name={`entities.${index}.links.${linkIndex}.url`}
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              name="url"
              fullWidth
              size="small"
              inputProps={{
                className: style.textField,
              }}
            />
          )}
        />

        <FieldHeader
          fieldName={t('form.functionForm.links.titleName')}
          tooltipText={t('form.functionForm.links.titleTooltipText')}
        />
        <Controller
          name={`entities.${index}.links.${linkIndex}.title`}
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              name="title"
              fullWidth
              size="small"
              inputProps={{
                className: style.textField,
              }}
            />
          )}
        />
      </Card>
    </>
  );
};
