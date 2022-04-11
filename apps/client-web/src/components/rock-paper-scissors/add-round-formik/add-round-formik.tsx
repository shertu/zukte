import {AddRoundForm, AddRoundFormProps} from './add-round-form/add-round-form';
import {Formik, FormikErrors} from 'formik';
import {
  nodeselection_optimal,
  nodeTournament,
  NodeValueMap,
} from '@zukte/node-selection-game';

import {AddRoundFormValues} from './add-round-form/values';
import {GraphExtension} from 'logic/node-selection-game/graph';
import React from 'react';
import {ScoredNodeSelectionExtension} from 'logic/node-selection-game/scored-node-selection';
import {noop} from 'logic/noop';
import {Chance} from 'chance';
import {randomiseNodeSelection} from 'logic/node-selection-game/randomise-node-selection';

export type PDistribution = [
  selcux: ScoredNodeSelectionExtension['selcux'],
  distribution: NodeValueMap
];

export interface AddRoundFormikProps {
  graph: GraphExtension;
  initialValues: AddRoundFormProps['initialValues'];
  useAdvancedView?: boolean;
  onSubmit?: (values: ScoredNodeSelectionExtension[]) => void;
  chance?: Chance.Chance;
  predicitions?: PDistribution[];
}

/**
 * A component which enables the user to add a round to the node war.
 */
export function AddRoundFormik(props: AddRoundFormikProps) {
  const {
    graph,
    initialValues,
    useAdvancedView = false,
    onSubmit = noop,
    chance = new Chance(),
    predicitions = [],
  } = props;

  /**
   * Make a node selection as per an item's instructions.
   */
  function makeSelection(item: ScoredNodeSelectionExtension): string {
    let selection: string | undefined = item.value;

    if (item.useAiSelection) {
      const dA: NodeValueMap[] = predicitions
        .filter(([selcux]) => selcux !== item.selcux)
        .map<NodeValueMap>(([, d]) => d);

      const sD: NodeValueMap = nodeselection_optimal(graph, ...dA);
      selection = randomiseNodeSelection(sD, chance);
    }

    if (selection) {
      return selection;
    } else {
      throw new Error('The node selection was invalid.');
    }
  }

  return (
    <Formik
      onSubmit={(values, helpers) => {
        // 1. selections
        const selections: string[] = values.items.map<string>(item =>
          makeSelection(item)
        );

        // 2. score
        const sA = nodeTournament(graph, ...selections);

        // 3. output
        const res = values.items.map<ScoredNodeSelectionExtension>((v, i) => {
          const s = sA[i];

          return {
            selcux: v.selcux,
            useAiSelection: v.useAiSelection,
            value: s.value,
            score: s.score,
            normalized: s.normalized,
          };
        });

        // 4. additional processes
        try {
          onSubmit(res);
        } finally {
          helpers.setSubmitting(false);
        }
      }}
      initialValues={initialValues}
      validate={(values: AddRoundFormValues) => {
        const errors: FormikErrors<AddRoundFormValues> = {};

        let ieC = 0;
        const ieA: FormikErrors<ScoredNodeSelectionExtension>[] =
          values.items.map<FormikErrors<ScoredNodeSelectionExtension>>(item => {
            if (!item.useAiSelection && !item.value) {
              ieC++;
              return {
                value: 'must make a selection',
              };
            }

            return {};
          });

        if (ieC > 0) {
          errors.items = ieA;
        }

        console.log('validation', values.items, errors);

        return errors;
      }}
    >
      {formik => (
        <AddRoundForm
          graph={graph}
          useAdvancedView={useAdvancedView}
          {...formik}
        />
      )}
    </Formik>
  );
}

export default AddRoundFormik;
