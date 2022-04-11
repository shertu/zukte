import {MenuItem, Select, SelectProps} from '@mui/material';

import React from 'react';
import {codes as getCurrencyCodes} from 'currency-codes';

/**
 * A {@link Select} component for ISO 4217 currency codes.
 */
export function CurrencySelect(props: SelectProps<string>) {
  const [codes] = React.useState(getCurrencyCodes());

  return (
    <Select {...props}>
      {codes.map(code => (
        <MenuItem key={code} value={code}>
          {code}
        </MenuItem>
      ))}
    </Select>
  );
}

export default CurrencySelect;
