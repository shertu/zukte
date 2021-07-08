import {PostCard} from './post-card';
import React from 'react';
import {render} from '@testing-library/react';

describe('PostCard', () => {
  it('should render successfully', () => {
    const {baseElement} = render(<PostCard />);
    expect(baseElement).toBeTruthy();
  });
});
