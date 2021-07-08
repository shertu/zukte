import {EntailAppBar} from './entail-app-bar';
import React from 'react';
import {render} from '@testing-library/react';

describe('EntailHeader', () => {
  it('should render successfully', () => {
    const {baseElement} = render(<EntailAppBar />);
    expect(baseElement).toBeTruthy();
  });
});
