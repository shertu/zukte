import {NodeValue} from './rock-paper-scissors';
import {
  convertToFeature,
  convertToLabel,
  PredicitionModelFeature,
  PredicitionModelLabel,
} from './prediction-io';
import {ScoredNodeSelection} from './scored-node-selection';

describe('prediction-io', () => {
  const nodes = [NodeValue.ROCK, NodeValue.SCISSORS, NodeValue.PAPER];

  it('convertToFeature', async () => {
    const selections: ScoredNodeSelection<NodeValue>[] = [
      {
        diff: true,
        normalized: 0,
        score: 0,
        value: NodeValue.ROCK,
      },
      {
        diff: true,
        normalized: 0.25,
        score: 1,
        value: NodeValue.SCISSORS,
      },
      {
        diff: true,
        normalized: 1,
        score: 4,
        value: NodeValue.PAPER,
      },
    ];

    const actual = convertToFeature(nodes, selections);
    const expected: PredicitionModelFeature[] = [
      {
        diff: true,
        normalized: 0,
        vindex: 0,
      },
      {
        diff: true,
        normalized: 0.25,
        vindex: 1,
      },
      {
        diff: true,
        normalized: 1,
        vindex: 2,
      },
    ];

    expect(actual).toEqual(expected);
  });

  it('convertToLabel', async () => {
    const selection: ScoredNodeSelection<NodeValue> = {
      diff: true,
      normalized: 0,
      score: 0,
      value: NodeValue.ROCK,
    };

    const actual = convertToLabel(nodes, selection);
    const expected: PredicitionModelLabel = [true, false, false];

    expect(actual).toEqual(expected);
  });
});
