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

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { Link } from '@backstage/core-components';
import { IconComponent } from '@backstage/core-plugin-api';

const SvgIconWrapper = styled('div')({
  display: 'inline-block',
  '& svg': {
    display: 'inline-block',
    fontSize: 'inherit',
    verticalAlign: 'baseline',
  },
});

export function IconLink(props: {
  href: string;
  text?: string;
  Icon?: IconComponent;
}) {
  const { href, text, Icon } = props;

  return (
    <Box display="flex">
      {Icon && (
        <Box mr={1}>
          <SvgIconWrapper>
            <Typography component="div">
              <Icon />
            </Typography>
          </SvgIconWrapper>
        </Box>
      )}
      <Box flexGrow="1">
        <Link to={href} target="_blank" rel="noopener">
          {text || href}
        </Link>
      </Box>
    </Box>
  );
}
