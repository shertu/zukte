import {Meta, Story} from '@storybook/react';
import {ShowPasswordInput, ShowPasswordInputProps} from './show-password-input';

import React from 'react';

const Template: Story<ShowPasswordInputProps> = args => (
  <ShowPasswordInput {...args} value="password" />
);

export const hidden: Story<ShowPasswordInputProps> = Template.bind({});

hidden.args = {};

export const shown: Story<ShowPasswordInputProps> = Template.bind({});

shown.args = {
  showPassword: true,
};

export default {
  title: 'components/show-password-input',
  component: Template,
} as Meta;
