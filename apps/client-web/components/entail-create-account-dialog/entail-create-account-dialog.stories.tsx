import {
  EntailCreateAccountDialog,
  EntailCreateAccountDialogProps,
} from './entail-create-account-dialog';
import {Meta, Story} from '@storybook/react';

import DateFnsUtils from '@date-io/date-fns';
import {MuiPickersUtilsProvider} from '@material-ui/pickers';
import React from 'react';

const Template: Story<EntailCreateAccountDialogProps> = args => (
  <EntailCreateAccountDialog {...args} open />
);

export const Primary: Story<EntailCreateAccountDialogProps> = Template.bind({});

Primary.args = {};

export default {
  title: 'components/entail-create-account-dialog',
  component: Template,
  decorators: [
    Story => (
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Story />
      </MuiPickersUtilsProvider>
    ),
  ],
} as Meta;
