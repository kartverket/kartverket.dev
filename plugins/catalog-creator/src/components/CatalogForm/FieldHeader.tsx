import { Flex } from '@backstage/ui';
import { Tooltip } from '@material-ui/core';
import { InfoOutlined } from '@mui/icons-material';

import style from '../../catalog.module.css';

type FieldHeaderProps = {
  fieldName: string;
  tooltipText?: string;
  required?: boolean;
};

export const FieldHeader = ({
  fieldName,
  tooltipText,
  required,
}: FieldHeaderProps) => {
  return (
    <Flex className={style.fieldHeaderContainer}>
      <p className={style.label}>
        {fieldName}

        {required && <span className={style.requiredMark}>*</span>}
        {tooltipText && (
          <Tooltip title={tooltipText} placement="top">
            <div className={style.fieldHeaderTooltip}>
              <InfoOutlined sx={{ scale: '70%' }} />
            </div>
          </Tooltip>
        )}
      </p>
    </Flex>
  );
};
