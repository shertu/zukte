export interface Page<T> {
  readonly values: T[];
  readonly continuationToken?: string | null | undefined;
}
