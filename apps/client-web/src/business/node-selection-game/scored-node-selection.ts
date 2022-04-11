import {ScoredNodeSelection} from '@zukte/node-selection-game';
import {NodeSelectionGamePlayer} from './player';

export interface ScoredNodeSelectionExtension extends ScoredNodeSelection {
  /**
   * The agent who made the selection.
   */
  readonly selcux: NodeSelectionGamePlayer['id'];

  /**
   * The toggle between selection modes.
   */
  readonly useAiSelection?: boolean;
}
