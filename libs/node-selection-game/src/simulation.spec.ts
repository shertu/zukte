import {simulate} from './simulation';
import {NodeValue, RockPaperScissors} from './rock-paper-scissors';

describe('simulate', () => {
  it('no. of probabilities mismatches no. of nodes to simulate', () => {
    const nodes: NodeValue[] = [
      NodeValue.ROCK,
      NodeValue.SCISSORS,
      NodeValue.PAPER,
    ];

    const probabilities: number[] = [];

    expect(() => {
      simulate<NodeValue>(RockPaperScissors, nodes, probabilities);
    }).toThrowError();
  });

  it('null scenario', () => {
    const nodes: NodeValue[] = [];
    const probabilities: number[] = [];

    const actual: number[] = simulate<NodeValue>(
      RockPaperScissors,
      nodes,
      probabilities
    );

    const expected: number[] = [];
    expect(actual).toEqual(expected);
  });

  it('no. of probabilities matches no. of nodes to simulate', () => {
    const nodes: NodeValue[] = [
      NodeValue.ROCK,
      NodeValue.SCISSORS,
      NodeValue.PAPER,
    ];

    const probabilities: number[] = [3, 2, 1];

    const actual: number[] = simulate<NodeValue>(
      RockPaperScissors,
      nodes,
      probabilities
    );

    const expected: number[] = [2, 1, 3];
    expect(actual).toEqual(expected);
  });
});
