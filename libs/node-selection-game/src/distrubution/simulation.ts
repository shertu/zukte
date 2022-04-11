import {G} from '../graph';
import {nodeTournament} from '../tournament';
import {PFn} from './pFn';

/**
 * Calculate the expected score for each node in the graph.
 */
export function simulate(graph: G, pFn: PFn): number[] {
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

// /**
//  * Reduces multiple opponent selection maps into a single opponent selection map.
//  */
// export function flattenPFn(graph: G, ...distributions: PFn[]): PFn {
//   const map = new Map<string, number>();
//   graph.forEachNode(node => {
//     const p: number = distributions.reduce<number>(
//       (prev, pFn) => prev + pFn(node),
//       0
//     );
//     map.set(node, p);
//   });

//   return function pFn(value: string): number {
//     return map.get(value) ?? 0;
//   };
// }
