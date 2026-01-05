import { Control, Controller, UseFieldArrayRemove } from 'react-hook-form';
import { FieldHeader } from '../FieldHeader';
import TextField from '@mui/material/TextField';
import { formSchema } from '../../../schemas/formSchema';
import z from 'zod/v4';
import { EntityErrors, Kind } from '../../../types/types';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { catalogCreatorTranslationRef } from '../../../utils/translations';
import DeleteIcon from '@mui/icons-material/Delete';

import style from '../../../catalog.module.css';
import { Button, Card, Flex } from '@backstage/ui';

type LinkCardProps = {
  index: number;
  linkIndex: number;
  control: Control<z.infer<typeof formSchema>>;
  errors: EntityErrors<Kind>;
  required?: boolean;
  removeLink: UseFieldArrayRemove;
};

export const LinkCard = ({
  index,
  linkIndex,
  control,
  errors,
  removeLink,
}: LinkCardProps) => {
  return (
    <>
      <Card style={{ padding: '1rem' }}>
        <Flex justify="between">
          <h4>Lenke {linkIndex + 1}</h4>
          <Button
            className={style.deleteEntityButton}
            onClick={() => removeLink(linkIndex)}
          >
            <DeleteIcon />
          </Button>
        </Flex>
        <FieldHeader fieldName="URL" tooltipText="Helper text" />
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

        <FieldHeader fieldName="Title" tooltipText="Helper text" />
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
