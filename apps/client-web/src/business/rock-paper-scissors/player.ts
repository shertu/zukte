import {NodeSelectionExtension} from './node-selection';

export interface NodeSelectionPlayer {
  readonly id: string | number;
  name?: string;
  readonly scores?: NodeSelectionExtension[];
}
