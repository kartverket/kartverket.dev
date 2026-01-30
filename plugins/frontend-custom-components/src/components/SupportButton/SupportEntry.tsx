import { Card, CardHeader, Flex, Text } from '@backstage/ui';
import { ReactElement } from 'react';
import Link from '@mui/material/Link';

type SupportEntryProps = {
  label: string;
  url: string;
  description: string;
  icon: ReactElement;
};

const SupportEntry = (props: SupportEntryProps) => {
  return (
    <Card>
      <CardHeader>
        <Flex align="center">
          {props.icon}
          <Flex direction="column" gap="0">
            <Text weight="bold">{props.label}</Text>
            <Link href={props.url} target="_blank">
              {props.description}
            </Link>
          </Flex>
        </Flex>
      </CardHeader>
    </Card>
  );
};

export default SupportEntry;
