/*
 * Copyright 2020 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { useElementFilter } from '@backstage/core-plugin-api';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { ReactNode } from 'react';

const ValueTypography = styled(Typography)({
  fontWeight: 'bold',
  overflow: 'hidden',
  lineHeight: '24px',
  wordBreak: 'break-word',
});

const LabelTypography = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  textTransform: 'uppercase',
  fontSize: '10px',
  fontWeight: 'bold',
  letterSpacing: 0.5,
  overflow: 'hidden',
  whiteSpace: 'nowrap',
}));

/**
 * Props for {@link AboutField}.
 *
 * @public
 */
export interface AboutFieldProps {
  label: string;
  value?: string;
  gridSizes?: Record<string, number>;
  children?: ReactNode;
  className?: string;
}

/** @public */
export function AboutField(props: AboutFieldProps) {
  const { label, value, gridSizes, children, className } = props;

  const childElements = useElementFilter(children, c => c.getElements());

  // Content is either children or a string prop `value`
  const content =
    childElements.length > 0 ? (
      childElements
    ) : (
      <ValueTypography variant="body2">{value || `unknown`}</ValueTypography>
    );
  return (
    <Grid size={gridSizes} className={className}>
      <LabelTypography variant="h2">{label}</LabelTypography>
      {content}
    </Grid>
  );
}
