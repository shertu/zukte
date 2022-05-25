import AddRoundFormik, {
  PDistribution,
} from './add-round-formik/add-round-formik';
import {
  GraphAlpha,
  NodeSelectionExtension,
  RockPaperScissorsGraph,
  RockPaperScissorsPlayer,
} from 'business';

import {AddRoundFormV} from './add-round-formik/add-round-form/values';
import {Chance} from 'chance';
import {NodeSelectionGameAi} from '@zukte/node-selection-game';
import React from 'react';
import {Scoreboard} from './scoreboard/scoreboard';
import {Typography} from '@mui/material';

export interface RockPaperScissorsProps {
  graph?: GraphAlpha;
  pNames?: string[];
  chance?: Chance.Chance;
  k?: number;
}

/**
 * A simple game where players select nodes on a graph.
 */
export function RockPaperScissors(props: RockPaperScissorsProps) {
  const {
    pNames = [],
    graph = RockPaperScissorsGraph,
    chance = new Chance(),
    k = 5,
  } = props;

  const [scored, setScored] = React.useState<NodeSelectionExtension[][]>([]);

  /**
   * Finds all scores attributed to the specified player.
   */
  function filterOnSelcux(
    selcux: NodeSelectionExtension['selcux']
  ): NodeSelectionExtension[] {
    return scored.flat().filter(selection => selection.selcux === selcux);
  }

  const _pA: RockPaperScissorsPlayer[] = React.useMemo<
    RockPaperScissorsPlayer[]
  >(() => {
    return pNames.map<RockPaperScissorsPlayer>(name => {
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
  const _initialValues: AddRoundFormV = React.useMemo<AddRoundFormV>(() => {
    const _items = _pA.map<NodeSelectionExtension>((p, i) => {
      return {
        selcux: p.id,
        useAiSelection: i >= 1,
        value: '',
        score: 0,
        normalized: 0,
        diff: false,
      };
    });

    return {items: _items};
  }, [_pA]);

  const pB: RockPaperScissorsPlayer[] = React.useMemo<
    RockPaperScissorsPlayer[]
  >(() => {
    return _pA.map<RockPaperScissorsPlayer>(p => ({
      ...p,
      scores: filterOnSelcux(p.id),
    }));
  }, [_pA, scored]);

  const pDistributions = React.useMemo<PDistribution[]>(() => {
    ai.predict();

    return pB.map<PDistribution>((v, i) => {
      return {
        selcux: v.id,
        pFn: i > 0 ? uniform : uniform,
      };
    });
  }, [pB]);

  function uniform(): number {
    return 1;
  }

  return (
    <div className="space-y-8">
      <AddRoundFormik
        // useAdvancedView
        graph={graph}
        initialValues={_initialValues}
        onSuccessHook={vs => {
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

export default RockPaperScissors;
