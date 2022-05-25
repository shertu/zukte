import {NodeSelectionExtension} from './node-selection';
import {NodeSelectionGameAi} from '@zukte/node-selection-game';

export interface RockPaperScissorsPlayer {
  readonly id: string | number;
  readonly name?: string;
  readonly scores?: NodeSelectionExtension[];
  readonly ai?: NodeSelectionGameAi;
}
