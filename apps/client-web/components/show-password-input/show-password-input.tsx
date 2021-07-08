import {EyeIcon, EyeOffIcon} from '@iconicicons/react';
import {IconButton, Input, InputAdornment, InputProps} from '@material-ui/core';

import React from 'react';

export interface ShowPasswordInputProps
  extends Omit<InputProps, 'type' | 'endAdornment'> {
  showPassword?: boolean;
  onClickEyeIcon?: React.MouseEventHandler<HTMLButtonElement>;
}

/** A password input component with an eye adornment to show or hide the password input value.*/
export function ShowPasswordInput(props: ShowPasswordInputProps) {
  const [showPassword_, setShowPassword_] = React.useState<boolean>(false);

  const {
    showPassword = showPassword_,
    onClickEyeIcon = () => setShowPassword_(!showPassword),
  } = props;

  const endAdornment = (
    <InputAdornment position="end">
      <IconButton
        aria-label="toggle password visibility"
        onClick={onClickEyeIcon}
      >
        {showPassword ? <EyeIcon /> : <EyeOffIcon />}
      </IconButton>
    </InputAdornment>
  );

  return (
    <Input
      {...props}
      type={showPassword ? 'text' : 'password'}
      endAdornment={endAdornment}
    />
  );
}

export default ShowPasswordInput;
