import {ScoredNodeSelectionExtension} from './scored-node-selection';

export interface NodeSelectionGamePlayer {
  readonly id: string | number;
  readonly name?: string;
  readonly scores?: ScoredNodeSelectionExtension[];
}
