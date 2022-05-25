import {RockPaperScissorsPlayer} from './player';
import {ScoredNodeSelection} from '@zukte/node-selection-game';

export interface NodeSelectionExtension extends ScoredNodeSelection {
  /**
   * The agent who made the selection.
   */
  readonly selcux: RockPaperScissorsPlayer['id'];

  /**
   * The toggle between selection modes.
   */
  readonly useAiSelection?: boolean;
}
