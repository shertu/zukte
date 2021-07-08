import {Meta, Story} from '@storybook/react';
import {PostCard, PostCardProps} from './post-card';

import React from 'react';

const Template: Story<PostCardProps> = args => <PostCard {...args} />;

export const Primary: Story<PostCardProps> = Template.bind({});

Primary.args = {
  avatarSrc:
    'https://ipfs.io/ipfs/QmacXWQ4dQUppVMiGj6Gt6VyUjrVzF3suyRkSJNpB5VEfm',
  title: 'Mane Bitch',
  handle: 'Lio',
  description:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Adipiscing neque et sed feugiat.',
};

export default {
  title: 'components/post-card',
  component: Template,
} as Meta;
