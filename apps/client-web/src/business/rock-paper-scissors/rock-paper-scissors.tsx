import {GraphExtension, NodeAttributes} from './graph';
import {NounPaperHandIcon, NounRockHandIcon, NounScissorsHandIcon} from 'icons';

import React from 'react';

const data: {[node: string]: NodeAttributes} = {
  paper: {
    createElement: p => <NounPaperHandIcon {...p} />,
  },
  rock: {
    createElement: p => <NounRockHandIcon {...p} />,
  },
  scissors: {
    createElement: p => <NounScissorsHandIcon {...p} />,
  },
};

const RockPaperScissorsGraph = new GraphExtension();

for (const [node, attr] of Object.entries(data)) {
  RockPaperScissorsGraph.addNode(node, attr);
}

const nodeArr: string[] = ['rock', 'scissors', 'paper'];
for (let i = 0; i < nodeArr.length; i++) {
  const nodeSource = nodeArr[i];
  const nodeTarget = nodeArr[(i + 1) % nodeArr.length];
  const edgeWeight = 1;
  RockPaperScissorsGraph.addEdge(nodeSource, nodeTarget, {weight: edgeWeight});
}

export {RockPaperScissorsGraph};
