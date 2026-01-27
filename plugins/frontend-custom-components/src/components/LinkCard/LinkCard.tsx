import { InfoCard } from '@backstage/core-components';
import Link from '@mui/material/Link';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

export interface LinkCardProps {
  title: string;
  link: string;
  linkTitle?: string;
}

export const LinkCard = ({ title, link, linkTitle }: LinkCardProps) => {
  return (
    <InfoCard title={title}>
      <Link href={link} target="_blank" rel="noreferrer">
        {linkTitle ?? link}
        <OpenInNewIcon fontSize="inherit" />
      </Link>
    </InfoCard>
  );
};
