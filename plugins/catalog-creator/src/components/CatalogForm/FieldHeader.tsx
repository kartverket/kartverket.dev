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
    <Flex justify="start" align="center">
      <p
        style={{
          fontSize: '0.75rem',
          margin: 0,
          display: 'inline-flex',
          alignItems: 'center',
        }}
      >
        {fieldName}

        {required && (
          <span style={{ color: '#ff0000', fontSize: '1rem' }}>*</span>
        )}
        {tooltipText && (
          <Tooltip title={tooltipText} placement="top">
            <div
              style={{
                cursor: 'help',
                color: '#cbcbcbff',
                display: 'flex',
                marginBottom: '0.1rem',
              }}
            >
              <InfoOutlined sx={{ scale: '70%' }} />
            </div>
          </Tooltip>
        )}
      </p>
    </Flex>
  );
};
