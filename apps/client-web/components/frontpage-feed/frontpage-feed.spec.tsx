import {FrontPageFeed} from './frontpage-feed';
import React from 'react';
import {render} from '@testing-library/react';

describe('FrontPageFeed', () => {
  it('should render successfully', () => {
    const {baseElement} = render(<FrontPageFeed />);
    expect(baseElement).toBeTruthy();
  });
});
