import {Button, FormControl, List, ListItem} from '@mui/material';

import {AddRoundFormItem} from './add-round-form-item';
import {AddRoundFormValues} from './values';
import {FormikProps} from 'formik';
import {GraphExtension} from 'logic/node-selection-game/graph';
import React from 'react';
import {ScoredNodeSelectionExtension} from 'logic/node-selection-game/scored-node-selection';

export interface AddRoundFormProps extends FormikProps<AddRoundFormValues> {
  graph: GraphExtension;
  useAdvancedView?: boolean;
}

/**
 * The underlying form component.
 */
export function AddRoundForm(props: AddRoundFormProps) {
  const {
    values,
    isSubmitting,
    handleSubmit,
    useAdvancedView = false,
    graph,
  } = props;

  // hide AI selections in advanced view mode
  let items: ScoredNodeSelectionExtension[] = values.items;
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
