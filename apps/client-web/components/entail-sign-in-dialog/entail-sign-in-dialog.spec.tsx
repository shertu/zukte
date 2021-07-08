import {EntailSignInDialog} from './entail-sign-in-dialog';
import React from 'react';
import {render} from '@testing-library/react';

describe('EntailCreateAccountDialog', () => {
  it('should render successfully', () => {
    const {baseElement} = render(<EntailSignInDialog open />);
    expect(baseElement).toBeTruthy();
  });
});
