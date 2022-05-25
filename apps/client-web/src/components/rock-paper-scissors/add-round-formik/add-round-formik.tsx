import {AddRoundForm, AddRoundFormP} from './add-round-form/add-round-form';
import {Formik, FormikErrors} from 'formik';
import {GraphExtension, NodeSelectionExtension, noop, sample} from 'business';
import {nodeTournament, simulate} from '@zukte/node-selection-game';

import {AddRoundFormV} from './add-round-form/values';
import {Chance} from 'chance';
import React from 'react';

export interface AddRoundFormikP {
  graph: GraphExtension;
  initialValues: AddRoundFormP['initialValues'];
  useAdvancedView?: boolean;
  onSuccessHook?: (values: NodeSelectionExtension[]) => void;
  chance?: Chance.Chance;
  predictor?: (value: string) => number;
}

/**
 * A component which enables the user to add a round to the node war.
 */
export function AddRoundFormik(props: AddRoundFormikP) {
  /**
   * The default predictor assumes a uniform random distribution.
   */
  function predictor_(): number {
    return 1 / count;
  }

  const {
    graph,
    initialValues,
    useAdvancedView = false,
    onSuccessHook = noop,
    chance = new Chance(),
    predictor = predictor_,
  } = props;

  const nodes = graph.nodes();
  const count = nodes.length;

  /**
   * Make a node selection as per an item's instructions.
   */
  function makeSelection(item: NodeSelectionExtension): string {
    let selection: string | undefined = item.value;
    const scores = simulate(graph, predictor);

    /**
     * The probability function which states that the
     * probability of a selection is proportional to the
     * predicted score for said selection.
     */
    function pFn(x: string): number {
      const index = nodes.indexOf(x);
      return scores[index];
    }

    if (item.useAiSelection) {
      selection = sample(nodes, pFn, chance);
    }

    if (selection) {
      return selection;
    } else {
      throw new Error('No node selection was made.');
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
        const res = values.items.map<NodeSelectionExtension>((v, i) => ({
          selcux: v.selcux,
          useAiSelection: v.useAiSelection,
          ...sA[i],
        }));

        // 4. additional processes
        try {
          onSuccessHook(res);
        } finally {
          helpers.setSubmitting(false);
        }
      }}
      initialValues={initialValues}
      validate={(values: AddRoundFormV) => {
        const errors: FormikErrors<AddRoundFormV> = {};

        let ieC = 0;
        const ieA: FormikErrors<NodeSelectionExtension>[] = values.items.map<
          FormikErrors<NodeSelectionExtension>
        >(item => {
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
