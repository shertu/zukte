import {NodeSelectionPlayer} from './player';
import {ScoredNodeSelection} from '@zukte/node-selection-game';

export interface NodeSelectionExtension extends ScoredNodeSelection<string> {
  /**
   * The agent who made the selection.
   */
  readonly selcux: NodeSelectionPlayer['id'];

  /**
   * The toggle between selection modes.
   */
  readonly useAiSelection?: boolean;
}
