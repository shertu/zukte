/** represents a stored response from a pagination request */
export class PaginationListInformation<T> {
  public items: T[] = [];
  public nextPageToken: string | undefined;
  public hasMadeAtLeastOneFetch: boolean = false;

  /** shorthand for length of the items array */
  public get length(): number {
    return this.items.length;
  }

  /**
   * Is there the potential to fetch more items?
   * @return {boolean}
   */
  public isPotentialForMore(): boolean {
    return Boolean(this.nextPageToken) || !this.hasMadeAtLeastOneFetch;
  }

  /**
   * Should the client try to fetch more items?
   * @param {number} paginationCurrent
   * @param {number | undefined} paginationPageSize
   * @return {boolean}
   */
  public shouldFetchMore(
      paginationCurrent: number, paginationPageSize?: number,
  ): boolean {
    const b: number = paginationPageSize || 0;
    const count: number = this.length;
    return count < paginationCurrent * b;
  }
}
