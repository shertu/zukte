import {Meta, Story} from '@storybook/react';
import {Result, ResultProps} from './result';

import {Button} from '@material-ui/core';
import React from 'react';

const Template: Story<ResultProps> = args => <Result {...args} />;

export const Success: Story<ResultProps> = Template.bind({});
export const HttpStatus404: Story<ResultProps> = Template.bind({});
export const HttpStatus500: Story<ResultProps> = Template.bind({});

Success.args = {
  status: 'success',
  title: 'Successfully Purchased Cloud Server ECS!',
  subTitle:
    'Order number: 2017182818828182881 Cloud server configuration takes 1-5 minutes, please wait.',
  extra: (
    <Button key="console" variant="contained" color="primary">
      Go Console
    </Button>
  ),
};

HttpStatus404.args = {
  status: '404',
  title: '404',
  subTitle: 'Sorry, the page you visited does not exist.',
  extra: (
    <Button variant="contained" color="primary">
      Back Home
    </Button>
  ),
};

HttpStatus500.args = {
  status: '500',
  title: '500',
  subTitle: 'Sorry, something went wrong.',
  extra: (
    <Button variant="contained" color="primary">
      Back Home
    </Button>
  ),
};

export default {
  title: 'components/result',
  component: Template,
} as Meta;
