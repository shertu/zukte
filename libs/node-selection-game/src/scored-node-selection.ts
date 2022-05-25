/**
 * The score and value of a node selection after a tournament.
 */
export interface ScoredNodeSelection {
  /**
   * The value of the selection.
   */
  readonly value: string;

  /**
   * The score for the selection.
   */
  readonly score: number;

  /**
   * The normalized score value.
   */
  readonly normalized: number;

  /**
   * Was there some difference between the scores?
   */
  readonly diff: boolean;
}
