import {EntailCreateAccountDialog} from './entail-create-account-dialog';
import React from 'react';
import {render} from '@testing-library/react';

describe('EntailCreateAccountDialog', () => {
  it('should render successfully', () => {
    const {baseElement} = render(<EntailCreateAccountDialog open />);
    expect(baseElement).toBeTruthy();
  });
});
