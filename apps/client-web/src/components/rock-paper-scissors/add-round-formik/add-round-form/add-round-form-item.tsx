import {
  AI_NODE_ATTR,
  AI_NODE_VALUE,
  AddRoundFormV,
  fnSelections,
} from './values';
import {ErrorMessage, FormikProps} from 'formik';
import {
  FormControl,
  FormHelperText,
  Grid,
  RadioGroup,
  Typography,
} from '@mui/material';

import {AddRoundFormControlLabel} from './add-round-form-control-label/add-round-form-control-label';
import {GraphExtension} from 'business';
import React from 'react';

export interface AddRoundFormItemP {
  formik: FormikProps<AddRoundFormV>;
  graph: GraphExtension;
  useAdvancedView?: boolean;
  index: number;
}

/**
 * The content of a singular selection.
 */
export function AddRoundFormItem(props: AddRoundFormItemP) {
  const {formik, graph, useAdvancedView = false, index} = props;
  const radioGroupValue: string = formik.values.selections[index].value;

  return (
    <FormControl component="fieldset" fullWidth>
      <RadioGroup
        row
        name={`${fnSelections}.${index}.value`}
        value={radioGroupValue}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        className="p-[6px]"
      >
        <Grid container spacing={3} justifyContent="center">
          {useAdvancedView && (
            <>
              <Grid item xs={4} className="text-center">
                <AddRoundFormControlLabel
                  value={AI_NODE_VALUE}
                  attributes={AI_NODE_ATTR}
                  checked={radioGroupValue === AI_NODE_VALUE}
                />
              </Grid>

              <Grid item xs={12} className="text-center">
                <Typography className="font-bold">or</Typography>
              </Grid>
            </>
          )}

          {graph.mapNodes<JSX.Element>((node, attr) => (
            <Grid item key={node} xs={4} className="text-center">
              <AddRoundFormControlLabel
                value={node}
                attributes={attr}
                checked={radioGroupValue === node}
              />
            </Grid>
          ))}
        </Grid>
      </RadioGroup>

      <FormHelperText error={true}>
        <ErrorMessage name={`${fnSelections}.${index}.value`} />
      </FormHelperText>
    </FormControl>
  );
}

export default AddRoundFormItem;
