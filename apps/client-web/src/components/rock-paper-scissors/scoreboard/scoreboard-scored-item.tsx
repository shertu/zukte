import {GraphAlpha, NodeSelectionExtension} from 'business';

import React from 'react';
import {Typography} from '@mui/material';
import clsx from 'clsx';

export interface ScoreboardScoredItemP {
  graph: GraphAlpha;
  scored: NodeSelectionExtension;
}

/**
 * A grid element which shows information about characters and characters' node selections.
 */
export function ScoreboardScoredItem(props: ScoreboardScoredItemP) {
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
