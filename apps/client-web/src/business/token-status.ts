/**
 * Copied from @square/web-sdk
 */
export enum TokenStatus {
  /**
   * Indicates an unknown tokenization status.
   */
  UNKNOWN = 'Unknown',
  /**
   * Indicates tokenization was successful.
   */
  OK = 'OK',
  /**
   * Indicates tokenization was not successful.
   */
  ERROR = 'Error',
  /**
   * Indicated validation has failed during tokenization
   */
  INVALID = 'Invalid',
  /**
   * Indicates tokenization was aborted.
   */
  ABORT = 'Abort',
  /**
   * Indicates tokenization was cancelled by the user.
   */
  CANCEL = 'Cancel',
}
