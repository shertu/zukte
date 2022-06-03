import {ScoredNodeSelection} from './scored-node-selection';
import {nodeTournament} from './tournament';
import {NodeValue, RockPaperScissors} from './rock-paper-scissors';

describe('nodeTournament', () => {
  it('win scenario', () => {
    const actual: ScoredNodeSelection<NodeValue>[] = nodeTournament<NodeValue>(
      RockPaperScissors,
      NodeValue.ROCK,
      NodeValue.SCISSORS
    );

    const expected: ScoredNodeSelection<NodeValue>[] = [
      {
        diff: true,
        normalized: 1,
        score: 1,
        value: NodeValue.ROCK,
      },
      {
        diff: true,
        normalized: 0,
        score: 0,
        value: NodeValue.SCISSORS,
      },
    ];

    expect(actual).toEqual(expected);
  });

  it('draw scenario', () => {
    const actual: ScoredNodeSelection<NodeValue>[] = nodeTournament<NodeValue>(
      RockPaperScissors,
      NodeValue.ROCK,
      NodeValue.ROCK
    );

    const expected: ScoredNodeSelection<NodeValue>[] = [
      {
        diff: false,
        normalized: 0,
        score: 0,
        value: NodeValue.ROCK,
      },
      {
        diff: false,
        normalized: 0,
        score: 0,
        value: NodeValue.ROCK,
      },
    ];

    expect(actual).toEqual(expected);
  });

  it('null scenario', () => {
    const actual: ScoredNodeSelection<NodeValue>[] =
      nodeTournament<NodeValue>(RockPaperScissors);
    const expected: ScoredNodeSelection<NodeValue>[] = [];
    expect(actual).toEqual(expected);
  });
});
