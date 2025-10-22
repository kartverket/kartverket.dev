import { Flex } from '@backstage/ui';
import { Tooltip } from '@material-ui/core';
import { InfoOutlined } from '@mui/icons-material';

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
    <Flex justify="between" align="center">
      <p
        style={{
          fontSize: '0.75rem',
        }}
      >
        {fieldName}

        {required && (
          <span style={{ color: '#ff0000', fontSize: '1rem' }}>*</span>
        )}
      </p>
      {tooltipText && (
        <Tooltip title={tooltipText} placement="top">
          <div
            style={{
              cursor: 'help',
              color: '#cbcbcbff',
            }}
          >
            <InfoOutlined sx={{ scale: '70%' }} />
          </div>
        </Tooltip>
      )}
    </Flex>
  );
};
