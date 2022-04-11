import {Scoreboard} from './scoreboard/scoreboard';

import {AddRoundFormValues} from './add-round-formik/add-round-form/values';
import AddRoundFormik, {
  PDistribution,
} from './add-round-formik/add-round-formik';
import {GraphExtension} from 'logic/node-selection-game/graph';
import {NodeSelectionGamePlayer} from 'logic/node-selection-game/player';
import React from 'react';
import RockPaperScissorsGraph from 'logic/node-selection-game/rock-paper-scissors';
import {ScoredNodeSelectionExtension} from 'logic/node-selection-game/scored-node-selection';
import {Typography} from '@mui/material';
import {Chance} from 'chance';
import {predictNext} from '@zukte/node-selection-game';

export interface RockPaperScissorsProps {
  graph?: GraphExtension;
  pNames?: string[];
  chance?: Chance.Chance;
}

/**
 * A simple game where players select nodes on a graph.
 */
export function RockPaperScissors(props: RockPaperScissorsProps) {
  const {
    pNames = [],
    graph = RockPaperScissorsGraph,
    chance = new Chance(),
  } = props;

  const [scored, setScored] = React.useState<ScoredNodeSelectionExtension[][]>(
    []
  );

  /**
   * Finds all scores attributed to the specified player.
   */
  function filterOnSelcux(
    selcux: ScoredNodeSelectionExtension['selcux']
  ): ScoredNodeSelectionExtension[] {
    return scored.flat().filter(selection => selection.selcux === selcux);
  }

  const _pA: NodeSelectionGamePlayer[] = React.useMemo<
    NodeSelectionGamePlayer[]
  >(() => {
    return pNames.map<NodeSelectionGamePlayer>(name => {
      return {
        id: chance.guid(),
        name: name,
        scores: [],
      };
    });
  }, []);

  /**
   * The default value is:
   * - All characters can make a selection
   * - All characters except the first one are AI controlled
   */
  const _initialValues: AddRoundFormValues =
    React.useMemo<AddRoundFormValues>(() => {
      const _items = _pA.map<ScoredNodeSelectionExtension>((p, i) => {
        return {
          selcux: p.id,
          useAiSelection: i >= 1,
          value: '',
          score: 0,
          normalized: 0,
        };
      });

      return {items: _items};
    }, [_pA]);

  const pB: NodeSelectionGamePlayer[] = React.useMemo<
    NodeSelectionGamePlayer[]
  >(() => {
    return _pA.map<NodeSelectionGamePlayer>(p => ({
      ...p,
      scores: filterOnSelcux(p.id),
    }));
  }, [_pA, scored]);

  const pDistributions = React.useMemo<PDistribution[]>(() => {
    return pB.map<PDistribution>(v => [v.id, predictNext(graph, v.scores)]);
  }, [pB]);

  return (
    <div className="space-y-8">
      <AddRoundFormik
        // useAdvancedView
        graph={graph}
        initialValues={_initialValues}
        onSubmit={vs => {
          setScored([...scored, vs]);
        }}
        chance={chance}
        predicitions={pDistributions}
      />

      {!!scored.length && (
        <>
          <Typography className="text-center" variant="h3">
            round no. {scored.length}
          </Typography>

          <Scoreboard graph={graph} information={pB} />
        </>
      )}
    </div>
  );
}

export default RockPaperScissorsGraph;
