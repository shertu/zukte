import {NodeSelectionExtension} from 'business';

export interface AddRoundFormV {
  items: NodeSelectionExtension[];
}

export const fn_items: keyof AddRoundFormV = 'items';
export const fn_selection: keyof NodeSelectionExtension = 'value';
export const fn_ai: keyof NodeSelectionExtension = 'useAiSelection';
