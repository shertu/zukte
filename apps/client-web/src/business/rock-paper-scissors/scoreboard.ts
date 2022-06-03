import {NodeSelectionExtension} from './node-selection';
import {NodeSelectionPlayer} from './player';

/**
 * Groups scores by {@link NodeSelectionPlayer}
 */
export function constructScoreboard(
  scores: NodeSelectionExtension[]
): NodeSelectionPlayer[] {
  const map = new Map<
    NodeSelectionExtension['selcux'],
    NodeSelectionExtension[]
  >();

  scores.forEach(score => {
    const pScores: NodeSelectionExtension[] = map.get(score.selcux) ?? [];
    pScores.push(score);
    if (!map.has(score.selcux)) {
      map.set(score.selcux, pScores);
    }
  });

  const result: NodeSelectionPlayer[] = [];
  for (const [id, pScores] of map) {
    result.push({id: id, scores: pScores});
  }
  return result;
}
