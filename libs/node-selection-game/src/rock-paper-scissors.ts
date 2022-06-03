import {DirectedGraph} from 'graphology';
import {Attributes} from 'graphology-types';
import {WeightedEdgeAttributes, WeightedGraph} from './weighted-graph';

export enum NodeValue {
  ROCK,
  SCISSORS,
  PAPER,
}

export const RockPaperScissors: WeightedGraph = new DirectedGraph<
  Attributes,
  WeightedEdgeAttributes
>();

const nodes = [NodeValue.ROCK, NodeValue.SCISSORS, NodeValue.PAPER];
nodes.forEach(v => RockPaperScissors.addNode(v));

for (let i = 0; i < nodes.length; i++) {
  const nodeSource = nodes[i];
  const nodeTarget = nodes[(i + 1) % nodes.length];
  RockPaperScissors.addEdge(nodeSource, nodeTarget);
}
