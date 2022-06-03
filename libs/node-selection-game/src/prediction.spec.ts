import {indexOfMax, NodeSelectionGameAi} from './prediction';
import {ScoredNodeSelection} from './scored-node-selection';
import {NodeValue} from './rock-paper-scissors';

describe('NodeSelectionGameAi', () => {
  const nodes = [NodeValue.ROCK, NodeValue.SCISSORS, NodeValue.PAPER];

  it('train affects weights and biases', async () => {
    const ai = new NodeSelectionGameAi(nodes, 3);

    const x: ScoredNodeSelection<NodeValue>[] = [
      {
        diff: true,
        normalized: 0,
        score: 0,
        value: NodeValue.PAPER,
      },
      {
        diff: false,
        normalized: 0,
        score: 0,
        value: NodeValue.PAPER,
      },
      {
        diff: true,
        normalized: 1,
        score: 1,
        value: NodeValue.PAPER,
      },
    ];

    const label: ScoredNodeSelection<NodeValue> = {
      diff: true,
      normalized: 0,
      score: 0,
      value: NodeValue.PAPER,
    };

    await ai.train(x, label); // use train to change weights and biases
    const prediction = await ai.predict(x);
    const index_: number = indexOfMax(prediction);
    expect(nodes[index_]).toEqual(NodeValue.PAPER);
  });
});
