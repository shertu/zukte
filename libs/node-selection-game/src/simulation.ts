import {WeightedGraph} from './weighted-graph';
import {nodeTournament} from './tournament';

/**
 * Calculate the expected score for a tournament between some nodes.
 */
export function simulate<T>(
  graph: WeightedGraph,
  nodes: T[],
  probabilities: number[]
): number[] {
  if (nodes.length !== probabilities.length) {
    throw new Error(
      `expected ${nodes.length} probabilities but received ${probabilities.length}, `
    );
  }

  return nodes.map<number>(aN => {
    return nodes.reduce<number>((prev, bN, i) => {
      // construct a two person tournament
      const selections: T[] = [aN, bN];
      const result = nodeTournament(graph, ...selections)[0];
      // calculate the expected difference
      return prev + result.normalized * probabilities[i];
    }, 0);
  });
}
