import {AI_NODE_VALUE, AddRoundFormV} from './add-round-form/values';
import {AddRoundForm, AddRoundFormP} from './add-round-form/add-round-form';
import {Formik, FormikErrors} from 'formik';
import {
  GraphExtension,
  NodeSelectionExtension,
  noop,
  predictConstant,
  sampleDiscreteDistribution,
} from 'business';
import {nodeTournament, simulate} from '@zukte/node-selection-game';

import React from 'react';

export interface AddRoundFormikP {
  graph: GraphExtension;
  nodes: string[];
  initialValues: AddRoundFormP['initialValues'];
  useAdvancedView?: boolean;
  onSuccessHook?: (values: NodeSelectionExtension[]) => void;
  predict?: (
    value: NodeSelectionExtension,
    selections: NodeSelectionExtension[]
  ) => Promise<number[]>;
}

/**
 * A component which enables the user to add a round to the node war.
 */
export function AddRoundFormik(props: AddRoundFormikP) {
  const {
    graph,
    nodes,
    initialValues,
    useAdvancedView = false,
    onSuccessHook = noop,
    predict = () => predictConstant(nodes),
  } = props;

  /**
   *
   * @param selection
   * @param index
   * @param selections
   */
  async function mapToSelectionValue(
    selection: NodeSelectionExtension,
    index: number,
    selections: NodeSelectionExtension[]
  ) {
    // non-AI selection
    if (!selection.useAiSelection) {
      return selection.value;
    }

    // AI selection
    const probabilities = await predict(selection, selections);
    const simulationScores = simulate(graph, nodes, probabilities);

    /**
     * The probability function which states that the
     * probability of a selection is proportional to the
     * expected score for said selection.
     */
    function pFn(x: string): number {
      return simulationScores[nodes.indexOf(x)];
    }

    const sample = sampleDiscreteDistribution(nodes, pFn);
    return sample;
  }

  return (
    <Formik
      onSubmit={async (values, helpers) => {
        // 1. selections
        const selections = values.selections.map<NodeSelectionExtension>(
          selection => ({
            ...selection,
            useAiSelection: selection.value === AI_NODE_VALUE,
          })
        );

        const selectionsValues: string[] = [];
        for (let i = 0; i < selections.length; i++) {
          const selection = selections[i];
          selectionsValues.push(
            await mapToSelectionValue(selection, i, selections)
          );
        }

        // 2. scores
        const scores = nodeTournament(graph, ...selectionsValues);

        // 3. combine
        const selectionsWithScores = selections.map<NodeSelectionExtension>(
          (v, i) => ({
            ...v,
            ...scores[i],
          })
        );

        // 4. additional processes
        onSuccessHook(selectionsWithScores);
        helpers.setSubmitting(false);
      }}
      initialValues={initialValues}
      validate={(values: AddRoundFormV) => {
        const errors: FormikErrors<AddRoundFormV> = {};
        const errors_selections: FormikErrors<NodeSelectionExtension>[] = [];

        values.selections.forEach(item => {
          if (!item.useAiSelection && !item.value) {
            const errors_selections_element: FormikErrors<NodeSelectionExtension> =
              {
                value: 'must select an option',
              };

            errors_selections.push(errors_selections_element);
          }
        });

        if (errors_selections.length > 0) {
          errors.selections = errors_selections;
        }

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
