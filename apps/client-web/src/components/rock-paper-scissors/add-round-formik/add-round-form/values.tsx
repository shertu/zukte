import {NodeAttributes, NodeSelectionExtension} from 'business';

import NounAiIcon from 'src/icons/noun-ai-2858678';

export interface AddRoundFormV {
  selections: NodeSelectionExtension[];
}

export const fnSelections: keyof AddRoundFormV = 'selections';

export const AI_NODE_VALUE = 'c632c78d-3d46-4e54-aa85-1c81c57a27d0';
export const AI_NODE_ATTR: NodeAttributes = {
  createElement: p => <NounAiIcon {...p} />,
};
