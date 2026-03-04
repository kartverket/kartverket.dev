import { useState, useRef, useEffect } from 'react';
import { Button, Flex, Select } from '@backstage/ui';
import { Progress } from '@backstage/core-components';
import Alert from '@mui/material/Alert';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { functionLinkCardTranslationRef } from '../FunctionSecurityFormsCard/translation';
import { useRegelrettCreateContextMutation } from '../../hooks/useRegelrettCreateContextMutation';

interface SelectOption {
  value: string;
  label: string;
}

interface CreateFormSectionProps {
  /** Options for the primary select (form type) */
  formTypeOptions: SelectOption[];
  /** Optional secondary select (e.g. function selector) shown before the form type select */
  secondarySelect?: {
    placeholder: string;
    options: SelectOption[];
    /** Called when the secondary selection changes; parent can use this to update formTypeOptions */
    onChange: (value: string) => void;
  };
  /** Called to build the mutation params when submitting */
  onBuildMutationParams: (
    formId: string,
    secondaryValue?: string,
  ) => { functionName: string; formId: string; teamId: string } | undefined;
  /** Called after a successful form creation */
  onSuccess: () => void;
  /** Optional custom label for the create button */
  createButtonLabel?: string;
}

export function CreateFormSection({
  formTypeOptions,
  secondarySelect,
  onBuildMutationParams,
  onSuccess,
  createButtonLabel,
}: CreateFormSectionProps) {
  const { t } = useTranslationRef(functionLinkCardTranslationRef);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedFormId, setSelectedFormId] = useState('');
  const [secondaryValue, setSecondaryValue] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const successTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    return () => clearTimeout(successTimeoutRef.current);
  }, []);

  const {
    mutate,
    isPending: isCreating,
    error: createError,
  } = useRegelrettCreateContextMutation();

  const handleSubmit = () => {
    const params = onBuildMutationParams(selectedFormId, secondaryValue);
    if (!params) return;

    mutate(params, {
      onSuccess: () => {
        onSuccess();
        setSelectedFormId('');
        setSecondaryValue('');
        setShowCreateForm(false);
        setShowSuccessMessage(true);
        successTimeoutRef.current = setTimeout(
          () => setShowSuccessMessage(false),
          2000,
        );
      },
    });
  };

  const handleSecondaryChange = (value: string) => {
    setSecondaryValue(value);
    setSelectedFormId('');
    secondarySelect?.onChange(value);
  };

  const isSubmitDisabled =
    !selectedFormId || isCreating || (secondarySelect && !secondaryValue);

  return (
    <div style={{ marginTop: '1rem' }}>
      {showSuccessMessage && (
        <Alert severity="success" style={{ margin: '1rem' }}>
          {t('groupFormCard.formCreatedSuccess')}
        </Alert>
      )}

      {!showCreateForm && (
        <Button onClick={() => setShowCreateForm(true)}>
          {createButtonLabel ?? t('groupFormCard.createNewForm')}
        </Button>
      )}

      {showCreateForm && (
        <Flex style={{ marginTop: '5px', gap: '8px', flexWrap: 'wrap' }}>
          {secondarySelect && (
            <Select
              style={{ flex: 1, minWidth: 0 }}
              placeholder={secondarySelect.placeholder}
              value={secondaryValue}
              isDisabled={isCreating}
              options={secondarySelect.options}
              onChange={key => handleSecondaryChange(key as string)}
            />
          )}

          {formTypeOptions.length === 0 &&
          (!secondarySelect || secondaryValue) ? (
            <Alert severity="info" style={{ flex: 1 }}>
              {t('groupFormCard.allFormsCreated')}
            </Alert>
          ) : (
            <>
              <Select
                style={{ flex: 1, minWidth: 0 }}
                placeholder={t('groupFormCard.selectForm')}
                value={selectedFormId}
                isDisabled={
                  isCreating || (!!secondarySelect && !secondaryValue)
                }
                options={formTypeOptions}
                onChange={key => setSelectedFormId(key as string)}
              />

              <Button
                variant="primary"
                isDisabled={!!isSubmitDisabled}
                onClick={handleSubmit}
              >
                {isCreating
                  ? t('groupFormCard.creating')
                  : t('groupFormCard.create')}
              </Button>
            </>
          )}

          <Button
            variant="secondary"
            isDisabled={isCreating}
            onClick={() => {
              setShowCreateForm(false);
              setSelectedFormId('');
              setSecondaryValue('');
            }}
          >
            {t('groupFormCard.cancel')}
          </Button>
        </Flex>
      )}

      {isCreating && <Progress />}

      {createError && (
        <Alert severity="error" style={{ margin: '1rem 0 0' }}>
          {t('groupFormCard.createError')}
        </Alert>
      )}
    </div>
  );
}
