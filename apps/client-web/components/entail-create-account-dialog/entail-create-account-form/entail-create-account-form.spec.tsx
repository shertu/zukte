import {EntailCreateAccountForm} from './entail-create-account-form';
import React from 'react';
import {render} from '@testing-library/react';

describe('EntailCreateAccountForm', () => {
  it('should render successfully', () => {
    const {baseElement} = render(<EntailCreateAccountForm />);
    expect(baseElement).toBeTruthy();
  });
});
