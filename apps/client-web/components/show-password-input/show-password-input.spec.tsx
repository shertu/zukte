import React from 'react';
import {ShowPasswordInput} from './show-password-input';
import {render} from '@testing-library/react';

describe('ShowPasswordInput', () => {
  it('should render successfully', () => {
    const {baseElement} = render(<ShowPasswordInput />);
    expect(baseElement).toBeTruthy();
  });
});
