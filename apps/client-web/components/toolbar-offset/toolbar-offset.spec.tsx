import React from 'react';
import {ToolbarOffset} from './toolbar-offset';
import {render} from '@testing-library/react';

describe('ToolbarOffset', () => {
  it('should render successfully', () => {
    const {baseElement} = render(<ToolbarOffset />);
    expect(baseElement).toBeTruthy();
  });
});
