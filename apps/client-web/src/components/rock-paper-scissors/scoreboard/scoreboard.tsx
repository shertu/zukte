import {GraphExtension, NodeSelectionPlayer} from 'business';
import {Grid, List, ListItem, ListProps, Typography} from '@mui/material';

import React from 'react';
import {ScoreboardScoredItem} from './scoreboard-scored-item';

export interface ScoreboardProps extends ListProps {
  graph: GraphExtension;
  information?: NodeSelectionPlayer[];
}

/**
 * A utility function to calculate the mean of some numbers.
 */
function mean(...values: number[]): number {
  const n = values.length;
  return n ? values.reduce((a, b) => a + b, 0) / n : 0;
}

/**
 * A utility function to calculate the ordinal string of an index.
 */
function getNumberWithOrdinal(n: number) {
  const s = ['th', 'st', 'nd', 'rd'],
    v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

/**
 * A grid element which shows information about characters and characters' node selections.
 */
export function Scoreboard(props: ScoreboardProps) {
  const {graph, information = [], ...other} = props;

  const sorted: NodeSelectionPlayer[] = information.sort(
    ({scores: aScores = []}, {scores: bScores = []}) => {
      const aMean: number = mean(...aScores.map(e => e.normalized));
      const bMean: number = mean(...bScores.map(e => e.normalized));
      return bMean - aMean;
    }
  );

  return (
    <List {...other}>
      {sorted.map(({id, scores = [], name = id}, rank) => {
        const aMean: number = mean(...scores.map(e => e.normalized));
        const last = scores.at(-1);

        return (
          <ListItem key={id} className="lowercase p-[8px]">
            <Grid
              container
              spacing={2}
              alignItems="center"
              justifyContent="center"
              // className="text-[5rem] md:text-[10rem] xl:text-[15rem]"
            >
              <Grid item xs={3} className="flex flex-col items-center">
                <Typography variant="h6" component="p">
                  {getNumberWithOrdinal(rank + 1)}
                </Typography>

                <Typography variant="body2" className="text-gray-400">
                  {aMean.toFixed(3)}
                </Typography>
              </Grid>

              <Grid item xs={4}>
                <Typography component="p" className="capitalize">
                  {name}
                </Typography>
              </Grid>

              {last && (
                <Grid item xs={4}>
                  <ScoreboardScoredItem graph={graph} scored={last} />
                </Grid>
              )}
            </Grid>
          </ListItem>
        );
      })}
    </List>
  );
}

export default Scoreboard;
