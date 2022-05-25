import {Button, FormControl, List, ListItem} from '@mui/material';
import {GraphExtension, NodeSelectionExtension} from 'business';

import {AddRoundFormItem} from './add-round-form-item';
import {AddRoundFormV} from './values';
import {FormikProps} from 'formik';
import React from 'react';

export interface AddRoundFormP extends FormikProps<AddRoundFormV> {
  graph: GraphExtension;
  useAdvancedView?: boolean;
}

/**
 * The underlying form component.
 */
export function AddRoundForm(props: AddRoundFormP) {
  const {
    values,
    isSubmitting,
    handleSubmit,
    useAdvancedView = false,
    graph,
  } = props;

  // hide AI selections in advanced view mode
  let items: NodeSelectionExtension[] = values.items;
  if (!useAdvancedView) {
    items = values.items.filter(({useAiSelection = false}) => !useAiSelection);
  }

  return (
    <form noValidate onSubmit={handleSubmit}>
      <List className="space-y-8 mb-4">
        {items.map<React.ReactNode>((selection, i) => (
          <ListItem key={i} className="even:bg-slate-100 p-8 flex-col">
            <AddRoundFormItem
              formik={props}
              selection={selection}
              index={i}
              graph={graph}
              useAdvancedView={useAdvancedView}
            />
          </ListItem>
        ))}
      </List>

      <FormControl fullWidth className="items-end">
        <Button
          type="submit"
          color="secondary"
          variant="contained"
          disabled={isSubmitting}
        >
          submit
        </Button>
      </FormControl>
    </form>
  );
}

export default AddRoundForm;
