import {ScoredNodeSelectionExtension} from 'logic/node-selection-game/scored-node-selection';

export interface AddRoundFormValues {
  items: ScoredNodeSelectionExtension[];
}

export const fn_items: keyof AddRoundFormValues = 'items';
export const fn_selection: keyof ScoredNodeSelectionExtension = 'value';
export const fn_ai: keyof ScoredNodeSelectionExtension = 'useAiSelection';
