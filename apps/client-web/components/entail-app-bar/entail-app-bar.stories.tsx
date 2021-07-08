import {EntailAppBar, EntailAppBarProps} from './entail-app-bar';
import {Meta, Story} from '@storybook/react';

import React from 'react';

const Template: Story<EntailAppBarProps> = args => <EntailAppBar {...args} />;

export const Primary: Story<EntailAppBarProps> = Template.bind({});

Primary.args = {
  // size: 'medium',
};

export default {
  title: 'components/entail-app-bar',
  component: Template,
} as Meta;
