import {
  AI_NODE_VALUE,
  AddRoundFormV,
} from './add-round-formik/add-round-form/values';
import {
  AddRoundFormik,
  AddRoundFormikP,
} from './add-round-formik/add-round-formik';
import {
  GraphExtension,
  NodeSelectionExtension,
  NodeSelectionPlayer,
  RockPaperScissorsGraph,
  constructScoreboard,
  predictConstant,
} from 'business';
import {
  NodeSelectionGameAi,
  ScoredNodeSelection,
} from '@zukte/node-selection-game';

import React from 'react';
import {Scoreboard} from './scoreboard/scoreboard';
import {Typography} from '@mui/material';

export interface RockPaperScissorsProps {
  graph?: GraphExtension;
  initialPlayers?: NodeSelectionPlayer[];
  initialValues?: AddRoundFormikP[];
  k?: number;
}

/**
 * A simple game where players select nodes on a graph.
 */
export function RockPaperScissors(props: RockPaperScissorsProps) {
  const {graph = RockPaperScissorsGraph, k = 5} = props;

  /**
   * The default value is:
   * - 2 characters with random ids and special names
   */
  const initialPlayers_: NodeSelectionPlayer[] = [
    {id: 'dc4efb53-3171-4070-8828-aeb5848c478c', name: 'You'},
    {id: '6d7b3b35-d41a-4b32-962a-58e753a49d27', name: 'computer'},
  ];

  const {initialPlayers = initialPlayers_} = props;

  /**
   * The default value is:
   * - All characters can make a selection
   * - All characters except the first one are AI controlled
   */
  const initialValues_: AddRoundFormV = React.useMemo<AddRoundFormV>(() => {
    const items = initialPlayers.map<NodeSelectionExtension>((p, i) => {
      const useAiSelection: boolean = i >= 1;

      return {
        diff: false,
        normalized: 0,
        score: 0,
        selcux: p.id,
        useAiSelection: useAiSelection,
        value: useAiSelection ? AI_NODE_VALUE : '',
      };
    });

    return {selections: items};
  }, [initialPlayers]);

  /**
   * The nodes of the graph in an ordinal collection.
   */
  const nodes = React.useMemo<string[]>(() => graph.nodes(), [graph]);

  /**
   * The record of the game's scores.
   */
  const [tournaments, setTournaments] = React.useState<
    NodeSelectionExtension[][]
  >([]);

  /**
   * The hook called when a node selection tournament is complete.
   */
  function onSuccessHook(tournament: NodeSelectionExtension[]): void {
    setTournaments([...tournaments, tournament]);

    tournament.forEach(selection => {
      if (!selection.useAiSelection) {
        const pHistory: NodeSelectionExtension[] =
          kSelections.get(selection.selcux) ?? [];

        if (pHistory.length === k) {
          nodeSelectionGameAi.train(
            pHistory as ScoredNodeSelection<string>[],
            selection
          );
        }
      }
    });
  }

  /**
   * The information used in the scoreboard component.
   */
  const scoreboardInformation = React.useMemo<NodeSelectionPlayer[]>(
    () => constructScoreboard(tournaments.flat()),
    [tournaments]
  );

  /**
   * The artificial intelligence used to predict which nodes non-ai will select.
   */
  const [nodeSelectionGameAi] = React.useState<NodeSelectionGameAi<string>>(
    new NodeSelectionGameAi(nodes, k)
  );

  /**
   * Store a map of the previous k selections for each player.
   */
  const kSelections = React.useMemo<
    Map<NodeSelectionExtension['selcux'], NodeSelectionExtension[]>
  >(() => {
    const map = new Map<
      NodeSelectionExtension['selcux'],
      NodeSelectionExtension[]
    >();

    scoreboardInformation.forEach(({id, scores = []}) => {
      map.set(id, scores.slice(-k));
    });

    return map;
  }, [k, scoreboardInformation]);

  /**
   *
   * @param value
   * @param selections
   * @returns
   */
  async function predict(
    value: NodeSelectionExtension,
    selections: NodeSelectionExtension[]
  ): Promise<number[]> {
    // all opponent selections
    const opponents = selections.filter(
      selection => selection.selcux !== value.selcux
    );

    const predictions: number[][] = [];

    for (let i = 0; i < opponents.length; i++) {
      const opponent = opponents[i];
      let prediction: number[] = predictConstant(nodes);

      // we avoid predictions for other AI opponents
      if (!opponent.useAiSelection) {
        const pHistory: NodeSelectionExtension[] =
          kSelections.get(opponent.selcux) ?? [];

        if (pHistory.length === k) {
          prediction = await nodeSelectionGameAi.predict(
            pHistory as ScoredNodeSelection<string>[]
          );
        }
      }

      predictions.push(prediction);
    }

    // sum of the predictions
    return nodes.map<number>((node, i) => {
      return predictions.reduce<number>((prev, curr) => prev + curr[i], 0);
    });
  }

  // append player names
  initialPlayers.forEach(pInitial => {
    scoreboardInformation.forEach(p => {
      if (p.id === pInitial.id) {
        p.name = pInitial.name;
      }
    });
  });

  return (
    <div className="space-y-8">
      <AddRoundFormik
        // useAdvancedView
        graph={graph}
        nodes={nodes}
        initialValues={initialValues_}
        onSuccessHook={onSuccessHook}
        predict={predict}
      />

      {!!tournaments.length && (
        <>
          <Typography className="text-center" variant="h3">
            round no. {tournaments.length}
          </Typography>

          <Scoreboard graph={graph} information={scoreboardInformation} />
        </>
      )}
    </div>
  );
}

export default RockPaperScissors;
