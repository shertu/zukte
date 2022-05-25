import {ScoredNodeSelection} from './scored-node-selection';
import {WeightedGraph} from './weighted-graph';

/**
 * Calculate the score of one node selection versus another.
 */
function duel(graph: WeightedGraph, source: unknown, target: unknown): number {
  return graph.reduceOutEdges<number>(
    source,
    target,
    (accumulator, edge, attr) => accumulator + attr.weight,
    0
  );
}

/**
 * Calculates the scores for each node in a round-robin tournament.
 */
function nodeTournamentScore(
  graph: WeightedGraph,
  ...selections: string[]
): number[] {
  return selections.map<number>(source =>
    selections.reduce<number>(
      (accumulator, target) => accumulator + duel(graph, source, target),
      0
    )
  );
}

/**
 * Calculates the scores and normalized scores for each selected node in a round-robin tournament.
 */
export function nodeTournament(
  graph: WeightedGraph,
  ...selections: string[]
): ScoredNodeSelection[] {
  const scores = nodeTournamentScore(graph, ...selections);

  // Normalizes an array of numbers using min-max normalization.
  const min: number = Math.min(...scores);
  const max: number = Math.max(...scores);
  const diff: number = max - min;

  return selections.map<ScoredNodeSelection>((node, i) => ({
    diff: !!diff,
    normalized: diff ? (scores[i] - min) / diff : 0,
    score: scores[i],
    value: node,
  }));
}
