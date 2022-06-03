import {ScoredNodeSelection} from './scored-node-selection';

export interface PredicitionModelFeature {
  /**
   * The normalized score value.
   */
  normalized: number;

  /**
   * Was there some difference between the scores?
   */
  diff: boolean;

  /**
   * The index which refers to the value of the selection.
   */
  vindex: number;
}

/**
 * Convert the data to features that we can use for machine learning.
 */
export function convertToFeature<T>(
  nodes: T[],
  selections: ScoredNodeSelection<T>[]
): PredicitionModelFeature[] {
  const nodeIndex = new Map(nodes.map<[T, number]>((node, i) => [node, i]));

  return selections.map<PredicitionModelFeature>(selection => {
    const vindex: number | undefined = nodeIndex.get(selection.value);

    if (vindex === undefined) {
      throw new Error('failed to find corresponding index for value');
    }

    return {
      diff: selection.diff,
      normalized: selection.normalized,
      vindex: vindex,
    };
  });
}

export type PredicitionModelLabel = boolean[];

/**
 * Convert the data to labels that we can use for machine learning.
 */
export function convertToLabel<T>(
  nodes: T[],
  selection: ScoredNodeSelection<T>
): PredicitionModelLabel {
  return nodes.map<boolean>(node => node === selection.value);
}
