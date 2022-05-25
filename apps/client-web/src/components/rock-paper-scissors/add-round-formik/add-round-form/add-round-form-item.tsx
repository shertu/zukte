import {AddRoundFormV, fn_ai, fn_items, fn_selection} from './values';
import {
  FormControl,
  FormHelperText,
  Grid,
  RadioGroup,
  Typography,
} from '@mui/material';
import {FormikErrors, FormikProps} from 'formik';
import {GraphExtension, NodeAttributes, NodeSelectionExtension} from 'business';

import {AddRoundFormControlLabel} from './add-round-form-control-label/add-round-form-control-label';
import {NounAiIcon} from 'icons';
import React from 'react';

export interface AddRoundFormItemP {
  formik: FormikProps<AddRoundFormV>;
  graph: GraphExtension;
  useAdvancedView?: boolean;
  selection: NodeSelectionExtension;
  index: number;
}

/**
/**
 * The main content of each list element in the form.
 */
export function AddRoundFormItem(props: AddRoundFormItemP) {
  const {formik, graph, useAdvancedView = false, selection, index} = props;

  const [aiNodeValue] = React.useState<string>(
    'c632c78d-3d46-4e54-aa85-1c81c57a27d0'
  );

  const aiNodeAttributes: NodeAttributes = {
    createElement: p => <NounAiIcon {...p} />,
  };

  const rgValue: string = selection.useAiSelection
    ? aiNodeValue
    : selection.value;

  /**
   * Used to hook a {@link ScoredNodeSelection.useAiSelection} setter into the default handler.
   */
  function onChangeRadioGroup(
    event: React.ChangeEvent<HTMLInputElement>,
    value: string
  ): void {
    // default event handler
    formik.handleChange(event);

    // hook
    formik.setFieldValue(
      `${fn_items}.${index}.${fn_ai}`,
      value === aiNodeValue
    );
  }

  const vTouched = formik.touched.items?.at(index);
  const vErrors = formik.errors.items?.at(index) as
    | FormikErrors<NodeSelectionExtension>
    | undefined;

  const valueError: string | undefined = vErrors?.value;
  // console.log(formik.errors, vErrors, valueError);

  return (
    <FormControl component="fieldset" fullWidth>
      <RadioGroup
        row
        name={`${fn_items}.${index}.${fn_selection}`}
        value={rgValue}
        onChange={onChangeRadioGroup}
        onBlur={formik.handleBlur}
        className="p-[6px]"
      >
        <Grid container spacing={3} justifyContent="center">
          {useAdvancedView && (
            <>
              <Grid item xs={4} className="text-center">
                <AddRoundFormControlLabel
                  value={aiNodeValue}
                  attributes={aiNodeAttributes}
                  checked={rgValue === aiNodeValue}
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
                checked={rgValue === node}
              />
            </Grid>
          ))}
        </Grid>
      </RadioGroup>

      <FormHelperText error={!!vTouched && !!valueError}>
        {!!vTouched && valueError}
      </FormHelperText>
    </FormControl>
  );
}

export default AddRoundFormItem;
