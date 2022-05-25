import {WeightedGraph} from './weighted-graph';
import {nodeTournament} from './tournament';

/**
 * Calculate the expected score for each node in the graph.
 */
export function simulate(
  graph: WeightedGraph,
  pFn: (value: string) => number
): number[] {
  const nodes: string[] = graph.nodes();
  const probabilities: number[] = nodes.map<number>(pFn);

  return graph.mapNodes<number>(aN => {
    return nodes.reduce<number>((prev, bN, i) => {
      // construct a two person tournament
      const selections: string[] = [aN, bN];
      const result = nodeTournament(graph, ...selections)[0];
      // calculate the expected difference
      return prev + result.normalized * probabilities[i];
    }, 0);
  });
}
