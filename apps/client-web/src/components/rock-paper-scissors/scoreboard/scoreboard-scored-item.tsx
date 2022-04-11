import {Typography} from '@mui/material';
import {GraphExtension} from 'logic/node-selection-game/graph';

import React from 'react';
import clsx from 'clsx';
import {ScoredNodeSelectionExtension} from 'logic/node-selection-game/scored-node-selection';

export interface ScoreboardScoredItemProps {
  graph: GraphExtension;
  scored: ScoredNodeSelectionExtension;
}

/**
 * A grid element which shows information about characters and characters' node selections.
 */
export function ScoreboardScoredItem(props: ScoreboardScoredItemProps) {
  const {scored, graph} = props;
  const attr = graph.getNodeAttributes(scored.value);

  return (
    <Typography
      className={clsx('flex flex-row items-center', {
        'text-primary-700': scored.normalized > 0,
        'text-secondary-700': scored.normalized <= 0,
      })}
    >
      {attr.createElement({
        className: 'text-5xl mr-4',
      })}

      {scored.score.toFixed(1)}
    </Typography>
  );
}

export default ScoreboardScoredItem;
