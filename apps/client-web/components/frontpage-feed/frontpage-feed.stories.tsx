import {Meta, Story} from '@storybook/react';

import {FrontPageFeed} from './frontpage-feed';
import React from 'react';

const Template: Story = args => <FrontPageFeed {...args} />;

export const Primary: Story = Template.bind({});

Primary.args = {
  // size: 'medium',
};

export default {
  title: 'components/frontpage-feed',
  component: Template,
} as Meta;
