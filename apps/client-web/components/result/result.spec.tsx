import React from 'react';
import {Result} from './result';
import {render} from '@testing-library/react';

describe('Result', () => {
  it('should render successfully', () => {
    const {baseElement} = render(<Result />);
    expect(baseElement).toBeTruthy();
  });
});
