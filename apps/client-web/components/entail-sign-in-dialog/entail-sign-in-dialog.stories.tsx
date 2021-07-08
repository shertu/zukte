import {
  EntailSignInDialog,
  EntailSignInDialogProps,
} from './entail-sign-in-dialog';
import {Meta, Story} from '@storybook/react';

import DateFnsUtils from '@date-io/date-fns';
import {MuiPickersUtilsProvider} from '@material-ui/pickers';
import React from 'react';

const Template: Story<EntailSignInDialogProps> = args => (
  <EntailSignInDialog {...args} open />
);

export const Primary: Story<EntailSignInDialogProps> = Template.bind({});

Primary.args = {};

export default {
  title: 'components/entail-sign-in-dialog',
  component: Template,
  decorators: [
    Story => (
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Story />
      </MuiPickersUtilsProvider>
    ),
  ],
} as Meta;
