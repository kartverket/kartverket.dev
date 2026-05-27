import { useState, useRef, useEffect } from 'react';
import { Button, Flex, TextField } from '@backstage/ui';
import FormControl from '@mui/material/FormControl';
import MuiSelect, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { Progress } from '@backstage/core-components';
import Alert from '@mui/material/Alert';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { functionLinkCardTranslationRef } from '../FunctionSecurityFormsCard/translation';
import { useRegelrettCreateContextMutation } from '../../hooks/useRegelrettCreateContextMutation';
import type { RegelrettApiError } from '../../hooks/useRegelrettCreateContextMutation';

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
    contextName?: string,
  ) => { functionName: string; formId: string; teamId: string } | undefined;
  /** Called after a successful form creation */
  onSuccess: () => void;
  /** Optional custom label for the create button */
  createButtonLabel?: string;
  includeNameField?: boolean;
}

export function CreateFormSection({
  formTypeOptions,
  secondarySelect,
  onBuildMutationParams,
  onSuccess,
  createButtonLabel,
  includeNameField,
}: CreateFormSectionProps) {
  const { t } = useTranslationRef(functionLinkCardTranslationRef);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedFormId, setSelectedFormId] = useState('');
  const [contextName, setContextName] = useState('');
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
    const params = onBuildMutationParams(selectedFormId, secondaryValue, contextName);
    if (!params) return;

    mutate(params, {
      onSuccess: () => {
        onSuccess();
        setSelectedFormId('');
        setSecondaryValue('');
        setContextName('');
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
    !selectedFormId ||
    isCreating ||
    (secondarySelect && !secondaryValue) ||
    (includeNameField && !contextName.trim());

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
            <FormControl size="small" style={{ flex: 1, minWidth: 0 }}>
              <MuiSelect
                displayEmpty
                value={secondaryValue}
                disabled={isCreating}
                sx={{ fontSize: 'var(--bui-font-size-3)' }}
                onChange={(e: SelectChangeEvent<string>) =>
                  handleSecondaryChange(e.target.value)
                }
              >
                <MenuItem
                  value=""
                  disabled
                  sx={{ fontSize: 'var(--bui-font-size-3)' }}
                >
                  <span style={{ color: 'inherit', opacity: 0.5 }}>
                    {secondarySelect.placeholder}
                  </span>
                </MenuItem>
                {secondarySelect.options.map(opt => (
                  <MenuItem
                    key={opt.value}
                    value={opt.value}
                    sx={{ fontSize: 'var(--bui-font-size-3)' }}
                  >
                    {opt.label}
                  </MenuItem>
                ))}
              </MuiSelect>
            </FormControl>
          )}

          {formTypeOptions.length === 0 &&
          (!secondarySelect || secondaryValue) ? (
            <Alert severity="info" style={{ flex: 1 }}>
              {t('groupFormCard.allFormsCreated')}
            </Alert>
          ) : (
            <>
              <FormControl
                size="small"
                style={{ flex: 1, minWidth: 0 }}
                disabled={isCreating || (!!secondarySelect && !secondaryValue)}
              >
                <MuiSelect
                  displayEmpty
                  value={selectedFormId}
                  sx={{ fontSize: 'var(--bui-font-size-3)' }}
                  onChange={(e: SelectChangeEvent<string>) =>
                    setSelectedFormId(e.target.value)
                  }
                >
                  <MenuItem
                    value=""
                    disabled
                    sx={{ fontSize: 'var(--bui-font-size-3)' }}
                  >
                    <span style={{ color: 'inherit', opacity: 0.5 }}>
                      {t('groupFormCard.selectForm')}
                    </span>
                  </MenuItem>
                  {formTypeOptions.map(opt => (
                    <MenuItem
                      key={opt.value}
                      value={opt.value}
                      sx={{ fontSize: 'var(--bui-font-size-3)' }}
                    >
                      {opt.label}
                    </MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>

              {includeNameField && (
                <div style={{ flex: 1, minWidth: 0 }}>
                  <TextField
                    size="small"
                    placeholder={t('groupFormCard.name')}
                    name="contextName"
                    value={contextName}
                    isDisabled={isCreating}
                    onChange={e => setContextName(e)}
                  />
                </div>
              )}

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
              setContextName('');
            }}
          >
            {t('groupFormCard.cancel')}
          </Button>
        </Flex>
      )}

      {isCreating && <Progress />}

      {createError && (
        <Alert severity="error" style={{ margin: '1rem 0 0' }}>
          {(createError as RegelrettApiError).status === 409
            ? t('groupFormCard.createConflictError')
            : t('groupFormCard.createError')}
        </Alert>
      )}
    </div>
  );
}
