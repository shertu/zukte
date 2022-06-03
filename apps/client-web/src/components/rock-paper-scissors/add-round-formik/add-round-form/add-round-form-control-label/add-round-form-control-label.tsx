import {
  FormControlLabel,
  FormControlLabelProps,
  Radio,
  RadioProps,
} from '@mui/material';

import {NodeAttributes} from 'business';
import React from 'react';
import clsx from 'clsx';

export interface AddRoundFormControlLabelP
  extends Omit<FormControlLabelProps, 'control' | 'label'> {
  attributes: NodeAttributes;
  checked?: RadioProps['checked'];
}

/**
 * A radio form control with an icon for the label.
 */
export function AddRoundFormControlLabel(props: AddRoundFormControlLabelP) {
  const {attributes, checked, ...other} = props;

  const label = attributes.createElement({
    className: clsx(
      'text-[5rem] md:text-[10rem] xl:text-[15rem] border border-solid border-secondary-500',
      {
        'bg-secondary-200': checked,
        'hover:bg-darker': !checked,
      }
    ),
  });

  return (
    <FormControlLabel
      className={clsx('mx-0', props.className)}
      control={<Radio className="hidden" checked={checked} />}
      label={label}
      {...other}
    />
  );
}

export default AddRoundFormControlLabel;
